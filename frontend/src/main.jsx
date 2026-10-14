import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Editor from "@monaco-editor/react";
import {
  Code2,
  LayoutDashboard,
  BookOpen,
  MessagesSquare,
  Trophy,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Play,
  Send,
  Plus,
  Bookmark,
  Heart,
  MessageCircle,
  Clock3,
  CheckCircle2,
  Flame,
  Terminal,
  Lightbulb,
  LogIn,
  LogOut,
  Menu,
  X,
  Filter,
  UserRound,
  Braces,
  Sparkles,
  FileText,
  Rocket,
  Moon,
  Zap,
} from "lucide-react";
import "./style.css";
import "./neon.css";
import "./animations.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const sampleProblems = [
  {
    _id: "demo1",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
  },
  {
    _id: "demo2",
    title: "Valid Parentheses",
    difficulty: "Medium",
    topic: "Stacks",
    description:
      "Given a string containing brackets, determine whether the input string is valid. Every opening bracket must close in the correct order.",
    examples: [{ input: 's = "()[]{}"', output: "true" }],
  },
  {
    _id: "demo3",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Searching",
    description:
      "Given a sorted array and a target, return the target index if it exists, otherwise return -1. Aim for O(log n) time.",
    examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
  },
  {
    _id: "demo4",
    title: "Climbing Stairs",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.",
    examples: [{ input: "n = 3", output: "3" }],
  },
  {
    _id: "demo5",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Find the contiguous subarray with the largest sum and return that sum.",
    examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
  },
  {
    _id: "demo6",
    title: "Reverse a String",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Given a string s, return the string with its characters in reverse order.",
    examples: [{ input: 's = "hello"', output: '"olleh"' }],
  },
];
const demoPosts = [
  {
    _id: "p1",
    author: { username: "Aarav" },
    title: "How do I optimize Two Sum beyond nested loops?",
    body: "I can solve this with two loops, but I am not sure how to improve the time complexity. Is a HashMap the right approach?",
    code: "for (let i = 0; i < nums.length; i++) { /* ... */ }",
    topic: "Arrays",
    difficulty: "Easy",
    comments: [
      {
        body: "Use a map to store each number and its index as you iterate.",
        user: { username: "Meera" },
      },
    ],
    likes: 12,
    bookmarks: 2,
    createdAt: new Date(),
  },
  {
    _id: "p2",
    author: { username: "Meera" },
    title: "Need help understanding recursion base cases",
    body: "I understand the recursive call but get confused about when it should stop. Could someone explain with a simple example?",
    code: "function factorial(n) { /* ... */ }",
    topic: "Recursion",
    difficulty: "Medium",
    comments: [],
    likes: 8,
    bookmarks: 4,
    createdAt: new Date(),
  },
  {
    _id: "p3",
    author: { username: "Rohan" },
    title: "Share your favourite dynamic programming resources",
    body: "I have started DP this week. Which patterns should I learn first and how do you identify overlapping subproblems?",
    code: "",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    comments: [],
    likes: 5,
    bookmarks: 1,
    createdAt: new Date(),
  },
];
async function request(path, { token, ...opts } = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
function App() {
  const [page, setPage] = useState("Dashboard");
  const [token, setToken] = useState(localStorage.getItem("cc_token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("cc_user") || "null"),
  );
  const [problems, setProblems] = useState(sampleProblems);
  const [posts, setPosts] = useState(demoPosts);
  const [selected, setSelected] = useState(sampleProblems[0]);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [code, setCode] = useState(
    "function twoSum(nums, target) {\n  // Your solution here\n  return [];\n}",
  );
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("Run your code to see output here.");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    solved: 0,
    submissions: 0,
    contributions: 0,
    points: 0,
    accepted: 0,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postCode, setPostCode] = useState("");
  const [postTopic, setPostTopic] = useState("Arrays");
  const [commentDraft, setCommentDraft] = useState({});
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const authed = Boolean(token && user);
  useEffect(() => {
    request("/problems")
      .then((d) => {
        if (d.length) {
          setProblems(d);
          setSelected(d[0]);
        }
      })
      .catch(() => {});
    request("/posts")
      .then((d) => {
        if (d.length) setPosts(d);
      })
      .catch(() => {});
    request("/dashboard/leaderboard")
      .then(setLeaderboard)
      .catch(() =>
        setLeaderboard([
          { rank: 1, username: "Meera", solved: 28, points: 120 },
          { rank: 2, username: "Aarav", solved: 23, points: 104 },
          { rank: 3, username: "Rohan", solved: 19, points: 87 },
        ]),
      );
  }, []);
  useEffect(() => {
    if (authed) {
      request("/dashboard/me", { token })
        .then((d) => {
          setStats(d.stats);
          setSubmissions(d.submissions || []);
        })
        .catch(() => {});
    }
  }, [token]);
  const filtered = useMemo(
    () =>
      problems.filter(
        (p) =>
          (p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.topic?.toLowerCase().includes(query.toLowerCase())) &&
          (difficulty === "All" || p.difficulty === difficulty) &&
          (topic === "All" || p.topic === topic),
      ),
    [problems, query, difficulty, topic],
  );
  const topics = [
    "All",
    ...new Set(problems.map((p) => p.topic).filter(Boolean)),
  ];
  function flash(s) {
    setNotice(s);
    setTimeout(() => setNotice(""), 3200);
  }
  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    flash("You have been logged out.");
  }
  async function submitAuth(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const path = authMode === "login" ? "/auth/login" : "/auth/register";
      const d = await request(path, {
        method: "POST",
        body: JSON.stringify({
          username: fd.get("username"),
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      setToken(d.token);
      setUser(d.user);
      localStorage.setItem("cc_token", d.token);
      localStorage.setItem("cc_user", JSON.stringify(d.user));
      setAuthOpen(false);
      flash(`Welcome${d.user.username ? `, ${d.user.username}` : ""}!`);
      request("/dashboard/me", { token: d.token })
        .then((x) => {
          setStats(x.stats);
          setSubmissions(x.submissions || []);
        })
        .catch(() => {});
    } catch (e) {
      flash(e.message);
    }
  }
  async function runCode() {
    if (!authed) {
      setAuthOpen(true);
      flash("Log in to submit code.");
      return;
    }
    setLoading(true);
    setOutput("Sending code to Judge0…");
    try {
      const d = await request(`/problems/${selected._id}/submit`, {
        method: "POST",
        token,
        body: JSON.stringify({ language, sourceCode: code }),
      });
      setOutput(
        `${d.status}\n\n${d.stdout || ""}${d.stderr ? `\n${d.stderr}` : ""}`,
      );
      request("/dashboard/me", { token })
        .then((x) => {
          setStats(x.stats);
          setSubmissions(x.submissions || []);
        })
        .catch(() => {});
    } catch (e) {
      setOutput(
        e.message +
          "\n\nFor sample/demo problems, configure MongoDB and Judge0 in backend/.env.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function createPost(e) {
    e.preventDefault();
    if (!authed) {
      setAuthOpen(true);
      return;
    }
    try {
      const p = await request("/posts", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          code: postCode,
          topic: postTopic,
        }),
      });
      setPosts([p, ...posts]);
      setPostTitle("");
      setPostBody("");
      setPostCode("");
      setShowPostForm(false);
      flash("Your doubt is live in the Help Room.");
    } catch (e) {
      flash(e.message);
    }
  }
  async function interactPost(post, action) {
    if (!authed) {
      setAuthOpen(true);
      return;
    }
    try {
      if (post._id.startsWith("p")) {
        flash(
          "Sign in and connect MongoDB to save interactions for sample posts.",
        );
        return;
      }
      const d = await request(`/posts/${post._id}/${action}`, {
        method: "POST",
        token,
        body: "{}",
      });
      setPosts(
        posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                [action === "like" ? "likes" : "bookmarks"]:
                  action === "like"
                    ? Array(d.likes).fill("x")
                    : d.bookmarked
                      ? [...(p.bookmarks || []), "x"]
                      : (p.bookmarks || []).slice(1),
              }
            : p,
        ),
      );
    } catch (e) {
      flash(e.message);
    }
  }
  async function addComment(post) {
    if (!authed) {
      setAuthOpen(true);
      return;
    }
    const body = commentDraft[post._id]?.trim();
    if (!body) return;
    try {
      const updated = await request(`/posts/${post._id}/comments`, {
        method: "POST",
        token,
        body: JSON.stringify({ body }),
      });
      setPosts(posts.map((p) => (p._id === post._id ? updated : p)));
      setCommentDraft({ ...commentDraft, [post._id]: "" });
    } catch (e) {
      flash(e.message);
    }
  }
  async function askAssistant() {
    if (!authed) {
      setAuthOpen(true);
      return;
    }
    setAssistantAnswer("Thinking…");
    try {
      const d = await request("/assistant", {
        method: "POST",
        token,
        body: JSON.stringify({ prompt: assistantPrompt, code, language }),
      });
      setAssistantAnswer(d.answer);
    } catch (e) {
      setAssistantAnswer(e.message);
    }
  }
  const nav = [
    ["Dashboard", LayoutDashboard],
    ["Problems", BookOpen],
    ["Submissions", FileText],
    ["Leaderboard", Trophy],
    ["Help Room", MessagesSquare],
  ];
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Code2 size={22} />
          </div>
          <div>
            <b>CodeConnect</b>
            <small>LEARN. BUILD. SHARE.</small>
          </div>
          <button className="mobile-close" onClick={() => setMobileNav(false)}>
            <X />
          </button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                setMobileNav(false);
              }}
            >
              <Icon size={18} />
              <span>{name}</span>
              {name === "Help Room" && (
                <span className="nav-count">{posts.length}</span>
              )}
              {name === "Submissions" && submissions.length > 0 && (
                <span className="nav-count">{submissions.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="better-card">
            <div className="bolt">
              <Zap size={18} />
            </div>
            <b>
              Better
              <br />
              Every Day
            </b>
            <p>Small steps in coding each day lead to big results.</p>
            <svg
              className="wave"
              viewBox="0 0 240 56"
              preserveAspectRatio="none"
            >
              <path
                d="M0 50 C40 46 60 30 100 38 S160 20 240 8"
                fill="none"
                stroke="#9b7bff"
                strokeWidth="2.5"
                style={{ filter: "drop-shadow(0 0 6px #9b7bff)" }}
              />
            </svg>
          </div>
          <div className="profile-mini">
            <div className="avatar">
              {user?.username?.[0]?.toUpperCase() || "G"}
            </div>
            <div className="profile-meta">
              <b>{user?.username || "Guest learner"}</b>
              <span>{authed ? "Student account" : "Explore as guest"}</span>
            </div>
            {authed ? (
              <button className="icon-button" title="Log out" onClick={logout}>
                <LogOut size={16} />
              </button>
            ) : (
              <button
                className="icon-button"
                title="Log in"
                onClick={() => setAuthOpen(true)}
              >
                <LogIn size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)}>
            <Menu />
          </button>
          <div className="top-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setPage("Problems")}
              placeholder="Search problems, topics, or anything..."
            />
            <kbd>Ctrl K</kbd>
          </div>
          <div className="top-actions">
            <button
              className="icon-button notification"
              onClick={() => flash("You are all caught up!")}
            >
              <Bell size={18} />
              <i />
            </button>
            <button
              className="icon-button"
              onClick={() => flash("Neon dark theme is on 🌙")}
            >
              <Moon size={18} />
            </button>
            <button
              className="top-profile"
              onClick={() =>
                authed ? setPage("Dashboard") : setAuthOpen(true)
              }
            >
              <div className="avatar small">
                {user?.username?.[0]?.toUpperCase() || "G"}
              </div>
              <span className="top-name">{user?.username || "Guest"}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className="page-content" key={page}>
          {page === "Dashboard" && (
            <Dashboard
              submissions={submissions}
              user={user}
              authed={authed}
              stats={stats}
              problems={problems}
              posts={posts}
              leaderboard={leaderboard}
              onPage={setPage}
              onSelect={(p) => {
                setSelected(p);
                setPage("Editor");
                setCode(
                  p.starterCode?.javascript ||
                    `// Solve: ${p.title}\nfunction solution() {\n  // Your code here\n}`,
                );
              }}
            />
          )}
          {page === "Problems" && (
            <>
              <PageHeading
                eyebrow="PRACTICE ARENA"
                title="Sharpen your skills."
                subtitle="Pick a challenge, write a solution, and keep your momentum going."
                right={
                  <div className="heading-stat">
                    <Flame size={17} />
                    <span>
                      <b>{stats.solved || 0}</b> solved
                    </span>
                  </div>
                }
              />
              <div className="filter-bar">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search problems or topics..."
                  />
                </div>
                <div className="select-wrap">
                  <Filter size={15} />
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option>All</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="select-wrap">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="problems-layout">
                <div className="problem-table">
                  <div className="table-head">
                    <span>PROBLEM</span>
                    <span>TOPIC</span>
                    <span>DIFFICULTY</span>
                    <span> </span>
                  </div>
                  {filtered.map((p, i) => (
                    <button
                      key={p._id}
                      className={`problem-row ${selected?._id === p._id ? "chosen" : ""}`}
                      onClick={() => setSelected(p)}
                    >
                      <span className="problem-name">
                        <span className="problem-index">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <b>{p.title}</b>
                          <small>
                            {p.examples?.length || 1} example
                            {(p.examples?.length || 1) > 1 ? "s" : ""}
                          </small>
                        </span>
                      </span>
                      <span className="topic-tag">{p.topic}</span>
                      <span>
                        <Difficulty value={p.difficulty} />
                      </span>
                      <ArrowUpRight size={16} className="row-arrow" />
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="empty-state">
                      No problems match those filters.
                    </div>
                  )}
                </div>
                <div className="problem-preview">
                  <div className="preview-top">
                    <span className="eyebrow">QUICK PREVIEW</span>
                    <span className="preview-icon">
                      <Braces size={19} />
                    </span>
                  </div>
                  <h2>{selected?.title || "Choose a problem"}</h2>
                  <div className="preview-tags">
                    <Difficulty value={selected?.difficulty} />
                    <span className="topic-tag">{selected?.topic}</span>
                  </div>
                  <p>{selected?.description}</p>
                  <div className="example-box">
                    <div>
                      <b>Example</b>
                      <span>01</span>
                    </div>
                    <code>
                      {selected?.examples?.[0]?.input || "Input example"}
                    </code>
                    <div className="example-output">
                      <span>Output</span>
                      <code>{selected?.examples?.[0]?.output || "Output"}</code>
                    </div>
                  </div>
                  <button
                    className="primary-button full"
                    onClick={() => {
                      setPage("Editor");
                      setCode(
                        selected?.starterCode?.javascript ||
                          `// ${selected?.title}\nfunction solution() {\n  // Write your solution here\n}`,
                      );
                    }}
                  >
                    Solve problem <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
          {page === "Editor" && (
            <EditorPage
              problem={selected}
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              output={output}
              runCode={runCode}
              loading={loading}
              assistantPrompt={assistantPrompt}
              setAssistantPrompt={setAssistantPrompt}
              assistantAnswer={assistantAnswer}
              askAssistant={askAssistant}
              authed={authed}
              onBack={() => setPage("Problems")}
            />
          )}
          {page === "Help Room" && (
            <>
              <PageHeading
                eyebrow="PEER-TO-PEER LEARNING"
                title="Help Room"
                subtitle="Stuck on a problem? Ask the community. Know the answer? Share what you know."
                right={
                  <button
                    className="primary-button"
                    onClick={() =>
                      authed
                        ? setShowPostForm(!showPostForm)
                        : setAuthOpen(true)
                    }
                  >
                    <Plus size={17} /> Ask a question
                  </button>
                }
              />
              {showPostForm && (
                <form className="compose-card" onSubmit={createPost}>
                  <div className="compose-title">
                    <div className="post-avatar">
                      <MessagesSquare size={18} />
                    </div>
                    <div>
                      <b>Start a discussion</b>
                      <p>
                        Be clear about what you tried and where you're stuck.
                      </p>
                    </div>
                  </div>
                  <input
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Give your question a clear title"
                  />
                  <textarea
                    required
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    placeholder="Describe your approach, expected result, and what isn't working..."
                    rows="4"
                  />
                  <textarea
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    placeholder="Paste code (optional)"
                    rows="3"
                    className="code-input"
                  />
                  <div className="compose-actions">
                    <select
                      value={postTopic}
                      onChange={(e) => setPostTopic(e.target.value)}
                    >
                      {[
                        "Arrays",
                        "Strings",
                        "Recursion",
                        "Dynamic Programming",
                        "Searching",
                        "Stacks",
                        "Trees",
                        "General",
                      ].map((x) => (
                        <option>{x}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowPostForm(false)}
                    >
                      Cancel
                    </button>
                    <button className="primary-button">
                      <Send size={15} /> Publish question
                    </button>
                  </div>
                </form>
              )}
              <div className="help-toolbar">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search discussions..."
                  />
                </div>
                <span>{posts.length} discussions</span>
              </div>
              <div className="discussion-list">
                {posts
                  .filter((p) =>
                    `${p.title} ${p.body} ${p.topic}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((p, i) => (
                    <article className="discussion-card" key={p._id}>
                      <div className="post-avatar">
                        {(p.author?.username || "S")[0].toUpperCase()}
                      </div>
                      <div className="discussion-main">
                        <div className="post-meta">
                          <b>{p.author?.username || "Student"}</b>
                          <span>·</span>
                          <span>{i + 1}h ago</span>
                          <span className="topic-tag">{p.topic}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p>{p.body}</p>
                        {p.code && (
                          <pre className="post-code">
                            <code>{p.code}</code>
                          </pre>
                        )}
                        <div className="post-actions">
                          <button onClick={() => interactPost(p, "like")}>
                            <Heart size={16} /> {p.likes?.length || 0} likes
                          </button>
                          <button
                            onClick={() =>
                              document
                                .getElementById(`comment-${p._id}`)
                                ?.focus()
                            }
                          >
                            <MessageCircle size={16} />{" "}
                            {p.comments?.length || 0} replies
                          </button>
                          <button onClick={() => interactPost(p, "bookmark")}>
                            <Bookmark size={15} /> Save
                          </button>
                        </div>
                        {p.comments?.slice(0, 2).map((c, j) => (
                          <div className="comment" key={j}>
                            <div className="comment-avatar">
                              {(c.user?.username || "P")[0].toUpperCase()}
                            </div>
                            <p>
                              <b>{c.user?.username || "Peer"} </b>
                              {c.body}
                            </p>
                          </div>
                        ))}
                        <div className="comment-form">
                          <input
                            id={`comment-${p._id}`}
                            value={commentDraft[p._id] || ""}
                            onChange={(e) =>
                              setCommentDraft({
                                ...commentDraft,
                                [p._id]: e.target.value,
                              })
                            }
                            placeholder="Add a helpful reply..."
                            onKeyDown={(e) =>
                              e.key === "Enter" && addComment(p)
                            }
                          />
                          <button
                            onClick={() => addComment(p)}
                            aria-label="Send reply"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </>
          )}
          {page === "Leaderboard" && (
            <>
              <PageHeading
                eyebrow="COMMUNITY SPOTLIGHT"
                title="Leaderboard"
                subtitle="Celebrating consistency, problem-solving, and students who help others."
              />
              <div className="leaderboard-card">
                <div className="leaderboard-head">
                  <div>
                    <span className="eyebrow">THIS COMMUNITY</span>
                    <h2>Top contributors</h2>
                  </div>
                  <div className="trophy-bubble">
                    <Trophy size={23} />
                  </div>
                </div>
                <div className="leader-row leader-label">
                  <span>RANK / STUDENT</span>
                  <span>PROBLEMS SOLVED</span>
                  <span>POINTS</span>
                </div>
                {(leaderboard.length
                  ? leaderboard
                  : [
                      { rank: 1, username: "Meera", solved: 28, points: 120 },
                      { rank: 2, username: "Aarav", solved: 23, points: 104 },
                      { rank: 3, username: "Rohan", solved: 19, points: 87 },
                    ]
                ).map((u, i) => (
                  <div className="leader-row" key={u.username}>
                    <div className="leader-person">
                      <span className={`rank rank-${i + 1}`}>{u.rank}</span>
                      <div className="avatar">{u.username[0]}</div>
                      <div>
                        <b>{u.username}</b>
                        <small>
                          {i === 0
                            ? "Consistency champion"
                            : i === 1
                              ? "Problem solver"
                              : "Community contributor"}
                        </small>
                      </div>
                    </div>
                    <span className="solved-count">
                      <CheckCircle2 size={15} />
                      {u.solved}
                    </span>
                    <span className="points">
                      {u.points} <span>pts</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="leader-note">
                <Lightbulb size={18} />
                <p>
                  <b>How to earn points</b>
                  <br />
                  Solve coding problems, ask thoughtful questions, and
                  contribute explanations that help your peers.
                </p>
              </div>
            </>
          )}
          {page === "Submissions" && (
            <SubmissionsPage
              submissions={submissions}
              authed={authed}
              onLogin={() => setAuthOpen(true)}
            />
          )}
          {page === "Profile" && (
            <Dashboard
              submissions={submissions}
              user={user}
              authed={authed}
              stats={stats}
              problems={problems}
              posts={posts}
              leaderboard={leaderboard}
              onPage={setPage}
              onSelect={(p) => {
                setSelected(p);
                setPage("Editor");
              }}
            />
          )}
        </div>
        <footer className="footer">
          <span>© 2026 CodeConnect</span>
          <span>
            Built for learners, by learners{" "}
            <span className="footer-heart">♥</span>
          </span>
          <span>Version 1.0.0</span>
        </footer>
      </main>
      {notice && <div className="toast">{notice}</div>}
      {authOpen && (
        <div className="modal-backdrop" onClick={() => setAuthOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthOpen(false)}>
              <X size={19} />
            </button>
            <div className="auth-logo">
              <Code2 size={25} />
            </div>
            <span className="eyebrow">YOUR CODING COMMUNITY</span>
            <h2>
              {authMode === "login" ? "Welcome back." : "Join CodeConnect."}
            </h2>
            <p>
              {authMode === "login"
                ? "Pick up where you left off."
                : "Practice, ask questions, and learn together."}
            </p>
            <form onSubmit={submitAuth}>
              {authMode === "register" && (
                <label>
                  Username
                  <input
                    name="username"
                    placeholder="e.g. tripti_codes"
                    required
                    minLength="2"
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                  minLength="8"
                />
              </label>
              <button className="primary-button full">
                {authMode === "login" ? "Sign in" : "Create account"}{" "}
                <ArrowUpRight size={16} />
              </button>
            </form>
            <div className="auth-switch">
              {authMode === "login"
                ? "New to CodeConnect?"
                : "Already have an account?"}
              <button
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
            <small className="auth-footnote">
              Demo mode: problem browsing works without an account. Sign in to
              post and track progress.
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
function PageHeading({ eyebrow, title, subtitle, right }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {right && <div className="heading-right">{right}</div>}
    </div>
  );
}
function Difficulty({ value }) {
  return (
    <span className={`difficulty ${String(value || "Easy").toLowerCase()}`}>
      {value || "Easy"}
    </span>
  );
}
function CountUp({ to = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const end = Number(to) || 0;
    if (!end) {
      setN(0);
      return;
    }
    let raf, start;
    const dur = 900;
    const tick = (t) => {
      start = start || t;
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="cc-count">{n}</span>;
}
function Spark({ tone, d }) {
  return (
    <svg className={`spark ${tone}`} viewBox="0 0 120 44">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 5px currentColor)" }}
      />
    </svg>
  );
}
function ago(t) {
  const m = Math.max(1, Math.round((Date.now() - new Date(t)) / 60000));
  return m < 60
    ? `${m} minute${m > 1 ? "s" : ""} ago`
    : m < 1440
      ? `${Math.round(m / 60)} hour(s) ago`
      : `${Math.round(m / 1440)} day(s) ago`;
}

// heatmap added 

function ActivityHeatmap({ submissions = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (364 - i));

    const count = submissions.filter((s) => {
      const submittedDate = new Date(s.createdAt);
      submittedDate.setHours(0, 0, 0, 0);
      return submittedDate.getTime() === date.getTime();
    }).length;

    return { date, count };
  });

  return (
    <section className="activity-card">
      <h3>Submission Activity</h3>
      <p>Your coding journey over the last year</p>

      <div className="activity-grid">
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`activity-cell level-${Math.min(day.count, 4)}`}
            title={`${day.date.toLocaleDateString()}: ${day.count} submissions`}
          />
        ))}
      </div>

      <div className="activity-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={`activity-cell level-${level}`}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}


function Dashboard({
  user,
  authed,
  stats,
  problems,
  posts,
  leaderboard,
  submissions = [],
  onPage,
  onSelect,
}) {
  const total = problems.length || 1,
    pct = Math.min(100, Math.round(((stats.solved || 0) / total) * 100));
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const done = days.map((d) =>
    submissions.some((s) => {
      const t = new Date(s.createdAt);
      t.setHours(0, 0, 0, 0);
      return +t === +d;
    }),
  );
  let streak = 0;
  for (let i = 6; i >= 0 && done[i]; i--) streak++;
  const topics = [
    ...new Set(problems.map((p) => p.topic).filter(Boolean)),
  ].slice(0, 8);
  const next = problems[(stats.solved || 0) % total] || problems[0];
  const first = problems[0];
  const cards = [
    [
      CheckCircle2,
      "Problems Solved",
      stats.solved,
      "Keep building your streak!",
      "green",
      "M2 36 C14 30 22 18 34 24 S52 10 66 16 S88 6 118 8",
    ],
    [
      Terminal,
      "Submissions",
      stats.submissions,
      "Every attempt counts!",
      "blue",
      "M2 34 C16 30 24 36 38 26 S60 28 72 18 S96 22 118 10",
    ],
    [
      MessagesSquare,
      "Contributions",
      stats.contributions,
      "Help someone today!",
      "purple",
      "M2 38 C12 20 22 34 34 22 S52 30 62 16 S86 28 100 12 S112 14 118 10",
    ],
    [
      Trophy,
      "Community Points",
      stats.points,
      "Your engagement matters!",
      "orange",
      "M2 34 C14 20 24 36 38 24 S58 18 70 26 S92 10 118 22",
    ],
  ];
  return (
    <>
      <div className="nd-top">
        <section className="nd-hero">
          <div>
            <div className="nd-welcome">
              <Zap size={13} /> Welcome
              {authed ? ` back, ${user?.username}` : " to CodeConnect"} 👋
            </div>
            <h1>
              Code smarter.
              <br />
              Grow <em>together.</em>
            </h1>
            <p>
              Solve problems, learn new concepts, get help from the community
              and build your coding skills — one step at a time.
            </p>
            <div className="nd-actions">
              <button
                className="primary-button"
                onClick={() => onPage("Problems")}
              >
                Start Practicing <ArrowUpRight size={16} />
              </button>
              <button
                className="secondary-button"
                onClick={() => onPage("Help Room")}
              >
                <UserRound size={15} /> Join Community
              </button>
            </div>
            <div className="nd-social">
              <div className="avatar-stack">
                <span>A</span>
                <span>M</span>
                <span>R</span>
                <span>S</span>
              </div>
              <span>
                <b>{leaderboard.length || 3}+ learners</b>
                <br />
                <small>are growing with CodeConnect</small>
              </span>
            </div>
          </div>
          <div className="nd-art">
            <div className="nd-glow" />
            <div className="nd-laptop">
              <div className="nd-screen">
                {Array.from({ length: 11 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <div className="nd-base" />
            </div>
            <div className="nd-hex h1">
              <Code2 size={24} />
            </div>
            <div className="nd-hex h2">
              <Code2 size={22} />
            </div>
            <div className="nd-chip c1">
              Build
              <br />
              Your Future
            </div>
            <div className="nd-chip c2">
              Learn
              <br />
              Code
              <br />
              Improve
              <br />
              Repeat
            </div>
          </div>
        </section>
        <section className="nd-progress panel">
          <div className="nd-prog-head">
            <h2>Your Progress</h2>
            <button className="nd-link" onClick={() => onPage("Submissions")}>
              View details <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="nd-prog-body">
            <div className="nd-ring" style={{ "--pct": `${pct}%` }}>
              <div>
                <b>
                  <CountUp to={pct} />%
                </b>
                <small>Overall Progress</small>
              </div>
            </div>
            <div className="nd-rows">
              <div className="nd-row">
                <CheckCircle2 size={16} />
                Problems Solved
                <b>
                  {stats.solved || 0} / {problems.length}
                </b>
              </div>
              <div className="nd-row">
                <FileText size={16} />
                Submissions<b>{stats.submissions || 0}</b>
              </div>
              <div className="nd-row">
                <Flame size={16} />
                Streak
                <b>
                  {streak} day{streak === 1 ? "" : "s"}
                </b>
              </div>
              <div className="nd-row">
                <Trophy size={16} />
                Points<b>{stats.points || 0}</b>
              </div>
            </div>
          </div>
          <div className="nd-streak">
            <div className="nd-streak-top">
              <Flame size={26} />
              <div>
                <b>{streak} Day Streak</b>
                <small>Keep the momentum going!</small>
              </div>
            </div>
            <div className="nd-days">
              {days.map((d, i) => (
                <div
                  key={i}
                  className={`nd-day ${done[i] ? "done" : ""} ${i === 6 ? "today" : ""}`}
                >
                  <i>
                    {i === 6 && !done[i] ? (
                      <Flame size={14} style={{ color: "#ff7ad9" }} />
                    ) : (
                      "✓"
                    )}
                  </i>
                  {d.toLocaleDateString("en", { weekday: "short" })}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="nd-head">
        <div>
          <span className="eyebrow">Your Overview</span>
          <h2>Progress at a glance</h2>
        </div>
      </div>
      <div className="nd-stats">
        {cards.map(([Icon, label, val, cap, tone, d]) => (
          <div className="nd-stat panel" key={label}>
            <div className={`ico ${tone}`}>
              <Icon size={20} />
            </div>
            <span className="l">{label}</span>
            <span className="v">
              <CountUp to={val || 0} />
            </span>
            <Spark tone={tone} d={d} />
            <small>{cap}</small>
          </div>
        ))}
      </div>


      {/* Blue activity heatmap */}
      <ActivityHeatmap submissions={submissions} />

      <div className="nd-bottom">
        <section className="nd-card panel">
          <div className="nd-card-head">
            <h3>
              <BookOpen size={18} /> Continue Learning
            </h3>
          </div>
          {first && (
            <div className="nd-learn">
              <div className="ic">{"</>"}</div>
              <div className="mid">
                <b>{first.title}</b>
                <div className="nd-bar">
                  <i style={{ width: `${Math.max(pct, 5)}%` }} />
                </div>
              </div>
              <button
                className="primary-button"
                onClick={() => onSelect(first)}
              >
                Continue <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </section>
        <section className="nd-card panel">
          <div className="nd-card-head">
            <h3>
              <Flame size={18} /> Popular Topics
            </h3>
            <button className="nd-link" onClick={() => onPage("Problems")}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="nd-chips">
            {topics.map((t) => (
              <button key={t} onClick={() => onPage("Problems")}>
                {t}
              </button>
            ))}
          </div>
        </section>
        <section className="nd-card panel">
          <div className="nd-card-head">
            <h3>
              <Clock3 size={18} /> Recent Activity
            </h3>
            <button className="nd-link" onClick={() => onPage("Submissions")}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          {submissions.slice(0, 3).map((s) => (
            <div className="nd-act" key={s._id}>
              <div className={`dot ${s.status === "Accepted" ? "ok" : ""}`}>
                {s.status === "Accepted" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Braces size={16} />
                )}
              </div>
              <div>
                You {s.status === "Accepted" ? "solved" : "submitted"}{" "}
                <em>{s.problem?.title || "a problem"}</em>
                <small>{ago(s.createdAt)}</small>
              </div>
            </div>
          ))}
          {!submissions.length && (
            <div className="nd-act">
              <div className="dot">
                <Braces size={16} />
              </div>
              <div>
                {authed
                  ? "No activity yet — solve your first problem!"
                  : "Log in to see your activity."}
              </div>
            </div>
          )}
        </section>
      </div>
      <div className="nd-banner">
        <div className="ic">
          <Rocket size={20} />
        </div>
        <div>
          <b>Keep going{authed ? `, ${user?.username}` : ""}!</b>
          <small>Consistency beats talent. You're doing great!</small>
        </div>
        <button
          className="primary-button"
          onClick={() => next && onSelect(next)}
        >
          Next Challenge <ArrowUpRight size={15} />
        </button>
      </div>
    </>
  );
}
function SubmissionsPage({ submissions, authed, onLogin }) {
  return (
    <>
      <PageHeading
        eyebrow="YOUR HISTORY"
        title="Submissions"
        subtitle="Everything you've sent to the judge, newest first."
      />
      <div className="problem-table">
        {!authed && (
          <div className="empty-state">
            Log in to see your submissions.{" "}
            <button className="nd-link" onClick={onLogin}>
              Log in
            </button>
          </div>
        )}
        {authed && !submissions.length && (
          <div className="empty-state">No submissions yet.</div>
        )}
        {submissions.map((s) => (
          <div
            className="problem-row"
            key={s._id}
            style={{ cursor: "default" }}
          >
            <span className="problem-name">
              <span>
                <b>{s.problem?.title || "Problem"}</b>
                <small>
                  {s.language} · {ago(s.createdAt)}
                </small>
              </span>
            </span>
            <span className="topic-tag">{s.time ? `${s.time}s` : "—"}</span>
            <span>
              <span
                className={`difficulty ${s.status === "Accepted" ? "easy" : "hard"}`}
              >
                {s.status}
              </span>
            </span>
            <span />
          </div>
        ))}
      </div>
    </>
  );
}
function StatCard({ icon: Icon, label, value, change, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <div className="stat-value">
        <CountUp to={value} />
        <small>{change}</small>
      </div>
      <div className={`stat-spark ${tone}`}>↗</div>
    </div>
  );
}
function EditorPage({
  problem,
  code,
  setCode,
  language,
  setLanguage,
  output,
  runCode,
  loading,
  assistantPrompt,
  setAssistantPrompt,
  assistantAnswer,
  askAssistant,
  authed,
  onBack,
}) {
  return (
    <>
      <div className="editor-heading">
        <button className="back-link" onClick={onBack}>
          ‹ All problems
        </button>
        <div className="editor-title-row">
          <div>
            <span className="eyebrow">CODING WORKSPACE</span>
            <h1>{problem?.title || "Code Editor"}</h1>
            <div className="preview-tags">
              <Difficulty value={problem?.difficulty} />
              <span className="topic-tag">{problem?.topic}</span>
            </div>
          </div>
          <button
            className="primary-button"
            onClick={runCode}
            disabled={loading}
          >
            <Play size={15} fill="currentColor" />
            {loading ? "Running…" : "Run & submit"}
          </button>
        </div>
      </div>
      <div className="editor-layout">
        <section className="panel description-panel">
          <div className="editor-tab">
            <BookOpen size={15} /> Description
          </div>
          <h2>{problem?.title}</h2>
          <p>{problem?.description}</p>
          <h3>Example</h3>
          <div className="example-box">
            <code>{problem?.examples?.[0]?.input || "Input"}</code>
            <div className="example-output">
              <span>Output</span>
              <code>{problem?.examples?.[0]?.output || "Output"}</code>
            </div>
          </div>
          <h3>Hints that help</h3>
          <p className="muted">
            Think about the data structure or pattern that can reduce repeated
            work. Explain your approach before optimizing.
          </p>
          <div className="assistant-box">
            <div className="assistant-heading">
              <Sparkles size={16} />
              <b>AI Coding Assistant</b>
              <span>OPTIONAL</span>
            </div>
            <p>
              Ask for a hint or explanation—learn the reasoning, not just the
              answer.
            </p>
            <textarea
              value={assistantPrompt}
              onChange={(e) => setAssistantPrompt(e.target.value)}
              placeholder="Why might a hash map help here?"
              rows="2"
            />
            <button className="secondary-button full" onClick={askAssistant}>
              Ask assistant <Send size={14} />
            </button>
            {assistantAnswer && (
              <div className="assistant-answer">{assistantAnswer}</div>
            )}
          </div>
        </section>
        <section className="panel code-panel">
          <div className="code-toolbar">
            <div className="editor-tab">
              <Braces size={15} /> Code editor
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(
                  e.target.value === "python"
                    ? "def solution():\n    # Your code here\n    pass"
                    : e.target.value === "java"
                      ? "class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}"
                      : e.target.value === "cpp"
                        ? "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Your code here\n    return 0;\n}"
                        : "function solution() {\n  // Your code here\n}",
                );
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
          </div>
          <div className="monaco-wrap">
            <Editor
              height="390px"
              language={
                language === "cpp" || language === "c" ? "cpp" : language
              }
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                padding: { top: 18 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                roundedSelection: true,
              }}
            />
          </div>
          <div className="output-header">
            <div>
              <Terminal size={15} />
              <b>Console output</b>
            </div>
            <span className="output-status">
              <span></span> Ready
            </span>
          </div>
          <pre className="output-box">{output}</pre>
          <div className="editor-bottom">
            <span>
              <Clock3 size={13} /> Runtime shown after execution
            </span>
            <button
              className="primary-button"
              onClick={runCode}
              disabled={loading}
            >
              <Play size={14} />
              {loading ? "Running…" : "Run code"}
            </button>
          </div>
        </section>
      </div>
      {!authed && (
        <div className="login-tip">
          <Lightbulb size={17} /> You can explore the editor as a guest. Log in
          to submit code and save your progress.
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
