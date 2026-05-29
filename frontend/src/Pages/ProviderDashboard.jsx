// ProviderDashboard.jsx — ServifyX · Matched to screenshot color palette
// Background: #0a0f1e (deep navy) | Cards: rgba(15,23,42,.75) | Accent: #6366f1→#06b6d4
// Fires window "auth-changed" event on logout.

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ─── Color tokens (matched to screenshot) ─────────────────────────────────── */
const T = {
  bg:          "#0a0f1e",   // page background — deepest navy
  bgCard:      "rgba(15,23,42,.75)",   // card / surface background
  bgCardHov:   "#101929",   // card hover
  bgNav:       "rgba(10,15,30,.92)", // navbar
  border:      "rgba(99,102,241,.13)",  // default border
  borderHov:   "rgba(99,102,241,.32)",  // hover border
  indigo:      "#6366f1",
  cyan:        "#06b6d4",
  purple:      "#8b5cf6",
  green:       "#10b981",
  amber:       "#f59e0b",
  red:         "#f43f5e",
  textPrimary: "#f1f5f9",
  textSub:     "#94a3b8",
  textMuted:   "#475569",
  gradMain:    "linear-gradient(135deg,#6366f1,#06b6d4)",
};

/* ─── CSS ───────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Poppins', sans-serif;
  background: #0f172a;
  color: #f1f5f9;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ─── keyframes ─── */
@keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes cardIn  { from{opacity:0;transform:translateY(18px) scale(.985)} to{opacity:1;transform:none} }
@keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.86)} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes shimmer { 0%{left:-100%} 100%{left:110%} }
@keyframes glow    { 0%,100%{box-shadow:0 0 14px rgba(99,102,241,.35)} 50%{box-shadow:0 0 28px rgba(99,102,241,.6)} }
@keyframes gridIn  { from{opacity:0} to{opacity:1} }

/* ─── page bg grid ─── */
.pd-bg-grid {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(99,102,241,.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.028) 1px, transparent 1px);
  background-size: 52px 52px;
  animation: gridIn .6s ease both;
}
.pd-bg-radial {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 40% at 50% -5%, rgba(99,102,241,.1) 0%, transparent 65%),
    radial-gradient(ellipse 40% 30% at 90% 80%, rgba(6,182,212,.06) 0%, transparent 60%);
}

/* ─── layout ─── */
.pd-root { position: relative; z-index: 1; min-height: 100vh; }

/* ─── navbar ─── */
.pd-nav {
  position: sticky; top: 0; z-index: 200;
  height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem;
  background: rgba(15,23,42,.92);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(99,102,241,.14);
  box-shadow: 0 1px 0 rgba(99,102,241,.08), 0 8px 32px rgba(0,0,0,.35);
}
.pd-logo {
  font-size: 1.48rem; font-weight: 900; letter-spacing: -.035em; cursor: pointer;
  background: linear-gradient(135deg,#6366f1,#06b6d4);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  transition: opacity .2s;
}
.pd-logo:hover { opacity: .85; }
.pd-nav-right { display: flex; align-items: center; gap: .65rem; }

.pd-user-chip {
  display: flex; align-items: center; gap: .45rem;
  padding: .36rem .85rem .36rem .5rem; border-radius: 100px;
  background: rgba(99,102,241,.09); border: 1px solid rgba(99,102,241,.22);
  color: #c7d2fe; font-size: .83rem; font-weight: 600;
}
.pd-user-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg,#6366f1,#06b6d4);
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 800; color: #fff; flex-shrink: 0;
}
.pd-role-pill {
  padding: .15rem .55rem; border-radius: 100px;
  background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.3);
  color: #6ee7b7; font-size: .7rem; font-weight: 700; letter-spacing: .04em;
}

.pd-dashboard-btn {
  padding: .4rem 1rem; border-radius: 10px;
  border: none;
  background: linear-gradient(135deg,#6366f1,#06b6d4);
  color: #fff; font-size: .83rem; font-weight: 700;
  cursor: pointer; font-family: 'Poppins',sans-serif;
  box-shadow: 0 3px 16px rgba(99,102,241,.38);
  transition: all .2s;
}
.pd-dashboard-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(99,102,241,.52); }

