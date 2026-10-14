import { Router } from 'express';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';
import { runAgainstTests } from '../services/localRunner.js';

const router = Router();
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Local runner is for development only. Set CODE_RUNNER=local in backend/.env to use it.
const useLocalRunner = () => process.env.CODE_RUNNER === 'local';

router.get('/', async (req, res) => {
  try {
    const q = {};
    if (req.query.difficulty && req.query.difficulty !== 'All') q.difficulty = req.query.difficulty;
    if (req.query.topic && req.query.topic !== 'All') q.topic = req.query.topic;
    if (req.query.search) q.title = { $regex: escapeRegex(req.query.search), $options: 'i' };
    res.json(await Problem.find(q).select('-testCases').sort({ createdAt: 1 }));
  } catch {
    res.status(500).json({ message: 'Unable to load problems.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // testCases (with expected answers) are not sent to the browser
    const p = await Problem.findById(req.params.id).select('-testCases');
    if (!p) return res.status(404).json({ message: 'Problem not found.' });
    res.json(p);
  } catch {
    res.status(400).json({ message: 'Invalid problem id.' });
  }
});

async function runOnJudge0(problem, language, sourceCode) {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
  } else if (process.env.JUDGE0_URL?.includes('rapidapi')) {
    const e = new Error('Configure JUDGE0_API_KEY in backend/.env, or set CODE_RUNNER=local to run code on your own computer.');
    e.status = 503; throw e;
  }
  const langMap = { javascript: 63, python: 71, java: 62, cpp: 54, c: 50 };
  const language_id = langMap[language.toLowerCase()];
  if (!language_id) { const e = new Error('Supported languages: JavaScript, Python, Java, C++, C.'); e.status = 400; throw e; }
  const base = (process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com').replace(/\/$/, '');
  const create = await fetch(`${base}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST', headers,
    body: JSON.stringify({ language_id, source_code: sourceCode, stdin: problem.testCases?.[0]?.input || '' })
  });
  if (!create.ok) throw new Error(`Judge0 returned ${create.status}`);
  const r = await create.json();
  return {
    status: r.status?.description || 'Submitted',
    stdout: r.stdout || '',
    stderr: r.stderr || r.compile_output || '',
    time: r.time == null ? undefined : String(r.time),
    memory: r.memory == null ? undefined : String(r.memory)
  };
}

router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { language, sourceCode } = req.body;
    if (!language || !sourceCode) return res.status(400).json({ message: 'Language and source code are required.' });

    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });

    if (useLocalRunner() && process.env.NODE_ENV === 'production' && process.env.ALLOW_LOCAL_RUNNER !== 'true') {
      return res.status(503).json({ message: 'Local runner is disabled in production for safety.' });
    }

    const result = useLocalRunner()
      ? await runAgainstTests(problem, language, sourceCode)
      : await runOnJudge0(problem, language, sourceCode);

    const submission = await Submission.create({
      user: req.user._id, problem: problem._id, language, sourceCode,
      status: result.status, stdout: result.stdout, stderr: result.stderr,
      time: result.time, memory: result.memory == null ? undefined : String(result.memory)
    });

    if (result.status === 'Accepted') {
      // $addToSet avoids duplicates and avoids overwriting other changes to the user document
      await req.user.constructor.updateOne({ _id: req.user._id }, { $addToSet: { solvedProblems: problem._id } });
    }

    res.json({ submissionId: submission._id, status: result.status, stdout: result.stdout, stderr: result.stderr, time: result.time, memory: result.memory });
  } catch (e) {
    res.status(e.status || 502).json({ message: e.message || 'Code execution service is unavailable.' });
  }
});

export default router;