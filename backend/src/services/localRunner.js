// LOCAL CODE RUNNER (development only)
// Runs JavaScript / Python on THIS computer and grades against all test cases.
// It is NOT a secure sandbox - never enable it on a public server.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const TIMEOUT_MS = Number(process.env.RUNNER_TIMEOUT_MS) || 5000;
const MAX_OUT = 64 * 1024;
const MARK = '__CC_RESULT__';

// Child processes get a minimal environment so they cannot read your .env secrets via process.env
function cleanEnv() {
  const env = { PATH: process.env.PATH || '', PYTHONIOENCODING: 'utf-8' };
  for (const k of ['SystemRoot', 'TEMP', 'TMP', 'HOME', 'USERPROFILE']) if (process.env[k]) env[k] = process.env[k];
  return env;
}

function exec(cmd, args, cwd) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    let out = '', err = '', timedOut = false, done = false;
    const p = spawn(cmd, args, { cwd, env: cleanEnv(), windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => { timedOut = true; p.kill('SIGKILL'); }, TIMEOUT_MS);
    p.stdout.on('data', (d) => { if (out.length < MAX_OUT) out += d; });
    p.stderr.on('data', (d) => { if (err.length < MAX_OUT) err += d; });
    const finish = (code, spawnErr) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ stdout: out, stderr: spawnErr ? spawnErr.message : err, code, timedOut, ms: Date.now() - t0, spawnError: Boolean(spawnErr) });
    };
    p.on('error', (e) => finish(-1, e));
    p.on('close', (c) => finish(c));
  });
}

let pythonCmd; // cached
async function findPython() {
  if (pythonCmd !== undefined) return pythonCmd;
  for (const c of ['python', 'python3', 'py']) {
    const r = await exec(c, ['--version'], tmpdir());
    if (!r.spawnError && r.code === 0 && /Python/i.test(r.stdout + r.stderr)) return (pythonCmd = c);
  }
  return (pythonCmd = null);
}

export function parseArgs(input) {
  return String(input ?? '').split(/\r?\n/).filter((l) => l.trim() !== '').map((l) => {
    try { return JSON.parse(l); } catch { return l; }
  });
}

function normalize(s) {
  const t = String(s ?? '').trim();
  try { const v = JSON.parse(t); return typeof v === 'string' ? v : JSON.stringify(v); } catch { return t; }
}

function fnName(code, lang) {
  const re = lang === 'python' ? /def\s+([A-Za-z_]\w*)\s*\(/ : /function\s+([A-Za-z_$][\w$]*)\s*\(/;
  return code?.match(re)?.[1];
}

function jsHarness(user, fn, args) {
  return `${user}
;(() => { try {
  const __r = ${fn}(...${JSON.stringify(args)});
  const __o = typeof __r === 'string' ? __r : JSON.stringify(__r);
  process.stdout.write('\\n${MARK}' + (__o === undefined ? 'undefined' : __o));
} catch (e) { process.stderr.write(String((e && e.stack) || e)); process.exit(1); } })();
`;
}

function pyHarness(user, fn, args) {
  return `${user}

import json as __json, sys as __sys
try:
    __r = ${fn}(*__json.loads(${JSON.stringify(JSON.stringify(args))}))
    __o = __r if isinstance(__r, str) else __json.dumps(__r, separators=(',', ':'))
    __sys.stdout.write('\\n${MARK}' + __o)
except Exception:
    import traceback; traceback.print_exc(); __sys.exit(1)
`;
}

export async function runAgainstTests(problem, language, sourceCode) {
  const lang = String(language).toLowerCase();
  if (!['javascript', 'python'].includes(lang)) {
    const e = new Error('Local runner supports JavaScript and Python only. Pick one of them.');
    e.status = 400; throw e;
  }
  const starter = problem.starterCode?.get ? problem.starterCode.get(lang) : problem.starterCode?.[lang];
  const fn = fnName(starter, lang) || fnName(sourceCode, lang);
  if (!fn) { const e = new Error('Could not find your function. Keep the function from the starter code.'); e.status = 400; throw e; }

  const cmd = lang === 'python' ? await findPython() : process.execPath;
  if (!cmd) { const e = new Error('Python is not installed or not in PATH. Install Python 3 from python.org.'); e.status = 503; throw e; }

  const tests = problem.testCases || [];
  if (!tests.length) { const e = new Error('This problem has no test cases. Run: npm run seed'); e.status = 400; throw e; }

  const dir = await mkdtemp(path.join(tmpdir(), 'cc-run-'));
  const file = path.join(dir, lang === 'python' ? 'main.py' : 'main.js');
  let maxMs = 0, passed = 0, firstPrints = '';
  try {
    for (let i = 0; i < tests.length; i++) {
      const args = parseArgs(tests[i].input);
      await writeFile(file, (lang === 'python' ? pyHarness : jsHarness)(sourceCode, fn, args));
      const r = await exec(cmd, [file], dir);
      maxMs = Math.max(maxMs, r.ms);
      const idx = r.stdout.lastIndexOf('\n' + MARK);
      const prints = (idx >= 0 ? r.stdout.slice(0, idx) : r.stdout).trim();
      if (i === 0) firstPrints = prints;
      const base = { time: (maxMs / 1000).toFixed(3), memory: null, passed, total: tests.length };

      if (r.timedOut) return { ...base, status: 'Time Limit Exceeded', stdout: `Passed ${passed}/${tests.length} test cases\n\nTest ${i + 1} took longer than ${TIMEOUT_MS / 1000}s.`, stderr: '' };
      if (r.code !== 0 || idx < 0) return { ...base, status: 'Runtime Error', stdout: `Passed ${passed}/${tests.length} test cases${prints ? `\n\nYour prints:\n${prints}` : ''}`, stderr: r.stderr.trim() || 'Program ended without returning a value.' };

      const got = r.stdout.slice(idx + 1 + MARK.length);
      if (normalize(got) !== normalize(tests[i].expectedOutput)) {
        return { ...base, status: 'Wrong Answer', stdout: `Passed ${passed}/${tests.length} test cases\n\nFailed on test ${i + 1}:\n  Input:    ${String(tests[i].input).replace(/\n/g, ' | ')}\n  Expected: ${tests[i].expectedOutput}\n  Got:      ${got}${prints ? `\n\nYour prints:\n${prints}` : ''}`, stderr: '' };
      }
      passed++;
    }
    return { status: 'Accepted', time: (maxMs / 1000).toFixed(3), memory: null, passed, total: tests.length, stdout: `Passed ${passed}/${tests.length} test cases${firstPrints ? `\n\nYour prints:\n${firstPrints}` : ''}`, stderr: '' };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}