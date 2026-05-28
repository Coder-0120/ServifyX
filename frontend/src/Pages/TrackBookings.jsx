import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ── Global CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; overflow-x: hidden; }

  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes btnShimmer { 0%{left:-100%} 100%{left:110%} }
  @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:.6} }

  .card-hover {
    transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease !important;
  }
  .card-hover:hover { transform: translateY(-5px) scale(1.01) !important; }

  .back-btn:hover {
    background: rgba(99,102,241,.18) !important;
    color: #c7d2fe !important;
  }
  .refresh-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,.5) !important;
  }
  .skeleton {
    background: linear-gradient(90deg, #1e293b 25%, #273348 50%, #1e293b 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 12px;
  }

  /* Cancel button */
  .cancel-btn {
    width: 100%;
    padding: .72rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(239,68,68,.35);
    background: rgba(239,68,68,.07);
    color: #fca5a5;
    font-size: .86rem;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all .25s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .45rem;
  }
  .cancel-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
  }
  .cancel-btn:hover:not(:disabled) {
    background: rgba(239,68,68,.15);
    border-color: rgba(239,68,68,.6);
    box-shadow: 0 6px 24px rgba(239,68,68,.25);
    transform: translateY(-2px);
  }
  .cancel-btn:hover:not(:disabled)::after { animation: btnShimmer .65s ease forwards; }
  .cancel-btn:disabled {
    opacity: .4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  .cancel-btn.cancelling {
    opacity: .7;
    cursor: not-allowed;
  }

  /* Stat card hover */
  .stat-card {
    transition: transform .25s, box-shadow .25s, border-color .25s;
  }
  .stat-card:hover {
    transform: translateY(-3px);
  }
`;

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_META = {
  requested:   { color: "#f59e0b", bg: "rgba(245,158,11,.1)",  border: "rgba(245,158,11,.25)",  icon: "🕐", label: "Requested"   },
  accepted:    { color: "#06b6d4", bg: "rgba(6,182,212,.1)",   border: "rgba(6,182,212,.25)",   icon: "✅", label: "Accepted"    },
  inprogress:  { color: "#8b5cf6", bg: "rgba(139,92,246,.1)",  border: "rgba(139,92,246,.25)",  icon: "⚙️", label: "In Progress" },
  "in-progress":{ color: "#8b5cf6", bg: "rgba(139,92,246,.1)", border: "rgba(139,92,246,.25)", icon: "⚙️", label: "In Progress" },
  completed:   { color: "#10b981", bg: "rgba(16,185,129,.1)",  border: "rgba(16,185,129,.25)",  icon: "🏆", label: "Completed"   },
  cancelled:   { color: "#ef4444", bg: "rgba(239,68,68,.1)",   border: "rgba(239,68,68,.25)",   icon: "✖️", label: "Cancelled"   },
};

const TIMELINE_STEPS = [
  { key: "requested",  label: "Requested",  emoji: "📋" },
  { key: "accepted",   label: "Accepted",   emoji: "✅" },
  { key: "inprogress", label: "In Progress",emoji: "⚙️" },
  { key: "completed",  label: "Completed",  emoji: "🏆" },
];

const STEP_ORDER = ["requested", "accepted", "inprogress", "in-progress", "completed"];
const getStepIndex = (status) => {
  const idx = STEP_ORDER.indexOf(status);
  // Map in-progress variants to same index
  if (status === "in-progress" || status === "inprogress") return 2;
  return idx === -1 ? 0 : idx;
};

// Returns ms until scheduled time
const msUntil = (scheduledTime) => new Date(scheduledTime).getTime() - Date.now();

// Can cancel if not already cancelled/completed AND scheduled time is >1hr away
const canCancel = (booking) => {
  if (booking.status === "cancelled" || booking.status === "completed") return false;
  return msUntil(booking.scheduledTime) > 60 * 60 * 1000;
};

// Human-readable reason why cancel is disabled
const cancelDisabledReason = (booking) => {
  if (booking.status === "cancelled") return "Already cancelled";
  if (booking.status === "completed") return "Job completed";
  if (msUntil(booking.scheduledTime) <= 0) return "Appointment passed";
  return "Within 1-hour window";
};

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(scheduledTime) {
  const [ms, setMs] = useState(() => msUntil(scheduledTime));
  useEffect(() => {
    const id = setInterval(() => setMs(msUntil(scheduledTime)), 30000);
    return () => clearInterval(id);
  }, [scheduledTime]);
  return ms;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: "rgba(15,23,42,.6)", borderRadius: "22px", padding: "28px",
      border: "1px solid rgba(99,102,241,.1)", backdropFilter: "blur(10px)",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
        <div className="skeleton" style={{ width: "60px", height: "60px", borderRadius: "16px", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: "18px", width: "60%", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "14px", width: "40%" }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: "14px", width: "80%", marginBottom: "10px" }} />
      <div className="skeleton" style={{ height: "14px", width: "55%", marginBottom: "10px" }} />
      <div className="skeleton" style={{ height: "14px", width: "65%", marginBottom: "24px" }} />
      <div style={{ display: "flex", gap: "8px" }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ flex: 1, height: "8px", borderRadius: "20px" }} />)}
      </div>
    </div>
  );
}

// ── Cancel button with countdown awareness ────────────────────────────────────
function CancelButton({ booking, onCancel, cancelling }) {
  const msLeft = useCountdown(booking.scheduledTime);
  const allowed = canCancel(booking) && msLeft > 60 * 60 * 1000;
  const isCancelling = cancelling === booking._id;

  // Format time left for tooltip/hint
  const formatTimeLeft = () => {
    if (msLeft <= 0) return "Past";
    const h = Math.floor(msLeft / 3600000);
    const m = Math.floor((msLeft % 3600000) / 60000);
    if (h > 48) return `${Math.floor(h / 24)}d left`;
    if (h > 0)  return `${h}h ${m}m left`;
    return `${m}m left`;
  };

  if (booking.status === "cancelled") {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
        padding: ".72rem 1rem", borderRadius: "12px",
        background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)",
        color: "#f87171", fontSize: ".84rem", fontWeight: 600,
      }}>
        ✖️ Booking Cancelled
      </div>
    );
  }

  if (booking.status === "completed") {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
        padding: ".72rem 1rem", borderRadius: "12px",
        background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.2)",
        color: "#6ee7b7", fontSize: ".84rem", fontWeight: 600,
      }}>
        🏆 Job Completed
      </div>
    );
  }

  return (
    <div>
      <button
        className={`cancel-btn${isCancelling ? " cancelling" : ""}`}
        onClick={() => allowed && !isCancelling && onCancel(booking._id)}
        disabled={!allowed || isCancelling}
        title={!allowed ? cancelDisabledReason(booking) : "Cancel this booking"}
      >
        {isCancelling ? (
          <>
            <span style={{ width: "14px", height: "14px", border: "2px solid rgba(252,165,165,.3)", borderTopColor: "#fca5a5", borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
            Cancelling…
          </>
        ) : (
          <>✕ Cancel Booking</>
        )}
      </button>

      {/* Time hint below button */}
      <div style={{
        marginTop: ".55rem",
        display: "flex", alignItems: "center", justifyContent: "center", gap: ".35rem",
        fontSize: ".7rem", fontWeight: 600,
        color: allowed ? "#64748b" : "#475569",
      }}>
        {allowed ? (
          <>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "timerPulse 2s infinite" }} />
            <span style={{ color: "#10b981" }}>Free cancellation</span>
            <span style={{ color: "#475569" }}>·</span>
            <span>{formatTimeLeft()} to cancel</span>
          </>
        ) : (
          <>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ color: "#ef4444" }}>{cancelDisabledReason(booking)}</span>
            {msLeft > 0 && msLeft <= 3600000 && (
              <><span>·</span><span>{formatTimeLeft()}</span></>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Booking card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, index, onCancel, cancelling }) {
  const status = booking.status || "requested";
  const meta = STATUS_META[status] || STATUS_META.requested;
  const currentStep = getStepIndex(status);
  const isCancelled = status === "cancelled";

  const serviceEmojis = {
    electrician: "⚡", plumber: "🔧", carpenter: "🪚",
    "ac repair": "❄️", cleaning: "🧹", painter: "🎨",
  };
  const serviceName = booking.serviceId?.name || "Service";
  const serviceEmoji = serviceEmojis[serviceName.toLowerCase()] || "🛠️";

  return (
    <div
      className="card-hover"
      style={{
        background: isCancelled ? "rgba(15,23,42,.5)" : "rgba(15,23,42,.75)",
        borderRadius: "22px",
        padding: "28px",
        border: `1px solid ${meta.border}`,
        backdropFilter: "blur(14px)",
        position: "relative",
        overflow: "hidden",
        animation: `fadeUp .55s ease ${index * 0.08}s both`,
        cursor: "default",
        opacity: isCancelled ? 0.8 : 1,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 20px 52px ${meta.color}18`;
        e.currentTarget.style.borderColor = meta.border;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = meta.border;
      }}
    >
      {/* Cancelled diagonal stripe overlay */}
      {isCancelled && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "22px",
          background: "repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(239,68,68,.025) 18px, rgba(239,68,68,.025) 20px)",
          pointerEvents: "none", zIndex: 0,
        }} />
      )}

      {/* Corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "90px", height: "90px",
        borderRadius: "0 22px 0 90px", background: `${meta.color}08`, pointerEvents: "none", zIndex: 0,
      }} />

      {/* Booking ID badge */}
      <div style={{
        position: "absolute", top: "18px", right: "18px", zIndex: 1,
        padding: ".18rem .65rem", borderRadius: "100px",
        background: `${meta.color}12`, border: `1px solid ${meta.color}30`,
        color: meta.color, fontSize: ".68rem", fontWeight: 700, letterSpacing: ".04em",
      }}>
        #{booking._id?.slice(-6).toUpperCase() || "------"}
      </div>

      {/* Body */}
      <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
        {/* Top row */}
        <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", marginBottom: "22px" }}>
          <div style={{
            width: "58px", height: "58px", borderRadius: "16px", flexShrink: 0,
            background: isCancelled
              ? "rgba(239,68,68,.12)"
              : `linear-gradient(135deg,${meta.color}cc,${meta.color}66)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.55rem", boxShadow: isCancelled ? "none" : `0 6px 20px ${meta.color}30`,
            animation: isCancelled ? "none" : "float 4s ease-in-out infinite",
            filter: isCancelled ? "grayscale(.6)" : "none",
          }}>
            {serviceEmoji}
          </div>
          <div style={{ flex: 1, paddingRight: "60px" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: isCancelled ? "#64748b" : "#f1f5f9", marginBottom: "5px" }}>
              {serviceName}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: ".84rem", display: "flex", alignItems: "center", gap: ".35rem" }}>
              👨‍🔧 {booking.providerId?.name || "Provider not assigned"}
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div style={{
          background: "rgba(99,102,241,.04)", borderRadius: "12px",
          padding: "14px 16px", marginBottom: "20px",
          border: "1px solid rgba(99,102,241,.08)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#cbd5e1", fontSize: ".84rem" }}>
              <span>📅</span>
              <span>{new Date(booking.scheduledTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#cbd5e1", fontSize: ".84rem" }}>
              <span>💳</span>
              <span>Payment:</span>
              <span style={{
                padding: ".1rem .55rem", borderRadius: "8px", fontSize: ".78rem", fontWeight: 700,
                background: booking.paymentStatus === "paid" ? "rgba(16,185,129,.12)" : "rgba(245,158,11,.12)",
                color: booking.paymentStatus === "paid" ? "#10b981" : "#f59e0b",
                border: `1px solid ${booking.paymentStatus === "paid" ? "rgba(16,185,129,.25)" : "rgba(245,158,11,.25)"}`,
              }}>
                {booking.paymentStatus || "pending"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#cbd5e1", fontSize: ".84rem" }}>
              <span>📌</span>
              <span>Status:</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: ".3rem",
                padding: ".12rem .65rem", borderRadius: "8px", fontSize: ".78rem", fontWeight: 700,
                background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
              }}>
                {meta.icon} {meta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline tracker */}
        {!isCancelled ? (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: ".7rem", color: "#475569", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "10px" }}>
              Progress
            </div>
            <div style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>
              {TIMELINE_STEPS.map((step, i) => {
                const isActive = i <= currentStep;
                const isCurrent = i === currentStep && status !== "completed";
                return (
                  <div key={step.key} style={{ flex: 1, position: "relative" }}>
                    <div style={{
                      height: "7px", borderRadius: "20px",
                      background: isActive ? `linear-gradient(90deg,#6366f1,${meta.color})` : "#1e293b",
                      transition: "background .5s ease",
                      boxShadow: isActive ? `0 0 10px ${meta.color}50` : "none",
                    }} />
                    {isCurrent && (
                      <div style={{
                        position: "absolute", top: "50%", right: "4px", transform: "translateY(-50%)",
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: meta.color, boxShadow: `0 0 10px ${meta.color}`,
                        animation: "pulse 1.5s infinite",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              {TIMELINE_STEPS.map((step, i) => {
                const isActive = i <= currentStep;
                return (
                  <div key={step.key} style={{
                    flex: 1, textAlign: "center", fontSize: ".62rem", fontWeight: isActive ? 700 : 400,
                    color: isActive ? meta.color : "#334155", transition: "color .4s",
                  }}>
                    {step.emoji} {step.label}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Cancelled progress replacement */
          <div style={{
            marginBottom: "20px",
            padding: ".65rem 1rem", borderRadius: "10px",
            background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.18)",
            display: "flex", alignItems: "center", gap: ".65rem",
          }}>
            <div style={{ display: "flex", gap: "4px", flex: 1 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: "7px", borderRadius: "20px", background: "rgba(239,68,68,.15)" }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer action — always rendered, pushed to bottom */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "auto" }}>
        <CancelButton booking={booking} onCancel={onCancel} cancelling={cancelling} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function TrackBookings() {
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/booking/my-bookings",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    setCancelling(bookingId);
    try {
      await axios.patch(
        `http://localhost:5000/api/booking/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Stats derived from bookings
  const stats = {
    total:      bookings.length,
    pending:    bookings.filter(b => b.status === "requested").length,
    active:     bookings.filter(b => b.status === "accepted").length,
    inprogress: bookings.filter(b => b.status === "inprogress" || b.status === "in-progress").length,
    completed:  bookings.filter(b => b.status === "completed").length,
    cancelled:  bookings.filter(b => b.status === "cancelled").length,
  };

  const STAT_ITEMS = [
    { label: "Total",       value: stats.total,      color: "#6366f1", icon: "📋" },
    { label: "Pending",     value: stats.pending,    color: "#f59e0b", icon: "🕐" },
    { label: "Accepted",    value: stats.active,     color: "#06b6d4", icon: "✅" },
    { label: "In Progress", value: stats.inprogress, color: "#8b5cf6", icon: "⚙️" },
    { label: "Completed",   value: stats.completed,  color: "#10b981", icon: "🏆" },
    { label: "Cancelled",   value: stats.cancelled,  color: "#ef4444", icon: "✖️" },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Radial glow */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: "400px", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,.14) 0%, transparent 70%)",
        }} />

        {/* ── Navbar ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 2rem",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          background: "rgba(15,23,42,.88)",
          borderBottom: "1px solid rgba(99,102,241,.15)",
          boxShadow: "0 4px 32px rgba(0,0,0,.3)",
        }}>
          <div onClick={() => navigate("/")} style={{
            fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-.03em", cursor: "pointer",
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            userSelect: "none",
          }}>ServifyX</div>

          <div style={{
            display: "flex", alignItems: "center", gap: ".55rem",
            padding: ".32rem 1rem", borderRadius: "100px",
            background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)",
          }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%", background: "#10b981",
              display: "inline-block", animation: "pulse 2s infinite", boxShadow: "0 0 8px #10b98180",
            }} />
            <span style={{ color: "#a5b4fc", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em" }}>
              MY BOOKINGS
            </span>
          </div>

          <button className="back-btn" onClick={() => navigate("/")} style={{
            display: "flex", alignItems: "center", gap: ".4rem",
            padding: ".42rem 1rem", borderRadius: "10px",
            border: "1.5px solid rgba(99,102,241,.3)",
            background: "rgba(99,102,241,.06)",
            color: "#94a3b8", fontSize: ".82rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "all .25s",
          }}>
            ← Home
          </button>
        </nav>

        {/* ── Content ── */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>

          {/* Page header */}
          <div style={{ marginBottom: "2.5rem", animation: "fadeUp .6s ease both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              padding: ".28rem .95rem", borderRadius: "100px", marginBottom: "1rem",
              background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.28)",
              color: "#a5b4fc", fontSize: ".76rem", fontWeight: 700, letterSpacing: ".06em",
            }}>
              TRACK BOOKINGS
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{
                  fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-.03em",
                  color: "#f1f5f9", lineHeight: 1.1, marginBottom: ".5rem",
                }}>
                  Your Service{" "}
                  <span style={{
                    background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>Bookings</span>
                </h1>
                <p style={{ color: "#64748b", fontSize: ".9rem" }}>
                  Real-time status · Free cancellation up to 1 hour before service
                </p>
              </div>
              <button className="refresh-btn" onClick={() => fetchBookings(true)} disabled={refreshing} style={{
                display: "flex", alignItems: "center", gap: ".5rem",
                padding: ".65rem 1.5rem", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                color: "#fff", fontSize: ".85rem", fontWeight: 700,
                cursor: refreshing ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all .3s",
                boxShadow: "0 4px 20px rgba(99,102,241,.35)",
                opacity: refreshing ? .7 : 1,
              }}>
                <span style={{ display: "inline-block", animation: refreshing ? "spin .8s linear infinite" : "none", fontSize: ".9rem" }}>↻</span>
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* ── Stats strip ── */}
          {!loading && !error && bookings.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))",
              gap: "1rem", marginBottom: "2.5rem",
              animation: "fadeUp .6s ease .1s both",
            }}>
              {STAT_ITEMS.map(({ label, value, color, icon }) => (
                <div key={label} className="stat-card" style={{
                  padding: "1.1rem 1rem", borderRadius: "14px",
                  background: "rgba(15,23,42,.6)", border: `1px solid ${color}20`,
                  backdropFilter: "blur(10px)", textAlign: "center",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`${color}45`; e.currentTarget.style.boxShadow=`0 8px 28px ${color}14`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=`${color}20`; e.currentTarget.style.boxShadow="none"; }}
                >
                  <div style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}>{icon}</div>
                  <div style={{ fontSize: "1.55rem", fontWeight: 900, color, lineHeight: 1, marginBottom: ".2rem" }}>{value}</div>
                  <div style={{ fontSize: ".68rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Cancellation policy banner */}
          {!loading && !error && bookings.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: ".75rem",
              padding: ".85rem 1.25rem", borderRadius: "12px", marginBottom: "2rem",
              background: "rgba(99,102,241,.05)", border: "1px solid rgba(99,102,241,.15)",
              animation: "fadeUp .6s ease .15s both",
            }}>
              <span style={{ fontSize: "1.1rem" }}>ℹ️</span>
              <div>
                <span style={{ color: "#a5b4fc", fontSize: ".8rem", fontWeight: 700 }}>Cancellation Policy: </span>
                <span style={{ color: "#64748b", fontSize: ".8rem" }}>
                  You can cancel any booking for free up to <strong style={{ color: "#cbd5e1" }}>1 hour before</strong> the scheduled service time. After that, the cancel button will be disabled.
                </span>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: "22px" }}>
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ textAlign: "center", padding: "5rem 2rem", animation: "fadeUp .5s ease both" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
              <h2 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: ".75rem" }}>{error}</h2>
              <button onClick={() => fetchBookings()} style={{
                padding: ".75rem 2rem", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                color: "#fff", fontSize: ".9rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(99,102,241,.4)",
              }}>Try Again</button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && bookings.length === 0 && (
            <div style={{ textAlign: "center", padding: "6rem 2rem", animation: "fadeUp .5s ease both" }}>
              <div style={{
                width: "90px", height: "90px", borderRadius: "24px", margin: "0 auto 1.5rem",
                background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(6,182,212,.1))",
                border: "1px solid rgba(99,102,241,.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.6rem",
              }}>📭</div>
              <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.4rem", marginBottom: ".75rem" }}>No Bookings Yet</h2>
              <p style={{ color: "#64748b", marginBottom: "2rem", maxWidth: "360px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
                You haven't made any service bookings yet. Find a trusted professional and book in under 60 seconds.
              </p>
              <button onClick={() => navigate("/services")} style={{
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                padding: ".85rem 2.5rem", borderRadius: "14px", border: "none",
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                color: "#fff", fontSize: ".95rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 28px rgba(99,102,241,.45)",
              }}>Browse Services →</button>
            </div>
          )}

          {/* Cards grid */}
          {!loading && !error && bookings.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
              gap: "22px",
            }}>
              {bookings.map((booking, i) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  index={i}
                  onCancel={cancelBooking}
                  cancelling={cancelling}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer strip */}
        <div style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(99,102,241,.08)",
          padding: "1.5rem 2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
        }}>
          <div style={{
            fontSize: "1.15rem", fontWeight: 900, letterSpacing: "-.03em",
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>ServifyX</div>
          <div style={{ fontSize: ".8rem", color: "#334155" }}>Real-time · Verified · Instant</div>
        </div>
      </div>
    </>
  );
}

export default TrackBookings;