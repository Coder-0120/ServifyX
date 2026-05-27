// ProviderDashboard.jsx — restyled to match ServifyX theme
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; overflow-x: hidden; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.88)} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{left:-100%} 100%{left:110%} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes cardIn  { from{opacity:0;transform:translateY(20px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }

  /* ── Navbar ── */
  .pd-nav {
    position: sticky; top: 0; z-index: 200;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem;
    background: rgba(10,15,30,.92); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,.15);
    box-shadow: 0 4px 32px rgba(0,0,0,.4);
  }
  .pd-logo {
    font-size: 1.5rem; font-weight: 900; letter-spacing: -.03em; cursor: pointer;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pd-nav-right { display: flex; align-items: center; gap: .75rem; }
  .pd-user-chip {
    display: flex; align-items: center; gap: .5rem;
    padding: .38rem .9rem; border-radius: 100px;
    background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.25);
    color: #c7d2fe; font-size: .84rem; font-weight: 600;
  }
  .pd-logout {
    padding: .42rem 1.1rem; border-radius: 10px; border: 1.5px solid rgba(239,68,68,.35);
    background: rgba(239,68,68,.08); color: #fca5a5;
    font-size: .84rem; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif;
    transition: all .2s;
  }
  .pd-logout:hover { background: rgba(239,68,68,.18); border-color: rgba(239,68,68,.55); }

  /* ── Hero ── */
  .pd-hero {
    padding: 3rem 2rem 2rem; text-align: center; position: relative; overflow: hidden;
    background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,.15) 0%, transparent 65%);
  }
  .pd-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .pd-badge {
    display: inline-flex; align-items: center; gap: .45rem;
    padding: .28rem .95rem; border-radius: 100px; margin-bottom: 1rem;
    background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.28);
    color: #a5b4fc; font-size: .74rem; font-weight: 700; letter-spacing: .05em;
    animation: fadeUp .4s ease both;
  }
  .pd-hero h1 {
    font-size: clamp(1.9rem,4vw,2.8rem); font-weight: 900; letter-spacing: -.03em;
    color: #f1f5f9; line-height: 1.1; margin-bottom: .55rem;
    animation: fadeUp .45s ease .08s both;
  }
  .pd-hero h1 span {
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pd-hero p { font-size: .95rem; color: #64748b; animation: fadeUp .45s ease .15s both; }

  /* ── Stats ── */
  .pd-stats {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
    gap: 1.2rem; padding: 2rem 2rem 0; max-width: 1200px; margin: 0 auto;
  }
  .pd-stat {
    padding: 1.5rem 1.6rem; border-radius: 18px;
    background: rgba(15,23,42,.75); border: 1px solid rgba(99,102,241,.15);
    display: flex; align-items: center; gap: 1rem;
    animation: fadeUp .5s ease both;
    transition: transform .3s, box-shadow .3s, border-color .3s;
  }
  .pd-stat:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(99,102,241,.12); border-color: rgba(99,102,241,.3); }
  .pd-stat-icon {
    width: 48px; height: 48px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  }
  .pd-stat-num { font-size: 1.7rem; font-weight: 900; letter-spacing: -.02em; line-height: 1; }
  .pd-stat-lbl { font-size: .78rem; color: #64748b; font-weight: 500; margin-top: 3px; }

  /* ── Section ── */
  .pd-section { max-width: 1200px; margin: 0 auto; padding: 2rem 2rem 4rem; }
  .pd-section-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem; flex-wrap: wrap; gap: .75rem;
  }
  .pd-section-title { font-size: 1.25rem; font-weight: 800; color: #f1f5f9; letter-spacing: -.02em; }
  .pd-section-count { font-size: .82rem; color: #64748b; font-weight: 500; }

  /* ── Refresh button ── */
  .pd-refresh {
    padding: .4rem 1rem; border-radius: 10px;
    border: 1.5px solid rgba(99,102,241,.3); background: rgba(99,102,241,.07);
    color: #a5b4fc; font-size: .82rem; font-weight: 600; cursor: pointer;
    font-family: 'Poppins',sans-serif; transition: all .2s;
    display: flex; align-items: center; gap: .4rem;
  }
  .pd-refresh:hover { background: rgba(99,102,241,.14); border-color: rgba(99,102,241,.5); }

  /* ── Grid ── */
  .pd-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(310px,1fr)); gap: 1.3rem;
  }

  /* ── Booking card ── */
  .pd-card {
    border-radius: 20px; background: rgba(15,23,42,.8);
    border: 1px solid rgba(99,102,241,.14); padding: 1.5rem;
    position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s, border-color .3s;
    animation: cardIn .5s ease both;
  }
  .pd-card:hover { transform: translateY(-5px); }
  .pd-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0; }

  .pd-card-top { display: flex; gap: .85rem; align-items: center; margin-bottom: 1rem; }
  .pd-card-icon {
    width: 50px; height: 50px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
  }
  .pd-service-name { font-size: 1rem; font-weight: 800; color: #f1f5f9; margin-bottom: 2px; }
  .pd-customer     { font-size: .8rem; color: #94a3b8; font-weight: 500; }

  .pd-divider { height: 1px; background: rgba(99,102,241,.1); margin: .85rem 0; }

  .pd-info-row { display: flex; align-items: center; gap: .5rem; margin-bottom: .4rem; font-size: .83rem; color: #94a3b8; }
  .pd-info-row span { font-weight: 500; }

  .pd-status-badge {
    display: inline-flex; align-items: center; gap: .35rem;
    padding: .22rem .75rem; border-radius: 100px;
    font-size: .75rem; font-weight: 700; letter-spacing: .03em;
  }

  /* ── Accept button ── */
  .pd-accept-btn {
    width: 100%; margin-top: 1.1rem; padding: .75rem; border-radius: 12px; border: none;
    background: linear-gradient(135deg,#10b981,#06b6d4); color: #fff;
    font-size: .9rem; font-weight: 700; font-family: 'Poppins',sans-serif;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 20px rgba(16,185,129,.35); transition: transform .25s, box-shadow .25s;
  }
  .pd-accept-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); }
  .pd-accept-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(16,185,129,.5); }
  .pd-accept-btn:hover::after { animation: shimmer .65s ease forwards; }
  .pd-accept-btn:active { transform: translateY(0); }
  .pd-accept-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  /* ── States ── */
  .pd-state { display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 5rem 2rem; text-align: center; gap: 1rem; grid-column: 1 / -1; }
  .pd-spinner { width: 44px; height: 44px; border: 3px solid rgba(99,102,241,.2);
    border-top-color: #6366f1; border-radius: 50%; animation: spin .9s linear infinite; }

  /* ── Responsive ── */
  @media(max-width:640px) {
    .pd-stats  { grid-template-columns: 1fr 1fr; gap: .9rem; padding: 1.5rem 1.25rem 0; }
    .pd-section { padding: 1.5rem 1.25rem 3rem; }
    .pd-hero   { padding: 2rem 1.25rem 1.5rem; }
    .pd-nav    { padding: 0 1.25rem; }
    .pd-user-chip-label { display: none; }
  }
  @media(max-width:400px) {
    .pd-stats { grid-template-columns: 1fr; }
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
const SERVICE_META = {
  electrician     : { emoji:"⚡", color:"#f59e0b" },
  plumber         : { emoji:"🔧", color:"#3b82f6" },
  carpenter       : { emoji:"🪚", color:"#8b5cf6" },
  "ac repair"     : { emoji:"❄️", color:"#06b6d4" },
  "deep cleaning" : { emoji:"🧹", color:"#10b981" },
  painter         : { emoji:"🎨", color:"#f43f5e" },
  default         : { emoji:"🏠", color:"#6366f1" },
};
const getMeta = (name = "") => SERVICE_META[(name || "").toLowerCase()] || SERVICE_META.default;

const STATUS_STYLE = {
  requested  : { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.25)",  dot:"#f59e0b", label:"Requested"   },
  accepted   : { color:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.25)",  dot:"#10b981", label:"Accepted"    },
  inprogress : { color:"#6366f1", bg:"rgba(99,102,241,.1)",  border:"rgba(99,102,241,.25)",  dot:"#6366f1", label:"In Progress" },
  completed  : { color:"#06b6d4", bg:"rgba(6,182,212,.1)",   border:"rgba(6,182,212,.25)",   dot:"#06b6d4", label:"Completed"   },
};
const getStatus = (s = "") => STATUS_STYLE[(s || "").toLowerCase().replace(" ","")] || { color:"#94a3b8", bg:"rgba(148,163,184,.1)", border:"rgba(148,163,184,.2)", dot:"#94a3b8", label: s };

const fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) : "No date";

// ─────────────────────────────────────────────────────────────────────────────
export default function ProviderDashboard() {
  const navigate = useNavigate();

  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [accepting, setAccepting] = useState(null); // bookingId being accepted

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();
  const token = localStorage.getItem("token");

  // ── Fetch bookings ──────────────────────────────────────────────────────
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/booking/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Auth + profile check ────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (!token) { navigate("/login"); return; }
      try {
        await axios.get("http://localhost:5000/api/provider/my-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBookings();
      } catch {
        navigate("/create-provider-profile");
      }
    };
    init();
  }, []);

  // ── Accept booking ──────────────────────────────────────────────────────
  const acceptBooking = async (bookingId) => {
    setAccepting(bookingId);
    try {
      await axios.patch(`http://localhost:5000/api/booking/accept/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept booking");
    } finally {
      setAccepting(null);
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const total     = bookings.length;
  const pending   = bookings.filter(b => b.status === "requested").length;
  const accepted  = bookings.filter(b => b.status === "accepted").length;
  const completed = bookings.filter(b => b.status === "completed").length;

  const STATS = [
    { icon:"📋", emoji:"📋", num:total,     label:"Total Requests", color:"#6366f1", delay:".05s" },
    { icon:"⏳", emoji:"⏳", num:pending,   label:"Pending",        color:"#f59e0b", delay:".1s"  },
    { icon:"✅", emoji:"✅", num:accepted,  label:"Accepted",       color:"#10b981", delay:".15s" },
    { icon:"🏆", emoji:"🏆", num:completed, label:"Completed",      color:"#06b6d4", delay:".2s"  },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* ── Navbar ── */}
      <nav className="pd-nav">
        <div className="pd-logo" onClick={() => navigate("/")}>ServifyX</div>
        <div className="pd-nav-right">
          <div className="pd-user-chip">
            <span>🔧</span>
            <span className="pd-user-chip-label">{user?.name || "Provider"}</span>
          </div>
          <button className="pd-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="pd-hero">
        <div className="pd-hero-grid"/>
        <div style={{position:"relative",zIndex:1}}>
          <div className="pd-badge">
            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#10b981",display:"inline-block",animation:"pulse 2s infinite",boxShadow:"0 0 8px #10b98180"}}/>
            LIVE DASHBOARD
          </div>
          <h1>Provider <span>Dashboard</span></h1>
          <p>Manage all your incoming service requests in real time</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="pd-stats">
        {STATS.map(({ emoji, num, label, color, delay }) => (
          <div className="pd-stat" key={label} style={{animationDelay:delay,borderColor:`${color}18`}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}38`;e.currentTarget.style.boxShadow=`0 12px 36px ${color}14`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${color}18`;e.currentTarget.style.boxShadow="none";}}>
            <div className="pd-stat-icon" style={{background:`${color}15`,border:`1px solid ${color}28`}}>{emoji}</div>
            <div>
              <div className="pd-stat-num" style={{color}}>{num}</div>
              <div className="pd-stat-lbl">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bookings ── */}
      <div className="pd-section">
        <div className="pd-section-head">
          <div>
            <div className="pd-section-title">Incoming Requests</div>
            {!loading && <div className="pd-section-count">{total} booking{total !== 1 ? "s" : ""} found</div>}
          </div>
          <button className="pd-refresh" onClick={fetchBookings}>
            <span style={{display:"inline-block", animation: loading ? "spin .9s linear infinite" : "none"}}>↻</span>
            Refresh
          </button>
        </div>

        <div className="pd-grid">
          {/* Loading */}
          {loading && (
            <div className="pd-state">
              <div className="pd-spinner"/>
              <p style={{color:"#64748b",fontSize:".95rem"}}>Fetching your bookings…</p>
            </div>
          )}

          {/* Empty */}
          {!loading && bookings.length === 0 && (
            <div className="pd-state">
              <div style={{fontSize:"2.8rem"}}>📭</div>
              <p style={{color:"#f1f5f9",fontWeight:700,fontSize:"1.05rem"}}>No bookings yet</p>
              <p style={{color:"#64748b",fontSize:".9rem"}}>New requests will appear here when customers book your service.</p>
            </div>
          )}

          {/* Cards */}
          {!loading && bookings.map((booking, i) => {
            const { emoji, color } = getMeta(booking?.serviceId?.name);
            const st = getStatus(booking.status);

            return (
              <div
                key={booking._id}
                className="pd-card"
                style={{animationDelay:`${i * 0.06}s`, borderColor:`${color}18`}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 20px 48px ${color}18`;e.currentTarget.style.borderColor=`${color}38`;}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=`${color}18`;}}
              >
                {/* Accent top bar */}
                <div className="pd-card-bar" style={{background:`linear-gradient(90deg,${color},${color}55)`}}/>

                {/* Top row */}
                <div className="pd-card-top">
                  <div className="pd-card-icon" style={{background:`${color}15`,border:`1px solid ${color}28`}}>
                    {emoji}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="pd-service-name">{booking?.serviceId?.name || "Service"}</div>
                    <div className="pd-customer">👤 {booking?.userId?.name || "Customer"}</div>
                  </div>
                  {/* Status badge */}
                  <div className="pd-status-badge" style={{background:st.bg, border:`1px solid ${st.border}`, color:st.color}}>
                    <span style={{width:"6px",height:"6px",borderRadius:"50%",background:st.dot,display:"inline-block",flexShrink:0}}/>
                    {st.label}
                  </div>
                </div>

                <div className="pd-divider"/>

                {/* Info */}
                <div className="pd-info-row">
                  <span>📅</span>
                  <span>{fmtDate(booking?.scheduledTime)}</span>
                </div>
                <div className="pd-info-row">
                  <span>💳</span>
                  <span style={{color: booking.paymentStatus === "paid" ? "#10b981" : "#f59e0b", fontWeight:600, textTransform:"capitalize"}}>
                    {booking.paymentStatus || "pending"}
                  </span>
                </div>

                {/* Accept button */}
                {booking.status === "requested" && (
                  <button
                    className="pd-accept-btn"
                    onClick={() => acceptBooking(booking._id)}
                    disabled={accepting === booking._id}
                  >
                    {accepting === booking._id ? (
                      <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem"}}>
                        <span style={{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite"}}/>
                        Accepting…
                      </span>
                    ) : "✓ Accept Booking"}
                  </button>
                )}

                {booking.status === "accepted" && (
                  <div style={{marginTop:"1rem",padding:".65rem 1rem",borderRadius:"10px",background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.22)",fontSize:".82rem",color:"#6ee7b7",fontWeight:600,textAlign:"center"}}>
                    ✅ Booking Accepted — Arrive on time!
                  </div>
                )}

                {booking.status === "completed" && (
                  <div style={{marginTop:"1rem",padding:".65rem 1rem",borderRadius:"10px",background:"rgba(6,182,212,.07)",border:"1px solid rgba(6,182,212,.22)",fontSize:".82rem",color:"#67e8f9",fontWeight:600,textAlign:"center"}}>
                    🏆 Job Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}