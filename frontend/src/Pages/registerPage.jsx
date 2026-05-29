// RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; overflow-x: hidden; min-height: 100vh; }

  @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
  @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-10px) rotate(-1deg)} }
  @keyframes floatC  { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.88)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{left:-100%} 100%{left:110%} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .rp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem;
    background: rgba(15,23,42,.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,.18);
    box-shadow: 0 4px 32px rgba(0,0,0,.35);
    transition: all .3s ease;
  }
  .rp-logo {
    font-size: 1.5rem; font-weight: 900; letter-spacing: -.03em; cursor: pointer;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .rp-nav-links { display: flex; gap: 2rem; list-style: none; align-items: center; }
  .rp-nav-link {
    color: #94a3b8; font-size: .875rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: color .2s;
  }
  .rp-nav-link:hover { color: #a5b4fc; }
  .rp-nav-ghost {
    padding: .4rem 1.1rem; border-radius: 10px; border: 1.5px solid rgba(99,102,241,.4);
    background: transparent; color: #a5b4fc; font-size: .84rem; font-weight: 600;
    cursor: pointer; font-family: 'Poppins',sans-serif; transition: background .2s;
  }
  .rp-nav-ghost:hover { background: rgba(99,102,241,.14); }
  .rp-nav-solid {
    padding: .4rem 1.1rem; border-radius: 10px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff;
    font-size: .84rem; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif;
    box-shadow: 0 4px 18px rgba(99,102,241,.4); transition: all .2s;
  }
  .rp-nav-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,.55); }
  .rp-hamburger {
    display: none; width: 36px; height: 36px; padding: 7px;
    border: 1px solid rgba(99,102,241,.3); border-radius: 10px;
    background: rgba(99,102,241,.08); color: #a5b4fc; cursor: pointer;
  }
  .rp-mobile-menu {
    position: fixed; top: 64px; left: 0; right: 0; z-index: 199;
    background: rgba(15,23,42,.97); backdrop-filter: blur(20px);
    padding: 1rem 1.5rem 1.5rem; border-bottom: 1px solid rgba(99,102,241,.15);
  }
  .rp-mobile-link {
    padding: .8rem 0; color: #94a3b8; display: block; cursor: pointer;
    font-size: 1rem; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,.05); transition: color .2s;
  }
  .rp-mobile-link:hover { color: #a5b4fc; }

  .rp-select, .rp-input {
    width: 100%; padding: .78rem 1rem .78rem 2.8rem;
    border-radius: 12px; border: 1.5px solid rgba(99,102,241,.22);
    background: rgba(15,23,42,.7); color: #f1f5f9;
    font-size: .92rem; font-family: 'Poppins',sans-serif; font-weight: 500;
    outline: none; transition: border-color .25s, box-shadow .25s, background .25s;
  }
  .rp-select { cursor: pointer; appearance: none; -webkit-appearance: none; }
  .rp-select option { background: #1e293b; color: #f1f5f9; }
  .rp-input::placeholder { color: #475569; }
  .rp-select:focus, .rp-input:focus { border-color: #6366f1; background: rgba(99,102,241,.08); box-shadow: 0 0 0 3px rgba(99,102,241,.18); }
  .rp-select:hover:not(:focus), .rp-input:hover:not(:focus) { border-color: rgba(99,102,241,.42); }

  .rp-btn {
    width: 100%; padding: .9rem; border-radius: 13px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4,#6366f1); background-size: 200% 200%;
    color: #fff; font-size: 1rem; font-weight: 700; font-family: 'Poppins',sans-serif;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 28px rgba(99,102,241,.5); transition: transform .25s, box-shadow .25s;
    animation: gradShift 4s ease infinite;
  }
  .rp-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent); }
  .rp-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(99,102,241,.65); }
  .rp-btn:hover::after { animation: shimmer .7s ease forwards; }
  .rp-btn:active { transform: translateY(0); }
  .rp-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

  .rp-eye { background:none; border:none; cursor:pointer; color:#475569; padding:0; display:flex; align-items:center; transition:color .2s; }
  .rp-eye:hover { color:#a5b4fc; }
  .rp-link { color:#6366f1; cursor:pointer; font-weight:700; transition:color .2s; text-decoration:none; }
  .rp-link:hover { color:#a5b4fc; text-decoration:underline; }
  .rp-error { padding:.65rem 1rem; border-radius:10px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.28); color:#fca5a5; font-size:.84rem; font-weight:500; }
  .rp-label { font-size:.8rem; font-weight:600; color:#94a3b8; display:block; margin-bottom:.5rem; letter-spacing:.04em; text-transform:uppercase; }

  @media(max-width:768px) { .rp-side { display:none !important; } .rp-nav-links { display:none !important; } .rp-nav-auth { display:none !important; } }
  @media(max-width:500px) { .rp-form-area { padding:1.75rem 1.25rem !important; } }
`;

const IconUser    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>;
const IconLock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconRole    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconEye     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"18px",height:"18px"}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"18px",height:"18px"}}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconChevron = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"16px",height:"16px"}}><polyline points="6 9 12 15 18 9"/></svg>;
const IconMenu = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconCheck   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><polyline points="20 6 9 17 4 12"/></svg>;

const IcoWrap = ({ children }) => (
  <div style={{ position:"absolute", top:"50%", left:".85rem", transform:"translateY(-50%)", width:"16px", height:"16px", color:"#6366f1", pointerEvents:"none" }}>{children}</div>
);

function PasswordStrength({ password }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const colors = ["#ef4444","#f97316","#eab308","#10b981"];
  const labels = ["Weak","Fair","Good","Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop:".5rem" }}>
      <div style={{ display:"flex", gap:"5px", marginBottom:".28rem" }}>
        {[0,1,2,3].map(i => <div key={i} style={{ flex:1, height:"4px", borderRadius:"4px", background: i < score ? colors[score-1] : "rgba(99,102,241,.12)", transition:"background .35s" }}/>)}
      </div>
      <span style={{ fontSize:".72rem", color: colors[score-1] ?? "#475569", fontWeight:700 }}>{labels[score-1] ?? ""}{score > 0 ? " password" : ""}</span>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ role:"", name:"", email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: "Home", action: () => navigate("/") },
    { label: "Services", action: () => navigate("/services") },
    { label: "How It Works", action: () => navigate("/") },
    { label: "Become Provider", action: () => navigate("/register") },
    { label: "Contact", action: () => navigate("/") },
  ];

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {

  try {

    setError("");

    // VALIDATIONS
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      setError("Please fill all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter valid email");
      return;
    }

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    // API CALL
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }
    );

    // STORE TOKEN
    localStorage.setItem("token", data.token);

    // STORE USER
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    // REDIRECT BASED ON ROLE
    if (data.user.role === "provider") {

      navigate("/create-provider-profile");

    } else {

      navigate("/services");

    }

  } catch (error) {

    console.log(error);

    setError(
      error.response?.data?.message ||
      "Registration failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <>
      <style>{CSS}</style>

      {/* ── Navbar ── */}
      <nav className="rp-nav">
        <div className="rp-logo" onClick={() => { navigate("/"); setMenuOpen(false); }}>ServifyX</div>
        <ul className="rp-nav-links">
          {NAV_LINKS.map(({ label, action }) => (
            <li key={label}><span className="rp-nav-link" onClick={() => { action(); setMenuOpen(false); }}>{label}</span></li>
          ))}
        </ul>
        <div className="rp-nav-auth" style={{ display:"flex", gap: ".6rem" }}>
          <button className="rp-nav-ghost" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Login</button>
          <button className="rp-nav-solid" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Sign Up</button>
        </div>
        <button type="button" className="rp-hamburger" onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? <IconClose/> : <IconMenu/>}
        </button>
      </nav>
      {menuOpen && (
        <div className="rp-mobile-menu">
          {NAV_LINKS.map(({ label, action }) => (
            <span key={label} className="rp-mobile-link" onClick={() => { action(); setMenuOpen(false); }}>{label}</span>
          ))}
          <div style={{ display:"flex", gap: ".75rem", marginTop: "1rem" }}>
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} style={{ flex:1, padding: ".6rem", borderRadius: "10px", border: "1.5px solid rgba(99,102,241,.4)", background: "transparent", color: "#a5b4fc", fontFamily: "inherit", fontWeight: 600, cursor: "pointer" }}>Login</button>
            <button onClick={() => { navigate("/register"); setMenuOpen(false); }} style={{ flex:1, padding: ".6rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#06b6d4)", color: "#fff", fontFamily: "inherit", fontWeight: 600, cursor: "pointer" }}>Sign Up</button>
          </div>
        </div>
      )}

      {/* ── Page ── */}
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"84px 1rem 2rem", background:"radial-gradient(ellipse 90% 55% at 50% 0%, rgba(99,102,241,.16) 0%, transparent 65%), #0f172a" }}>
        <div style={{ display:"flex", maxWidth:"920px", width:"100%", borderRadius:"26px", overflow:"hidden", border:"1px solid rgba(99,102,241,.2)", boxShadow:"0 40px 100px rgba(0,0,0,.65)", minHeight:"600px" }}>

          {/* ── Left panel ── */}
          <div className="rp-side" style={{ display:"flex", flex:"0 0 420px" }}>
            <div style={{ flex:1, position:"relative", overflow:"hidden", background:"radial-gradient(ellipse 90% 70% at 20% 50%, rgba(139,92,246,.18) 0%, transparent 70%), #080d1a", padding:"3rem 2.5rem", display:"flex", flexDirection:"column", justifyContent:"center", borderRight:"1px solid rgba(139,92,246,.12)" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(139,92,246,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.06) 1px,transparent 1px)", backgroundSize:"48px 48px", zIndex:0 }}/>
              <div style={{ position:"absolute", top:"10%", left:"5%", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.12),transparent 70%)", zIndex:0 }}/>
              <div style={{ position:"absolute", bottom:"15%", right:"0%", width:"160px", height:"160px", borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.1),transparent 70%)", zIndex:0 }}/>

              {[
                { pos:{top:"7%", right:"6%"},  anim:"floatA", delay:"0s",   emoji:"🚀", label:"Join for free",      color:"#8b5cf6" },
                { pos:{top:"76%",left:"4%"},   anim:"floatB", delay:".7s",  emoji:"🔧", label:"Become a provider",  color:"#06b6d4" },
                { pos:{top:"44%",right:"2%"},  anim:"floatC", delay:"1.3s", emoji:"✅", label:"Verified instantly", color:"#10b981" },
              ].map(({ pos, anim, delay, emoji, label, color }) => (
                <div key={label} style={{ position:"absolute", ...pos, padding:".48rem .9rem", borderRadius:"12px", background:"rgba(10,16,32,.9)", border:`1px solid ${color}40`, backdropFilter:"blur(12px)", fontSize:".76rem", fontWeight:600, color:"#e2e8f0", display:"flex", alignItems:"center", gap:".4rem", animation:`${anim} 3.8s ease-in-out ${delay} infinite`, whiteSpace:"nowrap", zIndex:3, boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>{emoji} {label}</div>
              ))}

              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:"1.75rem", fontWeight:900, letterSpacing:"-.03em", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:"2.5rem" }}>ServifyX</div>
                <div style={{ padding:"1.6rem", borderRadius:"20px", background:"rgba(10,16,32,.8)", border:"1px solid rgba(139,92,246,.28)", backdropFilter:"blur(24px)", boxShadow:"0 20px 60px rgba(0,0,0,.6)", marginBottom:"2rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.2rem" }}>
                    <div style={{ width:"42px", height:"42px", borderRadius:"12px", flexShrink:0, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", boxShadow:"0 4px 16px rgba(139,92,246,.4)" }}>🎉</div>
                    <div>
                      <div style={{ fontSize:".92rem", fontWeight:700, color:"#f1f5f9" }}>Join ServifyX</div>
                      <div style={{ fontSize:".72rem", color:"#64748b" }}>Create your free account</div>
                    </div>
                  </div>
                  {[["🚀","Real-time job bookings","#6366f1"],["🛡️","Verified & trusted platform","#10b981"],["📍","Connect with nearby pros","#06b6d4"],["💳","Secure payments built in","#f59e0b"]].map(([icon, label, color]) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:".55rem", marginBottom:".42rem" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", flexShrink:0, background:color, boxShadow:`0 0 8px ${color}70` }}/>
                      <span style={{ fontSize:".8rem", color:"#cbd5e1", fontWeight:500 }}>{icon} {label}</span>
                    </div>
                  ))}
                </div>

                {form.role === "provider" ? (
                  <div style={{ padding:".9rem 1rem", borderRadius:"14px", background:"rgba(139,92,246,.08)", border:"1px solid rgba(139,92,246,.25)", animation:"fadeUp .4s ease both" }}>
                    <div style={{ fontSize:".78rem", color:"#c4b5fd", fontWeight:700, marginBottom:".6rem" }}>🔧 Provider Benefits</div>
                    {["Live job alerts via Socket.IO","Set your own schedule & rates","10,000+ active customers"].map(t => (
                      <div key={t} style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".32rem" }}>
                        <div style={{ width:"14px", height:"14px", color:"#10b981", flexShrink:0 }}><IconCheck/></div>
                        <span style={{ fontSize:".78rem", color:"#94a3b8" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display:"flex", gap:"1.75rem" }}>
                    {[["10K+","Bookings"],["2K+","Providers"],["98%","Satisfaction"]].map(([n, l]) => (
                      <div key={l}>
                        <div style={{ fontSize:"1.25rem", fontWeight:800, background:"linear-gradient(135deg,#c4b5fd,#67e8f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{n}</div>
                        <div style={{ fontSize:".7rem", color:"#64748b", fontWeight:500 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right form ── */}
          <div style={{ flex:1, background:"linear-gradient(160deg,#0f172a 0%,#0a0f1e 100%)", padding:"3rem 2.5rem", display:"flex", alignItems:"center", overflowY:"auto" }}>
            <div className="rp-form-area" style={{ width:"100%", maxWidth:"400px", margin:"0 auto", animation:"fadeUp .5s ease both" }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}>

              <div style={{ display:"inline-flex", alignItems:"center", gap:".45rem", padding:".28rem 1rem", borderRadius:"100px", marginBottom:"1.25rem", background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.28)", color:"#6ee7b7", fontSize:".74rem", fontWeight:700, letterSpacing:".04em" }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite", boxShadow:"0 0 8px #10b98180" }}/>
                FREE TO JOIN
              </div>

              <h1 style={{ fontSize:"clamp(1.7rem,3.5vw,2.3rem)", fontWeight:900, letterSpacing:"-.03em", color:"#f1f5f9", lineHeight:1.1, marginBottom:".6rem" }}>
                Create your{" "}
                <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>ServifyX</span>
                {" "}account
              </h1>
              <p style={{ fontSize:".92rem", color:"#64748b", lineHeight:1.65, marginBottom:"2rem" }}>Join 10,000+ homeowners and 2,000+ verified providers.</p>

              {/* Role */}
              <div style={{ marginBottom:"1.2rem" }}>
                <label className="rp-label">Select Role</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconRole/></IcoWrap>
                  <select className="rp-select" value={form.role} onChange={set("role")}>
                    <option value="" disabled>-- Choose your role --</option>
                    <option value="user">🏠  Homeowner — I need services</option>
                    <option value="provider">🔧  Service Provider — I offer services</option>
                  </select>
                  <span style={{ pointerEvents:"none", position:"absolute", top:"50%", right:"1rem", transform:"translateY(-50%)", color:"#6366f1" }}><IconChevron/></span>
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom:"1.2rem" }}>
                <label className="rp-label">Full Name</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconUser/></IcoWrap>
                  <input className="rp-input" type="text" placeholder="Rajesh Kumar" value={form.name} onChange={set("name")} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom:"1.2rem" }}>
                <label className="rp-label">Email Address</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconMail/></IcoWrap>
                  <input className="rp-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:"1.75rem" }}>
                <label className="rp-label">Password</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconLock/></IcoWrap>
                  <input className="rp-input" type={showPass ? "text" : "password"} placeholder="Create a strong password" value={form.password} onChange={set("password")} style={{ paddingRight:"2.8rem" }} />
                  <button className="rp-eye" onClick={() => setShowPass(s => !s)} style={{ position:"absolute", top:"50%", right:".85rem", transform:"translateY(-50%)" }}>
                    {showPass ? <IconEyeOff/> : <IconEye/>}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              {error && <div className="rp-error" style={{ marginBottom:"1.2rem" }}>⚠️ {error}</div>}

              <button className="rp-btn" onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem" }}>
                      <span style={{ width:"18px", height:"18px", border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .8s linear infinite" }}/>
                      Creating account…
                    </span>
                  : `Create ${form.role === "provider" ? "Provider" : "Homeowner"} Account →`
                }
              </button>

              <p style={{ fontSize:".76rem", color:"#475569", textAlign:"center", lineHeight:1.65, marginTop:"1rem" }}>
                By signing up you agree to our{" "}
                <span className="rp-link">Terms of Service</span> and <span className="rp-link">Privacy Policy</span>.
              </p>

              {/* ── Switch to Login ── */}
              <p style={{ textAlign:"center", fontSize:".9rem", color:"#64748b", marginTop:".75rem" }}>
                Already have an account?{" "}
                <span className="rp-link" onClick={() => navigate("/login")}>Sign in</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}