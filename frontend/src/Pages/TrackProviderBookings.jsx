import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; overflow-x: hidden; }
  .card-hover { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease !important; }
  .card-hover:hover { transform: translateY(-5px) scale(1.01) !important; }
  .back-btn:hover { background: rgba(99,102,241,.18) !important; color: #c7d2fe !important; }
  .refresh-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,.5) !important; }
  .skeleton { background: linear-gradient(90deg, #1e293b 25%, #273348 50%, #1e293b 75%); background-size: 400px 100%; animation: shimmer 1.4s infinite; border-radius: 12px; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
`;

const STATUS_META = {
  requested:   { color: "#f59e0b", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)", icon: "🕐", label: "Requested" },
  accepted:    { color: "#06b6d4", bg: "rgba(6,182,212,.1)", border: "rgba(6,182,212,.25)", icon: "✅", label: "Accepted" },
  "in-progress": { color: "#8b5cf6", bg: "rgba(139,92,246,.1)", border: "rgba(139,92,246,.25)", icon: "⚙️", label: "In Progress" },
  completed:   { color: "#10b981", bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.25)", icon: "🏆", label: "Completed" },
  cancelled:   { color: "#ef4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.25)", icon: "✖️", label: "Cancelled" },
};

const TIMELINE_STEPS = [
  { key: "requested", label: "Requested", emoji: "📋" },
  { key: "accepted", label: "Accepted", emoji: "✅" },
  { key: "in-progress", label: "In Progress", emoji: "⚙️" },
  { key: "completed", label: "Completed", emoji: "🏆" },
];
const STEP_ORDER = ["requested", "accepted", "in-progress", "completed"];
const getStepIndex = (status) => STEP_ORDER.indexOf(status);

function SkeletonCard() {
  return (
    <div style={{ background: "rgba(15,23,42,.6)", borderRadius: "22px", padding: "28px", border: "1px solid rgba(99,102,241,.1)", backdropFilter: "blur(10px)" }}>
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
        {[1,2,3,4].map((i) => (
          <div key={i} className="skeleton" style={{ flex: 1, height: "8px", borderRadius: "20px" }} />
        ))}
      </div>
    </div>
  );
}

function BookingCard({ booking, onClick, index }) {
  const status = booking.status || "requested";
  const meta = STATUS_META[status] || STATUS_META.requested;
  const currentStep = getStepIndex(status);
  const serviceName = booking.serviceId?.name || "Service";
  const serviceEmoji = {
    electrician: "⚡", plumber: "🔧", carpenter: "🪚",
    "ac repair": "❄️", cleaning: "🧹", painter: "🎨",
  }[serviceName.toLowerCase()] || "🛠️";

  return (
    <div
      className="card-hover"
      onClick={() => onClick(booking)}
      style={{
        background: "rgba(15,23,42,.75)", borderRadius: "22px", padding: "28px", border: `1px solid ${meta.border}`,
        backdropFilter: "blur(14px)", position: "relative", overflow: "hidden", cursor: "pointer",
        animation: `fadeUp .55s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: "90px", height: "90px", borderRadius: "0 22px 0 90px", background: `${meta.color}08`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "18px", right: "18px", padding: ".18rem .65rem", borderRadius: "100px", background: `${meta.color}12`, border: `1px solid ${meta.color}30`, color: meta.color, fontSize: ".68rem", fontWeight: 700, letterSpacing: ".04em" }}>
        #{booking._id?.slice(-6).toUpperCase() || "------"}
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", marginBottom: "22px" }}>
        <div style={{ width: "58px", height: "58px", borderRadius: "16px", flexShrink: 0, background: `linear-gradient(135deg,${meta.color}cc,${meta.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.55rem", boxShadow: `0 6px 20px ${meta.color}30`, animation: "float 4s ease-in-out infinite" }}>
          {serviceEmoji}
        </div>
        <div style={{ flex: 1, paddingRight: "60px" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "5px" }}>{serviceName}</h2>
          <p style={{ color: "#94a3b8", fontSize: ".84rem", display: "flex", alignItems: "center", gap: ".35rem" }}>
            👤 {booking.userId?.name || booking.userId || "Customer details pending"}
          </p>
        </div>
      </div>

      <div style={{ background: "rgba(99,102,241,.04)", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px", border: "1px solid rgba(99,102,241,.08)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#cbd5e1", fontSize: ".84rem" }}>
            <span>📅</span>
            <span>{booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Not scheduled"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#cbd5e1", fontSize: ".84rem" }}>
            <span>💳</span>
            <span>Payment:</span>
            <span style={{ padding: ".1rem .55rem", borderRadius: "8px", fontSize: ".78rem", fontWeight: 700, background: booking.paymentStatus === "paid" ? "rgba(16,185,129,.12)" : "rgba(245,158,11,.12)", color: booking.paymentStatus === "paid" ? "#10b981" : "#f59e0b", border: `1px solid ${booking.paymentStatus === "paid" ? "rgba(16,185,129,.25)" : "rgba(245,158,11,.25)"}` }}>
              {booking.paymentStatus || "pending"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#cbd5e1", fontSize: ".84rem" }}>
            <span>📌</span>
            <span>Status:</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", padding: ".12rem .65rem", borderRadius: "8px", fontSize: ".78rem", fontWeight: 700, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
              {meta.icon} {meta.label}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <span style={{ color: "#94a3b8", fontSize: ".85rem" }}>
          {booking.providerId ? "Assigned to you" : "Open request"}
        </span>
        <button style={{ padding: ".72rem 1.1rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#6366f1,#06b6d4)", color: "#fff", fontSize: ".82rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          View Details
        </button>
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;

  const status = booking.status || "requested";
  const meta = STATUS_META[status] || STATUS_META.requested;
  const serviceName = booking.serviceId?.name || "Service";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(7,12,24,.85)" }}>
      <div style={{ width: "100%", maxWidth: "820px", maxHeight: "90vh", overflowY: "auto", borderRadius: "28px", background: "rgba(15,23,42,.98)", border: "1px solid rgba(99,102,241,.16)", boxShadow: "0 40px 120px rgba(0,0,0,.35)", padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: ".75rem", letterSpacing: ".18em", color: "#94a3b8", textTransform: "uppercase", marginBottom: "10px" }}>Booking Details</div>
            <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#f8fafc" }}>{serviceName}</h2>
            <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>#{booking._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "#cbd5e1", fontSize: "1.2rem", cursor: "pointer" }}>
            ?
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "20px" }}>
          {[
            { label: "Status", value: `${meta.icon} ${meta.label}` },
            { label: "Payment", value: booking.paymentStatus || "pending" },
            { label: "Requested by", value: booking.userId?.name || booking.userId || "Unknown" },
            { label: "Customer email", value: booking.userId?.email || "Not available" },
            { label: "Provider", value: booking.providerId?.name || "Not assigned" },
            { label: "Scheduled", value: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Not scheduled" },
          ].map((item) => (
            <div key={item.label} style={{ padding: "18px 20px", borderRadius: "18px", background: "rgba(99,102,241,.04)", border: "1px solid rgba(99,102,241,.08)" }}>
              <div style={{ color: "#94a3b8", fontSize: ".78rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "8px" }}>{item.label}</div>
              <div style={{ color: "#f8fafc", fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: "18px", marginBottom: "20px" }}>
          <div style={{ padding: "20px", borderRadius: "20px", background: "rgba(99,102,241,.04)", border: "1px solid rgba(99,102,241,.08)" }}>
            <div style={{ color: "#94a3b8", fontSize: ".78rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "10px" }}>Address</div>
            <p style={{ color: "#e2e8f0", margin: 0 }}>{booking.address || "Address not provided"}</p>
          </div>
          <div style={{ padding: "20px", borderRadius: "20px", background: "rgba(99,102,241,.04)", border: "1px solid rgba(99,102,241,.08)" }}>
            <div style={{ color: "#94a3b8", fontSize: ".78rem", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "10px" }}>Customer Notes</div>
            <p style={{ color: "#e2e8f0", margin: 0 }}>{booking.note || "No additional notes."}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#94a3b8", fontSize: ".78rem" }}>
            Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-"}
          </div>
          <button onClick={onClose} style={{ padding: ".85rem 1.3rem", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#6366f1,#06b6d4)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchBookings = async (isRefresh = false) => {
    if (!token) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("http://localhost:5000/api/booking/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load provider bookings. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [token, navigate]);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "requested").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    inProgress: bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Poppins', sans-serif", position: "relative", overflowX: "hidden" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "400px", zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,.14) 0%, transparent 70%)" }} />

        <nav style={{ position: "sticky", top: 0, zIndex: 50, height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(15,23,42,.88)", borderBottom: "1px solid rgba(99,102,241,.15)", boxShadow: "0 4px 32px rgba(0,0,0,.3)" }}>
          <div onClick={() => navigate("/")} style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-.03em", cursor: "pointer", background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", userSelect: "none" }}>
            ServifyX
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".55rem", padding: ".32rem 1rem", borderRadius: "100px", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite", boxShadow: "0 0 8px #10b98180" }} />
            <span style={{ color: "#a5b4fc", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em" }}>PROVIDER BOOKINGS</span>
          </div>
          <button className="back-btn" onClick={() => navigate("/provider/dashboard")} style={{ display: "flex", alignItems: "center", gap: ".4rem", padding: ".42rem 1rem", borderRadius: "10px", border: "1.5px solid rgba(99,102,241,.3)", background: "rgba(99,102,241,.06)", color: "#94a3b8", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .25s" }}>
            ← Dashboard
          </button>
        </nav>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
          <div style={{ marginBottom: "2.5rem", animation: "fadeUp .6s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".28rem .95rem", borderRadius: "100px", marginBottom: "1rem", background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.28)", color: "#a5b4fc", fontSize: ".76rem", fontWeight: 700, letterSpacing: ".06em" }}>
              TRACK PROVIDER BOOKINGS
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-.03em", color: "#f1f5f9", lineHeight: 1.1, marginBottom: ".5rem" }}>
                  Provider Booking <span style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Insights</span>
                </h1>
                <p style={{ color: "#64748b", fontSize: ".9rem" }}>
                  Track all requests for your service type and see every assigned job in one dashboard.
                </p>
              </div>
              <button className="refresh-btn" onClick={() => fetchBookings(true)} disabled={refreshing} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".65rem 1.5rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#6366f1,#06b6d4)", color: "#fff", fontSize: ".85rem", fontWeight: 700, cursor: refreshing ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all .3s", boxShadow: "0 4px 20px rgba(99,102,241,.35)", opacity: refreshing ? .7 : 1 }}>
                <span style={{ display: "inline-block", animation: refreshing ? "spin .8s linear infinite" : "none", fontSize: ".9rem" }}>↻</span>
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {!loading && !error && bookings.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1rem", marginBottom: "2.5rem", animation: "fadeUp .6s ease .1s both" }}>
              {[
                { label: "Total", value: stats.total, color: "#6366f1", icon: "📋" },
                { label: "Pending", value: stats.pending, color: "#f59e0b", icon: "🕐" },
                { label: "Accepted", value: stats.accepted, color: "#06b6d4", icon: "✅" },
                { label: "In Progress", value: stats.inProgress, color: "#8b5cf6", icon: "⚙️" },
                { label: "Completed", value: stats.completed, color: "#10b981", icon: "🏆" },
                { label: "Cancelled", value: stats.cancelled, color: "#ef4444", icon: "✖️" },
              ].map(({ label, value, color, icon }) => (
                <div key={label} style={{ padding: "1.1rem 1.25rem", borderRadius: "14px", background: "rgba(15,23,42,.6)", border: `1px solid ${color}20`, backdropFilter: "blur(10px)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: ".25rem" }}>{icon}</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 900, color, lineHeight: 1, marginBottom: ".2rem" }}>{value}</div>
                  <div style={{ fontSize: ".73rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: "22px" }}>
              {[1,2,3].map((i) => (<SkeletonCard key={i} />))}
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: "center", padding: "5rem 2rem", animation: "fadeUp .5s ease both" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
              <h2 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: ".75rem" }}>{error}</h2>
              <button onClick={() => fetchBookings()} style={{ padding: ".75rem 2rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#6366f1,#06b6d4)", color: "#fff", fontSize: ".9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(99,102,241,.4)" }}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div style={{ textAlign: "center", padding: "6rem 2rem", animation: "fadeUp .5s ease both" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "24px", margin: "0 auto 1.5rem", background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(6,182,212,.1))", border: "1px solid rgba(99,102,241,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.6rem" }}>📭</div>
              <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.4rem", marginBottom: ".75rem" }}>No Provider Bookings Yet</h2>
              <p style={{ color: "#64748b", margin: "0 auto 2rem", maxWidth: "360px", lineHeight: 1.7 }}>
                You currently have no matching booking requests or assigned jobs. Share your profile link or wait for new requests.
              </p>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "22px" }}>
              {bookings.map((booking, index) => (
                <BookingCard key={booking._id} booking={booking} index={index} onClick={setSelectedBooking} />
              ))}
            </div>
          )}
        </div>

        {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(99,102,241,.08)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "1.15rem", fontWeight: 900, letterSpacing: "-.03em", background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ServifyX</div>
          <div style={{ fontSize: ".8rem", color: "#334155" }}>Provider view · live status · easy follow-up</div>
        </div>
      </div>
    </>
  );
}

export default TrackProviderBookings;
