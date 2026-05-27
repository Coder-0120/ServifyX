// CreateProviderProfile.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.88)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes shimmer   { 0%{left:-100%} 100%{left:110%} }

  /* ── Navbar ── */
  .cpp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem;
    background: rgba(10,15,30,.88); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,.15);
    box-shadow: 0 4px 32px rgba(0,0,0,.4);
  }
  .cpp-logo {
    font-size: 1.5rem; font-weight: 900; letter-spacing: -.03em; cursor: pointer;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cpp-nav-links { display: flex; gap: 2rem; list-style: none; }
  .cpp-nav-links a { color: #94a3b8; font-size: .875rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: color .2s; }
  .cpp-nav-links a:hover { color: #a5b4fc; }
  .cpp-nav-ghost {
    padding: .4rem 1.1rem; border-radius: 10px; border: 1.5px solid rgba(99,102,241,.4);
    background: transparent; color: #a5b4fc; font-size: .84rem; font-weight: 600;
    cursor: pointer; font-family: 'Poppins',sans-serif; transition: background .2s;
  }
  .cpp-nav-ghost:hover { background: rgba(99,102,241,.14); }
  .cpp-nav-solid {
    padding: .4rem 1.1rem; border-radius: 10px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff;
    font-size: .84rem; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif;
    box-shadow: 0 4px 18px rgba(99,102,241,.35); transition: all .2s;
  }
  .cpp-nav-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,.55); }

  /* ── Input & Select ── */
  .cpp-input, .cpp-select {
    width: 100%; padding: .78rem 1rem .78rem 2.8rem;
    border-radius: 12px; border: 1.5px solid rgba(99,102,241,.22);
    background: rgba(15,23,42,.7); color: #f1f5f9;
    font-size: .92rem; font-family: 'Poppins',sans-serif; font-weight: 500;
    outline: none; transition: border-color .25s, box-shadow .25s, background .25s;
  }
  .cpp-input::placeholder { color: #475569; }
  .cpp-select { cursor: pointer; appearance: none; -webkit-appearance: none; }
  .cpp-select option { background: #1e293b; color: #f1f5f9; }
  .cpp-input:focus, .cpp-select:focus {
    border-color: #6366f1; background: rgba(99,102,241,.08); box-shadow: 0 0 0 3px rgba(99,102,241,.18);
  }
  .cpp-input:hover:not(:focus), .cpp-select:hover:not(:focus) { border-color: rgba(99,102,241,.42); }

  /* ── Submit button ── */
  .cpp-btn {
    width: 100%; padding: .9rem; border-radius: 13px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4,#6366f1); background-size: 200% 200%;
    color: #fff; font-size: 1rem; font-weight: 700; font-family: 'Poppins',sans-serif;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 28px rgba(99,102,241,.5); transition: transform .25s, box-shadow .25s;
    animation: gradShift 4s ease infinite;
  }
  .cpp-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent); }
  .cpp-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(99,102,241,.65); }
  .cpp-btn:hover::after { animation: shimmer .7s ease forwards; }
  .cpp-btn:active { transform: translateY(0); }
  .cpp-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }

  /* ── Toggle ── */
  .cpp-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: .9rem 1rem; border-radius: 12px; cursor: pointer;
    background: rgba(99,102,241,.05); border: 1.5px solid rgba(99,102,241,.18);
    transition: border-color .25s, background .25s;
  }
  .cpp-toggle-row:hover { background: rgba(99,102,241,.09); border-color: rgba(99,102,241,.35); }
  .cpp-track {
    width: 44px; height: 24px; border-radius: 100px; position: relative;
    flex-shrink: 0; transition: background .3s;
  }
  .cpp-thumb {
    position: absolute; top: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: #fff; transition: left .3s;
    box-shadow: 0 2px 6px rgba(0,0,0,.35);
  }

  .cpp-label { font-size:.8rem; font-weight:600; color:#94a3b8; display:block; margin-bottom:.5rem; letter-spacing:.04em; text-transform:uppercase; }
  .cpp-error { padding:.65rem 1rem; border-radius:10px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.28); color:#fca5a5; font-size:.84rem; font-weight:500; }
  .cpp-link { color:#6366f1; cursor:pointer; font-weight:700; transition:color .2s; }
  .cpp-link:hover { color:#a5b4fc; text-decoration:underline; }

  @media(max-width:768px) {
    .cpp-nav-links, .cpp-nav-auth { display: none !important; }
  }
  @media(max-width:500px) {
    .cpp-card { padding: 2rem 1.5rem !important; }
  }
`;

const IcoWrap = ({ children }) => (
  <div style={{ position:"absolute", top:"50%", left:".85rem", transform:"translateY(-50%)", width:"16px", height:"16px", color:"#6366f1", pointerEvents:"none" }}>{children}</div>
);

const IcoTool    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IcoStar    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoChevron = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"16px",height:"16px"}}><polyline points="6 9 12 15 18 9"/></svg>;

const SERVICE_OPTIONS = [
  { value:"electrician",   label:"⚡  Electrician"   },
  { value:"plumber",       label:"🔧  Plumber"        },
  { value:"carpenter",     label:"🪚  Carpenter"      },
  { value:"ac repair",     label:"❄️  AC Repair"      },
  { value:"deep cleaning", label:"🧹  Deep Cleaning"  },
  { value:"painter",       label:"🎨  Painter"        },
];

export default function CreateProviderProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ serviceType:"", experience:"", isAvailable:true });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.serviceType)  { setError("Please select a service type."); return; }
    if (!formData.experience)   { setError("Please enter your years of experience."); return; }
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/provider/create-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/provider/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Navbar */}
      <nav className="cpp-nav">
        <div className="cpp-logo" onClick={() => navigate("/")}>ServifyX</div>
        <div className="cpp-nav-auth" style={{ display:"flex", gap:".6rem" }}>
          <button className="cpp-nav-ghost" onClick={() => navigate("/logout")}>Logout</button>
        </div>
      </nav>

      {/* Page */}
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "84px 1rem 2rem",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,.15) 0%, transparent 60%), #0f172a",
      }}>
        <div className="cpp-card" style={{
          width: "100%", maxWidth: "460px",
          background: "linear-gradient(160deg,#0f172a 0%,#0a0f1e 100%)",
          border: "1px solid rgba(99,102,241,.2)",
          borderRadius: "24px",
          padding: "2.5rem 2.25rem",
          boxShadow: "0 32px 80px rgba(0,0,0,.6)",
          animation: "fadeUp .5s ease both",
        }}>

          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:".45rem", padding:".28rem 1rem", borderRadius:"100px", marginBottom:"1.25rem", background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.3)", color:"#a5b4fc", fontSize:".74rem", fontWeight:700, letterSpacing:".04em" }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite", boxShadow:"0 0 8px #10b98180" }}/>
            PROVIDER SETUP
          </div>

          {/* Heading */}
          <h1 style={{ fontSize:"clamp(1.6rem,4vw,2rem)", fontWeight:900, letterSpacing:"-.03em", color:"#f1f5f9", lineHeight:1.12, marginBottom:".5rem" }}>
            Create your{" "}
            <span style={{ background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              provider profile
            </span>
          </h1>
          <p style={{ fontSize:".9rem", color:"#64748b", lineHeight:1.65, marginBottom:"2rem" }}>
            Set up your profile to start receiving job requests from nearby customers.
          </p>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>

            {/* Service Type */}
            <div>
              <label className="cpp-label">Service Type</label>
              <div style={{ position:"relative" }}>
                <IcoWrap><IcoTool/></IcoWrap>
                <select
                  className="cpp-select"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Select your service --</option>
                  {SERVICE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <span style={{ pointerEvents:"none", position:"absolute", top:"50%", right:"1rem", transform:"translateY(-50%)", color:"#6366f1" }}>
                  <IcoChevron/>
                </span>
              </div>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="cpp-label">Years of Experience</label>
              <div style={{ position:"relative" }}>
                <IcoWrap><IcoStar/></IcoWrap>
                <input
                  className="cpp-input"
                  type="number"
                  name="experience"
                  placeholder="e.g. 3"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Availability toggle */}
            <div>
              <label className="cpp-label">Availability</label>
              <div
                className="cpp-toggle-row"
                onClick={() => setFormData(f => ({ ...f, isAvailable: !f.isAvailable }))}
              >
                <div>
                  <div style={{ fontSize:".9rem", fontWeight:700, color:"#f1f5f9" }}>
                    {formData.isAvailable ? "🟢  Available for jobs" : "🔴  Not available"}
                  </div>
                  <div style={{ fontSize:".75rem", color:"#64748b", marginTop:"2px" }}>
                    {formData.isAvailable ? "Customers can book you right now" : "You won't receive new requests"}
                  </div>
                </div>
                <div className="cpp-track" style={{ background: formData.isAvailable ? "rgba(16,185,129,.25)" : "rgba(71,85,105,.3)" }}>
                  <div className="cpp-thumb" style={{ left: formData.isAvailable ? "22px" : "3px", background: formData.isAvailable ? "#10b981" : "#475569" }}/>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && <div className="cpp-error">⚠️ {error}</div>}

            {/* Submit */}
            <button className="cpp-btn" type="submit" disabled={loading} style={{ marginTop:".25rem" }}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem" }}>
                  <span style={{ width:"18px", height:"18px", border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .8s linear infinite" }}/>
                  Creating Profile…
                </span>
              ) : "Create Provider Profile →"}
            </button>

            <p style={{ textAlign:"center", fontSize:".88rem", color:"#64748b" }}>
              Already set up?{" "}
              <span className="cpp-link" onClick={() => navigate("/provider/dashboard")}>Go to Dashboard</span>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}