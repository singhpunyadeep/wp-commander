import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "wpcommander_sites";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "create", label: "Create Post", icon: "✦" },
  { id: "posts", label: "Posts", icon: "≡" },
  { id: "pages", label: "Pages", icon: "◫" },
  { id: "comments", label: "Comments", icon: "◈" },
  { id: "seo", label: "SEO Tools", icon: "◎" },
  { id: "media", label: "Media", icon: "⊞" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a25;
    --surface3: #22222f;
    --border: #2a2a3a;
    --accent: #6ee7b7;
    --accent2: #818cf8;
    --accent3: #f472b6;
    --warn: #fb923c;
    --danger: #f87171;
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #475569;
    --radius: 10px;
    --mono: 'DM Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  html, body, #root { height: 100%; }
  body { background: var(--bg); color: var(--text); font-family: var(--mono); }

  .app {
    display: flex; height: 100vh; overflow: hidden;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(110,231,183,0.03) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(129,140,248,0.04) 0%, transparent 50%);
  }

  .sidebar {
    width: 220px; min-width: 220px;
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; z-index: 10;
  }
  .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid var(--border); }
  .logo-mark { font-family: var(--sans); font-size: 18px; font-weight: 800; color: var(--accent); letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
  .logo-sub { color: var(--text2); font-weight: 400; font-size: 11px; font-family: var(--mono); display: block; margin-top: 3px; }

  .site-selector { padding: 16px 12px; border-bottom: 1px solid var(--border); }
  .site-selector .lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--text3); display: block; margin-bottom: 6px; }
  .site-select { width: 100%; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--mono); font-size: 11px; padding: 8px 10px; border-radius: 6px; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
  .site-select:focus { border-color: var(--accent); }
  .add-site-btn { width: 100%; margin-top: 6px; padding: 6px; background: transparent; border: 1px dashed var(--border); color: var(--text3); font-family: var(--mono); font-size: 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .add-site-btn:hover { border-color: var(--accent); color: var(--accent); }

  .nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 7px; cursor: pointer; font-size: 12px; color: var(--text2); transition: all 0.15s; margin-bottom: 2px; border: 1px solid transparent; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(110,231,183,0.08); color: var(--accent); border-color: rgba(110,231,183,0.15); }
  .nav-icon { font-size: 14px; width: 18px; text-align: center; }

  .sidebar-footer { padding: 12px; border-top: 1px solid var(--border); }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); display: inline-block; margin-right: 6px; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .status-text { font-size: 10px; color: var(--text3); }

  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar { height: 56px; min-height: 56px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .topbar-title { font-family: var(--sans); font-size: 15px; font-weight: 700; color: var(--text); }
  .topbar-actions { display: flex; gap: 8px; align-items: center; }
  .tag { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; padding: 3px 8px; border-radius: 4px; }
  .tag-green { background: rgba(110,231,183,0.1); color: var(--accent); border: 1px solid rgba(110,231,183,0.2); }
  .tag-purple { background: rgba(129,140,248,0.1); color: var(--accent2); border: 1px solid rgba(129,140,248,0.2); }
  .tag-pink { background: rgba(244,114,182,0.1); color: var(--accent3); border: 1px solid rgba(244,114,182,0.2); }

  .content { flex: 1; overflow-y: auto; padding: 28px; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .card-title { font-family: var(--sans); font-size: 13px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }

  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.green::before { background: var(--accent); }
  .stat-card.purple::before { background: var(--accent2); }
  .stat-card.pink::before { background: var(--accent3); }
  .stat-card.orange::before { background: var(--warn); }
  .stat-num { font-family: var(--sans); font-size: 32px; font-weight: 800; color: var(--text); }
  .stat-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
  .stat-icon { position: absolute; top: 16px; right: 16px; font-size: 24px; opacity: 0.15; }

  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 7px; border: none; font-family: var(--mono); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn-primary { background: var(--accent); color: #0a0a0f; }
  .btn-primary:hover { background: #4ade80; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(110,231,183,0.3); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(248,113,113,0.1); color: var(--danger); border: 1px solid rgba(248,113,113,0.2); }
  .btn-danger:hover { background: rgba(248,113,113,0.2); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-sm { padding: 5px 10px; font-size: 10px; border-radius: 5px; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

  .input, .textarea, .select-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--mono); font-size: 13px; padding: 10px 14px; border-radius: 7px; outline: none; transition: border-color 0.2s; }
  .input:focus, .textarea:focus, .select-input:focus { border-color: var(--accent); }
  .textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
  .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text3); display: block; margin-bottom: 6px; }
  .field { margin-bottom: 16px; }
  .select-input { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }

  .table { width: 100%; border-collapse: collapse; }
  .table th { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--text3); padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); font-weight: 500; }
  .table td { padding: 12px 14px; border-bottom: 1px solid rgba(42,42,58,0.5); font-size: 12px; vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: rgba(255,255,255,0.01); }

  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
  .badge-green { background: rgba(110,231,183,0.1); color: var(--accent); }
  .badge-gray { background: rgba(148,163,184,0.1); color: var(--text2); }
  .badge-orange { background: rgba(251,146,60,0.1); color: var(--warn); }
  .badge-red { background: rgba(248,113,113,0.1); color: var(--danger); }
  .badge-purple { background: rgba(129,140,248,0.1); color: var(--accent2); }

  .ai-output { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; font-size: 13px; line-height: 1.8; color: var(--text); white-space: pre-wrap; word-break: break-word; max-height: 500px; overflow-y: auto; }

  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(110,231,183,0.2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-bar { height: 2px; background: var(--border); border-radius: 2px; overflow: hidden; margin: 12px 0; }
  .loading-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); animation: loadingAnim 1.5s ease-in-out infinite; transform-origin: left; }
  @keyframes loadingAnim { 0%{transform:scaleX(0) translateX(0)} 50%{transform:scaleX(0.6) translateX(60%)} 100%{transform:scaleX(0) translateX(200%)} }

  .empty { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.3; }
  .empty-text { font-size: 13px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; width: 520px; max-width: 90vw; max-height: 85vh; overflow-y: auto; }
  .modal-title { font-family: var(--sans); font-size: 18px; font-weight: 800; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }

  .alert { padding: 12px 16px; border-radius: 7px; font-size: 12px; margin-bottom: 16px; line-height: 1.6; }
  .alert-error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); color: var(--danger); }
  .alert-success { background: rgba(110,231,183,0.1); border: 1px solid rgba(110,231,183,0.2); color: var(--accent); }
  .alert-info { background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.2); color: var(--accent2); }
  .alert-warn { background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.2); color: var(--warn); }

  .inner-tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
  .inner-tab { padding: 8px 14px; font-size: 11px; cursor: pointer; color: var(--text3); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
  .inner-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .inner-tab:hover:not(.active) { color: var(--text2); }

  .progress { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 6px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .section-title { font-family: var(--sans); font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .section-sub { font-size: 12px; color: var(--text3); margin-bottom: 24px; }
  .row { display: flex; gap: 12px; align-items: flex-start; }
  .row .field { flex: 1; }
  .flex { display: flex; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .flex-1 { flex: 1; }
  .w-full { width: 100%; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mt-8 { margin-top: 8px; } .mt-12 { margin-top: 12px; } .mt-16 { margin-top: 16px; }
  .mb-16 { margin-bottom: 16px; }
  .text-sm { font-size: 11px; color: var(--text2); line-height: 1.7; }
  .text-xs { font-size: 10px; color: var(--text3); }
  .fw-600 { font-weight: 600; }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function wpFetch(site, path, options = {}) {
  const base = "/.netlify/functions/wp-proxy";
  const url = `${base}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "x-wp-site-url": site.url.replace(/\/$/, ""),
      "x-wp-username": site.username,
      "x-wp-password": site.password,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function askClaude(prompt, system) {
  const res = await fetch("/.netlify/functions/claude-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text || "";
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

// ─── ADD SITE MODAL ───────────────────────────────────────────────────────────
function AddSiteModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", url: "", username: "", password: "" });
  const [testing, setTesting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const testConnection = async () => {
    if (!form.url || !form.username || !form.password) { setErr("Fill in all fields first"); return; }
    setTesting(true); setErr(""); setOk(false);
    try {
      const res = await wpFetch(form, "/users/me");
      if (res.ok) { setOk(true); }
      else { const d = await res.json(); setErr(d.message || "Authentication failed — check username/password"); }
    } catch (e) { setErr("Cannot reach site. Check URL and try again."); }
    setTesting(false);
  };

  const save = () => {
    if (!form.name || !form.url || !form.username || !form.password) { setErr("All fields are required"); return; }
    onAdd({ ...form, id: Date.now().toString() });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Add WordPress Site</div>
        <div className="alert alert-info">Use an Application Password, not your main WP password. Generate one from WP Admin → Users → Profile → Application Passwords.</div>
        {err && <div className="alert alert-error">{err}</div>}
        {ok && <div className="alert alert-success">✓ Connection successful! You can now save this site.</div>}
        <div className="field"><label className="lbl">Site Name</label><input className="input" placeholder="Supply Chain Star" value={form.name} onChange={set("name")} /></div>
        <div className="field"><label className="lbl">WordPress URL</label><input className="input" placeholder="https://supplychainstar.com" value={form.url} onChange={set("url")} /></div>
        <div className="field"><label className="lbl">Admin Username</label><input className="input" placeholder="singhpunyadeep" value={form.username} onChange={set("username")} /></div>
        <div className="field"><label className="lbl">Application Password</label><input className="input" type="password" placeholder="xxxx xxxx xxxx xxxx xxxx xxxx" value={form.password} onChange={set("password")} /></div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary" onClick={testConnection} disabled={testing}>{testing ? <><span className="spinner" /> Testing...</> : "Test Connection"}</button>
          <button className="btn btn-primary" onClick={save}>Save Site</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ site }) {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!site) return;
    setLoading(true);
    Promise.all([
      wpFetch(site, "/posts?per_page=5&status=publish").then((r) => r.json()),
      wpFetch(site, "/comments?per_page=1&status=spam").then((r) => ({ spam: r.headers.get("X-WP-Total") || "?" })),
      wpFetch(site, "/comments?per_page=1&status=hold").then((r) => ({ pending: r.headers.get("X-WP-Total") || "?" })),
      wpFetch(site, "/posts?per_page=1").then((r) => ({ posts: r.headers.get("X-WP-Total") || "?" })),
      wpFetch(site, "/pages?per_page=1").then((r) => ({ pages: r.headers.get("X-WP-Total") || "?" })),
    ]).then(([posts, spam, pending, postCount, pageCount]) => {
      setRecentPosts(Array.isArray(posts) ? posts : []);
      setStats({ ...spam, ...pending, ...postCount, ...pageCount });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [site]);

  if (!site) return <div className="empty"><div className="empty-icon">⬡</div><div className="empty-text">Add a WordPress site to get started</div></div>;
  if (loading) return <div className="empty"><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-title">Dashboard</div>
      <div className="section-sub">{site.url}</div>
      <div className="grid-4">
        <div className="stat-card green"><div className="stat-icon">✦</div><div className="stat-num">{stats?.posts || 0}</div><div className="stat-label">Published Posts</div></div>
        <div className="stat-card purple"><div className="stat-icon">◫</div><div className="stat-num">{stats?.pages || 0}</div><div className="stat-label">Pages</div></div>
        <div className="stat-card orange"><div className="stat-icon">◈</div><div className="stat-num">{stats?.pending || 0}</div><div className="stat-label">Pending Comments</div></div>
        <div className="stat-card pink"><div className="stat-icon">⊘</div><div className="stat-num">{stats?.spam || 0}</div><div className="stat-label">Spam Comments</div></div>
      </div>
      <div className="card">
        <div className="card-title">Recent Posts</div>
        {recentPosts.length === 0 ? <div className="text-xs">No posts found</div> : (
          <table className="table">
            <thead><tr><th>Title</th><th>Date</th></tr></thead>
            <tbody>
              {recentPosts.map((p) => (
                <tr key={p.id}>
                  <td><span className="truncate" style={{ maxWidth: 400, display: "block" }}>{stripHtml(p.title?.rendered)}</span></td>
                  <td className="text-xs">{timeAgo(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── CREATE POST ──────────────────────────────────────────────────────────────
function CreatePost({ site }) {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("1500");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState("draft");
  const [msg, setMsg] = useState(null);
  const [step, setStep] = useState("form");

  useEffect(() => {
    if (!site) return;
    wpFetch(site, "/categories?per_page=100").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setCategories(d); }).catch(() => {});
  }, [site]);

  const generate = async () => {
    if (!topic) return;
    setGenerating(true); setMsg(null);
    try {
      const result = await askClaude(
        `Write a complete, SEO-optimized WordPress blog post about: "${topic}"

Target keyword: ${keyword || topic}
Tone: ${tone}
Word count: approximately ${wordCount} words

Return EXACTLY in this format:
TITLE: [the post title here]
---
[full post content in HTML, use proper h2/h3/p/ul/li tags]
---META---
METATITLE: [meta title under 60 chars]
METADESC: [meta description under 155 chars]`,
        "You are an expert supply chain and business content writer. Write detailed, authoritative, SEO-optimized posts that rank well and provide genuine value to supply chain professionals."
      );

      const metaSplit = result.split("---META---");
      const mainPart = metaSplit[0];
      const metaPart = metaSplit[1] || "";

      const titleMatch = mainPart.match(/TITLE:\s*(.+)/);
      const contentMatch = mainPart.split("---");
      const title = titleMatch?.[1]?.trim() || topic;
      const content = contentMatch[1]?.trim() || mainPart.replace(/TITLE:.+\n/, "").trim();

      const metaTitleMatch = metaPart.match(/METATITLE:\s*(.+)/);
      const metaDescMatch = metaPart.match(/METADESC:\s*(.+)/);

      setGenerated({
        title,
        content,
        metaTitle: metaTitleMatch?.[1]?.trim() || title.slice(0, 60),
        metaDesc: metaDescMatch?.[1]?.trim() || "",
      });
      setStep("review");
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setGenerating(false);
  };

  const publish = async () => {
    if (!site || !generated) return;
    setPublishing(true); setMsg(null);
    try {
      const body = { title: generated.title, content: generated.content, status, ...(category ? { categories: [parseInt(category)] } : {}) };
      const res = await wpFetch(site, "/posts", { method: "POST", body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) { setMsg({ type: "success", text: `✓ Post ${status === "publish" ? "published" : "saved as draft"}! Post ID: ${data.id}` }); setStep("done"); }
      else setMsg({ type: "error", text: data.message || "Failed to publish" });
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setPublishing(false);
  };

  const reset = () => { setStep("form"); setGenerated(null); setTopic(""); setKeyword(""); setMsg(null); };

  if (!site) return <div className="empty"><div className="empty-icon">✦</div><div className="empty-text">Select a site first</div></div>;

  return (
    <div>
      <div className="section-title">Create Post</div>
      <div className="section-sub">Topic → Claude writes → Review → Publish</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {step === "form" && (
        <div className="card">
          <div className="field"><label className="lbl">Topic / Title Idea *</label><input className="input" placeholder="e.g. How to improve demand forecast accuracy in FMCG supply chains" value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
          <div className="row">
            <div className="field"><label className="lbl">Target Keyword</label><input className="input" placeholder="demand forecasting FMCG" value={keyword} onChange={(e) => setKeyword(e.target.value)} /></div>
            <div className="field"><label className="lbl">Tone</label>
              <select className="select-input" value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="educational">Educational</option>
                <option value="thought-leadership">Thought Leadership</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field"><label className="lbl">Word Count</label>
              <select className="select-input" value={wordCount} onChange={(e) => setWordCount(e.target.value)}>
                <option value="800">~800 words (Quick read)</option>
                <option value="1500">~1500 words (Standard)</option>
                <option value="2500">~2500 words (In-depth)</option>
                <option value="4000">~4000 words (Pillar post)</option>
              </select>
            </div>
            <div className="field"><label className="lbl">Category</label>
              <select className="select-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">— Uncategorized —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={generate} disabled={generating || !topic}>
            {generating ? <><span className="spinner" /> Claude is writing...</> : "✦ Generate Post"}
          </button>
          {generating && <div className="loading-bar"><div className="loading-bar-fill" /></div>}
        </div>
      )}

      {step === "review" && generated && (
        <div>
          <div className="flex gap-8 items-center mb-16">
            <button className="btn btn-ghost btn-sm" onClick={() => setStep("form")}>← Back</button>
            <span className="tag tag-green">Review before publishing</span>
          </div>
          <div className="card mb-16">
            <div className="card-title">Post Title</div>
            <input className="input" value={generated.title} onChange={(e) => setGenerated((g) => ({ ...g, title: e.target.value }))} />
          </div>
          <div className="card mb-16">
            <div className="flex justify-between items-center mb-16">
              <div className="card-title" style={{ margin: 0 }}>Content</div>
              <span className="text-xs">{generated.content.split(" ").length} words</span>
            </div>
            <textarea className="textarea" style={{ minHeight: 380 }} value={generated.content} onChange={(e) => setGenerated((g) => ({ ...g, content: e.target.value }))} />
          </div>
          <div className="card mb-16">
            <div className="card-title">SEO Meta</div>
            <div className="field"><label className="lbl">Meta Title ({generated.metaTitle.length}/60)</label><input className="input" value={generated.metaTitle} onChange={(e) => setGenerated((g) => ({ ...g, metaTitle: e.target.value }))} /></div>
            <div className="field"><label className="lbl">Meta Description ({generated.metaDesc.length}/155)</label><textarea className="textarea" style={{ minHeight: 60 }} value={generated.metaDesc} onChange={(e) => setGenerated((g) => ({ ...g, metaDesc: e.target.value }))} /></div>
          </div>
          <div className="flex gap-8 items-center">
            <select className="select-input" style={{ width: 160 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Save as Draft</option>
              <option value="publish">Publish Now</option>
            </select>
            <button className="btn btn-primary" onClick={publish} disabled={publishing}>
              {publishing ? <><span className="spinner" /> Publishing...</> : `→ ${status === "publish" ? "Publish" : "Save Draft"}`}
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="card" style={{ textAlign: "center", padding: 56 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✦</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {status === "publish" ? "Published!" : "Draft Saved!"}
          </div>
          <div className="text-sm mb-16">{generated?.title}</div>
          <button className="btn btn-primary" onClick={reset}>Create Another Post</button>
        </div>
      )}
    </div>
  );
}

// ─── POSTS MANAGER ────────────────────────────────────────────────────────────
function PostsManager({ site }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [postStatus, setPostStatus] = useState("publish");
  const [editPost, setEditPost] = useState(null);
  const [optimizing, setOptimizing] = useState(null);
  const [optimizeResult, setOptimizeResult] = useState({});
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    if (!site) return;
    setLoading(true);
    try {
      const res = await wpFetch(site, `/posts?per_page=20&page=${page}&status=${postStatus}${search ? `&search=${encodeURIComponent(search)}` : ""}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
      setTotal(parseInt(res.headers.get("X-WP-Total") || 0));
    } catch (e) {}
    setLoading(false);
  }, [site, page, postStatus, search]);

  useEffect(() => { load(); }, [load]);

  const deletePost = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    await wpFetch(site, `/posts/${id}?force=true`, { method: "DELETE" });
    load();
  };

  const optimizePost = async (post) => {
    setOptimizing(post.id);
    const content = stripHtml(post.content?.rendered || "").slice(0, 2000);
    const title = stripHtml(post.title?.rendered || "");
    try {
      const result = await askClaude(
        `SEO-optimize this WordPress post for a supply chain blog:

Title: ${title}
Content excerpt: ${content}

Give me:
1. SEO Score (0-100)
2. Improved title
3. Meta description (155 chars)
4. Top 3 content improvements
5. 5 LSI keywords to add
6. Internal linking suggestions`,
        "You are an SEO expert specializing in supply chain and B2B content."
      );
      setOptimizeResult((prev) => ({ ...prev, [post.id]: result }));
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setOptimizing(null);
  };

  const saveEdit = async () => {
    if (!editPost) return;
    try {
      const res = await wpFetch(site, `/posts/${editPost.id}`, { method: "POST", body: JSON.stringify({ title: editPost.title, content: editPost.content }) });
      if (res.ok) { setMsg({ type: "success", text: "Post updated successfully!" }); setEditPost(null); load(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message }); }
    } catch (e) { setMsg({ type: "error", text: e.message }); }
  };

  if (!site) return <div className="empty"><div className="empty-icon">≡</div><div className="empty-text">Select a site first</div></div>;

  return (
    <div>
      <div className="section-title">Posts</div>
      <div className="section-sub">{total} total posts</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="flex gap-8 mb-16 items-center">
        <input className="input" style={{ maxWidth: 260 }} placeholder="Search posts..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="select-input" style={{ width: 130 }} value={postStatus} onChange={(e) => { setPostStatus(e.target.value); setPage(1); }}>
          <option value="publish">Published</option>
          <option value="draft">Drafts</option>
          <option value="pending">Pending</option>
          <option value="trash">Trash</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={load}>↻</button>
      </div>

      {loading ? <div className="empty"><div className="spinner" /></div> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <>
                  <tr key={p.id}>
                    <td><div className="truncate fw-600" style={{ maxWidth: 340 }}>{stripHtml(p.title?.rendered)}</div></td>
                    <td className="text-xs">{timeAgo(p.date)}</td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditPost({ id: p.id, title: stripHtml(p.title?.rendered), content: p.content?.rendered || "" })}>Edit</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => optimizePost(p)} disabled={optimizing === p.id}>{optimizing === p.id ? <span className="spinner" /> : "⬡ SEO"}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deletePost(p.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                  {optimizeResult[p.id] && (
                    <tr key={`opt-${p.id}`}>
                      <td colSpan={3}><div className="ai-output" style={{ fontSize: 11, maxHeight: 220, marginTop: 4 }}>{optimizeResult[p.id]}</div></td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-16">
            <span className="text-xs">{posts.length} of {total}</span>
            <div className="flex gap-8">
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <button className="btn btn-ghost btn-sm" disabled={posts.length < 20} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {editPost && (
        <div className="modal-overlay" onClick={() => setEditPost(null)}>
          <div className="modal" style={{ width: 700 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Edit Post</div>
            <div className="field"><label className="lbl">Title</label><input className="input" value={editPost.title} onChange={(e) => setEditPost((p) => ({ ...p, title: e.target.value }))} /></div>
            <div className="field"><label className="lbl">Content (HTML)</label><textarea className="textarea" style={{ minHeight: 320 }} value={editPost.content} onChange={(e) => setEditPost((p) => ({ ...p, content: e.target.value }))} /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditPost(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMMENTS ─────────────────────────────────────────────────────────────────
function CommentsManager({ site }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentStatus, setCommentStatus] = useState("spam");
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    if (!site) return;
    setLoading(true);
    try {
      const res = await wpFetch(site, `/comments?per_page=50&status=${commentStatus}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
      setTotal(parseInt(res.headers.get("X-WP-Total") || 0));
    } catch (e) {}
    setLoading(false);
  }, [site, commentStatus]);

  useEffect(() => { load(); }, [load]);

  const deleteOne = async (id) => {
    await wpFetch(site, `/comments/${id}?force=true`, { method: "DELETE" });
    setComments((c) => c.filter((x) => x.id !== id));
    setTotal((t) => t - 1);
  };

  const approveOne = async (id) => {
    await wpFetch(site, `/comments/${id}`, { method: "POST", body: JSON.stringify({ status: "approved" }) });
    setComments((c) => c.filter((x) => x.id !== id));
  };

  const bulkDeleteAll = async () => {
    if (!confirm(`Permanently delete ALL ${total} ${commentStatus} comments?`)) return;
    setDeleting(true);
    try {
      await Promise.all(comments.map((c) => wpFetch(site, `/comments/${c.id}?force=true`, { method: "DELETE" })));
      setMsg({ type: "success", text: `✓ Deleted ${comments.length} ${commentStatus} comments` });
      load();
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setDeleting(false);
  };

  if (!site) return <div className="empty"><div className="empty-icon">◈</div><div className="empty-text">Select a site first</div></div>;

  return (
    <div>
      <div className="section-title">Comments</div>
      <div className="section-sub">{total} {commentStatus} comments</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="flex gap-8 mb-16 items-center justify-between">
        <div className="flex gap-8">
          {["spam", "hold", "approved", "trash"].map((s) => (
            <button key={s} className={`btn btn-sm ${commentStatus === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setCommentStatus(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-danger btn-sm" onClick={bulkDeleteAll} disabled={deleting || comments.length === 0}>
          {deleting ? <><span className="spinner" /> Deleting...</> : `✕ Delete All (${total})`}
        </button>
      </div>
      {loading ? <div className="empty"><div className="spinner" /></div> : (
        <div className="card">
          {comments.length === 0 ? <div className="empty"><div className="empty-icon">✓</div><div className="empty-text">No {commentStatus} comments — clean!</div></div> : (
            <table className="table">
              <thead><tr><th>Author</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {comments.map((c) => (
                  <tr key={c.id}>
                    <td><div className="fw-600" style={{ fontSize: 12 }}>{c.author_name}</div><div className="text-xs">{c.author_email}</div></td>
                    <td><div className="truncate" style={{ maxWidth: 280, fontSize: 12 }}>{stripHtml(c.content?.rendered)}</div></td>
                    <td className="text-xs">{timeAgo(c.date)}</td>
                    <td>
                      <div className="flex gap-8">
                        {commentStatus !== "approved" && <button className="btn btn-secondary btn-sm" onClick={() => approveOne(c.id)}>✓</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => deleteOne(c.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function PagesManager({ site }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPage, setEditPage] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    if (!site) return;
    setLoading(true);
    try {
      const res = await wpFetch(site, "/pages?per_page=50");
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (e) {}
    setLoading(false);
  }, [site]);

  useEffect(() => { load(); }, [load]);

  const deletePage = async (id) => {
    if (!confirm("Delete this page permanently?")) return;
    await wpFetch(site, `/pages/${id}?force=true`, { method: "DELETE" });
    load();
  };

  const savePage = async () => {
    try {
      const res = await wpFetch(site, `/pages/${editPage.id}`, { method: "POST", body: JSON.stringify({ title: editPage.title, content: editPage.content }) });
      if (res.ok) { setMsg({ type: "success", text: "Page updated!" }); setEditPage(null); load(); }
    } catch (e) { setMsg({ type: "error", text: e.message }); }
  };

  if (!site) return <div className="empty"><div className="empty-icon">◫</div><div className="empty-text">Select a site first</div></div>;

  return (
    <div>
      <div className="section-title">Pages</div>
      <div className="section-sub">{pages.length} pages</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="card">
        {loading ? <div className="empty"><div className="spinner" /></div> : (
          <table className="table">
            <thead><tr><th>Title</th><th>Status</th><th>Modified</th><th>Actions</th></tr></thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="fw-600">{stripHtml(p.title?.rendered)}</td>
                  <td><span className={`badge ${p.status === "publish" ? "badge-green" : "badge-gray"}`}>{p.status}</span></td>
                  <td className="text-xs">{timeAgo(p.modified)}</td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditPage({ id: p.id, title: stripHtml(p.title?.rendered), content: p.content?.rendered || "" })}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deletePage(p.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editPage && (
        <div className="modal-overlay" onClick={() => setEditPage(null)}>
          <div className="modal" style={{ width: 700 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Edit Page</div>
            <div className="field"><label className="lbl">Title</label><input className="input" value={editPage.title} onChange={(e) => setEditPage((p) => ({ ...p, title: e.target.value }))} /></div>
            <div className="field"><label className="lbl">Content (HTML)</label><textarea className="textarea" style={{ minHeight: 300 }} value={editPage.content} onChange={(e) => setEditPage((p) => ({ ...p, content: e.target.value }))} /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditPage(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={savePage}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SEO TOOLS ────────────────────────────────────────────────────────────────
function SEOTools({ site }) {
  const [activeTab, setActiveTab] = useState("audit");
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [bulkTopics, setBulkTopics] = useState("");
  const [bulkResults, setBulkResults] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [genCount, setGenCount] = useState(0);

  const run = async (promptFn, system) => {
    setLoading(true); setResult("");
    try { setResult(await askClaude(promptFn(), system)); } catch (e) { setResult("Error: " + e.message); }
    setLoading(false);
  };

  const bulkGenMeta = async () => {
    const topics = bulkTopics.split("\n").filter((t) => t.trim()).slice(0, 10);
    if (!topics.length) return;
    setGenerating(true); setBulkResults([]); setGenCount(0);
    const results = [];
    for (const topic of topics) {
      try {
        const r = await askClaude(
          `For a supply chain blog post titled: "${topic.trim()}"
Generate JSON only, no markdown:
{"title":"SEO title under 60 chars","meta":"meta description under 155 chars","slug":"url-slug","keyword":"primary keyword","tags":["tag1","tag2","tag3"]}`,
          "Return only valid JSON, no explanation."
        );
        const parsed = JSON.parse(r.replace(/```json|```/g, "").trim());
        results.push({ topic: topic.trim(), ...parsed });
      } catch (e) { results.push({ topic: topic.trim(), error: true }); }
      setGenCount(results.length);
    }
    setBulkResults(results);
    setGenerating(false);
  };

  return (
    <div>
      <div className="section-title">SEO Tools</div>
      <div className="section-sub">AI-powered optimization suite</div>
      <div className="inner-tabs">
        {[["audit", "SEO Audit"], ["keywords", "Keywords"], ["calendar", "Content Calendar"], ["bulk", "Bulk Meta"]].map(([id, label]) => (
          <div key={id} className={`inner-tab ${activeTab === id ? "active" : ""}`} onClick={() => { setActiveTab(id); setResult(""); }}>{label}</div>
        ))}
      </div>

      {activeTab === "audit" && (
        <div className="card">
          <div className="field"><label className="lbl">Post URL (optional)</label><input className="input" placeholder="https://supplychainstar.com/your-post/" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
          <div className="field"><label className="lbl">Target Keyword</label><input className="input" placeholder="supply chain optimization" value={keyword} onChange={(e) => setKeyword(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={() => run(() => `Detailed SEO audit for a supply chain blog post.\nURL: ${url || "Not provided"}\nKeyword: ${keyword || "supply chain"}\n\nProvide: SEO Score, title tag analysis, meta description, keyword optimization, content structure, internal linking, schema markup, page speed tips, featured snippet opportunities, 10 LSI keywords, action priority list (High/Medium/Low).`, "You are a senior SEO consultant specializing in B2B and supply chain content.")} disabled={loading}>
            {loading ? <><span className="spinner" /> Analyzing...</> : "◎ Run Audit"}
          </button>
          {loading && <div className="loading-bar"><div className="loading-bar-fill" /></div>}
          {result && <div className="ai-output mt-16">{result}</div>}
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="card">
          <div className="field"><label className="lbl">Seed Topic</label><input className="input" placeholder="inventory management, demand planning..." value={keyword} onChange={(e) => setKeyword(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={() => run(() => `Keyword research report for supplychainstar.com — a supply chain planning blog targeting supply chain professionals.\n\nSeed topic: ${keyword || "supply chain planning"}\n\nProvide: Primary keywords (volume/competition), long-tail keywords, question keywords (for featured snippets), semantic keywords, trending topics, content gap opportunities, 10 post title suggestions, search volume estimates.`, "You are an SEO and content strategist specializing in supply chain B2B.")} disabled={loading}>
            {loading ? <><span className="spinner" /> Researching...</> : "◎ Research Keywords"}
          </button>
          {loading && <div className="loading-bar"><div className="loading-bar-fill" /></div>}
          {result && <div className="ai-output mt-16">{result}</div>}
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="card">
          <div className="text-sm mb-16">Generate a 30-day SEO content calendar for supplychainstar.com — optimized for supply chain professionals.</div>
          <button className="btn btn-primary" onClick={() => run(() => "Create a 30-day content calendar for supplychainstar.com, a supply chain planning blog. Format as a table: Week | Day | Topic | Target Keyword | Content Type | Word Count | Priority. Mix: how-to guides, listicles, tool comparisons, trend analysis, templates, career advice. SEO-focused, realistic posting schedule.", "You are a content strategist for B2B supply chain blogs.")} disabled={loading}>
            {loading ? <><span className="spinner" /> Building...</> : "◎ Generate 30-Day Calendar"}
          </button>
          {loading && <div className="loading-bar"><div className="loading-bar-fill" /></div>}
          {result && <div className="ai-output mt-16">{result}</div>}
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="card">
          <div className="field"><label className="lbl">Post Topics (one per line, max 10)</label>
            <textarea className="textarea" style={{ minHeight: 160 }} placeholder={"How to improve demand forecast accuracy\nTop 10 S&OP tools for FMCG\nInventory optimization strategies\nWhat is DDMRP and how does it work"} value={bulkTopics} onChange={(e) => setBulkTopics(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={bulkGenMeta} disabled={generating}>
            {generating ? <><span className="spinner" /> Generating {genCount}/{bulkTopics.split("\n").filter((t) => t.trim()).length}...</> : "◎ Generate Meta for All"}
          </button>
          {bulkResults.length > 0 && (
            <div className="mt-16">
              {bulkResults.map((r, i) => (
                <div key={i} className="card mb-16" style={{ background: "var(--surface2)", padding: 16 }}>
                  <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 8, fontSize: 13 }}>{r.topic}</div>
                  {r.error ? <div className="text-xs" style={{ color: "var(--danger)" }}>Generation failed — try again</div> : (
                    <div style={{ fontSize: 11, lineHeight: 1.8 }}>
                      <div><strong>Title:</strong> {r.title}</div>
                      <div><strong>Meta:</strong> {r.meta}</div>
                      <div><strong>Slug:</strong> /{r.slug}</div>
                      <div><strong>Keyword:</strong> {r.keyword} &nbsp;·&nbsp; <strong>Tags:</strong> {r.tags?.join(", ")}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MEDIA ────────────────────────────────────────────────────────────────────
function MediaManager({ site }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    if (!site) return;
    setLoading(true);
    try {
      const res = await wpFetch(site, "/media?per_page=24&media_type=image");
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (e) {}
    setLoading(false);
  }, [site]);

  useEffect(() => { load(); }, [load]);

  const generateAltText = async (item) => {
    setGenerating(item.id);
    try {
      const filename = item.slug || item.title?.rendered || "image";
      const result = await askClaude(
        `Generate SEO-optimized alt text for a supply chain blog image.\nFilename: ${filename}\nCaption: ${stripHtml(item.caption?.rendered) || "none"}\nReturn ONLY the alt text, 10-15 words, descriptive and keyword-rich.`,
        "You are an SEO specialist. Return only the alt text, nothing else."
      );
      await wpFetch(site, `/media/${item.id}`, { method: "POST", body: JSON.stringify({ alt_text: result.trim() }) });
      setMsg({ type: "success", text: `Alt text updated for: ${filename}` });
      load();
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setGenerating(null);
  };

  if (!site) return <div className="empty"><div className="empty-icon">⊞</div><div className="empty-text">Select a site first</div></div>;

  return (
    <div>
      <div className="section-title">Media Library</div>
      <div className="section-sub">Images and alt text optimization</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      {loading ? <div className="empty"><div className="spinner" /></div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
          {media.map((m) => (
            <div key={m.id} className="card" style={{ padding: 12 }}>
              <img src={m.media_details?.sizes?.thumbnail?.source_url || m.source_url} alt={m.alt_text} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 6, marginBottom: 8, background: "var(--surface2)" }} onError={(e) => { e.target.style.display = "none"; }} />
              <div className="truncate text-sm fw-600" style={{ marginBottom: 4 }}>{m.title?.rendered}</div>
              <div className="text-xs" style={{ marginBottom: 8, minHeight: 28, color: m.alt_text ? "var(--text2)" : "var(--danger)" }}>{m.alt_text || "⚠ No alt text"}</div>
              <button className="btn btn-secondary btn-sm w-full" onClick={() => generateAltText(m)} disabled={generating === m.id}>{generating === m.id ? <span className="spinner" /> : "⬡ Generate Alt Text"}</button>
            </div>
          ))}
          {media.length === 0 && <div className="empty"><div className="empty-icon">⊞</div><div className="empty-text">No images found</div></div>}
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ sites, onDeleteSite }) {
  return (
    <div>
      <div className="section-title">Settings</div>
      <div className="section-sub">Manage connected WordPress sites</div>
      <div className="card mb-16">
        <div className="card-title">Connected Sites ({sites.length})</div>
        {sites.length === 0 ? <div className="empty"><div className="empty-icon">⬡</div><div className="empty-text">No sites yet — add one from the sidebar</div></div> : (
          <table className="table">
            <thead><tr><th>Name</th><th>URL</th><th>Username</th><th></th></tr></thead>
            <tbody>
              {sites.map((s) => (
                <tr key={s.id}>
                  <td className="fw-600">{s.name}</td>
                  <td className="text-xs">{s.url}</td>
                  <td className="text-xs">{s.username}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Remove this site?")) onDeleteSite(s.id); }}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="card mb-16">
        <div className="card-title">How to Add a New Site</div>
        <div className="text-sm">
          1. Log into WordPress Admin → <strong>Users → Profile</strong><br />
          2. Scroll to <strong>Application Passwords</strong><br />
          3. Enter name "WP Commander" → click <strong>Add New Application Password</strong><br />
          4. Copy the generated password (shown only once)<br />
          5. Click <strong>"+ Add Site"</strong> in the sidebar and enter your details
        </div>
      </div>
      <div className="card">
        <div className="card-title">Security</div>
        <div className="text-sm" style={{ color: "var(--warn)" }}>
          ⚠ Credentials are stored in your browser localStorage only and sent directly to your WordPress site via the Netlify proxy. Always use Application Passwords (not your main WP login). Revoke any password anytime from WP Admin → Users → Profile.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [sites, setSites] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } });
  const [activeSiteId, setActiveSiteId] = useState(() => { try { return localStorage.getItem("wpcommander_active") || ""; } catch { return ""; } });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddSite, setShowAddSite] = useState(false);

  const activeSite = sites.find((s) => s.id === activeSiteId) || sites[0] || null;

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sites)); } catch {} }, [sites]);
  useEffect(() => { try { localStorage.setItem("wpcommander_active", activeSiteId); } catch {} }, [activeSiteId]);

  useEffect(() => {
    if (sites.length > 0 && !activeSiteId) setActiveSiteId(sites[0].id);
  }, [sites]);

  const addSite = (site) => { setSites((s) => [...s, site]); setActiveSiteId(site.id); };
  const deleteSite = (id) => { setSites((s) => s.filter((x) => x.id !== id)); if (activeSiteId === id) setActiveSiteId(sites.filter((x) => x.id !== id)[0]?.id || ""); };

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">⬡ WP Commander</div>
            <span className="logo-sub">AI WordPress Control Panel</span>
          </div>
          <div className="site-selector">
            <span className="lbl">Active Site</span>
            <select className="site-select" value={activeSiteId} onChange={(e) => setActiveSiteId(e.target.value)}>
              {sites.length === 0 && <option value="">No sites added</option>}
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="add-site-btn" onClick={() => setShowAddSite(true)}>+ Add Site</button>
          </div>
          <nav className="nav">
            {TABS.map((tab) => (
              <div key={tab.id} className={`nav-item ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                <span className="nav-icon">{tab.icon}</span>{tab.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <span className="status-dot" />
            <span className="status-text">{activeSite ? activeSite.name : "No site selected"}</span>
          </div>
        </div>
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{TABS.find((t) => t.id === activeTab)?.label}</div>
            <div className="topbar-actions">
              {activeSite && <span className="tag tag-green">● {activeSite.name}</span>}
              <span className="tag tag-purple">Claude Sonnet</span>
              <span className="tag tag-pink">WP REST API</span>
            </div>
          </div>
          <div className="content">
            {activeTab === "dashboard" && <Dashboard site={activeSite} />}
            {activeTab === "create" && <CreatePost site={activeSite} />}
            {activeTab === "posts" && <PostsManager site={activeSite} />}
            {activeTab === "pages" && <PagesManager site={activeSite} />}
            {activeTab === "comments" && <CommentsManager site={activeSite} />}
            {activeTab === "seo" && <SEOTools site={activeSite} />}
            {activeTab === "media" && <MediaManager site={activeSite} />}
            {activeTab === "settings" && <Settings sites={sites} onDeleteSite={deleteSite} />}
          </div>
        </div>
      </div>
      {showAddSite && <AddSiteModal onAdd={addSite} onClose={() => setShowAddSite(false)} />}
    </>
  );
}
