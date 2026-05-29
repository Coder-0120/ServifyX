// ProviderDashboard.jsx — ServifyX
// UI perfectly synced with TrackProviderBookings.jsx
// Same navbar height, fonts, spacing, bg layers, heading style throughout.

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ─── Shared CSS — identical keyframes + utility classes to TrackProviderBookings ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Poppins', sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── keyframes — exact copy from TrackProviderBookings ── */
@keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes cardIn  { from{opacity:0;transform:translateY(20px) scale(.985)} to{opacity:1;transform:none} }
@keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
@keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes shimmer { 0%{left:-100%} 100%{left:110%} }

/* ── card hover — same as TrackProviderBookings .card-hover ── */
.pd-card {
  transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
  border-radius: 20px;
  background: rgba(15,23,42,.75);
  border: 1px solid rgba(99,102,241,.13);
  padding: 1.5rem; position: relative; overflow: hidden;
  animation: cardIn .5s ease both;
}
.pd-card:hover { transform: translateY(-5px) scale(1.01); }
.pd-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0; }
.pd-card::before {
  content:''; position:absolute; top:-40px; right:-40px;
  width:120px; height:120px; border-radius:50%; pointer-events:none; opacity:.06;
}
.pd-card-top { display: flex; gap: .85rem; align-items: flex-start; margin-bottom: 1rem; }
.pd-card-icon { width:50px; height:50px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.5rem; }
.pd-service-name { font-size:1rem; font-weight:800; color:#f1f5f9; margin-bottom:2px; letter-spacing:-.015em; }
.pd-customer     { font-size:.8rem; color:#94a3b8; font-weight:500; }
.pd-status-badge { display:inline-flex; align-items:center; gap:.32rem; padding:.2rem .7rem; border-radius:100px; font-size:.73rem; font-weight:700; letter-spacing:.03em; flex-shrink:0; margin-left:auto; }
.pd-divider      { height:1px; background:rgba(99,102,241,.09); margin:.9rem 0; }
.pd-info-row     { display:flex; align-items:center; gap:.48rem; margin-bottom:.38rem; font-size:.82rem; color:#94a3b8; }
.pd-info-row span{ font-weight:500; }
.pd-info-box     { padding:.68rem .88rem; border-radius:11px; background:rgba(99,102,241,.04); border:1px solid rgba(99,102,241,.1); margin-bottom:.5rem; }
.pd-info-box-label{ font-size:.67rem; font-weight:700; color:#475569; letter-spacing:.05em; text-transform:uppercase; margin-bottom:.2rem; }
.pd-info-box-val { font-size:.82rem; color:#cbd5e1; font-weight:500; line-height:1.5; }

/* ── stat cards ── */
.pd-stat {
  padding:1.2rem 1.25rem; border-radius:16px;
  background:rgba(15,23,42,.75); backdropFilter:blur(14px);
  display:flex; align-items:center; gap:.9rem;
  animation:fadeUp .5s ease both;
  transition:transform .3s, box-shadow .3s, border-color .3s;
  position:relative; overflow:hidden;
}
.pd-stat::before {
  content:''; position:absolute; inset:0; border-radius:16px;
  background:linear-gradient(135deg,rgba(99,102,241,.03) 0%,transparent 60%);
  pointer-events:none;
}
.pd-stat:hover { transform:translateY(-3px); }
.pd-stat-icon { width:46px; height:46px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
.pd-stat-num  { font-size:1.7rem; font-weight:900; letter-spacing:-.025em; line-height:1; }
.pd-stat-lbl  { font-size:.73rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:.05em; margin-top:3px; }

/* ── filter tabs ── */
.pd-filters { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1.5rem; }
.pd-filter-tab {
  padding:.36rem .95rem; border-radius:100px;
  border:1.5px solid rgba(99,102,241,.18);
  background:rgba(99,102,241,.04); color:#94a3b8;
  font-size:.81rem; font-weight:600; cursor:pointer;
  font-family:'Poppins',sans-serif; transition:all .22s;
  display:flex; align-items:center; gap:.38rem;
}
.pd-filter-tab:hover { border-color:rgba(99,102,241,.4); color:#c7d2fe; background:rgba(99,102,241,.09); }
.pd-filter-tab.active { border-color:#6366f1; background:rgba(99,102,241,.16); color:#a5b4fc; box-shadow:0 0 0 3px rgba(99,102,241,.1); }
.pd-filter-count { padding:.08rem .42rem; border-radius:100px; font-size:.69rem; font-weight:800; min-width:18px; text-align:center; }

/* ── action buttons ── */
.pd-btn {
  width:100%; padding:.75rem; border-radius:12px; border:none;
  font-size:.88rem; font-weight:700; font-family:'Poppins',sans-serif;
  cursor:pointer; position:relative; overflow:hidden;
  transition:transform .25s, box-shadow .25s;
  display:flex; align-items:center; justify-content:center; gap:.5rem;
}
.pd-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent); }
.pd-btn:hover { transform:translateY(-2px); }
.pd-btn:hover::after { animation:shimmer .6s ease forwards; }
.pd-btn:active  { transform:translateY(0); }
.pd-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
.pd-btn:disabled::after { display:none; }
.pd-btn-accept   { background:linear-gradient(135deg,#10b981,#06b6d4); box-shadow:0 4px 18px rgba(16,185,129,.32); margin-top:1rem; }
.pd-btn-accept:hover   { box-shadow:0 8px 26px rgba(16,185,129,.52); }
.pd-btn-progress { background:linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow:0 4px 18px rgba(99,102,241,.32); margin-top:1rem; }
.pd-btn-progress:hover { box-shadow:0 8px 26px rgba(99,102,241,.52); }
.pd-btn-complete { background:linear-gradient(135deg,#f59e0b,#f97316); box-shadow:0 4px 18px rgba(245,158,11,.32); margin-top:.6rem; }
.pd-btn-complete:hover { box-shadow:0 8px 26px rgba(245,158,11,.52); }

/* ── status banners ── */
.pd-status-info { margin-top:1rem; padding:.65rem 1rem; border-radius:11px; font-size:.82rem; font-weight:600; text-align:center; }

/* ── loading state ── */
.pd-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5rem 2rem; text-align:center; gap:1rem; grid-column:1/-1; }
.pd-spinner { width:42px; height:42px; border:3px solid rgba(99,102,241,.18); border-top-color:#6366f1; border-radius:50%; animation:spin .85s linear infinite; }

/* ── skeleton — same as TrackProviderBookings ── */
.skeleton { background:linear-gradient(90deg,#1e293b 25%,#273348 50%,#1e293b 75%); background-size:400px 100%; animation:shimmer-sk 1.4s infinite; border-radius:12px; }
@keyframes shimmer-sk { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

/* ── responsive ── */
@media(max-width:1100px){ .pd-stats-grid { grid-template-columns:repeat(3,1fr) !important; } }
@media(max-width:640px){
  .pd-stats-grid { grid-template-columns:1fr 1fr !important; gap:.85rem !important; }
  .pd-grid       { grid-template-columns:1fr !important; }
  .pd-nav-label  { display:none; }
}
@media(max-width:420px){ .pd-stats-grid { grid-template-columns:1fr !important; } }
`;

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const SERVICE_META = {
  electrician       : { emoji:"⚡", color:"#f59e0b" },
  plumber           : { emoji:"🔧", color:"#3b82f6" },
  carpenter         : { emoji:"🪚", color:"#8b5cf6" },
  "ac repair"       : { emoji:"❄️", color:"#06b6d4" },
  "deep cleaning"   : { emoji:"🧹", color:"#10b981" },
  cleaning          : { emoji:"🧹", color:"#10b981" },
  painter           : { emoji:"🎨", color:"#f43f5e" },
  painting          : { emoji:"🎨", color:"#f43f5e" },
  "appliance repair": { emoji:"🔌", color:"#a78bfa" },
  "pest control"    : { emoji:"🐛", color:"#84cc16" },
};
const getMeta = (n="") =>
  SERVICE_META[(n||"").toLowerCase().trim()] || { emoji:"🏠", color:"#6366f1" };

const STATUS_CFG = {
  requested   : { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.25)",  dot:"#f59e0b", label:"Requested"   },
  accepted    : { color:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.25)",  dot:"#10b981", label:"Accepted"    },
  in_progress : { color:"#8b5cf6", bg:"rgba(139,92,246,.1)",  border:"rgba(139,92,246,.25)",  dot:"#8b5cf6", label:"In Progress" },
  completed   : { color:"#06b6d4", bg:"rgba(6,182,212,.1)",   border:"rgba(6,182,212,.25)",   dot:"#06b6d4", label:"Completed"   },
  cancelled   : { color:"#ef4444", bg:"rgba(239,68,68,.1)",   border:"rgba(239,68,68,.25)",   dot:"#ef4444", label:"Cancelled"   },
};
const getStatus = (s="") =>
  STATUS_CFG[(s||"").toLowerCase().replace(/[\s-]/g,"_")] ||
  { color:"#94a3b8", bg:"rgba(148,163,184,.1)", border:"rgba(148,163,184,.2)", dot:"#94a3b8", label:s };

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) : "—";

/* ─── BtnSpinner ───────────────────────────────────────────────────────────── */
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

  /* fetch */
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

  /* mount */
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

  /* accept */
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

  /* status update */
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

  /* logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  /* derived counts */
  const total      = bookings.length;
  const pending    = bookings.filter(b=>b.status==="requested").length;
  const accepted   = bookings.filter(b=>b.status==="accepted").length;
  const inprogress = bookings.filter(b=>b.status==="in_progress").length;
  const completed  = bookings.filter(b=>b.status==="completed").length;
  const cancelled  = bookings.filter(b=>b.status==="cancelled").length;

  const STATS = [
    { emoji:"📋", num:total,      label:"Total",       color:"#6366f1", delay:".04s" },
    { emoji:"⏳", num:pending,    label:"Pending",     color:"#f59e0b", delay:".08s" },
    { emoji:"✅", num:accepted,   label:"Accepted",    color:"#10b981", delay:".12s" },
    { emoji:"⚙️", num:inprogress, label:"In Progress", color:"#8b5cf6", delay:".16s" },
    { emoji:"🏆", num:completed,  label:"Completed",   color:"#06b6d4", delay:".20s" },
    { emoji:"✖️", num:cancelled,  label:"Cancelled",   color:"#ef4444", delay:".24s" },
  ];

  const TABS = [
    { key:"all",         label:"All",         color:"#6366f1", count:total      },
    { key:"requested",   label:"Requested",   color:"#f59e0b", count:pending    },
    { key:"accepted",    label:"Accepted",    color:"#10b981", count:accepted   },
    { key:"in_progress", label:"In Progress", color:"#8b5cf6", count:inprogress },
    { key:"completed",   label:"Completed",   color:"#06b6d4", count:completed  },
    { key:"cancelled",   label:"Cancelled",   color:"#ef4444", count:cancelled  },
  ];

  const visible = activeFilter==="all"
    ? bookings
    : bookings.filter(b=>b.status===activeFilter);

  /* ── render ── */
  return (
    <>
      <style>{CSS}</style>

      {/* ── Page wrapper — same as TrackProviderBookings ── */}
      <div style={{minHeight:"100vh", background:"#0f172a", fontFamily:"'Poppins',sans-serif", position:"relative", overflowX:"hidden"}}>

        {/* grid lines */}
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(99,102,241,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.028) 1px,transparent 1px)",backgroundSize:"52px 52px"}}/>

        {/* dual radial */}
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse 70% 40% at 50% -5%,rgba(99,102,241,.1) 0%,transparent 65%),radial-gradient(ellipse 40% 30% at 90% 80%,rgba(6,182,212,.06) 0%,transparent 60%)"}}/>

        {/* top-center bloom */}
        <div style={{position:"fixed",top:0,left:0,right:0,height:"420px",zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse 85% 55% at 50% -8%,rgba(99,102,241,.18) 0%,rgba(6,182,212,.06) 45%,transparent 70%)"}}/>

        {/* ── Navbar — exact match to TrackProviderBookings ── */}
        <nav style={{
          position:"sticky", top:0, zIndex:50, height:"66px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 2rem",
          backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          background:"rgba(15,23,42,.92)",
          borderBottom:"1px solid rgba(99,102,241,.15)",
          boxShadow:"0 4px 32px rgba(0,0,0,.3)",
        }}>
          {/* Logo */}
          <div onClick={()=>navigate("/")} style={{fontSize:"1.5rem",fontWeight:900,letterSpacing:"-.03em",cursor:"pointer",userSelect:"none",background:"linear-gradient(135deg,#6366f1,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
            ServifyX
          </div>

          {/* Centre badge */}
          <div style={{display:"flex",alignItems:"center",gap:".55rem",padding:".32rem 1rem",borderRadius:"100px",background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)"}}>
            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#10b981",display:"inline-block",animation:"pulse 2s infinite",boxShadow:"0 0 8px rgba(16,185,129,.55)"}}/>
            <span className="pd-nav-label" style={{color:"#a5b4fc",fontSize:".8rem",fontWeight:700,letterSpacing:".04em"}}>
              PROVIDER DASHBOARD
            </span>
          </div>

          {/* Right: logout */}
          <button
            onClick={handleLogout}
            style={{display:"flex",alignItems:"center",gap:".4rem",padding:".42rem 1rem",borderRadius:"10px",border:"1.5px solid rgba(239,68,68,.3)",background:"rgba(239,68,68,.07)",color:"#fca5a5",fontSize:".82rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .25s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,.16)";e.currentTarget.style.borderColor="rgba(239,68,68,.52)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,.07)";e.currentTarget.style.borderColor="rgba(239,68,68,.3)";}}
          >Logout</button>
        </nav>

        {/* ── Content — same maxWidth/padding as TrackProviderBookings ── */}
        <div style={{position:"relative",zIndex:1,maxWidth:"1200px",margin:"0 auto",padding:"2.5rem 2rem 4rem"}}>

          {/* ── Page heading — pixel-identical to TrackProviderBookings ── */}
          <div style={{marginBottom:"2.5rem",animation:"fadeUp .6s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:".5rem",padding:".28rem .95rem",borderRadius:"100px",marginBottom:"1rem",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.28)",color:"#a5b4fc",fontSize:".76rem",fontWeight:700,letterSpacing:".06em"}}>
              PROVIDER DASHBOARD
            </div>

            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
              <div>
                <h1 style={{fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:900,letterSpacing:"-.03em",color:"#f1f5f9",lineHeight:1.1,marginBottom:".5rem"}}>
                  Manage Incoming{" "}
                  <span style={{background:"linear-gradient(135deg,#6366f1,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                    Requests
                  </span>
                </h1>
                <p style={{color:"#64748b",fontSize:".9rem",margin:0}}>
                  Accept jobs, update progress, and track all your bookings in real time.
                </p>
              </div>

              {/* Refresh — gradient, same as TrackProviderBookings */}
              <button
                onClick={fetchBookings}
                style={{display:"flex",alignItems:"center",gap:".5rem",padding:".65rem 1.5rem",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#6366f1,#06b6d4)",color:"#fff",fontSize:".85rem",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",transition:"all .3s",boxShadow:"0 4px 20px rgba(99,102,241,.35)",opacity:loading?.7:1,flexShrink:0}}
                onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(99,102,241,.5)";}}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,.35)";}}
              >
                <span style={{display:"inline-block",animation:loading?"spin .8s linear infinite":"none",fontSize:".9rem"}}>↻</span>
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* ── Stat cards — same layout as TrackProviderBookings ── */}
          <div className="pd-stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"1rem",marginBottom:"2.5rem",animation:"fadeUp .6s ease .1s both"}}>
            {STATS.map(({emoji,num,label,color,delay})=>(
              <div
                key={label}
                className="pd-stat"
                style={{border:`1px solid ${color}20`, animationDelay:delay}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 12px 32px ${color}18`;e.currentTarget.style.borderColor=`${color}38`;}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=`${color}20`;}}
              >
                <div className="pd-stat-icon" style={{background:`${color}14`,border:`1px solid ${color}26`}}>{emoji}</div>
                <div>
                  <div className="pd-stat-num" style={{color}}>{num}</div>
                  <div className="pd-stat-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Section head ── */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.4rem",flexWrap:"wrap",gap:".75rem"}}>
            <div>
              <div style={{fontSize:"1.2rem",fontWeight:800,color:"#f1f5f9",letterSpacing:"-.02em"}}>Incoming Requests</div>
              {!loading && (
                <div style={{fontSize:".8rem",color:"#64748b",fontWeight:500,marginTop:"2px"}}>
                  {visible.length} booking{visible.length!==1?"s":""}
                  {activeFilter!=="all"?` · ${activeFilter}`:""}
                </div>
              )}
            </div>
          </div>

          {/* ── Filter tabs ── */}
          <div className="pd-filters">
            {TABS.map(({key,label,color,count})=>(
              <button
                key={key}
                className={`pd-filter-tab${activeFilter===key?" active":""}`}
                style={activeFilter===key?{borderColor:color,background:`${color}16`,color,boxShadow:`0 0 0 3px ${color}12`}:{}}
                onClick={()=>setActiveFilter(key)}
              >
                {label}
                <span className="pd-filter-count" style={{background:activeFilter===key?`${color}22`:"rgba(99,102,241,.08)",color:activeFilter===key?color:"#64748b"}}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* ── Card grid ── */}
          <div className="pd-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"22px"}}>

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
                  {activeFilter==="all"?"No bookings yet":`No ${activeFilter} bookings`}
                </p>
                <p style={{color:"#64748b",fontSize:".88rem",maxWidth:"340px"}}>
                  {activeFilter==="all"
                    ?"New requests will appear here when customers book your service."
                    :`You don't have any ${activeFilter} bookings right now.`}
                </p>
                {activeFilter!=="all" && (
                  <button onClick={()=>setActiveFilter("all")} style={{marginTop:".25rem",padding:".48rem 1.2rem",borderRadius:"10px",border:"1.5px solid rgba(99,102,241,.28)",background:"rgba(99,102,241,.07)",color:"#a5b4fc",fontSize:".83rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    View all bookings
                  </button>
                )}
              </div>
            )}

            {/* Booking cards */}
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
                  style={{animationDelay:`${i*.06}s`, borderColor:`${color}20`}}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 20px 52px rgba(0,0,0,.4),0 0 0 1px ${color}30,inset 0 1px 0 rgba(255,255,255,.04)`;e.currentTarget.style.borderColor=`${color}38`;}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=`${color}20`;}}
                >
                  <div className="pd-card-bar" style={{background:`linear-gradient(90deg,${color},${color}40)`}}/>

                  {/* booking ID chip — same as TrackProviderBookings */}
                  <div style={{position:"absolute",top:"18px",right:"18px",padding:".18rem .65rem",borderRadius:"100px",background:`${color}12`,border:`1px solid ${color}30`,color,fontSize:".68rem",fontWeight:700,letterSpacing:".04em"}}>
                    #{booking._id?.slice(-6).toUpperCase()||"------"}
                  </div>

                  <div className="pd-card-top" style={{paddingRight:"60px"}}>
                    <div className="pd-card-icon" style={{background:`linear-gradient(135deg,${color}cc,${color}66)`,boxShadow:`0 6px 20px ${color}30`}}>
                      {emoji}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="pd-service-name">{booking?.serviceId?.name||"Service"}</div>
                      <div className="pd-customer">👤 {booking?.userId?.name||"Customer"}</div>
                    </div>
                  </div>

                  {/* Status badge row */}
                  <div style={{marginBottom:".9rem"}}>
                    <div className="pd-status-badge" style={{background:st.bg,border:`1px solid ${st.border}`,color:st.color,marginLeft:0}}>
                      <span style={{width:"6px",height:"6px",borderRadius:"50%",background:st.dot,display:"inline-block",flexShrink:0}}/>
                      {st.label}
                    </div>
                  </div>

                  <div className="pd-divider"/>

                  {/* Info box — matches TrackProviderBookings card layout */}
                  <div style={{background:"rgba(99,102,241,.04)",borderRadius:"12px",padding:"14px 16px",marginBottom:"16px",border:"1px solid rgba(99,102,241,.08)"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
                      <div className="pd-info-row">
                        <span>📅</span>
                        <span>{fmtDate(booking?.scheduledTime)}</span>
                      </div>
                      <div className="pd-info-row">
                        <span>💳</span>
                        <span>Payment:</span>
                        <span style={{padding:".1rem .55rem",borderRadius:"8px",fontSize:".78rem",fontWeight:700,background:booking.paymentStatus==="paid"?"rgba(16,185,129,.12)":"rgba(245,158,11,.12)",color:booking.paymentStatus==="paid"?"#10b981":"#f59e0b",border:`1px solid ${booking.paymentStatus==="paid"?"rgba(16,185,129,.25)":"rgba(245,158,11,.25)"}`}}>
                          {booking.paymentStatus||"pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pd-info-box">
                    <div className="pd-info-box-label">📍 Address</div>
                    <div className="pd-info-box-val">{booking?.address||<span style={{color:"#475569",fontStyle:"italic"}}>Not provided</span>}</div>
                  </div>
                  <div className="pd-info-box">
                    <div className="pd-info-box-label">📝 Customer Note</div>
                    <div className="pd-info-box-val" style={{color:booking?.note?"#cbd5e1":"#475569",fontStyle:booking?.note?"normal":"italic"}}>
                      {booking?.note||"No additional notes"}
                    </div>
                  </div>

                  {/* Assigned label + action — matches TrackProviderBookings footer row */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"1rem",flexWrap:"wrap",gap:"8px"}}>
                    <span style={{color:"#94a3b8",fontSize:".85rem"}}>
                      {booking.providerId?"Assigned to you":"Open request"}
                    </span>
                  </div>

                  {/* Action buttons */}
                  {booking.status==="requested" && (
                    <button className="pd-btn pd-btn-accept" onClick={()=>acceptBooking(booking._id)} disabled={isAccepting}>
                      {isAccepting?<BtnSpinner label="Accepting…"/>:"✓ Accept Booking"}
                    </button>
                  )}
                  {booking.status==="accepted" && (
                    <>
                      <div className="pd-status-info" style={{background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.2)",color:"#6ee7b7"}}>✅ Booking Accepted — Arrive on time!</div>
                      <button className="pd-btn pd-btn-progress" onClick={()=>updateStatus(booking._id,"in_progress")} disabled={isUpdatingIP}>
                        {isUpdatingIP?<BtnSpinner label="Updating…"/>:"🔨 Mark as In Progress"}
                      </button>
                    </>
                  )}
                  {booking.status==="in_progress" && (
                    <>
                      <div className="pd-status-info" style={{background:"rgba(139,92,246,.07)",border:"1px solid rgba(139,92,246,.22)",color:"#c4b5fd"}}>🔨 Work In Progress…</div>
                      <button className="pd-btn pd-btn-complete" onClick={()=>updateStatus(booking._id,"completed")} disabled={isUpdatingC}>
                        {isUpdatingC?<BtnSpinner label="Completing…"/>:"🏆 Mark as Completed"}
                      </button>
                    </>
                  )}
                  {booking.status==="completed" && (
                    <div className="pd-status-info" style={{background:"rgba(6,182,212,.06)",border:"1px solid rgba(6,182,212,.2)",color:"#67e8f9"}}>🏆 Job Completed</div>
                  )}
                  {booking.status==="cancelled" && (
                    <div className="pd-status-info" style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",color:"#fca5a5"}}>✖️ Booking Cancelled</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}