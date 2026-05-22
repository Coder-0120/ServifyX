// LoginPage.jsx
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

  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem;
    background: rgba(10,15,30,.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,.15);
    box-shadow: 0 4px 32px rgba(0,0,0,.4);
  }
  .lp-logo {
    font-size: 1.5rem; font-weight: 900; letter-spacing: -.03em; cursor: pointer;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .lp-nav-links { display: flex; gap: 2rem; list-style: none; }
  .lp-nav-links a { color: #94a3b8; font-size: .875rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: color .2s; }
  .lp-nav-links a:hover { color: #a5b4fc; }
  .lp-nav-ghost {
    padding: .4rem 1.1rem; border-radius: 10px; border: 1.5px solid rgba(99,102,241,.4);
    background: transparent; color: #a5b4fc; font-size: .84rem; font-weight: 600;
    cursor: pointer; font-family: 'Poppins',sans-serif; transition: background .2s;
  }
  .lp-nav-ghost:hover { background: rgba(99,102,241,.14); }
  .lp-nav-solid {
    padding: .4rem 1.1rem; border-radius: 10px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4); color: #fff;
    font-size: .84rem; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif;
    box-shadow: 0 4px 18px rgba(99,102,241,.4); transition: all .2s;
  }
  .lp-nav-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,.55); }

  .lp-select, .lp-input {
    width: 100%; padding: .78rem 1rem .78rem 2.8rem;
    border-radius: 12px; border: 1.5px solid rgba(99,102,241,.22);
    background: rgba(15,23,42,.7); color: #f1f5f9;
    font-size: .92rem; font-family: 'Poppins',sans-serif; font-weight: 500;
    outline: none; transition: border-color .25s, box-shadow .25s, background .25s;
  }
  .lp-select { cursor: pointer; appearance: none; -webkit-appearance: none; }
  .lp-select option { background: #1e293b; color: #f1f5f9; }
  .lp-input::placeholder { color: #475569; }
  .lp-select:focus, .lp-input:focus { border-color: #6366f1; background: rgba(99,102,241,.08); box-shadow: 0 0 0 3px rgba(99,102,241,.18); }
  .lp-select:hover:not(:focus), .lp-input:hover:not(:focus) { border-color: rgba(99,102,241,.42); }

  .lp-btn {
    width: 100%; padding: .9rem; border-radius: 13px; border: none;
    background: linear-gradient(135deg,#6366f1,#06b6d4,#6366f1); background-size: 200% 200%;
    color: #fff; font-size: 1rem; font-weight: 700; font-family: 'Poppins',sans-serif;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 28px rgba(99,102,241,.5); transition: transform .25s, box-shadow .25s;
    animation: gradShift 4s ease infinite;
  }
  .lp-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent); }
  .lp-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(99,102,241,.65); }
  .lp-btn:hover::after { animation: shimmer .7s ease forwards; }
  .lp-btn:active { transform: translateY(0); }
  .lp-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

  .lp-eye { background:none; border:none; cursor:pointer; color:#475569; padding:0; display:flex; align-items:center; transition:color .2s; }
  .lp-eye:hover { color:#a5b4fc; }
  .lp-link { color:#6366f1; cursor:pointer; font-weight:700; transition:color .2s; text-decoration:none; }
  .lp-link:hover { color:#a5b4fc; text-decoration:underline; }
  .lp-error { padding:.65rem 1rem; border-radius:10px; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.28); color:#fca5a5; font-size:.84rem; font-weight:500; }
  .lp-label { font-size:.8rem; font-weight:600; color:#94a3b8; display:block; margin-bottom:.5rem; letter-spacing:.04em; text-transform:uppercase; }

  @media(max-width:768px) { .lp-side { display:none !important; } .lp-nav-links { display:none !important; } .lp-nav-auth { display:none !important; } }
  @media(max-width:500px) { .lp-form-area { padding:1.75rem 1.25rem !important; } }
`;

const IconMail    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>;
const IconLock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconRole    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconEye     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"18px",height:"18px"}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"18px",height:"18px"}}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconChevron = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"16px",height:"16px"}}><polyline points="6 9 12 15 18 9"/></svg>;

const IcoWrap = ({ children }) => (
  <div style={{ position:"absolute", top:"50%", left:".85rem", transform:"translateY(-50%)", width:"16px", height:"16px", color:"#6366f1", pointerEvents:"none" }}>{children}</div>
);

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ role:"", email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

 const handleSubmit = async () => {
  try {

    setError("");

    if (!form.role) {
      setError("Please select your role.");
      return;
    }

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    // API CALL
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
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
      navigate("/provider/dashboard");
    } else {
      navigate("/services");
    }

  } catch (error) {

    console.log(error);

    setError(
      error.response?.data?.message ||
      "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <>
      <style>{CSS}</style>

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-logo" onClick={() => navigate("/")}>ServifyX</div>
        <ul className="lp-nav-links">
          {["Home","Services","How It Works","Become Provider","Contact"].map(l => (
            <li key={l}><a>{l}</a></li>
          ))}
        </ul>
        <div className="lp-nav-auth" style={{ display:"flex", gap:".6rem" }}>
          <button className="lp-nav-ghost">Login</button>
          <button className="lp-nav-solid" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </nav>

      {/* ── Page ── */}
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"84px 1rem 2rem", background:"radial-gradient(ellipse 90% 55% at 50% 0%, rgba(99,102,241,.16) 0%, transparent 65%), #0f172a" }}>
        <div style={{ display:"flex", maxWidth:"920px", width:"100%", borderRadius:"26px", overflow:"hidden", border:"1px solid rgba(99,102,241,.2)", boxShadow:"0 40px 100px rgba(0,0,0,.65)", minHeight:"540px" }}>

          {/* ── Left panel ── */}
          <div className="lp-side" style={{ display:"flex", flex:"0 0 420px" }}>
            <div style={{ flex:1, position:"relative", overflow:"hidden", background:"radial-gradient(ellipse 90% 70% at 20% 50%, rgba(99,102,241,.2) 0%, transparent 70%), #080d1a", padding:"3rem 2.5rem", display:"flex", flexDirection:"column", justifyContent:"center", borderRight:"1px solid rgba(99,102,241,.12)" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(99,102,241,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.06) 1px,transparent 1px)", backgroundSize:"48px 48px", zIndex:0 }}/>
              <div style={{ position:"absolute", top:"15%", left:"10%", width:"180px", height:"180px", borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.12),transparent 70%)", zIndex:0 }}/>
              <div style={{ position:"absolute", bottom:"20%", right:"5%", width:"140px", height:"140px", borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,.1),transparent 70%)", zIndex:0 }}/>

              {[
                { pos:{top:"7%", right:"6%"},  anim:"floatA", delay:"0s",   emoji:"⚡", label:"Electrician nearby", color:"#f59e0b" },
                { pos:{top:"75%",left:"4%"},   anim:"floatB", delay:".7s",  emoji:"🔧", label:"Plumber online",     color:"#3b82f6" },
                { pos:{top:"44%",right:"2%"},  anim:"floatC", delay:"1.3s", emoji:"✅", label:"Verified Pro",       color:"#10b981" },
              ].map(({ pos, anim, delay, emoji, label, color }) => (
                <div key={label} style={{ position:"absolute", ...pos, padding:".48rem .9rem", borderRadius:"12px", background:"rgba(10,16,32,.9)", border:`1px solid ${color}40`, backdropFilter:"blur(12px)", fontSize:".76rem", fontWeight:600, color:"#e2e8f0", display:"flex", alignItems:"center", gap:".4rem", animation:`${anim} 3.8s ease-in-out ${delay} infinite`, whiteSpace:"nowrap", zIndex:3, boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>{emoji} {label}</div>
              ))}

              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:"1.75rem", fontWeight:900, letterSpacing:"-.03em", background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:"2.5rem" }}>ServifyX</div>
                <div style={{ padding:"1.6rem", borderRadius:"20px", background:"rgba(10,16,32,.8)", border:"1px solid rgba(99,102,241,.28)", backdropFilter:"blur(24px)", boxShadow:"0 20px 60px rgba(0,0,0,.6)", marginBottom:"2rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.1rem" }}>
                    <div style={{ width:"42px", height:"42px", borderRadius:"12px", flexShrink:0, background:"linear-gradient(135deg,#6366f1,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", boxShadow:"0 4px 16px rgba(99,102,241,.4)" }}>🏠</div>
                    <div>
                      <div style={{ fontSize:".92rem", fontWeight:700, color:"#f1f5f9" }}>Welcome back!</div>
                      <div style={{ fontSize:".72rem", color:"#64748b" }}>Sign in to your account</div>
                    </div>
                  </div>
                  {[["Booking Requested","#6366f1",true],["Provider Accepted","#10b981",true],["In Progress","#f59e0b",true],["Completed","#06b6d4",false]].map(([label, color, done]) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:".55rem", marginBottom:".38rem" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", flexShrink:0, background: done ? color : "#1e293b", boxShadow: done ? `0 0 8px ${color}70` : "none" }}/>
                      <span style={{ fontSize:".8rem", color: done ? "#cbd5e1" : "#475569", fontWeight: done ? 600 : 400 }}>{label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"1.75rem" }}>
                  {[["10K+","Bookings"],["2K+","Providers"],["98%","Satisfaction"]].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontSize:"1.25rem", fontWeight:800, background:"linear-gradient(135deg,#a5b4fc,#67e8f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{n}</div>
                      <div style={{ fontSize:".7rem", color:"#64748b", fontWeight:500 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right form ── */}
          <div style={{ flex:1, background:"linear-gradient(160deg,#0f172a 0%,#0a0f1e 100%)", padding:"3rem 2.5rem", display:"flex", alignItems:"center", overflowY:"auto" }}>
            <div className="lp-form-area" style={{ width:"100%", maxWidth:"400px", margin:"0 auto", animation:"fadeUp .5s ease both" }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}>

              <div style={{ display:"inline-flex", alignItems:"center", gap:".45rem", padding:".28rem 1rem", borderRadius:"100px", marginBottom:"1.25rem", background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.3)", color:"#a5b4fc", fontSize:".74rem", fontWeight:700, letterSpacing:".04em" }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite", boxShadow:"0 0 8px #10b98180" }}/>
                SECURE LOGIN
              </div>

              <h1 style={{ fontSize:"clamp(1.7rem,3.5vw,2.3rem)", fontWeight:900, letterSpacing:"-.03em", color:"#f1f5f9", lineHeight:1.1, marginBottom:".6rem" }}>
                Sign in to{" "}
                <span style={{ background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>ServifyX</span>
              </h1>
              <p style={{ fontSize:".92rem", color:"#64748b", lineHeight:1.65, marginBottom:"2rem" }}>Manage your bookings and services in real time.</p>

              {/* Role */}
              <div style={{ marginBottom:"1.2rem" }}>
                <label className="lp-label">Select Role</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconRole/></IcoWrap>
                  <select className="lp-select" value={form.role} onChange={set("role")}>
                    <option value="" disabled>-- Choose your role --</option>
                    <option value="user">🏠  Homeowner — I need services</option>
                    <option value="provider">🔧  Service Provider — I offer services</option>
                  </select>
                  <span style={{ pointerEvents:"none", position:"absolute", top:"50%", right:"1rem", transform:"translateY(-50%)", color:"#6366f1" }}><IconChevron/></span>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom:"1.2rem" }}>
                <label className="lp-label">Email Address</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconMail/></IcoWrap>
                  <input className="lp-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:"1.75rem" }}>
                <label className="lp-label">Password</label>
                <div style={{ position:"relative" }}>
                  <IcoWrap><IconLock/></IcoWrap>
                  <input className="lp-input" type={showPass ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={set("password")} style={{ paddingRight:"2.8rem" }} />
                  <button className="lp-eye" onClick={() => setShowPass(s => !s)} style={{ position:"absolute", top:"50%", right:".85rem", transform:"translateY(-50%)" }}>
                    {showPass ? <IconEyeOff/> : <IconEye/>}
                  </button>
                </div>
              </div>

              {error && <div className="lp-error" style={{ marginBottom:"1.2rem" }}>⚠️ {error}</div>}

              <button className="lp-btn" onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem" }}>
                      <span style={{ width:"18px", height:"18px", border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .8s linear infinite" }}/>
                      Signing in…
                    </span>
                  : `Sign In${form.role === "user" ? " as Homeowner" : form.role === "provider" ? " as Provider" : ""} →`
                }
              </button>

              {/* ── Switch to Register ── */}
              <p style={{ textAlign:"center", fontSize:".9rem", color:"#64748b", marginTop:"1.5rem" }}>
                Don't have an account?{" "}
                <span className="lp-link" onClick={() => navigate("/register")}>Create one free</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}