// ServicesPage.jsx — with updated navbar matching screenshot
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingModal from "./BookServiceModal";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; overflow-x: hidden; min-height: 100vh; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown  { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.88)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer   { 0%{left:-100%} 100%{left:110%} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes floatA    { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(2deg)} }
  @keyframes floatB    { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-10px) rotate(-1deg)} }
  @keyframes cardIn    { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  /* ════════════════════════════════════
     NAVBAR
  ════════════════════════════════════ */
  .sp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 300;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem;
    background: rgba(15,23,42,.92);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,.18);
    box-shadow: 0 4px 32px rgba(0,0,0,.35);
    transition: all .3s ease;
  }
  .sp-logo {
    font-size: 1.5rem; font-weight: 900; letter-spacing: -.03em; cursor: pointer;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    flex-shrink: 0;
  }

  /* center nav links */
  .sp-nav-links { display: flex; gap: .35rem; list-style: none; align-items: center; }
  .sp-nav-link {
    padding: .42rem 1rem; border-radius: 10px; border: none;
    background: transparent; color: #94a3b8;
    font-size: .875rem; font-weight: 500; cursor: pointer;
    font-family: 'Poppins',sans-serif; transition: all .2s;
    text-decoration: none; display: block;
  }
  .sp-nav-link:hover { color: #a5b4fc; background: rgba(99,102,241,.08); }
  .sp-nav-link.active { color: #a5b4fc; background: rgba(99,102,241,.1); }

  /* right side */
  .sp-nav-right { display: flex; align-items: center; gap: .6rem; flex-shrink: 0; }

  /* user chip */
  .sp-user-chip {
    display: flex; align-items: center; gap: .45rem;
    padding: .36rem .9rem; border-radius: 100px;
    background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.28);
    color: #c7d2fe; font-size: .84rem; font-weight: 600;
    white-space: nowrap;
  }
  .sp-user-role {
    font-size: .7rem; padding: .1rem .45rem; border-radius: 6px;
    background: rgba(99,102,241,.18); color: #818cf8; font-weight: 700;
  }

  /* nav buttons */
  .sp-nav-btn {
    padding: .4rem 1.1rem; border-radius: 10px;
    font-size: .84rem; font-weight: 600; cursor: pointer;
    font-family: 'Poppins',sans-serif; transition: all .2s;
    white-space: nowrap;
  }
  .sp-nav-bookings {
    border: 1.5px solid rgba(6,182,212,.35);
    background: rgba(6,182,212,.07); color: #67e8f9;
  }
  .sp-nav-bookings:hover { background: rgba(6,182,212,.14); border-color: rgba(6,182,212,.55); }
  .sp-nav-logout {
    border: 1.5px solid rgba(239,68,68,.35);
    background: rgba(239,68,68,.07); color: #fca5a5;
  }
  .sp-nav-logout:hover { background: rgba(239,68,68,.16); border-color: rgba(239,68,68,.55); }
  .sp-nav-ghost {
    border: 1.5px solid rgba(99,102,241,.4);
    background: transparent; color: #a5b4fc;
  }
  .sp-nav-ghost:hover { background: rgba(99,102,241,.12); }
  .sp-nav-solid {
    border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff;
    box-shadow: 0 4px 18px rgba(99,102,241,.35);
  }
  .sp-nav-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,.55); }

  /* hamburger */
  .sp-hamburger {
    display: none; width: 36px; height: 36px; padding: 7px;
    border: 1px solid rgba(99,102,241,.3); border-radius: 10px;
    background: rgba(99,102,241,.08); color: #a5b4fc; cursor: pointer;
    align-items: center; justify-content: center;
  }

  /* mobile drawer */
  .sp-mobile-menu {
    position: fixed; top: 64px; left: 0; right: 0; z-index: 299;
    background: rgba(10,15,30,.97); backdrop-filter: blur(20px);
    padding: 1rem 1.5rem 1.5rem;
    border-bottom: 1px solid rgba(99,102,241,.15);
    animation: fadeDown .25s ease;
  }
  .sp-mobile-link {
    padding: .7rem 0; color: #94a3b8; font-size: 1rem; font-weight: 500;
    cursor: pointer; border-bottom: 1px solid rgba(255,255,255,.05);
    transition: color .2s; display: block;
  }
  .sp-mobile-link:hover { color: #a5b4fc; }

  /* ════════════════════════════════════
     HERO
  ════════════════════════════════════ */
  .sp-hero {
    padding: 110px 2rem 64px; position: relative; overflow: hidden;
    background: radial-gradient(ellipse 90% 60% at 50% -5%, rgba(99,102,241,.18) 0%, transparent 65%);
    text-align: center;
  }
  .sp-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(99,102,241,.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,.05) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .sp-badge {
    display: inline-flex; align-items: center; gap: .45rem;
    padding: .3rem 1rem; border-radius: 100px; margin-bottom: 1.25rem;
    background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.3);
    color: #a5b4fc; font-size: .75rem; font-weight: 700; letter-spacing: .06em;
    animation: fadeUp .5s ease both;
  }
  .sp-hero h1 {
    font-size: clamp(2rem,5vw,3.4rem); font-weight: 900; letter-spacing: -.035em;
    color: #f1f5f9; line-height: 1.1; margin-bottom: 1.1rem;
    animation: fadeUp .55s ease .1s both;
  }
  .sp-hero h1 span {
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sp-hero p {
    font-size: 1.05rem; color: #94a3b8; line-height: 1.72; max-width: 520px;
    margin: 0 auto 2.5rem; animation: fadeUp .55s ease .2s both;
  }

  /* ── Search bar ── */
  .sp-search-wrap {
    display: flex; align-items: center; gap: .75rem;
    max-width: 540px; margin: 0 auto 1.5rem;
    padding: .55rem .55rem .55rem 1.2rem;
    background: rgba(15,23,42,.85); border: 1.5px solid rgba(99,102,241,.25);
    border-radius: 16px; backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0,0,0,.3);
    animation: fadeUp .55s ease .3s both;
    transition: border-color .25s, box-shadow .25s;
  }
  .sp-search-wrap:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15), 0 8px 32px rgba(0,0,0,.3); }
  .sp-search-input {
    flex: 1; background: none; border: none; outline: none;
    color: #f1f5f9; font-size: .95rem; font-family: 'Poppins',sans-serif; font-weight: 500;
  }
  .sp-search-input::placeholder { color: #475569; }
  .sp-search-btn {
    padding: .6rem 1.4rem; border-radius: 11px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff;
    font-size: .88rem; font-weight: 700; font-family: 'Poppins',sans-serif;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(99,102,241,.4); transition: all .2s;
  }
  .sp-search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(99,102,241,.55); }

  /* ── Category filter pills ── */
  .sp-filter-wrap {
    display: flex; gap: .65rem; flex-wrap: wrap; justify-content: center;
    max-width: 760px; margin: 0 auto;
    animation: fadeUp .55s ease .35s both;
  }
  .sp-pill {
    padding: .38rem 1.1rem; border-radius: 100px;
    border: 1.5px solid rgba(99,102,241,.22);
    background: rgba(99,102,241,.05); color: #94a3b8;
    font-size: .82rem; font-weight: 600; font-family: 'Poppins',sans-serif;
    cursor: pointer; transition: all .22s;
  }
  .sp-pill:hover { border-color: rgba(99,102,241,.45); color: #c7d2fe; background: rgba(99,102,241,.1); }
  .sp-pill.active { border-color: #6366f1; background: rgba(99,102,241,.18); color: #a5b4fc; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }

  /* ── Stats strip ── */
  .sp-stats {
    display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
    padding: 2.5rem 2rem;
    border-top: 1px solid rgba(99,102,241,.08); border-bottom: 1px solid rgba(99,102,241,.08);
    background: rgba(99,102,241,.02);
  }
  .sp-stat-num {
    font-size: 1.6rem; font-weight: 900; letter-spacing: -.02em;
    background: linear-gradient(135deg,#a5b4fc,#67e8f9);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sp-stat-lbl { font-size: .78rem; color: #64748b; font-weight: 500; margin-top: 2px; }

  /* ── Main ── */
  .sp-main { max-width: 1200px; margin: 0 auto; padding: 3.5rem 2rem 5rem; }
  .sp-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .sp-section-title { font-size: 1.35rem; font-weight: 800; color: #f1f5f9; letter-spacing: -.02em; }
  .sp-section-count { font-size: .82rem; color: #64748b; font-weight: 500; }

  .sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.4rem; }

  /* ── Service card ── */
  .sp-card {
    border-radius: 20px; background: rgba(15,23,42,.75); border: 1px solid rgba(99,102,241,.14);
    padding: 1.6rem; cursor: pointer; position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s, border-color .3s; animation: cardIn .5s ease both;
  }
  .sp-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(99,102,241,.04) 0%,transparent 60%); opacity:0; transition:opacity .3s; }
  .sp-card:hover { transform: translateY(-6px) scale(1.01); }
  .sp-card:hover::before { opacity: 1; }
  .sp-card-shine { position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent); }
  .sp-card:hover .sp-card-shine { animation: shimmer .7s ease forwards; }
  .sp-card-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:1.1rem; flex-shrink:0; }
  .sp-card-category { display:inline-block; padding:.2rem .75rem; border-radius:100px; font-size:.7rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; margin-bottom:.75rem; background:rgba(99,102,241,.1); border:1px solid rgba(99,102,241,.2); color:#a5b4fc; }
  .sp-card-name { font-size:1.15rem; font-weight:800; color:#f1f5f9; margin-bottom:.45rem; letter-spacing:-.015em; }
  .sp-card-desc { font-size:.84rem; color:#94a3b8; line-height:1.65; margin-bottom:1.3rem; }
  .sp-card-footer { display:flex; align-items:center; justify-content:space-between; }
  .sp-card-price { font-size:1.2rem; font-weight:900; letter-spacing:-.02em; }
  .sp-card-price span { font-size:.76rem; font-weight:500; color:#64748b; margin-left:2px; }
  .sp-book-btn { padding:.48rem 1.2rem; border-radius:10px; border:none; font-size:.82rem; font-weight:700; font-family:'Poppins',sans-serif; cursor:pointer; transition:all .2s; position:relative; overflow:hidden; background:linear-gradient(135deg,#6366f1,#06b6d4); color:#fff; box-shadow:0 3px 14px rgba(99,102,241,.4); }
  .sp-book-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.55); filter:brightness(1.08); }
  .sp-card-bar { position:absolute; top:0; left:0; right:0; height:3px; border-radius:20px 20px 0 0; }

  /* ── States ── */
  .sp-state-box { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5rem 2rem; text-align:center; gap:1rem; }
  .sp-spinner { width:44px; height:44px; border:3px solid rgba(99,102,241,.2); border-top-color:#6366f1; border-radius:50%; animation:spin .9s linear infinite; }
  .sp-retry-btn { margin-top:.5rem; padding:.6rem 1.6rem; border-radius:10px; border:none; background:linear-gradient(135deg,#6366f1,#06b6d4); color:#fff; font-size:.88rem; font-weight:700; font-family:'Poppins',sans-serif; cursor:pointer; box-shadow:0 4px 16px rgba(99,102,241,.4); transition:all .2s; }
  .sp-retry-btn:hover { transform:translateY(-1px); }

  .sp-chip { position:absolute; padding:.45rem .9rem; border-radius:12px; background:rgba(10,16,32,.9); backdrop-filter:blur(12px); font-size:.75rem; font-weight:600; color:#e2e8f0; display:flex; align-items:center; gap:.4rem; white-space:nowrap; box-shadow:0 4px 20px rgba(0,0,0,.3); }

  /* ── Responsive ── */
  @media(max-width:768px) {
    .sp-nav-links  { display: none !important; }
    .sp-nav-right  { display: none !important; }
    .sp-hamburger  { display: flex !important; }
    .sp-hero       { padding: 96px 1.25rem 48px; }
    .sp-stats      { gap: 2rem; }
    .sp-main       { padding: 2.5rem 1.25rem 4rem; }
  }
  @media(max-width:480px) {
    .sp-grid  { grid-template-columns: 1fr; }
    .sp-stats { gap: 1.5rem; padding: 2rem 1.25rem; }
  }
`;

// ── Meta map ──────────────────────────────────────────────────────────────────
const SERVICE_META = {
  electrician : { emoji:"⚡", color:"#f59e0b" },
  plumber     : { emoji:"🔧", color:"#3b82f6" },
  carpenter   : { emoji:"🪚", color:"#8b5cf6" },
  "ac repair" : { emoji:"❄️", color:"#06b6d4" },
  cleaning    : { emoji:"🧹", color:"#10b981" },
  painter     : { emoji:"🎨", color:"#f43f5e" },
  default     : { emoji:"🛠️", color:"#6366f1" },
};
const getMeta = (name = "") => SERVICE_META[name.toLowerCase()] || SERVICE_META.default;

// ── SVG ───────────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"18px",height:"18px",flexShrink:0}}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconMenu  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR — Logo · Home · Book a Service · Track Bookings · (right) Logout
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
    setMenuOpen(false);
  };

  const NAV_LINKS = [
    { label:"Home",           action: () => navigate("/")               },
    { label:"Book a Service", action: () => navigate("/services")       },
    { label:"Track Bookings", action: () => navigate("/track-bookings") },
  ];

  return (
    <>
      <nav className="sp-nav">
        {/* Logo */}
        <div className="sp-logo" onClick={() => navigate("/")}>ServifyX</div>

        {/* Centre links */}
        <ul className="sp-nav-links">
          {NAV_LINKS.map(({ label, action }) => (
            <li key={label}>
              <span className="sp-nav-link" onClick={action}>{label}</span>
            </li>
          ))}
        </ul>

        {/* Right — Logout or Login/SignUp */}
        <div className="sp-nav-right">
          {user ? (
            <button className="sp-nav-btn sp-nav-logout" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="sp-nav-btn sp-nav-ghost"  onClick={() => navigate("/login")}>Login</button>
              <button className="sp-nav-btn sp-nav-solid"  onClick={() => navigate("/register")}>Sign Up</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="sp-hamburger" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <IconClose/> : <IconMenu/>}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sp-mobile-menu">
          {NAV_LINKS.map(({ label, action }) => (
            <span key={label} className="sp-mobile-link" onClick={() => { action(); setMenuOpen(false); }}>{label}</span>
          ))}
          <div style={{ display:"flex", gap:".75rem", marginTop:"1rem" }}>
            {user ? (
              <button onClick={handleLogout} style={{ flex:1, padding:".6rem", borderRadius:"10px", border:"1.5px solid rgba(239,68,68,.35)", background:"rgba(239,68,68,.07)", color:"#fca5a5", fontFamily:"'Poppins',sans-serif", fontWeight:600, cursor:"pointer" }}>Logout</button>
            ) : (
              <>
                <button onClick={() => { navigate("/login");    setMenuOpen(false); }} style={{ flex:1, padding:".6rem", borderRadius:"10px", border:"1.5px solid rgba(99,102,241,.4)", background:"transparent", color:"#a5b4fc", fontFamily:"'Poppins',sans-serif", fontWeight:600, cursor:"pointer" }}>Login</button>
                <button onClick={() => { navigate("/register"); setMenuOpen(false); }} style={{ flex:1, padding:".6rem", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#6366f1,#06b6d4)", color:"#fff", fontFamily:"'Poppins',sans-serif", fontWeight:600, cursor:"pointer" }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const navigate = useNavigate();

  const [services,       setServices]       = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService,setSelectedService]= useState(null);

  const fetchServices = async () => {
    setLoading(true); setError("");
    try {
      const res  = await axios.get("http://localhost:5000/api/service/all");
      const list = res.data.services || [];
      setServices(list); setFiltered(list);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    let result = services;
    if (activeCategory !== "All") result = result.filter(s => s.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeCategory, services]);

  const categories = ["All", ...new Set(services.map(s => s.category).filter(Boolean))];

  const handleBook = (service, emoji, color) => {
    const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();
    if (!user) { navigate("/login"); return; }
    setSelectedService({ ...service, emoji, color });
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Booking modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={(data) => console.log("Booking created:", data.booking)}
        />
      )}

      {/* ── Navbar ── */}
      <Navbar/>

      {/* ── Hero ── */}
      <section className="sp-hero">
        <div className="sp-hero-grid"/>
        <div className="sp-chip" style={{top:"18%", left:"4%", border:"1px solid #f59e0b40", animation:"floatA 3.8s ease-in-out infinite"}}>⚡ Electrician nearby</div>
        <div className="sp-chip" style={{top:"22%", right:"3%", border:"1px solid #10b98140", animation:"floatB 3.8s ease-in-out .8s infinite"}}>✅ Verified Pros</div>

        <div style={{position:"relative", zIndex:1}}>
          <div className="sp-badge">
            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#10b981",display:"inline-block",animation:"pulse 2s infinite",boxShadow:"0 0 8px #10b98180"}}/>
            15+ SERVICES AVAILABLE
          </div>
          <h1>Find Trusted Experts<br/><span>Right at Your Doorstep</span></h1>
          <p>Browse 15+ verified home services — from electricians to deep cleaning. Book instantly, track in real time, pay after the job.</p>

          <div className="sp-search-wrap">
            <IconSearch/>
            <input className="sp-search-input" type="text" placeholder="Search services e.g. Electrician, Plumber…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch("")} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"1.1rem",lineHeight:1,padding:"0 .25rem",transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="#a5b4fc"} onMouseLeave={e=>e.currentTarget.style.color="#475569"}>✕</button>
            )}
            <button className="sp-search-btn">Search</button>
          </div>

          <div className="sp-filter-wrap">
            {categories.map(cat => (
              <button key={cat} className={`sp-pill${activeCategory === cat ? " active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

   
      {/* ── Services grid ── */}
      <main className="sp-main">
        <div className="sp-section-head">
          <div>
            <div className="sp-section-title">{activeCategory === "All" ? "All Services" : activeCategory}</div>
            {!loading && !error && (
              <div className="sp-section-count">{filtered.length} service{filtered.length !== 1 ? "s" : ""} found{search && ` for "${search}"`}</div>
            )}
          </div>
          {(search || activeCategory !== "All") && (
            <button style={{padding:".38rem 1rem",borderRadius:"9px",border:"1.5px solid rgba(99,102,241,.3)",background:"transparent",color:"#a5b4fc",fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"'Poppins',sans-serif",transition:"background .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,.1)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear filters ✕</button>
          )}
        </div>

        <div className="sp-grid">
          {loading && <div className="sp-state-box"><div className="sp-spinner"/><p style={{color:"#64748b",fontSize:".95rem"}}>Fetching available services…</p></div>}
          {!loading && error && <div className="sp-state-box"><div style={{fontSize:"2.5rem"}}>⚠️</div><p style={{color:"#fca5a5",fontWeight:600,fontSize:"1rem"}}>{error}</p><button className="sp-retry-btn" onClick={fetchServices}>Try Again</button></div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="sp-state-box">
              <div style={{fontSize:"2.8rem"}}>🔍</div>
              <p style={{color:"#f1f5f9",fontWeight:700,fontSize:"1.05rem"}}>No services found</p>
              <p style={{color:"#64748b",fontSize:".9rem"}}>Try a different search or clear the filters.</p>
              <button className="sp-retry-btn" onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear Filters</button>
            </div>
          )}
          {!loading && !error && filtered.map((service, i) => {
            const { emoji, color } = getMeta(service.name);
            return (
              <ServiceCard
                key={service._id}
                service={service}
                emoji={emoji}
                color={color}
                delay={`${i * 0.06}s`}
                onBook={() => handleBook(service, emoji, color)}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}

// ── Service Card ──────────────────────────────────────────────────────────────
function ServiceCard({ service, emoji, color, delay, onBook }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="sp-card"
      style={{ animationDelay:delay, boxShadow: hovered ? `0 20px 52px ${color}1e, 0 4px 16px rgba(0,0,0,.3)` : "0 4px 16px rgba(0,0,0,.25)", borderColor: hovered ? `${color}40` : "rgba(99,102,241,.14)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="sp-card-bar" style={{background:`linear-gradient(90deg,${color},${color}55)`}}/>
      <div className="sp-card-shine"/>
      <div style={{position:"absolute",top:"-30px",right:"-30px",width:"100px",height:"100px",borderRadius:"50%",background:`radial-gradient(circle,${color}12,transparent 70%)`}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div className="sp-card-icon" style={{background:`${color}15`, border:`1px solid ${color}28`}}>{emoji}</div>
        {service.category && <div className="sp-card-category">{service.category}</div>}
        <div className="sp-card-name">{service.name}</div>
        <div className="sp-card-desc">{service.description || "Professional service delivered by verified experts."}</div>
        <div className="sp-card-footer">
          <div>
            <div className="sp-card-price" style={{color}}>₹{service.basePrice}<span>/ starting</span></div>
            <div style={{fontSize:".7rem",color:"#475569",marginTop:"2px",fontWeight:500}}>Incl. labour charges</div>
          </div>
          <button className="sp-book-btn" style={{background:`linear-gradient(135deg,${color},${color}cc)`}} onClick={e => { e.stopPropagation(); onBook(); }}>
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
}