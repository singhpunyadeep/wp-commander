import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wpcommander_sites";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "create", label: "Create Post", icon: "✦" },
  { id: "posts", label: "Posts", icon: "≡" },
  { id: "pages", label: "Pages", icon: "◫" },
  { id: "comments", label: "Comments", icon: "◈" },
  { id: "seo", label: "SEO Tools", icon: "◎" },
  { id: "growth", label: "Growth", icon: "▲" },
  { id: "media", label: "Media", icon: "⊞" },
  { id: "monetize", label: "Monetize", icon: "◉" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0a0a0f;--surface:#111118;--surface2:#1a1a25;--border:#2a2a3a;--accent:#6ee7b7;--accent2:#818cf8;--accent3:#f472b6;--warn:#fb923c;--danger:#f87171;--text:#e2e8f0;--text2:#94a3b8;--text3:#475569;--radius:10px;--mono:'DM Mono',monospace;--sans:'Syne',sans-serif}
  html,body,#root{height:100%}
  body{background:var(--bg);color:var(--text);font-family:var(--mono)}
  .app{display:flex;height:100vh;overflow:hidden;background:var(--bg)}
  .sidebar{width:215px;min-width:215px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:10}
  .sidebar-logo{padding:18px 18px 14px;border-bottom:1px solid var(--border)}
  .logo-mark{font-family:var(--sans);font-size:16px;font-weight:800;color:var(--accent)}
  .logo-sub{color:var(--text2);font-size:10px;font-family:var(--mono);display:block;margin-top:2px}
  .site-selector{padding:10px;border-bottom:1px solid var(--border)}
  .lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--text3);display:block;margin-bottom:4px}
  .site-select{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:11px;padding:6px 10px;border-radius:6px;cursor:pointer;outline:none;appearance:none}
  .site-select:focus{border-color:var(--accent)}
  .add-site-btn{width:100%;margin-top:5px;padding:5px;background:transparent;border:1px dashed var(--border);color:var(--text3);font-family:var(--mono);font-size:10px;border-radius:6px;cursor:pointer;transition:all .2s}
  .add-site-btn:hover{border-color:var(--accent);color:var(--accent)}
  .nav{flex:1;padding:8px;overflow-y:auto}
  .nav-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;font-size:11px;color:var(--text2);transition:all .15s;margin-bottom:1px;border:1px solid transparent}
  .nav-item:hover{background:var(--surface2);color:var(--text)}
  .nav-item.active{background:rgba(110,231,183,.08);color:var(--accent);border-color:rgba(110,231,183,.15)}
  .nav-icon{font-size:12px;width:15px;text-align:center}
  .sidebar-footer{padding:10px;border-top:1px solid var(--border)}
  .status-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;margin-right:5px;animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  .status-text{font-size:9px;color:var(--text3)}
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .topbar{height:50px;min-height:50px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 20px}
  .topbar-title{font-family:var(--sans);font-size:13px;font-weight:700}
  .topbar-actions{display:flex;gap:6px}
  .tag{font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 7px;border-radius:4px}
  .tag-green{background:rgba(110,231,183,.1);color:var(--accent);border:1px solid rgba(110,231,183,.2)}
  .tag-purple{background:rgba(129,140,248,.1);color:var(--accent2);border:1px solid rgba(129,140,248,.2)}
  .tag-pink{background:rgba(244,114,182,.1);color:var(--accent3);border:1px solid rgba(244,114,182,.2)}
  .content{flex:1;overflow-y:auto;padding:22px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px}
  .card-title{font-family:var(--sans);font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;position:relative;overflow:hidden}
  .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
  .stat-card.green::before{background:var(--accent)}.stat-card.purple::before{background:var(--accent2)}.stat-card.pink::before{background:var(--accent3)}.stat-card.orange::before{background:var(--warn)}
  .stat-num{font-family:var(--sans);font-size:26px;font-weight:800}.stat-label{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-top:2px}
  .btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:6px;border:none;font-family:var(--mono);font-size:11px;cursor:pointer;transition:all .2s;white-space:nowrap}
  .btn-primary{background:var(--accent);color:#0a0a0f}.btn-primary:hover{background:#4ade80;transform:translateY(-1px)}
  .btn-secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border)}.btn-secondary:hover{border-color:var(--accent);color:var(--accent)}
  .btn-danger{background:rgba(248,113,113,.1);color:var(--danger);border:1px solid rgba(248,113,113,.2)}.btn-danger:hover{background:rgba(248,113,113,.2)}
  .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border)}.btn-ghost:hover{background:var(--surface2);color:var(--text)}
  .btn-warn{background:rgba(251,146,60,.1);color:var(--warn);border:1px solid rgba(251,146,60,.2)}
  .btn-sm{padding:4px 8px;font-size:10px;border-radius:5px}
  .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
  .input,.textarea,.select-input{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:12px;padding:8px 11px;border-radius:6px;outline:none;transition:border-color .2s}
  .input:focus,.textarea:focus,.select-input:focus{border-color:var(--accent)}
  .textarea{resize:vertical;min-height:80px;line-height:1.6}
  .field{margin-bottom:12px}
  .select-input{appearance:none;cursor:pointer}
  .table{width:100%;border-collapse:collapse}
  .table th{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--text3);padding:8px 10px;text-align:left;border-bottom:1px solid var(--border)}
  .table td{padding:9px 10px;border-bottom:1px solid rgba(42,42,58,.4);font-size:11px;vertical-align:middle}
  .table tr:last-child td{border-bottom:none}
  .badge{display:inline-block;padding:2px 6px;border-radius:3px;font-size:9px;text-transform:uppercase}
  .badge-green{background:rgba(110,231,183,.1);color:var(--accent)}.badge-gray{background:rgba(148,163,184,.1);color:var(--text2)}.badge-purple{background:rgba(129,140,248,.1);color:var(--accent2)}
  .ai-output{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;font-size:11px;line-height:1.8;color:var(--text);white-space:pre-wrap;word-break:break-word;max-height:420px;overflow-y:auto}
  .spinner{display:inline-block;width:12px;height:12px;border:2px solid rgba(110,231,183,.2);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .loading-bar{height:2px;background:var(--border);border-radius:2px;overflow:hidden;margin:8px 0}
  .loading-bar-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));animation:la 1.5s ease-in-out infinite}
  @keyframes la{0%{transform:scaleX(0) translateX(0)}50%{transform:scaleX(.6) translateX(60%)}100%{transform:scaleX(0) translateX(200%)}}
  .empty{text-align:center;padding:48px 20px;color:var(--text3)}
  .empty-icon{font-size:32px;margin-bottom:8px;opacity:.3}.empty-text{font-size:11px}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(4px)}
  .modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:22px;width:500px;max-width:90vw;max-height:85vh;overflow-y:auto}
  .modal-title{font-family:var(--sans);font-size:15px;font-weight:800;margin-bottom:16px}
  .modal-actions{display:flex;gap:6px;justify-content:flex-end;margin-top:16px}
  .alert{padding:9px 12px;border-radius:6px;font-size:11px;margin-bottom:12px;line-height:1.5}
  .alert-error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);color:var(--danger)}
  .alert-success{background:rgba(110,231,183,.1);border:1px solid rgba(110,231,183,.2);color:var(--accent)}
  .alert-info{background:rgba(129,140,248,.1);border:1px solid rgba(129,140,248,.2);color:var(--accent2)}
  .alert-warn{background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.2);color:var(--warn)}
  .inner-tabs{display:flex;gap:2px;margin-bottom:16px;border-bottom:1px solid var(--border)}
  .inner-tab{padding:6px 11px;font-size:10px;cursor:pointer;color:var(--text3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .2s}
  .inner-tab.active{color:var(--accent);border-bottom-color:var(--accent)}
  .inner-tab:hover:not(.active){color:var(--text2)}
  ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
  .section-title{font-family:var(--sans);font-size:19px;font-weight:800;margin-bottom:4px}
  .section-sub{font-size:10px;color:var(--text3);margin-bottom:18px}
  .row{display:flex;gap:10px;align-items:flex-start}.row .field{flex:1}
  .flex{display:flex}.gap-6{gap:6px}.gap-8{gap:8px}.items-center{align-items:center}.justify-between{justify-content:space-between}.flex-1{flex:1}.w-full{width:100%}
  .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .mt-8{margin-top:8px}.mt-12{margin-top:12px}.mb-12{margin-bottom:12px}.mb-16{margin-bottom:16px}
  .text-sm{font-size:11px;color:var(--text2);line-height:1.6}.text-xs{font-size:10px;color:var(--text3)}.fw-600{font-weight:600}
  .score-ring{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;font-family:var(--sans);font-size:18px;font-weight:800;border:3px solid}
`;

// helpers
function wpFetch(site, path, opts = {}) {
  return fetch(`/.netlify/functions/wp-proxy${path}`, {
    ...opts,
    headers: { "x-wp-site-url": site.url.replace(/\/$/, ""), "x-wp-username": site.username, "x-wp-password": site.password, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
}
async function claude(prompt, sys, maxTokens = 700) {
  const r = await fetch("/.netlify/functions/claude-proxy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, system: sys, maxTokens }) });
  const d = await r.json(); if (d.error) throw new Error(d.error); return d.text || "";
}
const timeAgo = d => { const m = Math.floor((Date.now() - new Date(d)) / 60000); return m < 60 ? `${m}m` : m < 1440 ? `${Math.floor(m/60)}h` : `${Math.floor(m/1440)}d`; };
const strip = h => h?.replace(/<[^>]+>/g, "") || "";

// add site modal
function AddSiteModal({ onAdd, onClose }) {
  const [f, setF] = useState({ name: "", url: "", username: "", password: "" });
  const [testing, setT] = useState(false); const [err, setE] = useState(""); const [ok, setOk] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const test = async () => { setT(true); setE(""); setOk(false); try { const r = await wpFetch(f, "/users/me"); r.ok ? setOk(true) : setE((await r.json()).message || "Auth failed"); } catch { setE("Cannot reach site"); } setT(false); };
  return (
    <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-title">Add WordPress Site</div>
      <div className="alert alert-info">Use Application Password from WP Admin → Users → Profile</div>
      {err && <div className="alert alert-error">{err}</div>}
      {ok && <div className="alert alert-success">✓ Connected!</div>}
      {[["name","Site Name",""],["url","WordPress URL","https://yoursite.com"],["username","Admin Username",""],["password","Application Password","xxxx xxxx xxxx xxxx xxxx xxxx"]].map(([k,l,ph]) => (
        <div className="field" key={k}><label className="lbl">{l}</label><input className="input" type={k==="password"?"password":"text"} placeholder={ph} value={f[k]} onChange={set(k)}/></div>
      ))}
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-secondary" onClick={test} disabled={testing}>{testing ? <><span className="spinner"/> Testing...</> : "Test"}</button>
        <button className="btn btn-primary" onClick={() => { if (!f.name||!f.url||!f.username||!f.password) { setE("All fields required"); return; } onAdd({ ...f, id: Date.now().toString() }); onClose(); }}>Save</button>
      </div>
    </div></div>
  );
}

// dashboard
function Dashboard({ site }) {
  const [stats, setStats] = useState(null); const [posts, setPosts] = useState([]); const [loading, setL] = useState(true);
  useEffect(() => {
    if (!site) return; setL(true);
    Promise.all([
      wpFetch(site, "/posts?per_page=5&status=publish").then(r => r.json()),
      wpFetch(site, "/comments?per_page=1&status=spam").then(r => ({ spam: r.headers.get("X-WP-Total") || 0 })),
      wpFetch(site, "/comments?per_page=1&status=hold").then(r => ({ pending: r.headers.get("X-WP-Total") || 0 })),
      wpFetch(site, "/posts?per_page=1").then(r => ({ posts: r.headers.get("X-WP-Total") || 0 })),
      wpFetch(site, "/pages?per_page=1").then(r => ({ pages: r.headers.get("X-WP-Total") || 0 })),
    ]).then(([p, sp, pe, pc, pg]) => { setPosts(Array.isArray(p) ? p : []); setStats({ ...sp, ...pe, ...pc, ...pg }); setL(false); }).catch(() => setL(false));
  }, [site]);
  if (!site) return <div className="empty"><div className="empty-icon">⬡</div><div className="empty-text">Add a site to get started</div></div>;
  if (loading) return <div className="empty"><div className="spinner"/></div>;
  return (
    <div>
      <div className="section-title">Dashboard</div><div className="section-sub">{site.url}</div>
      <div className="grid-4">
        {[["green","✦",stats?.posts,"Posts"],["purple","◫",stats?.pages,"Pages"],["orange","◈",stats?.pending,"Pending"],["pink","⊘",stats?.spam,"Spam"]].map(([c,ic,n,l]) => (
          <div className={`stat-card ${c}`} key={l}><div style={{fontSize:18,opacity:.15,position:"absolute",top:12,right:12}}>{ic}</div><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="card"><div className="card-title">Recent Posts</div>
        <table className="table"><thead><tr><th>Title</th><th>Date</th></tr></thead>
          <tbody>{posts.map(p => <tr key={p.id}><td><span className="truncate" style={{maxWidth:380,display:"block"}}>{strip(p.title?.rendered)}</span></td><td className="text-xs">{timeAgo(p.date)} ago</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// create post
function CreatePost({ site }) {
  const [topic, setTopic] = useState(""); const [kw, setKw] = useState(""); const [tone, setTone] = useState("professional"); const [wc, setWc] = useState("1500");
  const [cat, setCat] = useState(""); const [cats, setCats] = useState([]); const [gen, setGen] = useState(false); const [out, setOut] = useState(null);
  const [pub, setPub] = useState(false); const [status, setStatus] = useState("draft"); const [msg, setMsg] = useState(null); const [step, setStep] = useState("form");
  const [addLinks, setAddLinks] = useState(false); const [genStatus, setGenStatus] = useState("");

  useEffect(() => { if (site) wpFetch(site, "/categories?per_page=100").then(r => r.json()).then(d => Array.isArray(d) && setCats(d)).catch(() => {}); }, [site]);

  const generate = async () => {
    if (!topic) return; setGen(true); setMsg(null); setGenStatus("Writing post...");
    try {
      let internalLinksContext = "";
      if (addLinks && site) {
        setGenStatus("Loading your posts for internal links...");
        try {
          const r = await wpFetch(site, "/posts?per_page=30&status=publish");
          const posts = await r.json();
          if (Array.isArray(posts) && posts.length) {
            internalLinksContext = posts.map(p => `- ${strip(p.title?.rendered)}: ${site.url.replace(/\/$/, "")}/?p=${p.id}`).join("\n");
          }
        } catch {}
        setGenStatus("Claude is writing your post...");
      }
      const linkInstruction = addLinks ? `\nINTERNAL LINKS: Weave 3-5 internal links naturally into the content using these posts (use the exact URLs):\n${internalLinksContext || "No existing posts — skip internal links."}\n\nEXTERNAL LINKS: Include 3-5 external links to authoritative sources (Gartner, McKinsey, APICS, Harvard Business Review, Supply Chain Management Review, or reputable supply chain sites). Use realistic URLs.\n\nFor all links use: <a href="URL" target="_blank" rel="noopener">anchor text</a>\nInternal links: omit target="_blank".\nPlace links naturally in content — never bunch them together.` : "";

      const r = await claude(
        `Write SEO-optimized WordPress blog post: "${topic}"\nKeyword: ${kw||topic}\nTone: ${tone}\nWords: ~${wc}\n${linkInstruction}\nReturn EXACTLY:\nTITLE: [title]\n---\n[full HTML content]\n---META---\nMETATITLE: [max 60 chars]\nMETADESC: [max 155 chars]`,
        "Expert supply chain content writer. Follow the format exactly. Weave links naturally into content.",
        2500
      );
      const [main, metaPart] = r.split("---META---"); const parts = main.split("---");
      const title = (parts[0].match(/TITLE:\s*(.+)/)||[])[1]?.trim()||topic;
      const content = parts[1]?.trim()||main;
      const extCount = (content.match(/target="_blank"/g)||[]).length;
      setOut({ title, content, metaTitle: (metaPart?.match(/METATITLE:\s*(.+)/)||[])[1]?.trim()||title.slice(0,60), metaDesc: (metaPart?.match(/METADESC:\s*(.+)/)||[])[1]?.trim()||"", extCount });
      setStep("review");
    } catch(e) { setMsg({ type:"error", text:e.message }); }
    setGen(false); setGenStatus("");
  };

  const publish = async () => {
    setPub(true); setMsg(null);
    try {
      const r = await wpFetch(site, "/posts", { method:"POST", body:JSON.stringify({ title:out.title, content:out.content, status, ...(cat?{categories:[parseInt(cat)]}:{}) }) });
      const d = await r.json();
      r.ok ? (setMsg({ type:"success", text:`✓ ${status==="publish"?"Published":"Saved"}! ID: ${d.id}` }), setStep("done")) : setMsg({ type:"error", text:d.message });
    } catch(e) { setMsg({ type:"error", text:e.message }); }
    setPub(false);
  };

  if (!site) return <div className="empty"><div className="empty-icon">✦</div><div className="empty-text">Select a site first</div></div>;
  return (
    <div>
      <div className="section-title">Create Post</div><div className="section-sub">Topic → Claude writes → Review → Publish</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      {step==="form" && <div className="card">
        <div className="field"><label className="lbl">Topic *</label><input className="input" placeholder="How to improve demand forecast accuracy in FMCG" value={topic} onChange={e=>setTopic(e.target.value)}/></div>
        <div className="row">
          <div className="field"><label className="lbl">Keyword</label><input className="input" placeholder="demand forecasting" value={kw} onChange={e=>setKw(e.target.value)}/></div>
          <div className="field"><label className="lbl">Tone</label><select className="select-input" value={tone} onChange={e=>setTone(e.target.value)}>{["professional","conversational","educational","thought-leadership"].map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div className="row">
          <div className="field"><label className="lbl">Words</label><select className="select-input" value={wc} onChange={e=>setWc(e.target.value)}>{[["800","~800"],["1500","~1500"],["2500","~2500"],["4000","~4000 (pillar)"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
          <div className="field"><label className="lbl">Category</label><select className="select-input" value={cat} onChange={e=>setCat(e.target.value)}><option value="">Uncategorized</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--surface2)",borderRadius:7,border:"1px solid var(--border)",marginBottom:14}}>
          <input type="checkbox" id="addLinks" checked={addLinks} onChange={e=>setAddLinks(e.target.checked)} style={{accentColor:"var(--accent)",width:14,height:14,cursor:"pointer"}}/>
          <label htmlFor="addLinks" style={{cursor:"pointer",fontSize:11,flex:1}}>
            <span style={{fontWeight:600,color:"var(--accent)"}}>Auto-add links</span>
            <span style={{color:"var(--text3)",marginLeft:6}}>3–5 internal links to your posts + 3–5 external authority links</span>
          </label>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={gen||!topic}>{gen?<><span className="spinner"/> {genStatus||"Writing..."}</>:"✦ Generate Post"}</button>
        {gen && <div className="loading-bar"><div className="loading-bar-fill"/></div>}
      </div>}
      {step==="review" && out && <div>
        <div className="flex gap-8 items-center mb-12">
          <button className="btn btn-ghost btn-sm" onClick={()=>setStep("form")}>← Back</button>
          <span className="tag tag-green">Review before publishing</span>
          {out.extCount>0 && <span className="tag tag-purple">🔗 {out.extCount} external links added</span>}
        </div>
        <div className="card mb-12"><div className="card-title">Title</div><input className="input" value={out.title} onChange={e=>setOut(o=>({...o,title:e.target.value}))}/></div>
        <div className="card mb-12">
          <div className="flex justify-between items-center mb-12"><div className="card-title" style={{margin:0}}>Content</div><span className="text-xs">{out.content.split(" ").length} words</span></div>
          <textarea className="textarea" style={{minHeight:320}} value={out.content} onChange={e=>setOut(o=>({...o,content:e.target.value}))}/>
        </div>
        <div className="card mb-12"><div className="card-title">SEO Meta</div>
          <div className="field"><label className="lbl">Meta Title ({out.metaTitle.length}/60)</label><input className="input" value={out.metaTitle} onChange={e=>setOut(o=>({...o,metaTitle:e.target.value}))}/></div>
          <div className="field"><label className="lbl">Meta Desc ({out.metaDesc.length}/155)</label><textarea className="textarea" style={{minHeight:48}} value={out.metaDesc} onChange={e=>setOut(o=>({...o,metaDesc:e.target.value}))}/></div>
        </div>
        <div className="flex gap-8 items-center">
          <select className="select-input" style={{width:150}} value={status} onChange={e=>setStatus(e.target.value)}><option value="draft">Save as Draft</option><option value="publish">Publish Now</option></select>
          <button className="btn btn-primary" onClick={publish} disabled={pub}>{pub?<><span className="spinner"/> Publishing...</>:`→ ${status==="publish"?"Publish":"Save Draft"}`}</button>
        </div>
      </div>}
      {step==="done" && <div className="card" style={{textAlign:"center",padding:44}}>
        <div style={{fontSize:40,marginBottom:12}}>✦</div>
        <div style={{fontFamily:"var(--sans)",fontSize:18,fontWeight:800,marginBottom:6}}>{status==="publish"?"Published!":"Draft Saved!"}</div>
        <div className="text-sm mb-12">{out?.title}</div>
        <button className="btn btn-primary" onClick={()=>{setStep("form");setOut(null);setTopic("");setKw("");setMsg(null);}}>Create Another</button>
      </div>}
    </div>
  );
}


// posts manager
function PostsManager({ site }) {
  const [posts, setPosts] = useState([]); const [loading, setL] = useState(false); const [page, setPage] = useState(1); const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(""); const [ps, setPs] = useState("publish"); const [editPost, setEdit] = useState(null);
  const [optimizing, setOpt] = useState(null); const [optResults, setOptR] = useState({}); const [applying, setApp] = useState(null); const [msg, setMsg] = useState(null);
  const load = useCallback(async () => {
    if (!site) return; setL(true);
    try { const r = await wpFetch(site, `/posts?per_page=20&page=${page}&status=${ps}${search?`&search=${encodeURIComponent(search)}`:""}`); setPosts(await r.json()); setTotal(parseInt(r.headers.get("X-WP-Total")||0)); } catch {}
    setL(false);
  }, [site, page, ps, search]);
  useEffect(() => { load(); }, [load]);
  const del = async id => { if (!confirm("Delete permanently?")) return; await wpFetch(site, `/posts/${id}?force=true`, { method:"DELETE" }); load(); };
  const optimize = async post => {
    setOpt(post.id);
    try {
      const r = await claude(`SEO audit supply chain post:\nTitle: ${strip(post.title?.rendered)}\nContent: ${strip(post.content?.rendered||"").slice(0,1200)}\nReturn JSON only: {"score":85,"newTitle":"...","metaDesc":"...","improvements":["...","...","..."],"keywords":["...","..."]}`, "SEO expert. Return valid JSON only.", 500);
      setOptR(p => ({ ...p, [post.id]: JSON.parse(r.replace(/```json|```/g,"").trim()) }));
    } catch(e) { setMsg({ type:"error", text:e.message }); }
    setOpt(null);
  };
  const applyOpt = async (post, opt) => {
    setApp(post.id);
    try { const r = await wpFetch(site, `/posts/${post.id}`, { method:"POST", body:JSON.stringify({ title:opt.newTitle, excerpt:opt.metaDesc }) }); r.ok ? setMsg({ type:"success", text:`✓ Applied: ${opt.newTitle}` }) : setMsg({ type:"error", text:"Apply failed" }); load(); }
    catch(e) { setMsg({ type:"error", text:e.message }); }
    setApp(null);
  };
  const rewrite = async post => {
    setOpt(post.id+"rw");
    try {
      const r = await claude(`Rewrite this supply chain blog post to be more SEO-optimized and comprehensive:\nTitle: ${strip(post.title?.rendered)}\nContent: ${strip(post.content?.rendered||"").slice(0,2000)}\nReturn HTML content only.`, "Expert supply chain content writer. Return HTML body content only.", 2500);
      await wpFetch(site, `/posts/${post.id}`, { method:"POST", body:JSON.stringify({ content:r.trim() }) });
      setMsg({ type:"success", text:`✓ Rewrote: ${strip(post.title?.rendered)}` }); load();
    } catch(e) { setMsg({ type:"error", text:e.message }); }
    setOpt(null);
  };
  if (!site) return <div className="empty"><div className="empty-icon">≡</div><div className="empty-text">Select a site first</div></div>;
  return (
    <div>
      <div className="section-title">Posts</div><div className="section-sub">{total} posts</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="flex gap-6 mb-12 items-center">
        <input className="input" style={{maxWidth:220}} placeholder="Search..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
        <select className="select-input" style={{width:110}} value={ps} onChange={e=>{setPs(e.target.value);setPage(1);}}>{["publish","draft","pending","trash"].map(s=><option key={s} value={s}>{s}</option>)}</select>
        <button className="btn btn-secondary btn-sm" onClick={load}>↻</button>
      </div>
      {loading ? <div className="empty"><div className="spinner"/></div> : <div className="card">
        <table className="table">
          <thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{posts.map(p => (<>
            <tr key={p.id}>
              <td><div className="truncate fw-600" style={{maxWidth:280}}>{strip(p.title?.rendered)}</div></td>
              <td className="text-xs">{timeAgo(p.date)}</td>
              <td><div className="flex gap-6">
                <button className="btn btn-ghost btn-sm" onClick={()=>setEdit({id:p.id,title:strip(p.title?.rendered),content:p.content?.rendered||""})}>Edit</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>optimize(p)} disabled={!!optimizing}>{optimizing===p.id?<span className="spinner"/>:"⬡ SEO"}</button>
                <button className="btn btn-warn btn-sm" onClick={()=>rewrite(p)} disabled={!!optimizing}>{optimizing===p.id+"rw"?<span className="spinner"/>:"↺ Rewrite"}</button>
                <button className="btn btn-danger btn-sm" onClick={()=>del(p.id)}>✕</button>
              </div></td>
            </tr>
            {optResults[p.id] && <tr key={`o${p.id}`}><td colSpan={3}>
              <div style={{background:"var(--surface2)",borderRadius:8,padding:12,marginTop:4,fontSize:11}}>
                <div className="flex gap-8 items-center mb-8">
                  <div className="score-ring" style={{borderColor:optResults[p.id].score>70?"var(--accent)":optResults[p.id].score>50?"var(--warn)":"var(--danger)",color:optResults[p.id].score>70?"var(--accent)":optResults[p.id].score>50?"var(--warn)":"var(--danger)"}}>{optResults[p.id].score}</div>
                  <div className="flex-1"><div style={{fontWeight:600,marginBottom:3}}>{optResults[p.id].newTitle}</div><div className="text-xs">{optResults[p.id].metaDesc}</div><div className="text-xs mt-8">Keywords: {optResults[p.id].keywords?.join(", ")}</div></div>
                  <button className="btn btn-primary btn-sm" onClick={()=>applyOpt(p,optResults[p.id])} disabled={applying===p.id}>{applying===p.id?<span className="spinner"/>:"✓ Apply Changes"}</button>
                </div>
                {optResults[p.id].improvements?.map((im,i)=><div key={i} className="text-xs">• {im}</div>)}
              </div>
            </td></tr>}
          </>))}</tbody>
        </table>
        <div className="flex justify-between items-center mt-12">
          <span className="text-xs">{posts.length} of {total}</span>
          <div className="flex gap-6"><button className="btn btn-ghost btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button><button className="btn btn-ghost btn-sm" disabled={posts.length<20} onClick={()=>setPage(p=>p+1)}>Next →</button></div>
        </div>
      </div>}
      {editPost && <div className="modal-overlay" onClick={()=>setEdit(null)}><div className="modal" style={{width:660}} onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Edit Post</div>
        <div className="field"><label className="lbl">Title</label><input className="input" value={editPost.title} onChange={e=>setEdit(p=>({...p,title:e.target.value}))}/></div>
        <div className="field"><label className="lbl">Content (HTML)</label><textarea className="textarea" style={{minHeight:280}} value={editPost.content} onChange={e=>setEdit(p=>({...p,content:e.target.value}))}/></div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={()=>setEdit(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={async()=>{const r=await wpFetch(site,`/posts/${editPost.id}`,{method:"POST",body:JSON.stringify({title:editPost.title,content:editPost.content})});r.ok&&(setMsg({type:"success",text:"Saved!"}),setEdit(null),load());}}>Save</button>
        </div>
      </div></div>}
    </div>
  );
}

// comments
function CommentsManager({ site }) {
  const [comments, setC] = useState([]); const [loading, setL] = useState(false); const [cs, setCs] = useState("spam"); const [total, setTotal] = useState(0); const [del, setDel] = useState(false); const [msg, setMsg] = useState(null);
  const load = useCallback(async () => { if(!site)return; setL(true); try { const r=await wpFetch(site,`/comments?per_page=50&status=${cs}`); setC(await r.json()); setTotal(parseInt(r.headers.get("X-WP-Total")||0)); } catch {} setL(false); }, [site,cs]);
  useEffect(()=>{ load(); },[load]);
  if (!site) return <div className="empty"><div className="empty-icon">◈</div><div className="empty-text">Select a site first</div></div>;
  return (
    <div>
      <div className="section-title">Comments</div><div className="section-sub">{total} {cs} comments</div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="flex gap-6 mb-12 items-center justify-between">
        <div className="flex gap-6">{["spam","hold","approved","trash"].map(s=><button key={s} className={`btn btn-sm ${cs===s?"btn-primary":"btn-ghost"}`} onClick={()=>setCs(s)}>{s}</button>)}</div>
        <button className="btn btn-danger btn-sm" disabled={del||!comments.length} onClick={async()=>{if(!confirm(`Delete ALL ${total} ${cs}?`))return;setDel(true);await Promise.all(comments.map(c=>wpFetch(site,`/comments/${c.id}?force=true`,{method:"DELETE"})));setMsg({type:"success",text:`✓ Deleted ${comments.length}`});load();setDel(false);}}>{del?<><span className="spinner"/> Deleting...</>:`✕ Delete All (${total})`}</button>
      </div>
      {loading?<div className="empty"><div className="spinner"/></div>:<div className="card">
        {!comments.length?<div className="empty"><div className="empty-icon">✓</div><div className="empty-text">No {cs} comments</div></div>:
        <table className="table"><thead><tr><th>Author</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{comments.map(c=><tr key={c.id}>
            <td><div className="fw-600">{c.author_name}</div><div className="text-xs">{c.author_email}</div></td>
            <td><div className="truncate" style={{maxWidth:240}}>{strip(c.content?.rendered)}</div></td>
            <td className="text-xs">{timeAgo(c.date)}</td>
            <td><div className="flex gap-6">
              {cs!=="approved"&&<button className="btn btn-secondary btn-sm" onClick={async()=>{await wpFetch(site,`/comments/${c.id}`,{method:"POST",body:JSON.stringify({status:"approved"})});setC(x=>x.filter(y=>y.id!==c.id));}}>✓</button>}
              <button className="btn btn-danger btn-sm" onClick={async()=>{await wpFetch(site,`/comments/${c.id}?force=true`,{method:"DELETE"});setC(x=>x.filter(y=>y.id!==c.id));setTotal(t=>t-1);}}>✕</button>
            </div></td>
          </tr>)}</tbody>
        </table>}
      </div>}
    </div>
  );
}

// pages
function PagesManager({ site }) {
  const [pages, setPages] = useState([]); const [loading, setL] = useState(false); const [ep, setEp] = useState(null); const [msg, setMsg] = useState(null);
  const load = useCallback(async()=>{ if(!site)return; setL(true); try { setPages(await(await wpFetch(site,"/pages?per_page=50")).json()); } catch {} setL(false); },[site]);
  useEffect(()=>{load();},[load]);
  if (!site) return <div className="empty"><div className="empty-icon">◫</div><div className="empty-text">Select a site first</div></div>;
  return (
    <div>
      <div className="section-title">Pages</div><div className="section-sub">{pages.length} pages</div>
      {msg&&<div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="card">{loading?<div className="empty"><div className="spinner"/></div>:
        <table className="table"><thead><tr><th>Title</th><th>Status</th><th>Modified</th><th>Actions</th></tr></thead>
          <tbody>{pages.map(p=><tr key={p.id}>
            <td className="fw-600">{strip(p.title?.rendered)}</td>
            <td><span className={`badge ${p.status==="publish"?"badge-green":"badge-gray"}`}>{p.status}</span></td>
            <td className="text-xs">{timeAgo(p.modified)}</td>
            <td><div className="flex gap-6">
              <button className="btn btn-ghost btn-sm" onClick={()=>setEp({id:p.id,title:strip(p.title?.rendered),content:p.content?.rendered||""})}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={async()=>{if(!confirm("Delete?"))return;await wpFetch(site,`/pages/${p.id}?force=true`,{method:"DELETE"});load();}}>✕</button>
            </div></td>
          </tr>)}</tbody>
        </table>}
      </div>
      {ep&&<div className="modal-overlay" onClick={()=>setEp(null)}><div className="modal" style={{width:660}} onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Edit Page</div>
        <div className="field"><label className="lbl">Title</label><input className="input" value={ep.title} onChange={e=>setEp(p=>({...p,title:e.target.value}))}/></div>
        <div className="field"><label className="lbl">Content</label><textarea className="textarea" style={{minHeight:260}} value={ep.content} onChange={e=>setEp(p=>({...p,content:e.target.value}))}/></div>
        <div className="modal-actions"><button className="btn btn-ghost" onClick={()=>setEp(null)}>Cancel</button><button className="btn btn-primary" onClick={async()=>{const r=await wpFetch(site,`/pages/${ep.id}`,{method:"POST",body:JSON.stringify({title:ep.title,content:ep.content})});r.ok&&(setMsg({type:"success",text:"Saved!"}),setEp(null),load());}}>Save</button></div>
      </div></div>}
    </div>
  );
}

// seo tools
function SEOTools({ site }) {
  const [tab, setTab] = useState("audit"); const [kw, setKw] = useState(""); const [url, setUrl] = useState(""); const [loading, setL] = useState(false); const [result, setR] = useState("");
  const [bulkTopics, setBt] = useState(""); const [bulkResults, setBr] = useState([]); const [bulkRunning, setBrun] = useState(false); const [bulkCount, setBc] = useState(0);
  const [linkPosts, setLp] = useState([]); const [linkLoading, setLL] = useState(false); const [linkResults, setLr] = useState([]);
  const run = async (p,s,t=700)=>{ setL(true); setR(""); try { setR(await claude(p,s,t)); } catch(e){ setR("Error: "+e.message); } setL(false); };
  const bulkMeta = async () => {
    const topics=bulkTopics.split("\n").filter(t=>t.trim()).slice(0,10); if(!topics.length)return; setBrun(true); setBr([]); setBc(0); const res=[];
    for(const t of topics) { try { const r=await claude(`Supply chain blog: "${t.trim()}"\nJSON only: {"title":"<60","meta":"<155","slug":"slug","keyword":"kw","tags":["t1","t2","t3"]}`,"Return JSON only.",250); res.push({topic:t.trim(),...JSON.parse(r.replace(/```json|```/g,"").trim())}); } catch { res.push({topic:t.trim(),error:true}); } setBc(res.length); }
    setBr(res); setBrun(false);
  };
  const suggestLinks = async () => {
    if(!linkPosts.length)return; setL(true); setLr([]);
    try { const titles=linkPosts.map(p=>strip(p.title?.rendered)).slice(0,20).join("\n"); const r=await claude(`Supply chain posts:\n${titles}\n\nSuggest 8 internal linking pairs as JSON array: [{"from":"...","to":"...","anchor":"...","reason":"..."}]`,"Return JSON array only.",500); setLr(JSON.parse(r.replace(/```json|```/g,"").trim())); } catch(e){ setR("Error: "+e.message); }
    setL(false);
  };
  return (
    <div>
      <div className="section-title">SEO Tools</div><div className="section-sub">Audit · Keywords · Calendar · Bulk Meta · Internal Links</div>
      <div className="inner-tabs">{[["audit","Audit"],["keywords","Keywords"],["calendar","Calendar"],["bulk","Bulk Meta"],["links","Internal Links"]].map(([id,l])=><div key={id} className={`inner-tab ${tab===id?"active":""}`} onClick={()=>{setTab(id);setR("");}}>  {l}</div>)}</div>
      {tab==="audit"&&<div className="card">
        <div className="field"><label className="lbl">URL (optional)</label><input className="input" placeholder="https://supplychainstar.com/post/" value={url} onChange={e=>setUrl(e.target.value)}/></div>
        <div className="field"><label className="lbl">Target Keyword</label><input className="input" placeholder="supply chain optimization" value={kw} onChange={e=>setKw(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading} onClick={()=>run(`SEO audit for supply chain blog.\nURL: ${url||"n/a"}\nKeyword: ${kw||"supply chain"}\nProvide: Score/100, title fix, meta desc, top 5 improvements, 8 LSI keywords, featured snippet opportunity.`,"Senior SEO consultant B2B supply chain.")}>{loading?<><span className="spinner"/> Auditing...</>:"◎ Run Audit"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="keywords"&&<div className="card">
        <div className="field"><label className="lbl">Seed Topic</label><input className="input" placeholder="inventory management, S&OP..." value={kw} onChange={e=>setKw(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading} onClick={()=>run(`Keyword research for supplychainstar.com.\nSeed: ${kw||"supply chain planning"}\nProvide: 5 primary keywords, 8 long-tail, 5 question keywords, 3 trending topics, search volume estimates, 5 post titles.`,"SEO strategist B2B supply chain.")}>{loading?<><span className="spinner"/> Researching...</>:"◎ Research Keywords"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="calendar"&&<div className="card">
        <div className="text-sm mb-12">30-day SEO content calendar for supplychainstar.com</div>
        <button className="btn btn-primary" disabled={loading} onClick={()=>run("30-day content calendar for supplychainstar.com. Table: Week|Day|Topic|Keyword|Type|WordCount|Priority. One post every 2 days. Mix how-to, listicles, tool comparisons, templates.","B2B supply chain content strategist.")}>{loading?<><span className="spinner"/> Building...</>:"◎ Generate 30-Day Calendar"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="bulk"&&<div className="card">
        <div className="field"><label className="lbl">Topics (one per line, max 10)</label><textarea className="textarea" style={{minHeight:120}} placeholder={"How to improve demand forecast accuracy\nTop S&OP tools for FMCG\nInventory optimization strategies"} value={bulkTopics} onChange={e=>setBt(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={bulkRunning} onClick={bulkMeta}>{bulkRunning?<><span className="spinner"/> {bulkCount}/{bulkTopics.split("\n").filter(t=>t.trim()).length}...</>:"◎ Generate Meta for All"}</button>
        {bulkResults.length>0&&<div className="mt-12">{bulkResults.map((r,i)=><div key={i} style={{background:"var(--surface2)",borderRadius:7,padding:10,marginBottom:7,fontSize:10}}>
          <div style={{fontWeight:600,color:"var(--accent)",marginBottom:5}}>{r.topic}</div>
          {r.error?<div style={{color:"var(--danger)"}}>Failed</div>:<div style={{lineHeight:1.8}}><div><b>Title:</b> {r.title}</div><div><b>Meta:</b> {r.meta}</div><div><b>Slug:</b> /{r.slug} · <b>KW:</b> {r.keyword} · <b>Tags:</b> {r.tags?.join(", ")}</div></div>}
        </div>)}</div>}
      </div>}
      {tab==="links"&&<div className="card">
        <div className="text-sm mb-12">AI-suggested internal linking pairs to boost topical authority and SEO.</div>
        <div className="flex gap-8 mb-12">
          <button className="btn btn-secondary" onClick={async()=>{setLL(true);try{const r=await wpFetch(site,"/posts?per_page=50&status=publish");setLp(await r.json());}catch{}setLL(false);}} disabled={linkLoading}>{linkLoading?<><span className="spinner"/> Loading...</>:"Load Posts"}</button>
          {linkPosts.length>0&&<button className="btn btn-primary" onClick={suggestLinks} disabled={loading}>{loading?<><span className="spinner"/> Analyzing...</>:`◎ Suggest Links (${linkPosts.length} posts)`}</button>}
        </div>
        {linkResults.length>0&&<table className="table"><thead><tr><th>From</th><th>→ Link To</th><th>Anchor</th><th>Why</th></tr></thead>
          <tbody>{linkResults.map((l,i)=><tr key={i}><td style={{fontSize:10}}>{l.from}</td><td style={{fontSize:10}}>{l.to}</td><td><span className="badge badge-purple">{l.anchor}</span></td><td className="text-xs">{l.reason}</td></tr>)}</tbody>
        </table>}
      </div>}
    </div>
  );
}

// growth engine
function GrowthEngine({ site }) {
  const [tab, setTab] = useState("ranks"); const [loading, setL] = useState(false); const [result, setR] = useState("");
  const [kws, setKws] = useState("demand forecasting, S&OP, inventory management, supply chain planning");
  const [competitor, setComp] = useState(""); const [schedPosts, setSp] = useState([]); const [schedLoading, setSl] = useState(false);
  const [scheduling, setSched] = useState(null); const [broken, setBroken] = useState([]); const [brokenLoading, setBl] = useState(false);
  const run = async (p,s,t=700)=>{ setL(true); setR(""); try { setR(await claude(p,s,t)); } catch(e){ setR("Error: "+e.message); } setL(false); };
  const loadDrafts = async () => { setSl(true); try { setSp(await(await wpFetch(site,"/posts?status=draft&per_page=20")).json()); } catch {} setSl(false); };
  const schedule = async (id,date) => { setSched(id); try { await wpFetch(site,`/posts/${id}`,{method:"POST",body:JSON.stringify({status:"future",date})}); setSp(p=>p.map(x=>x.id===id?{...x,_scheduled:true}:x)); } catch {} setSched(null); };
  const analyzeCats = async () => {
    setL(true); setR("");
    try { const r=await wpFetch(site,"/categories?per_page=50"); const cats=await r.json(); const r2=await wpFetch(site,"/posts?per_page=1"); const total=r2.headers.get("X-WP-Total"); const list=Array.isArray(cats)?cats.map(c=>`${c.name} (${c.count} posts)`).join("\n"):"";
      setR(await claude(`Supply chain blog taxonomy audit:\nTotal: ${total} posts\nCategories:\n${list}\nRecommend: restructure, merge candidates, missing categories, SEO names, tag strategy.`,"Content architect for B2B blogs.",600));
    } catch(e){ setR("Error: "+e.message); } setL(false);
  };
  return (
    <div>
      <div className="section-title">Growth Engine</div><div className="section-sub">Ranks · Competitor · Scheduler · Broken Links · Categories</div>
      <div className="inner-tabs">{[["ranks","Rank Tracker"],["competitor","Competitor Spy"],["scheduler","Scheduler"],["broken","Broken Links"],["categories","Categories"]].map(([id,l])=><div key={id} className={`inner-tab ${tab===id?"active":""}`} onClick={()=>{setTab(id);setR("");}}>{l}</div>)}</div>
      {tab==="ranks"&&<div className="card">
        <div className="field"><label className="lbl">Your Target Keywords</label><textarea className="textarea" style={{minHeight:70}} value={kws} onChange={e=>setKws(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading} onClick={()=>run(`Keyword ranking analysis for supplychainstar.com:\n${kws}\nFor each: difficulty (1-100), search intent, ranking potential, content gap, suggested post title, recommended word count. Format as table.`,"SEO analyst B2B supply chain.")}>{loading?<><span className="spinner"/> Analyzing...</>:"▲ Analyze Ranking Potential"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="competitor"&&<div className="card">
        <div className="field"><label className="lbl">Competitor Domain or URL</label><input className="input" placeholder="supplychaintoday.com" value={competitor} onChange={e=>setComp(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading} onClick={()=>run(`Competitor analysis for supply chain blog.\nCompetitor: ${competitor||"top supply chain planning blogs"}\nAnalyze: content strategy, topic gaps to exploit, keywords they likely rank for, how to outrank them on 5 specific topics. Give actionable attack plan.`,"Competitive SEO analyst B2B.")}>{loading?<><span className="spinner"/> Analyzing...</>:"▲ Spy on Competitor"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="scheduler"&&<div className="card">
        <div className="text-sm mb-12">Schedule draft posts for future publishing.</div>
        <button className="btn btn-secondary mb-12" onClick={loadDrafts} disabled={schedLoading}>{schedLoading?<><span className="spinner"/> Loading...</>:"Load Drafts"}</button>
        {schedPosts.length>0&&<table className="table"><thead><tr><th>Draft</th><th>Publish Date</th><th></th></tr></thead>
          <tbody>{schedPosts.map((p,i)=>{const def=new Date(Date.now()+(i+1)*3*24*60*60*1000).toISOString().slice(0,16); return <tr key={p.id}>
            <td><div className="truncate" style={{maxWidth:220}}>{strip(p.title?.rendered)||"(no title)"}</div></td>
            <td><input type="datetime-local" className="input" style={{width:170,fontSize:10}} defaultValue={def} id={`s${p.id}`}/></td>
            <td>{p._scheduled?<span className="badge badge-green">Scheduled</span>:<button className="btn btn-primary btn-sm" disabled={scheduling===p.id} onClick={()=>schedule(p.id,document.getElementById(`s${p.id}`).value)}>{scheduling===p.id?<span className="spinner"/>:"Schedule"}</button>}</td>
          </tr>;})}</tbody>
        </table>}
      </div>}
      {tab==="broken"&&<div className="card">
        <div className="text-sm mb-12">Identifies posts with potentially broken outbound links.</div>
        <button className="btn btn-primary mb-12" onClick={async()=>{setBl(true);setBroken([]);try{const r=await wpFetch(site,"/posts?per_page=30&status=publish");const posts=await r.json();const found=[];for(const p of posts){const links=[...( p.content.rendered.matchAll(/href="(https?:\/\/[^"]+)"/g))].map(m=>m[1]).filter(l=>!l.includes(site.url)).slice(0,2);for(const l of links){try{await fetch(l,{method:"HEAD",mode:"no-cors"});}catch{found.push({post:strip(p.title?.rendered),url:l});}}}setBroken(found.length?found:[{post:"Scan complete",url:"No obvious broken links detected"}]);}catch(e){setBroken([{post:"Error",url:e.message}]);}setBl(false);}} disabled={brokenLoading}>{brokenLoading?<><span className="spinner"/> Scanning...</>:"▲ Scan Broken Links"}</button>
        {broken.length>0&&<table className="table"><thead><tr><th>Post</th><th>Broken URL</th></tr></thead><tbody>{broken.map((b,i)=><tr key={i}><td className="text-xs">{b.post}</td><td className="text-xs" style={{color:"var(--danger)",wordBreak:"break-all"}}>{b.url}</td></tr>)}</tbody></table>}
      </div>}
      {tab==="categories"&&<div className="card">
        <div className="text-sm mb-12">Audit category taxonomy for SEO. Well-structured categories improve crawlability and topical authority.</div>
        <button className="btn btn-primary mb-12" onClick={analyzeCats} disabled={loading}>{loading?<><span className="spinner"/> Analyzing...</>:"▲ Audit Categories & Tags"}</button>
        {result&&<div className="ai-output">{result}</div>}
      </div>}
    </div>
  );
}

// media
function MediaManager({ site }) {
  const [media, setM] = useState([]); const [loading, setL] = useState(false); const [gen, setGen] = useState(null); const [bulkR, setBulkR] = useState(false); const [bulkC, setBulkC] = useState(0); const [msg, setMsg] = useState(null);
  const load = useCallback(async()=>{ if(!site)return; setL(true); try { setM(await(await wpFetch(site,"/media?per_page=24&media_type=image")).json()); } catch {} setL(false); },[site]);
  useEffect(()=>{load();},[load]);
  const genAlt = async item => {
    setGen(item.id);
    try { const alt=await claude(`Alt text for supply chain blog image.\nFilename: ${item.slug||item.title?.rendered}\nReturn ONLY alt text, 10-15 words.`,"Return only alt text.",80); await wpFetch(site,`/media/${item.id}`,{method:"POST",body:JSON.stringify({alt_text:alt.trim()})}); setMsg({type:"success",text:"✓ Alt text updated"}); load(); }
    catch(e){ setMsg({type:"error",text:e.message}); } setGen(null);
  };
  const bulkAlt = async () => {
    const noAlt=media.filter(m=>!m.alt_text); if(!noAlt.length){setMsg({type:"info",text:"All images have alt text!"});return;} setBulkR(true); setBulkC(0);
    for(const item of noAlt){ try { const alt=await claude(`Alt text for supply chain image. Filename: ${item.slug||item.title?.rendered}. Return ONLY alt text, 10 words.`,"Return alt text only.",60); await wpFetch(site,`/media/${item.id}`,{method:"POST",body:JSON.stringify({alt_text:alt.trim()})}); setBulkC(c=>c+1); } catch {} }
    setMsg({type:"success",text:`✓ Updated ${noAlt.length} images`}); load(); setBulkR(false);
  };
  if (!site) return <div className="empty"><div className="empty-icon">⊞</div><div className="empty-text">Select a site first</div></div>;
  return (
    <div>
      <div className="section-title">Media Library</div><div className="section-sub">Images and alt text optimization</div>
      {msg&&<div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <button className="btn btn-primary mb-12" onClick={bulkAlt} disabled={bulkR}>{bulkR?<><span className="spinner"/> {bulkC} done...</>:"⊞ Bulk Alt Text (all missing)"}</button>
      {loading?<div className="empty"><div className="spinner"/></div>:
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:9}}>
          {media.map(m=><div key={m.id} className="card" style={{padding:9}}>
            <img src={m.media_details?.sizes?.thumbnail?.source_url||m.source_url} alt={m.alt_text} style={{width:"100%",height:95,objectFit:"cover",borderRadius:5,marginBottom:6,background:"var(--surface2)"}} onError={e=>e.target.style.display="none"}/>
            <div className="truncate fw-600 text-sm" style={{marginBottom:3}}>{m.title?.rendered}</div>
            <div className="text-xs" style={{marginBottom:6,minHeight:22,color:m.alt_text?"var(--text2)":"var(--danger)"}}>{m.alt_text||"⚠ No alt text"}</div>
            <button className="btn btn-secondary btn-sm w-full" onClick={()=>genAlt(m)} disabled={gen===m.id}>{gen===m.id?<span className="spinner"/>:"⬡ Gen Alt"}</button>
          </div>)}
        </div>}
    </div>
  );
}

// monetize
function Monetize({ site }) {
  const [tab, setTab] = useState("leadmagnet"); const [loading, setL] = useState(false); const [result, setR] = useState("");
  const [topic, setTopic] = useState(""); const [audience, setAud] = useState("supply chain professionals");
  const [postUrl, setPu] = useState(""); const [platforms, setPlat] = useState(["linkedin","twitter"]);
  const [faqTopic, setFt] = useState(""); const [titleA, setTa] = useState(""); const [titleB, setTb] = useState("");
  const run = async (p,s,t=700)=>{ setL(true); setR(""); try { setR(await claude(p,s,t)); } catch(e){ setR("Error: "+e.message); } setL(false); };
  const genFaq = async () => {
    if(!faqTopic)return; setL(true); setR("");
    try {
      const r=await claude(`5 FAQ pairs for: "${faqTopic}"\nJSON array: [{"q":"...","a":"..."}]`,"Return JSON array only.",400);
      const faqs=JSON.parse(r.replace(/```json|```/g,"").trim());
      const schema=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))},null,2);
      const html=faqs.map(f=>`<details><summary><strong>${f.q}</strong></summary><p>${f.a}</p></details>`).join("\n");
      setR(`<!-- Add to your post HTML -->\n${html}\n\n<!-- Schema Markup (add to <head> or via plugin) -->\n<script type="application/ld+json">\n${schema}\n</script>`);
    } catch(e){ setR("Error: "+e.message); } setL(false);
  };
  return (
    <div>
      <div className="section-title">Monetize</div><div className="section-sub">Lead magnets · Email drip · Social repurpose · FAQ schema · A/B titles</div>
      <div className="inner-tabs">{[["leadmagnet","Lead Magnet"],["email","Email Drip"],["social","Social"],["faq","FAQ Schema"],["abtitle","A/B Titles"]].map(([id,l])=><div key={id} className={`inner-tab ${tab===id?"active":""}`} onClick={()=>{setTab(id);setR("");}}>{l}</div>)}</div>
      {tab==="leadmagnet"&&<div className="card">
        <div className="field"><label className="lbl">Topic</label><input className="input" placeholder="Supply chain planning checklist, S&OP template..." value={topic} onChange={e=>setTopic(e.target.value)}/></div>
        <div className="field"><label className="lbl">Target Audience</label><input className="input" value={audience} onChange={e=>setAud(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading||!topic} onClick={()=>run(`Lead magnet for supplychainstar.com:\nTopic: ${topic}\nAudience: ${audience}\nProvide: 1) Compelling title 2) Subtitle 3) 10-point checklist/template 4) Opt-in copy (headline + 3 benefits + CTA) 5) Thank-you email 6) Placement strategy`,"Conversion copywriter B2B supply chain.",700)}>{loading?<><span className="spinner"/> Creating...</>:"◉ Generate Lead Magnet"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="email"&&<div className="card">
        <div className="field"><label className="lbl">Lead Magnet Topic</label><input className="input" placeholder="S&OP template, demand planning guide..." value={topic} onChange={e=>setTopic(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading||!topic} onClick={()=>run(`5-email drip for supplychainstar.com subscribers who downloaded: "${topic}"\nEach email: Subject, Preview text, Body (150 words), CTA, Timing (Day 0/3/7/14/30)\nGoal: trust building + drive back to site.`,"Email copywriter B2B supply chain.",800)}>{loading?<><span className="spinner"/> Writing...</>:"◉ Generate Email Sequence"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="social"&&<div className="card">
        <div className="field"><label className="lbl">Post URL or Topic</label><input className="input" placeholder="https://supplychainstar.com/post/ or topic" value={postUrl} onChange={e=>setPu(e.target.value)}/></div>
        <div className="field"><label className="lbl">Platforms</label><div className="flex gap-8">{["linkedin","twitter","instagram"].map(p=><label key={p} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer"}}><input type="checkbox" checked={platforms.includes(p)} onChange={e=>setPlat(prev=>e.target.checked?[...prev,p]:prev.filter(x=>x!==p))} style={{accentColor:"var(--accent)"}}/>{p}</label>)}</div></div>
        <button className="btn btn-primary" disabled={loading||!postUrl} onClick={()=>run(`Repurpose supply chain content for social:\nPost: ${postUrl}\n${platforms.includes("linkedin")?"LinkedIn: 150 word post + 5 hashtags\n":""}${platforms.includes("twitter")?"Twitter/X: 5-tweet thread (280 chars each)\n":""}${platforms.includes("instagram")?"Instagram: 100 word caption + 10 hashtags\n":""}Platform-native and engaging.`,"Social media strategist B2B supply chain.",600)}>{loading?<><span className="spinner"/> Repurposing...</>:"◉ Repurpose Content"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="faq"&&<div className="card">
        <div className="text-sm mb-12">Generate FAQ content + structured data schema markup for Google featured snippets.</div>
        <div className="field"><label className="lbl">Topic or Post Title</label><input className="input" placeholder="What is S&OP? / Demand forecasting methods" value={faqTopic} onChange={e=>setFt(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading||!faqTopic} onClick={genFaq}>{loading?<><span className="spinner"/> Generating...</>:"◉ Generate FAQ + Schema"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
      {tab==="abtitle"&&<div className="card">
        <div className="text-sm mb-12">Score two title variations for CTR, SEO strength, and emotional hook.</div>
        <div className="field"><label className="lbl">Title A</label><input className="input" placeholder="How to Improve Demand Forecasting Accuracy" value={titleA} onChange={e=>setTa(e.target.value)}/></div>
        <div className="field"><label className="lbl">Title B</label><input className="input" placeholder="7 Demand Forecasting Techniques for FMCG" value={titleB} onChange={e=>setTb(e.target.value)}/></div>
        <button className="btn btn-primary" disabled={loading||!titleA||!titleB} onClick={()=>run(`A/B title test:\nA: "${titleA}"\nB: "${titleB}"\nScore each (0-100): CTR potential, SEO strength, emotional hook, clarity, search intent. Declare winner + suggest Title C.`,"CRO and SEO expert B2B content.",450)}>{loading?<><span className="spinner"/> Scoring...</>:"◉ Compare Titles"}</button>
        {loading&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {result&&<div className="ai-output mt-12">{result}</div>}
      </div>}
    </div>
  );
}

// settings
function Settings({ sites, onDeleteSite }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("wpc_api_key") || "");
  const [keySaved, setKeySaved] = useState(false);
  const saveKey = () => { localStorage.setItem("wpc_api_key", apiKey); window.__WPC_KEY__ = apiKey; setKeySaved(true); setTimeout(() => setKeySaved(false), 2000); };
  return (
    <div>
      <div className="section-title">Settings</div><div className="section-sub">Manage connected WordPress sites</div>
      <div className="card mb-12"><div className="card-title">Anthropic API Key</div>
        <div className="text-sm mb-12">Required for AI features. Get yours from <strong>console.anthropic.com</strong></div>
        <div className="flex gap-8 items-center">
          <input className="input" type="password" placeholder="sk-ant-..." value={apiKey} onChange={e=>setApiKey(e.target.value)} style={{flex:1}}/>
          <button className="btn btn-primary" onClick={saveKey}>{keySaved?"✓ Saved!":"Save Key"}</button>
        </div>
        {window.__WPC_KEY__ && <div className="alert alert-success mt-8">✓ API key active</div>}
      </div>
      <div className="card mb-12"><div className="card-title">Connected Sites ({sites.length})</div>
        {!sites.length?<div className="empty"><div className="empty-icon">⬡</div><div className="empty-text">No sites yet</div></div>:
        <table className="table"><thead><tr><th>Name</th><th>URL</th><th>User</th><th></th></tr></thead>
          <tbody>{sites.map(s=><tr key={s.id}><td className="fw-600">{s.name}</td><td className="text-xs">{s.url}</td><td className="text-xs">{s.username}</td><td><button className="btn btn-danger btn-sm" onClick={()=>{if(confirm("Remove?"))onDeleteSite(s.id);}}>Remove</button></td></tr>)}</tbody>
        </table>}
      </div>
      <div className="card mb-12"><div className="card-title">Adding Sites</div><div className="text-sm">WP Admin → Users → Profile → Application Passwords → Add New → copy → "+ Add Site"</div></div>
      <div className="card"><div className="card-title">Security</div><div className="text-sm" style={{color:"var(--warn)"}}>⚠ Credentials in browser localStorage only. Use Application Passwords, not main WP login. Revoke from WP Admin anytime.</div></div>
    </div>
  );
}

// main
export default function App() {
  const [sites, setSites] = useState(()=>{ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); } catch { return []; } });
  const [activeSiteId, setActive] = useState(()=>{ try { return localStorage.getItem("wpcommander_active")||""; } catch { return ""; } });
  const [activeTab, setTab] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const activeSite = sites.find(s=>s.id===activeSiteId)||sites[0]||null;

  useEffect(()=>{ try { localStorage.setItem(STORAGE_KEY,JSON.stringify(sites)); } catch {} },[sites]);
  useEffect(()=>{ try { localStorage.setItem("wpcommander_active",activeSiteId); } catch {} },[activeSiteId]);
  useEffect(()=>{ if(sites.length&&!activeSiteId) setActive(sites[0].id); },[sites]);
  const addSite = s => { setSites(p=>[...p,s]); setActive(s.id); };
  const delSite = id => { setSites(p=>p.filter(x=>x.id!==id)); if(activeSiteId===id) setActive(sites.filter(x=>x.id!==id)[0]?.id||""); };
  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo"><div className="logo-mark">⬡ WP Commander</div><span className="logo-sub">AI WordPress Control Panel</span></div>
          <div className="site-selector">
            <span className="lbl">Active Site</span>
            <select className="site-select" value={activeSiteId} onChange={e=>setActive(e.target.value)}>
              {!sites.length&&<option value="">No sites</option>}
              {sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="add-site-btn" onClick={()=>setShowAdd(true)}>+ Add Site</button>
          </div>
          <nav className="nav">{TABS.map(t=><div key={t.id} className={`nav-item ${activeTab===t.id?"active":""}`} onClick={()=>setTab(t.id)}><span className="nav-icon">{t.icon}</span>{t.label}</div>)}</nav>
          <div className="sidebar-footer"><span className="status-dot"/><span className="status-text">{activeSite?activeSite.name:"No site selected"}</span></div>
        </div>
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{TABS.find(t=>t.id===activeTab)?.label}</div>
            <div className="topbar-actions">
              {activeSite&&<span className="tag tag-green">● {activeSite.name}</span>}
              <span className="tag tag-purple">Claude Sonnet</span>
              <span className="tag tag-pink">WP REST API</span>
            </div>
          </div>
          <div className="content">
            {activeTab==="dashboard"&&<Dashboard site={activeSite}/>}
            {activeTab==="create"&&<CreatePost site={activeSite}/>}
            {activeTab==="posts"&&<PostsManager site={activeSite}/>}
            {activeTab==="pages"&&<PagesManager site={activeSite}/>}
            {activeTab==="comments"&&<CommentsManager site={activeSite}/>}
            {activeTab==="seo"&&<SEOTools site={activeSite}/>}
            {activeTab==="growth"&&<GrowthEngine site={activeSite}/>}
            {activeTab==="media"&&<MediaManager site={activeSite}/>}
            {activeTab==="monetize"&&<Monetize site={activeSite}/>}
            {activeTab==="settings"&&<Settings sites={sites} onDeleteSite={delSite}/>}
          </div>
        </div>
      </div>
      {showAdd&&<AddSiteModal onAdd={addSite} onClose={()=>setShowAdd(false)}/>}
    </>
  );
}