.pd-logout {
  padding: .4rem 1rem; border-radius: 10px;
  border: 1.5px solid rgba(239,68,68,.3);
  background: rgba(239,68,68,.07); color: #fca5a5;
  font-size: .83rem; font-weight: 600; cursor: pointer;
  font-family: 'Poppins',sans-serif; transition: all .2s;
}
.pd-logout:hover { background: rgba(239,68,68,.16); border-color: rgba(239,68,68,.52); transform: translateY(-1px); }

/* ─── hero ─── */
.pd-hero {
  padding: 3.5rem 2rem 2rem; text-align: center;
  background: radial-gradient(ellipse 80% 55% at 50% -10%, rgba(99,102,241,.13) 0%, transparent 65%);
  position: relative;
}
.pd-hero-gridlines {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(99,102,241,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.035) 1px, transparent 1px);
  background-size: 52px 52px;
}
.pd-badge {
  display: inline-flex; align-items: center; gap: .45rem;
  padding: .3rem 1rem; border-radius: 100px; margin-bottom: 1rem;
  background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.28);
  color: #a5b4fc; font-size: .74rem; font-weight: 700; letter-spacing: .05em;
  animation: fadeUp .4s ease both;
}
.pd-hero h1 {
  font-size: clamp(2rem,4vw,2.9rem); font-weight: 900; letter-spacing: -.035em;
  color: #f1f5f9; line-height: 1.08; margin-bottom: .6rem;
  animation: fadeUp .45s ease .08s both;
}
.pd-hero h1 span {
  background: linear-gradient(135deg,#6366f1,#06b6d4);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.pd-hero p {
  font-size: .95rem; color: #64748b; animation: fadeUp .45s ease .16s both;
  max-width: 480px; margin: 0 auto;
}

/* ─── stats grid ─── */
.pd-stats {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.1rem;
  padding: 2rem 2rem 0;
  max-width: 1280px; margin: 0 auto;
}
.pd-stat {
  padding: 1.4rem 1.5rem; border-radius: 18px;
  background: rgba(15,23,42,.75); border: 1px solid rgba(99,102,241,.13);
  display: flex; align-items: center; gap: .9rem;
  animation: fadeUp .5s ease both;
  transition: transform .3s, box-shadow .3s, border-color .3s;
  position: relative; overflow: hidden;
}
.pd-stat::before {
  content:''; position:absolute; inset:0; border-radius:18px;
  background: linear-gradient(135deg, rgba(99,102,241,.03) 0%, transparent 60%);
  pointer-events: none;
}
.pd-stat:hover { transform: translateY(-3px); }
.pd-stat-icon {
  width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
}
.pd-stat-num  { font-size: 1.75rem; font-weight: 900; letter-spacing: -.025em; line-height: 1; }
.pd-stat-lbl  { font-size: .74rem; color: #64748b; font-weight: 500; margin-top: 3px; }

/* ─── section ─── */
.pd-section { max-width: 1280px; margin: 0 auto; padding: 2rem 2rem 5rem; }
.pd-section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.4rem; flex-wrap: wrap; gap: .75rem;
}
.pd-section-title { font-size: 1.2rem; font-weight: 800; color: #f1f5f9; letter-spacing: -.02em; }
.pd-section-count { font-size: .8rem; color: #64748b; font-weight: 500; margin-top: 2px; }

.pd-refresh {
  padding: .4rem 1rem; border-radius: 10px;
  border: 1.5px solid rgba(99,102,241,.25);
  background: rgba(99,102,241,.06); color: #a5b4fc;
  font-size: .82rem; font-weight: 600; cursor: pointer;
  font-family: 'Poppins',sans-serif; transition: all .2s;
  display: flex; align-items: center; gap: .4rem;
}
.pd-refresh:hover { background: rgba(99,102,241,.14); border-color: rgba(99,102,241,.48); }

/* ─── filter tabs ─── */
.pd-filters { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.pd-filter-tab {
  padding: .36rem .95rem; border-radius: 100px;
  border: 1.5px solid rgba(99,102,241,.18);
  background: rgba(99,102,241,.04); color: #94a3b8;
  font-size: .81rem; font-weight: 600; cursor: pointer;
  font-family: 'Poppins',sans-serif; transition: all .22s;
  display: flex; align-items: center; gap: .38rem;
}
.pd-filter-tab:hover { border-color: rgba(99,102,241,.4); color: #c7d2fe; background: rgba(99,102,241,.09); }
.pd-filter-tab.active {
  border-color: #6366f1; background: rgba(99,102,241,.16);
  color: #a5b4fc; box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}
.pd-filter-count {
  padding: .08rem .42rem; border-radius: 100px;
  font-size: .69rem; font-weight: 800; min-width: 18px; text-align: center;
}

/* ─── card grid ─── */
.pd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px,1fr));
  gap: 1.3rem;
}

/* ─── booking card ─── */
.pd-card {
  border-radius: 20px;
  background: rgba(15,23,42,.75);
  border: 1px solid rgba(99,102,241,.13);
  padding: 1.5rem; position: relative; overflow: hidden;
  transition: transform .3s, box-shadow .3s, border-color .3s;
  animation: cardIn .5s ease both;
}
.pd-card:hover { transform: translateY(-5px); }
.pd-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0; }

/* subtle inner glow top-right */
.pd-card::before {
  content:''; position:absolute; top:-40px; right:-40px;
  width:120px; height:120px; border-radius:50%;
  pointer-events:none; opacity:.06;
}

.pd-card-top { display: flex; gap: .85rem; align-items: flex-start; margin-bottom: 1rem; }
.pd-card-icon {
  width: 50px; height: 50px; border-radius: 13px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
}
.pd-service-name { font-size: 1rem; font-weight: 800; color: #f1f5f9; margin-bottom: 2px; letter-spacing: -.015em; }
.pd-customer     { font-size: .8rem; color: #94a3b8; font-weight: 500; }

.pd-status-badge {
  display: inline-flex; align-items: center; gap: .32rem;
  padding: .2rem .7rem; border-radius: 100px;
  font-size: .73rem; font-weight: 700; letter-spacing: .03em;
  flex-shrink: 0; margin-left: auto;
}

.pd-divider { height: 1px; background: rgba(99,102,241,.09); margin: .9rem 0; }

.pd-info-row { display: flex; align-items: center; gap: .48rem; margin-bottom: .38rem; font-size: .82rem; color: #94a3b8; }
.pd-info-row span { font-weight: 500; }

.pd-info-box {
  padding: .68rem .88rem; border-radius: 11px;
  background: rgba(99,102,241,.04); border: 1px solid rgba(99,102,241,.1);
  margin-bottom: .5rem;
}
.pd-info-box-label {
  font-size: .67rem; font-weight: 700; color: #475569;
  letter-spacing: .05em; text-transform: uppercase; margin-bottom: .2rem;
}
.pd-info-box-val { font-size: .82rem; color: #cbd5e1; font-weight: 500; line-height: 1.5; }

/* ─── action buttons ─── */
.pd-btn {
  width: 100%; padding: .75rem; border-radius: 12px; border: none;
  font-size: .88rem; font-weight: 700; font-family: 'Poppins',sans-serif;
  cursor: pointer; position: relative; overflow: hidden;
  transition: transform .25s, box-shadow .25s;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
}
.pd-btn::after {
  content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);
}
.pd-btn:hover { transform: translateY(-2px); }
.pd-btn:hover::after { animation: shimmer .6s ease forwards; }
.pd-btn:active  { transform: translateY(0); }
.pd-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
.pd-btn:disabled::after { display: none; }

.pd-btn-accept   { background: linear-gradient(135deg,#10b981,#06b6d4); box-shadow:0 4px 18px rgba(16,185,129,.32); margin-top:1rem; }
.pd-btn-accept:hover   { box-shadow:0 8px 26px rgba(16,185,129,.52); }
.pd-btn-progress { background: linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow:0 4px 18px rgba(99,102,241,.32); margin-top:1rem; }
.pd-btn-progress:hover { box-shadow:0 8px 26px rgba(99,102,241,.52); }
.pd-btn-complete { background: linear-gradient(135deg,#f59e0b,#f97316); box-shadow:0 4px 18px rgba(245,158,11,.32); margin-top:.6rem; }
.pd-btn-complete:hover { box-shadow:0 8px 26px rgba(245,158,11,.52); }

/* ─── status banners ─── */
.pd-status-info { margin-top: 1rem; padding: .65rem 1rem; border-radius: 11px; font-size: .82rem; font-weight: 600; text-align: center; }

/* ─── states ─── */
.pd-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 5rem 2rem; text-align: center; gap: 1rem; grid-column: 1 / -1;
}
.pd-spinner {
  width: 42px; height: 42px;
  border: 3px solid rgba(99,102,241,.18); border-top-color: #6366f1;
  border-radius: 50%; animation: spin .85s linear infinite;
}

/* ─── responsive ─── */
@media(max-width:1100px) {
  .pd-stats { grid-template-columns: repeat(3,1fr); }
}
@media(max-width:640px) {
  .pd-stats   { grid-template-columns: 1fr 1fr; gap: .85rem; padding: 1.4rem 1.2rem 0; }
  .pd-section { padding: 1.5rem 1.2rem 3rem; }
  .pd-hero    { padding: 2.5rem 1.2rem 1.5rem; }
  .pd-nav     { padding: 0 1.2rem; }
  .pd-chip-label { display: none; }
  .pd-role-pill  { display: none; }
  .pd-dashboard-btn { display: none; }
}
@media(max-width:420px) {
  .pd-stats { grid-template-columns: 1fr; }
}
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const SERVICE_META = {
  electrician     : { emoji:"⚡", color:"#f59e0b" },
  plumber         : { emoji:"🔧", color:"#3b82f6" },
  carpenter       : { emoji:"🪚", color:"#8b5cf6" },
  "ac repair"     : { emoji:"❄️", color:"#06b6d4" },
  "deep cleaning" : { emoji:"🧹", color:"#10b981" },
  cleaning        : { emoji:"🧹", color:"#10b981" },
  painter         : { emoji:"🎨", color:"#f43f5e" },
  painting        : { emoji:"🎨", color:"#f43f5e" },
  "appliance repair":{ emoji:"🔌", color:"#a78bfa" },
  "pest control"  : { emoji:"🐛", color:"#84cc16" },
};
const getMeta = (n = "") =>
  SERVICE_META[(n||"").toLowerCase().trim()] ||
  { emoji:"🏠", color:"#6366f1" };

const STATUS_CFG = {
  requested   : { color:"#f59e0b", bg:"rgba(245,158,11,.09)",  border:"rgba(245,158,11,.22)",  dot:"#f59e0b", label:"Requested"    },
  accepted    : { color:"#10b981", bg:"rgba(16,185,129,.09)",  border:"rgba(16,185,129,.22)",  dot:"#10b981", label:"Accepted"     },
  in_progress : { color:"#8b5cf6", bg:"rgba(139,92,246,.09)",  border:"rgba(139,92,246,.22)",  dot:"#8b5cf6", label:"In Progress"  },
  completed   : { color:"#06b6d4", bg:"rgba(6,182,212,.09)",   border:"rgba(6,182,212,.22)",   dot:"#06b6d4", label:"Completed"    },
  cancelled   : { color:"#f43f5e", bg:"rgba(244,63,94,.09)",   border:"rgba(244,63,94,.22)",   dot:"#f43f5e", label:"Cancelled"    },
};
const getStatus = (s = "") =>
  STATUS_CFG[(s||"").toLowerCase().replace(/[\s-]/g,"_")] ||
  { color:"#94a3b8", bg:"rgba(148,163,184,.09)", border:"rgba(148,163,184,.2)", dot:"#94a3b8", label: s };

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) : "—";

const initials = (name="") =>
  name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) || "P";

/* ─── BtnSpinner ─────────────────────────────────────────────────────────── */
const BtnSpinner = ({label}) => (
  <span style={{display:"flex",alignItems:"center",gap:".45rem"}}>
    <span style={{width:"15px",height:"15px",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .75s linear infinite"}}/>
    {label}
  </span>
);

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function ProviderDashboard() {
  const navigate = useNavigate();

  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [accepting,    setAccepting]    = useState(null);
  const [updating,     setUpdating]     = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")||"null"); } catch { return null; }
  })();
  const token = localStorage.getItem("token");

  /* fetch ── */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/booking/my-bookings",{
        headers:{ Authorization:`Bearer ${token}` },
      });
      setBookings(data||[]);
    } catch(err){ console.error(err); }
    finally { setLoading(false); }
  };

  /* mount ── */
  useEffect(()=>{
    const init = async () => {
      if(!token){ navigate("/login"); return; }
      try {
        await axios.get("http://localhost:5000/api/provider/my-profile",{
          headers:{ Authorization:`Bearer ${token}` },
        });
        fetchBookings();
      } catch { navigate("/create-provider-profile"); }
    };
    init();
  },[]);

  /* accept ── */
  const acceptBooking = async (id) => {
    setAccepting(id);
    try {
      await axios.patch(`http://localhost:5000/api/booking/accept/${id}`,{},{
        headers:{ Authorization:`Bearer ${token}` },
      });
      fetchBookings();
    } catch(err){ alert(err.response?.data?.message||"Failed to accept"); }
    finally { setAccepting(null); }
  };

  /* status update ── */
  const updateStatus = async (id, status) => {
    setUpdating(id+status);
    try {
      await axios.patch(`http://localhost:5000/api/booking/status/${id}`,{status},{
        headers:{ Authorization:`Bearer ${token}` },
      });
      fetchBookings();
    } catch(err){ alert(err.response?.data?.message||`Failed: ${status}`); }
    finally { setUpdating(null); }
  };

  /* logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  /* derived ── */
  const total       = bookings.length;
  const pending     = bookings.filter(b=>b.status==="requested").length;
  const accepted    = bookings.filter(b=>b.status==="accepted").length;
  const inprogress  = bookings.filter(b=>b.status==="in_progress").length;
  const completed   = bookings.filter(b=>b.status==="completed").length;
  const cancelled   = bookings.filter(b=>b.status==="cancelled").length;

  const STATS = [
    { emoji:"📋", num:total,      label:"Total",       color:T.indigo, delay:".04s" },
    { emoji:"⏳", num:pending,    label:"Pending",     color:T.amber,  delay:".09s" },
    { emoji:"✅", num:accepted,   label:"Accepted",    color:T.green,  delay:".14s" },
    { emoji:"🔨", num:inprogress, label:"In Progress", color:T.purple, delay:".18s" },
    { emoji:"🏆", num:completed,  label:"Completed",   color:T.cyan,   delay:".22s" },
    { emoji:"✖️", num:cancelled,  label:"Cancelled",   color:T.red,    delay:".26s" },
  ];

  const TABS = [
    { key:"all",         label:"All",         color:T.indigo, count:total       },
    { key:"requested",   label:"Requested",   color:T.amber,  count:pending     },
    { key:"accepted",    label:"Accepted",    color:T.green,  count:accepted    },
    { key:"in_progress", label:"In Progress", color:T.purple, count:inprogress  },
    { key:"completed",   label:"Completed",   color:T.cyan,   count:completed   },
    { key:"cancelled",   label:"Cancelled",   color:T.red,    count:cancelled   },
  ];

  const visible = activeFilter==="all"
    ? bookings
    : bookings.filter(b=>b.status===activeFilter);

  /* ── render ── */
  return (
    <>
      <style>{CSS}</style>
      <div className="pd-bg-grid"/>
      <div className="pd-bg-radial"/>

      <div className="pd-root">

        {/* ── Navbar — logo left · badge center · dashboard btn right ── */}
        <nav className="pd-nav">
          {/* Left: Logo */}
          <div className="pd-logo" onClick={()=>navigate("/")}>ServifyX</div>

          {/* Center: live badge */}
          <div style={{
            display:"flex", alignItems:"center", gap:".5rem",
            padding:".3rem 1rem", borderRadius:"100px",
            background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.22)",
          }}>
            <span style={{
              width:"7px", height:"7px", borderRadius:"50%",
              background:"#10b981", display:"inline-block",
              animation:"pulse 2s infinite", boxShadow:"0 0 8px rgba(16,185,129,.6)",
            }}/>
            <span style={{color:"#a5b4fc", fontSize:".8rem", fontWeight:700, letterSpacing:".05em"}}>
              PROVIDER DASHBOARD
            </span>
          </div>

          {/* Right: Dashboard back button */}
          <button
            onClick={()=>navigate("/provider/dashboard")}
            style={{
              display:"flex", alignItems:"center", gap:".4rem",
              padding:".42rem 1.1rem", borderRadius:"10px",
              border:"1.5px solid rgba(99,102,241,.3)",
              background:"rgba(99,102,241,.06)", color:"#94a3b8",
              fontSize:".83rem", fontWeight:600, cursor:"pointer",
              fontFamily:"'Poppins',sans-serif", transition:"all .2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.16)";e.currentTarget.style.color="#c7d2fe";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,102,241,.06)";e.currentTarget.style.color="#94a3b8";}}
          >← Dashboard</button>
        </nav>

        {/* ── Hero ── */}
        <div className="pd-hero" style={{textAlign:"left", padding:"3rem 2rem 2rem"}}>
          <div className="pd-hero-gridlines"/>
          <div style={{position:"relative",zIndex:1, maxWidth:"1280px", margin:"0 auto"}}>
            <div className="pd-badge" style={{marginBottom:"1.25rem"}}>
              TRACK PROVIDER BOOKINGS
            </div>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem"}}>
              <div>
                <h1 style={{textAlign:"left", marginBottom:".5rem"}}>
                  Provider Dashboard <span>Insights</span>
                </h1>
                <p style={{textAlign:"left", margin:0}}>
                  Track all requests for your service type and see every assigned job in one dashboard.
                </p>
              </div>
              <button
                onClick={fetchBookings}
                style={{
                  flexShrink:0,
                  display:"flex", alignItems:"center", gap:".5rem",
                  padding:".62rem 1.5rem", borderRadius:"12px", border:"none",
                  background:"linear-gradient(135deg,#6366f1,#06b6d4)",
                  color:"#fff", fontSize:".88rem", fontWeight:700,
                  cursor:"pointer", fontFamily:"'Poppins',sans-serif",
                  boxShadow:"0 4px 20px rgba(99,102,241,.38)",
                  transition:"all .25s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(99,102,241,.55)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,.38)";}}
              >
                <span style={{display:"inline-block", animation:loading?"spin .9s linear infinite":"none", fontSize:"1rem"}}>↻</span>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="pd-stats">
          {STATS.map(({emoji,num,label,color,delay})=>(
            <div
              key={label}
              className="pd-stat"
              style={{animationDelay:delay, borderColor:`${color}18`}}
              onMouseEnter={e=>{
                e.currentTarget.style.borderColor=`${color}35`;
                e.currentTarget.style.boxShadow=`0 12px 36px ${color}12, 0 0 0 1px ${color}20`;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.borderColor=`${color}18`;
                e.currentTarget.style.boxShadow="none";
              }}
            >
              <div
                className="pd-stat-icon"
                style={{background:`${color}14`,border:`1px solid ${color}26`}}
              >{emoji}</div>
              <div>
                <div className="pd-stat-num" style={{color}}>{num}</div>
                <div className="pd-stat-lbl">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main section ── */}
        <div className="pd-section">

          <div className="pd-section-head">
            <div>
              <div className="pd-section-title">Incoming Requests</div>
              {!loading && (
                <div className="pd-section-count">
                  {visible.length} booking{visible.length!==1?"s":""}
                  {activeFilter!=="all"?` · ${activeFilter}`:""}
                </div>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="pd-filters">
            {TABS.map(({key,label,color,count})=>(
              <button
                key={key}
                className={`pd-filter-tab${activeFilter===key?" active":""}`}
                style={activeFilter===key
                  ? {borderColor:color,background:`${color}16`,color,boxShadow:`0 0 0 3px ${color}12`}
                  : {}
                }
                onClick={()=>setActiveFilter(key)}
              >
                {label}
                <span
                  className="pd-filter-count"
                  style={{
                    background: activeFilter===key ? `${color}22` : "rgba(99,102,241,.08)",
                    color: activeFilter===key ? color : "#64748b",
                  }}
                >{count}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="pd-grid">

            {/* Loading */}
            {loading && (
              <div className="pd-state">
                <div className="pd-spinner"/>
                <p style={{color:"#64748b",fontSize:".93rem"}}>Fetching your bookings…</p>
              </div>
            )}

            {/* Empty */}
            {!loading && visible.length===0 && (
              <div className="pd-state">
                <div style={{fontSize:"3rem"}}>📭</div>
                <p style={{color:"#f1f5f9",fontWeight:700,fontSize:"1.05rem"}}>
                  {activeFilter==="all" ? "No bookings yet" : `No ${activeFilter} bookings`}
                </p>
                <p style={{color:"#64748b",fontSize:".88rem",maxWidth:"340px"}}>
                  {activeFilter==="all"
                    ? "New requests will appear here when customers book your service."
                    : `You don't have any ${activeFilter} bookings right now.`}
                </p>
                {activeFilter!=="all" && (
                  <button
                    onClick={()=>setActiveFilter("all")}
                    style={{
                      marginTop:".25rem",padding:".48rem 1.2rem",borderRadius:"10px",
                      border:"1.5px solid rgba(99,102,241,.28)",background:"rgba(99,102,241,.07)",
                      color:"#a5b4fc",fontSize:".83rem",fontWeight:600,cursor:"pointer",
                      fontFamily:"'Poppins',sans-serif",transition:"all .2s",
                    }}
                  >View all bookings</button>
                )}
              </div>
            )}

            {/* Cards */}
            {!loading && visible.map((booking,i)=>{
              const {emoji,color} = getMeta(booking?.serviceId?.name);
              const st = getStatus(booking.status);
              const isAccepting  = accepting===booking._id;
              const isUpdatingIP = updating===booking._id+"in_progress";
              const isUpdatingC  = updating===booking._id+"completed";

              return (
                <div
                  key={booking._id}
                  className="pd-card"
                  style={{animationDelay:`${i*.06}s`, borderColor:`${color}16`}}
                  onMouseEnter={e=>{
                    e.currentTarget.style.boxShadow=`0 20px 52px rgba(0,0,0,.4), 0 0 0 1px ${color}30, inset 0 1px 0 rgba(255,255,255,.04)`;
                    e.currentTarget.style.borderColor=`${color}35`;
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.boxShadow="none";
                    e.currentTarget.style.borderColor=`${color}16`;
                  }}
                >
                  {/* Top accent bar */}
                  <div className="pd-card-bar" style={{background:`linear-gradient(90deg,${color},${color}40)`}}/>

                  {/* Card top row */}
                  <div className="pd-card-top">
                    <div
                      className="pd-card-icon"
                      style={{background:`${color}14`,border:`1px solid ${color}26`}}
                    >{emoji}</div>

                    <div style={{flex:1,minWidth:0}}>
                      <div className="pd-service-name">
                        {booking?.serviceId?.name || "Service"}
                      </div>
                      <div className="pd-customer">
                        👤 {booking?.userId?.name || "Customer"}
                      </div>
                    </div>

                    <div
                      className="pd-status-badge"
                      style={{background:st.bg,border:`1px solid ${st.border}`,color:st.color}}
                    >
                      <span style={{
                        width:"6px",height:"6px",borderRadius:"50%",
                        background:st.dot,display:"inline-block",flexShrink:0,
                      }}/>
                      {st.label}
                    </div>
                  </div>

                  <div className="pd-divider"/>

                  {/* Info rows */}
                  <div className="pd-info-row">
                    <span>📅</span>
                    <span>{fmtDate(booking?.scheduledTime)}</span>
                  </div>
                  <div className="pd-info-row" style={{marginBottom:".8rem"}}>
                    <span>💳</span>
                    <span style={{
                      color: booking.paymentStatus==="paid" ? "#10b981" : "#f59e0b",
                      fontWeight:600, textTransform:"capitalize",
                    }}>
                      {booking.paymentStatus||"pending"}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="pd-info-box">
                    <div className="pd-info-box-label">📍 Address</div>
                    <div className="pd-info-box-val">
                      {booking?.address ||
                        <span style={{color:"#475569",fontStyle:"italic"}}>Not provided</span>}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="pd-info-box">
                    <div className="pd-info-box-label">📝 Customer Note</div>
                    <div className="pd-info-box-val"
                      style={{color:booking?.note?"#cbd5e1":"#475569",fontStyle:booking?.note?"normal":"italic"}}
                    >
                      {booking?.note||"No additional notes"}
                    </div>
                  </div>

                  {/* ── Action buttons ── */}
                  {booking.status==="requested" && (
                    <button
                      className="pd-btn pd-btn-accept"
                      onClick={()=>acceptBooking(booking._id)}
                      disabled={isAccepting}
                    >
                      {isAccepting ? <BtnSpinner label="Accepting…"/> : "✓ Accept Booking"}
                    </button>
                  )}

                  {booking.status==="accepted" && (
                    <>
                      <div
                        className="pd-status-info"
                        style={{background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.2)",color:"#6ee7b7"}}
                      >
                        ✅ Booking Accepted — Arrive on time!
                      </div>
                      <button
                        className="pd-btn pd-btn-progress"
                        onClick={()=>updateStatus(booking._id,"in_progress")}
                        disabled={isUpdatingIP}
                      >
                        {isUpdatingIP ? <BtnSpinner label="Updating…"/> : "🔨 Mark as In Progress"}
                      </button>
                    </>
                  )}

                  {booking.status==="in_progress" && (
                    <>
                      <div
                        className="pd-status-info"
                        style={{background:"rgba(139,92,246,.07)",border:"1px solid rgba(139,92,246,.22)",color:"#c4b5fd"}}
                      >
                        🔨 Work In Progress…
                      </div>
                      <button
                        className="pd-btn pd-btn-complete"
                        onClick={()=>updateStatus(booking._id,"completed")}
                        disabled={isUpdatingC}
                      >
                        {isUpdatingC ? <BtnSpinner label="Completing…"/> : "🏆 Mark as Completed"}
                      </button>
                    </>
                  )}

                  {booking.status==="completed" && (
                    <div
                      className="pd-status-info"
                      style={{background:"rgba(6,182,212,.06)",border:"1px solid rgba(6,182,212,.2)",color:"#67e8f9"}}
                    >
                      🏆 Job Completed
                    </div>
                  )}

                  {booking.status==="cancelled" && (
                    <div
                      className="pd-status-info"
                      style={{background:"rgba(244,63,94,.06)",border:"1px solid rgba(244,63,94,.2)",color:"#fda4af"}}
                    >
                      ✖️ Booking Cancelled
                    </div>
                  )}
                </div>
              );
            })}

          </div>{/* .pd-grid */}
        </div>{/* .pd-section */}
      </div>{/* .pd-root */}
    </>
  );
}