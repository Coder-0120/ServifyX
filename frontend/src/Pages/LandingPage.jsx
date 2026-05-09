import { useState, useEffect, useRef } from "react";

// ── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target, duration]);
  return value;
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Zap = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Shield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Activity = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const MapPin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CreditCard = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const Rocket = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
const StarIcon = () => <svg viewBox="0 0 24 24" fill="#f59e0b" style={{width:"100%",height:"100%"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const MenuIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:"100%",height:"100%"}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Twitter = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:"100%",height:"100%"}}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
const Github = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:"100%",height:"100%"}}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
const Linkedin = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:"100%",height:"100%"}}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  { emoji:"⚡", title:"Electrician",  desc:"Wiring, repairs & installations",    price:"₹299", color:"#f59e0b" },
  { emoji:"🔧", title:"Plumber",      desc:"Leaks, pipes & drainage solutions",   price:"₹199", color:"#3b82f6" },
  { emoji:"🪚", title:"Carpenter",    desc:"Furniture, doors & woodwork",         price:"₹349", color:"#8b5cf6" },
  { emoji:"❄️", title:"AC Repair",    desc:"Service, gas refill & expert repairs",price:"₹399", color:"#06b6d4" },
  { emoji:"🧹", title:"Cleaning",     desc:"Deep cleaning & sanitization",        price:"₹149", color:"#10b981" },
  { emoji:"🎨", title:"Painter",      desc:"Interior & exterior painting",        price:"₹249", color:"#f43f5e" },
];

const FEATURES = [
  { Icon:Zap,        title:"Real-Time Booking",         desc:"Socket.IO-powered instant connection. The moment you book, nearby providers get a live notification — zero delay.",               color:"#f59e0b" },
  { Icon:Shield,     title:"Secure JWT Auth",            desc:"Industry-standard JWT tokens with role-based access control protect every user, provider, and admin session.",                  color:"#6366f1" },
  { Icon:Activity,   title:"Live Status Tracking",       desc:"Watch your booking move through Requested → Accepted → In Progress → Completed in real time on your screen.",                  color:"#06b6d4" },
  { Icon:MapPin,     title:"Nearby Providers",           desc:"Geolocation matching surfaces the closest verified professionals so you get faster arrivals and lower travel costs.",           color:"#10b981" },
  { Icon:CreditCard, title:"Online Payments",            desc:"Seamless Razorpay / Stripe integration. Pay securely after the job is done — no upfront payment required.",                    color:"#f43f5e" },
  { Icon:Rocket,     title:"Fast & Reliable",            desc:"MERN stack built for high concurrency. Optimized API response times under 100ms and zero scheduled downtime.",                  color:"#8b5cf6" },
];

const STEPS = [
  { emoji:"🔍", num:"01", title:"Choose Service",     desc:"Browse 15+ categories and find exactly the help you need with smart location filters.",            color:"#6366f1" },
  { emoji:"📱", num:"02", title:"Book Instantly",     desc:"Pick a time slot, confirm your address, and place a booking in under 60 seconds.",                  color:"#06b6d4" },
  { emoji:"✅", num:"03", title:"Provider Accepts",   desc:"Nearby verified professionals receive a live push notification and accept your request in real time.",color:"#10b981" },
  { emoji:"🏆", num:"04", title:"Service Completed",  desc:"Your pro arrives, work gets done, you pay securely, and leave a rating for the community.",         color:"#8b5cf6" },
];

const STATUS_STEPS = [
  { label:"Booking Requested",  sub:"User placed a request for AC Repair",          color:"#6366f1", badge:"New"     },
  { label:"Provider Notified",  sub:"3 nearby providers received live notification", color:"#f59e0b", badge:"Live"    },
  { label:"Request Accepted",   sub:"Rajesh Kumar accepted · ETA 25 min",           color:"#06b6d4", badge:"Matched" },
  { label:"Service Completed",  sub:"Booking marked done · Payment processed",      color:"#10b981", badge:"Done"    },
];

const TESTIMONIALS = [
  { name:"Priya Sharma",  role:"Homeowner, Delhi",              text:"ServifyX connected me with an electrician in under 5 minutes. The real-time tracking made the whole experience completely stress-free.", rating:5, avatar:"PS", color:"#8b5cf6" },
  { name:"Rahul Verma",   role:"Apartment Resident, Mumbai",    text:"I booked a plumber at midnight and someone accepted within minutes. Incredible platform — feels like magic compared to old methods.",     rating:5, avatar:"RV", color:"#06b6d4" },
  { name:"Ananya Iyer",   role:"Working Professional, Bangalore",text:"The live status updates from Requested → Completed gave me complete peace of mind. 10/10 would recommend to every homeowner.",          rating:5, avatar:"AI", color:"#f59e0b" },
];

// ── Global Styles (injected once) ────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; overflow-x: hidden; }

  @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(-2deg)}  50%{transform:translateY(-12px) rotate(2deg)} }
  @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(2deg)}   50%{transform:translateY(-9px) rotate(-1deg)} }
  @keyframes floatC  { 0%,100%{transform:translateY(0) rotate(-1deg)}  50%{transform:translateY(-14px) rotate(3deg)} }
  @keyframes floatD  { 0%,100%{transform:translateY(0)}                50%{transform:translateY(-8px)} }
  @keyframes floatMain{ 0%,100%{transform:translateY(0)}               50%{transform:translateY(-14px)} }
  @keyframes pulse   { 0%,100%{opacity:1; transform:scale(1)}          50%{opacity:.5; transform:scale(.9)} }
  @keyframes spin    { from{transform:rotate(0deg)}                    to{transform:rotate(360deg)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)}      to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown{ from{opacity:0;transform:translateY(-12px)}     to{opacity:1;transform:translateY(0)} }
  @keyframes gradMove{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .fade-up      { animation: fadeUp .75s ease both; }
  .fade-up-d1   { animation: fadeUp .75s ease .15s both; }
  .fade-up-d2   { animation: fadeUp .75s ease .3s both; }

  .fc:hover { transform:translateY(-5px) scale(1.01) !important; }
  .sc:hover { transform:translateY(-6px) scale(1.015) !important; }
  .tc:hover { transform:translateY(-4px) !important; }

  .nav-link:hover  { color: #a5b4fc !important; }
  .foot-link:hover { color: #a5b4fc !important; }
  .soc:hover       { color: #a5b4fc !important; border-color: rgba(99,102,241,.35) !important; }

  .btn-main:hover   { transform:translateY(-2px); box-shadow:0 10px 40px rgba(99,102,241,.6) !important; }
  .btn-ghost:hover  { background:rgba(99,102,241,.14) !important; }
  .book-btn:hover   { filter:brightness(1.15); }

  @media(max-width:900px){
    .hero-grid      { grid-template-columns:1fr !important; text-align:center; }
    .hero-visual    { display:none !important; }
    .hero-btns      { justify-content:center !important; }
    .hero-trust     { justify-content:center !important; }
    .nav-links      { display:none !important; }
    .nav-auth       { display:none !important; }
    .hamburger      { display:flex !important; }
    .footer-grid    { grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:540px){
    .footer-grid    { grid-template-columns:1fr !important; }
    .stats-grid     { grid-template-columns:1fr 1fr !important; }
  }
`;

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  const navLinks = [
    ["Home","hero"],["Services","services"],["How It Works","howitworks"],
    ["Become Provider","cta"],["Contact","footer-sec"],
  ];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        height:"66px", display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 2rem",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        background: scrolled ? "rgba(15,23,42,.92)" : "rgba(15,23,42,.7)",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,.18)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,.35)" : "none",
        transition:"all .35s ease",
      }}>
        {/* Logo */}
        <div onClick={() => window.scrollTo({top:0,behavior:"smooth"})} style={{
          fontSize:"1.5rem", fontWeight:900, letterSpacing:"-.03em", cursor:"pointer",
          background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>ServifyX</div>

        {/* Desktop links */}
        <ul className="nav-links" style={{ display:"flex", gap:"2rem", listStyle:"none" }}>
          {navLinks.map(([label, id]) => (
            <li key={label}>
              <span className="nav-link" onClick={() => go(id)} style={{
                color:"#94a3b8", fontSize:".875rem", fontWeight:500,
                cursor:"pointer", transition:"color .2s",
              }}>{label}</span>
            </li>
          ))}
        </ul>

        {/* Auth buttons */}
        <div className="nav-auth" style={{ display:"flex", gap:".6rem" }}>
          <button className="btn-ghost" onClick={() => {}} style={{
            padding:".42rem 1.1rem", borderRadius:"10px", border:"1.5px solid rgba(99,102,241,.4)",
            background:"transparent", color:"#a5b4fc", fontSize:".84rem", fontWeight:600,
            cursor:"pointer", fontFamily:"inherit", transition:"background .25s",
          }}>Login</button>
          <button className="btn-main" onClick={() => {}} style={{
            padding:".42rem 1.1rem", borderRadius:"10px", border:"none",
            background:"linear-gradient(135deg,#6366f1,#06b6d4)", color:"#fff",
            fontSize:".84rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit",
            transition:"all .25s", boxShadow:"0 4px 20px rgba(99,102,241,.4)",
          }}>Sign Up</button>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} style={{
          display:"none", width:"36px", height:"36px", padding:"7px",
          border:"1px solid rgba(99,102,241,.3)", borderRadius:"10px",
          background:"rgba(99,102,241,.08)", color:"#a5b4fc", cursor:"pointer",
        }}>
          {menuOpen ? <CloseIcon/> : <MenuIcon/>}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:"fixed", top:"66px", left:0, right:0, zIndex:99,
          background:"rgba(15,23,42,.97)", backdropFilter:"blur(20px)",
          padding:"1rem 2rem 1.5rem",
          borderBottom:"1px solid rgba(99,102,241,.15)",
          animation:"fadeDown .25s ease",
        }}>
          {navLinks.map(([label, id]) => (
            <div key={label} onClick={() => go(id)} style={{
              padding:".7rem 0", color:"#94a3b8", fontSize:"1rem", fontWeight:500,
              cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,.05)",
              transition:"color .2s",
            }}>{label}</div>
          ))}
          <div style={{ display:"flex", gap:".75rem", marginTop:"1rem" }}>
            <button style={{ flex:1, padding:".6rem", borderRadius:"10px", border:"1.5px solid rgba(99,102,241,.4)", background:"transparent", color:"#a5b4fc", fontFamily:"inherit", fontWeight:600, cursor:"pointer" }}>Login</button>
            <button style={{ flex:1, padding:".6rem", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#6366f1,#06b6d4)", color:"#fff", fontFamily:"inherit", fontWeight:600, cursor:"pointer" }}>Sign Up</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden", paddingTop:"66px",
      background:"radial-gradient(ellipse 90% 60% at 50% -10%, rgba(99,102,241,.18) 0%, transparent 65%), #0f172a",
    }}>
      {/* Subtle grid bg */}
      <div style={{
        position:"absolute", inset:0, zIndex:0,
        backgroundImage:"linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)",
        backgroundSize:"60px 60px",
      }}/>

      <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"4rem 2rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3.5rem", alignItems:"center", position:"relative", zIndex:1 }} className="hero-grid">

        {/* Left */}
        <div className="fade-up">
          {/* Live badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:".5rem",
            padding:".32rem 1rem", borderRadius:"100px", marginBottom:"1.5rem",
            background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.28)",
            color:"#a5b4fc", fontSize:".78rem", fontWeight:700,
          }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite", boxShadow:"0 0 8px #10b98180" }}/>
            Live Platform · MERN Stack · Socket.IO
          </div>

          <h1 style={{
            fontSize:"clamp(2.2rem,5vw,3.9rem)", fontWeight:900, lineHeight:1.08,
            letterSpacing:"-.035em", color:"#f1f5f9", marginBottom:"1.3rem",
          }}>
            Book{" "}
            <span style={{ background:"linear-gradient(135deg,#6366f1,#06b6d4,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Trusted</span>
            {" "}Home Services{" "}
            <span style={{ background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Instantly</span>
          </h1>

          <p style={{ fontSize:"1.05rem", color:"#94a3b8", lineHeight:1.75, marginBottom:"2.5rem", maxWidth:"480px" }}>
            Real-time marketplace connecting homeowners with verified local professionals for 15+ services — live booking, live tracking, zero wait.
          </p>

          <div className="hero-btns" style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2.75rem" }}>
            <button className="btn-main" style={{
              display:"flex", alignItems:"center", gap:".5rem",
              padding:".85rem 2rem", borderRadius:"14px", border:"none",
              background:"linear-gradient(135deg,#6366f1,#06b6d4)", color:"#fff",
              fontSize:".95rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              boxShadow:"0 4px 28px rgba(99,102,241,.45)", transition:"all .3s",
            }}>
              Book a Service <span style={{ width:"16px", height:"16px" }}><ArrowRight/></span>
            </button>
            <button className="btn-ghost" style={{
              padding:".85rem 2rem", borderRadius:"14px",
              border:"1.5px solid rgba(99,102,241,.35)",
              background:"rgba(99,102,241,.07)", color:"#a5b4fc",
              fontSize:".95rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              transition:"background .25s",
            }}>
              Become a Provider
            </button>
          </div>

          {/* Trust strip */}
          <div className="hero-trust" style={{ display:"flex", gap:"2rem", flexWrap:"wrap" }}>
            {[["10K+","Bookings Done"],["2K+","Verified Providers"],["98%","Satisfaction Rate"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize:"1.3rem", fontWeight:800, background:"linear-gradient(135deg,#a5b4fc,#67e8f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{n}</div>
                <div style={{ fontSize:".72rem", color:"#64748b", fontWeight:500, marginTop:"1px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Illustration */}
        <div className="hero-visual fade-up-d1" style={{ position:"relative", height:"500px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {/* Glow ring */}
          <div style={{
            position:"absolute", width:"360px", height:"360px", borderRadius:"50%",
            background:"radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%)",
            border:"1px solid rgba(99,102,241,.12)",
          }}/>
          <div style={{
            position:"absolute", width:"280px", height:"280px", borderRadius:"50%",
            border:"1px dashed rgba(6,182,212,.15)",
          }}/>

          {/* Floating chips */}
          {[
            { style:{top:"5%",  left:"3%"  }, anim:"floatA", emoji:"⚡", label:"Electrician nearby",  color:"#f59e0b" },
            { style:{top:"78%", left:"0%"  }, anim:"floatB", emoji:"🔧", label:"Plumber online",      color:"#3b82f6" },
            { style:{top:"8%",  right:"2%" }, anim:"floatC", emoji:"✅", label:"Verified Pro",        color:"#10b981" },
            { style:{top:"80%", right:"3%" }, anim:"floatD", emoji:"🚀", label:"Live booking",        color:"#8b5cf6" },
          ].map(({ style, anim, emoji, label, color }) => (
            <div key={label} style={{
              position:"absolute", ...style,
              padding:".5rem .9rem", borderRadius:"12px",
              background:"rgba(15,23,42,.85)", border:`1px solid ${color}35`,
              backdropFilter:"blur(12px)", fontSize:".78rem", fontWeight:600,
              color:"#e2e8f0", display:"flex", alignItems:"center", gap:".4rem",
              animation:`${anim} ${3.5}s ease-in-out infinite`, whiteSpace:"nowrap", zIndex:3,
            }}>{emoji} {label}</div>
          ))}

          {/* Central booking card */}
          <div style={{
            position:"relative", zIndex:2, width:"230px", padding:"1.6rem",
            borderRadius:"22px",
            background:"rgba(15,23,42,.85)",
            border:"1px solid rgba(99,102,241,.25)",
            backdropFilter:"blur(24px)",
            boxShadow:"0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.1)",
            animation:"floatMain 4s ease-in-out infinite",
          }}>
            {/* Card header */}
            <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.1rem" }}>
              <div style={{
                width:"40px", height:"40px", borderRadius:"11px", flexShrink:0,
                background:"linear-gradient(135deg,#6366f1,#06b6d4)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem",
              }}>🏠</div>
              <div>
                <div style={{ fontSize:".88rem", fontWeight:700, color:"#f1f5f9" }}>AC Repair</div>
                <div style={{ fontSize:".7rem", color:"#64748b" }}>Booking confirmed</div>
              </div>
            </div>

            {/* Accepted chip */}
            <div style={{
              padding:".65rem .85rem", borderRadius:"10px", marginBottom:".9rem",
              background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.25)",
            }}>
              <div style={{ fontSize:".74rem", color:"#10b981", fontWeight:700 }}>✓ Provider Accepted</div>
              <div style={{ fontSize:".7rem", color:"#64748b", marginTop:"2px" }}>Rajesh Kumar · ETA 25 min</div>
            </div>

            {/* Status list */}
            {[["Requested",true],["Accepted",true],["In Progress",true],["Completed",false]].map(([s,done]) => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".32rem" }}>
                <div style={{
                  width:"8px", height:"8px", borderRadius:"50%", flexShrink:0,
                  background: done ? "#10b981" : "#1e293b",
                  boxShadow: done ? "0 0 8px #10b98170" : "none",
                  transition:"all .4s",
                }}/>
                <span style={{ fontSize:".73rem", color: done ? "#e2e8f0" : "#475569", fontWeight: done ? 600 : 400 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" style={{ padding:"6rem 2rem", background:"rgba(99,102,241,.02)", borderTop:"1px solid rgba(99,102,241,.08)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <Badge>Platform Features</Badge>
          <SectionTitle>Everything you need,<br/>built for scale</SectionTitle>
          <SectionSub>Production-grade capabilities powering every booking on ServifyX</SectionSub>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1.4rem" }}>
          {FEATURES.map(({ Icon, title, desc, color }) => (
            <div key={title} className="fc" style={{
              padding:"1.75rem", borderRadius:"18px",
              background:"rgba(15,23,42,.6)", border:`1px solid ${color}1a`,
              backdropFilter:"blur(10px)", transition:"transform .3s, box-shadow .3s",
              position:"relative", overflow:"hidden", cursor:"default",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 16px 48px ${color}18`; e.currentTarget.style.borderColor=`${color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=`${color}1a`; }}
            >
              <div style={{ position:"absolute", top:0, right:0, width:"80px", height:"80px", borderRadius:"0 18px 0 80px", background:`${color}07` }}/>
              <div style={{
                width:"48px", height:"48px", borderRadius:"13px", padding:"10px",
                background:`${color}15`, border:`1px solid ${color}28`,
                color, marginBottom:"1.25rem",
              }}><Icon/></div>
              <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#f1f5f9", marginBottom:".45rem" }}>{title}</h3>
              <p style={{ fontSize:".86rem", color:"#94a3b8", lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ padding:"6rem 2rem" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <Badge>Popular Services</Badge>
          <SectionTitle>What can we help you with?</SectionTitle>
          <SectionSub>From quick fixes to complete home makeovers — find verified experts for every need</SectionSub>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:"1.4rem" }}>
          {SERVICES.map(({ emoji, title, desc, price, color }) => (
            <div key={title} className="sc" style={{
              padding:"1.75rem", borderRadius:"18px",
              background:"rgba(15,23,42,.7)", border:`1px solid ${color}18`,
              transition:"transform .3s, box-shadow .3s", cursor:"pointer",
              position:"relative", overflow:"hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 20px 52px ${color}1e`; e.currentTarget.style.borderColor=`${color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=`${color}18`; }}
            >
              <div style={{ position:"absolute", top:"-22px", right:"-22px", width:"84px", height:"84px", borderRadius:"50%", background:`${color}07` }}/>
              <span style={{ fontSize:"2.6rem", display:"block", marginBottom:".9rem" }}>{emoji}</span>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:"#f1f5f9", marginBottom:".4rem" }}>{title}</h3>
              <p style={{ fontSize:".84rem", color:"#94a3b8", lineHeight:1.6, marginBottom:"1.3rem" }}>{desc}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:"1.1rem", fontWeight:800, color }}>{`From ${price}`}</span>
                <button className="book-btn" style={{
                  padding:".38rem 1rem", borderRadius:"8px",
                  border:`1.5px solid ${color}38`, background:`${color}0e`,
                  color, fontSize:".8rem", fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit", transition:"filter .2s",
                }}>Book Now →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="howitworks" style={{ padding:"6rem 2rem", background:"rgba(99,102,241,.025)", borderTop:"1px solid rgba(99,102,241,.07)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <Badge>How It Works</Badge>
          <SectionTitle>From booking to done in 4 steps</SectionTitle>
          <SectionSub>ServifyX removes every friction point between a home problem and its solution</SectionSub>
        </div>

        <div style={{ position:"relative" }}>
          {/* Connector line */}
          <div style={{
            position:"absolute", top:"36px", left:"12.5%", right:"12.5%", height:"2px",
            background:"linear-gradient(90deg,#6366f1,#06b6d4,#10b981,#8b5cf6)",
            opacity:.35, zIndex:0,
          }}/>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"0", position:"relative", zIndex:1 }}>
            {STEPS.map(({ emoji, num, title, desc, color }) => (
              <div key={title} style={{
                padding:"2rem 1.5rem", textAlign:"center", transition:"transform .3s", cursor:"default",
              }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-5px)"}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
              >
                <div style={{
                  width:"58px", height:"58px", borderRadius:"50%", margin:"0 auto 1.1rem",
                  background:`linear-gradient(135deg,${color},${color}88)`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem",
                  boxShadow:`0 8px 24px ${color}35`,
                }}>{emoji}</div>
                <div style={{ fontSize:".7rem", color, fontWeight:700, letterSpacing:".1em", marginBottom:".5rem" }}>STEP {num}</div>
                <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#f1f5f9", marginBottom:".45rem" }}>{title}</h3>
                <p style={{ fontSize:".84rem", color:"#94a3b8", lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Live Booking Showcase ────────────────────────────────────────────────────
function LiveBooking() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % 4), 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="live-booking" style={{ padding:"6rem 2rem" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <Badge>Real-Time Dashboard</Badge>
          <SectionTitle>Watch a booking unfold live</SectionTitle>
          <SectionSub>Powered by Socket.IO — every status change is pushed instantly to user and provider</SectionSub>
        </div>

        <div style={{
          maxWidth:"680px", margin:"0 auto", padding:"2.5rem", borderRadius:"24px",
          background:"rgba(15,23,42,.85)", border:"1px solid rgba(99,102,241,.2)",
          backdropFilter:"blur(20px)", boxShadow:"0 24px 64px rgba(0,0,0,.4)",
        }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.75rem", paddingBottom:"1.25rem", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
            <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#10b981", animation:"pulse 1.5s infinite", boxShadow:"0 0 12px #10b98180", display:"inline-block" }}/>
            <span style={{ fontSize:".85rem", fontWeight:600, color:"#10b981" }}>Live Booking Feed</span>
            <span style={{ marginLeft:"auto", fontSize:".76rem", color:"#475569" }}>Socket.IO connected</span>
          </div>

          {/* Steps */}
          {STATUS_STEPS.map(({ label, sub, color, badge }, i) => (
            <div key={label} style={{
              display:"flex", alignItems:"center", gap:"1rem",
              padding:".85rem 1rem", borderRadius:"12px", marginBottom:".55rem",
              background: active >= i ? `${color}0f` : "transparent",
              border: active >= i ? `1px solid ${color}28` : "1px solid transparent",
              transition:"all .45s ease",
            }}>
              <div style={{
                width:"12px", height:"12px", borderRadius:"50%", flexShrink:0,
                background: active >= i ? color : "#1e293b",
                boxShadow: active >= i ? `0 0 14px ${color}80` : "none",
                transition:"all .45s ease",
              }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:".9rem", fontWeight: active >= i ? 600 : 400, color: active >= i ? "#f1f5f9" : "#475569" }}>{label}</div>
                <div style={{ fontSize:".76rem", color:"#475569", marginTop:"1px" }}>{sub}</div>
              </div>
              {active >= i && (
                <div style={{
                  padding:".18rem .65rem", borderRadius:"100px",
                  background:`${color}18`, color, fontSize:".73rem", fontWeight:700,
                }}>{badge}</div>
              )}
              {active === i && (
                <div style={{
                  width:"15px", height:"15px", borderRadius:"50%", flexShrink:0,
                  border:`2px solid ${color}`, borderTopColor:"transparent",
                  animation:"spin .85s linear infinite",
                }}/>
              )}
            </div>
          ))}

          <div style={{
            marginTop:"1.5rem", padding:"1rem 1.25rem", borderRadius:"12px",
            background:"rgba(16,185,129,.05)", border:"1px solid rgba(16,185,129,.18)",
            fontSize:".8rem", color:"#6ee7b7", display:"flex", gap:".5rem", alignItems:"center",
          }}>
            <span>⚡</span>
            <span>Average booking-to-acceptance time: <strong>under 3 minutes</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef();
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold:.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const b = useCountUp(10000, 2000, started);
  const p = useCountUp(2000,  2000, started);
  const sv= useCountUp(15,    1400, started);
  const sa= useCountUp(98,    2000, started);

  const fmt = (v, target) => {
    if (v >= 1000) return (v / 1000).toFixed(v >= target ? 0 : 1) + "K+";
    if (v >= target) return v + (target < 100 ? "+" : "%");
    return v + "";
  };

  const STATS = [
    { val: b  >= 10000 ? "10K+" : fmt(b,10000),  label:"Total Bookings",       sub:"and counting",    color:"#6366f1" },
    { val: p  >= 2000  ? "2K+"  : fmt(p,2000),   label:"Verified Providers",   sub:"across 12 cities",color:"#06b6d4" },
    { val: sv + "+",                               label:"Service Categories",   sub:"more coming soon",color:"#10b981" },
    { val: sa + "%",                               label:"Customer Satisfaction",sub:"based on ratings", color:"#f59e0b" },
  ];

  return (
    <section ref={ref} style={{ padding:"6rem 2rem", background:"rgba(99,102,241,.03)", borderTop:"1px solid rgba(99,102,241,.07)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <Badge>By the Numbers</Badge>
          <SectionTitle>Trusted by thousands across India</SectionTitle>
        </div>
        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"1.4rem" }}>
          {STATS.map(({ val, label, sub, color }) => (
            <div key={label} style={{
              padding:"2rem 1.5rem", borderRadius:"18px", textAlign:"center",
              background:"rgba(15,23,42,.7)", border:`1px solid ${color}18`,
            }}>
              <div style={{ fontSize:"2.6rem", fontWeight:900, color, lineHeight:1, marginBottom:".45rem", letterSpacing:"-.02em" }}>{val}</div>
              <div style={{ fontSize:".95rem", fontWeight:700, color:"#e2e8f0", marginBottom:".3rem" }}>{label}</div>
              <div style={{ fontSize:".8rem", color:"#64748b" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section id="testimonials" style={{ padding:"6rem 2rem" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <Badge>Testimonials</Badge>
          <SectionTitle>What our customers say</SectionTitle>
          <SectionSub>Real feedback from real homeowners across India</SectionSub>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:"1.4rem" }}>
          {TESTIMONIALS.map(({ name, role, text, rating, avatar, color }) => (
            <div key={name} className="tc" style={{
              padding:"1.75rem", borderRadius:"18px",
              background:"rgba(15,23,42,.7)", border:`1px solid ${color}22`,
              transition:"transform .3s, box-shadow .3s",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow=`0 18px 48px ${color}15`}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
            >
              <div style={{ display:"flex", gap:".35rem", marginBottom:".2rem" }}>
                {Array(rating).fill(0).map((_,i) => <span key={i} style={{ width:"14px", height:"14px", color:"#f59e0b" }}><StarIcon/></span>)}
              </div>
              <p style={{ fontSize:".88rem", color:"#cbd5e1", lineHeight:1.72, margin:"1rem 0", fontStyle:"italic" }}>"{text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                <div style={{
                  width:"44px", height:"44px", borderRadius:"50%", flexShrink:0,
                  background:`linear-gradient(135deg,${color},${color}80)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:".84rem", fontWeight:700, color:"#fff",
                }}>{avatar}</div>
                <div>
                  <div style={{ fontSize:".9rem", fontWeight:700, color:"#f1f5f9" }}>{name}</div>
                  <div style={{ fontSize:".75rem", color:"#64748b" }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ───────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section id="cta" style={{
      padding:"6rem 2rem", textAlign:"center",
      background:"linear-gradient(135deg,rgba(99,102,241,.14) 0%,rgba(6,182,212,.07) 50%,rgba(139,92,246,.12) 100%)",
      borderTop:"1px solid rgba(99,102,241,.14)", borderBottom:"1px solid rgba(99,102,241,.14)",
    }}>
      <div style={{ maxWidth:"660px", margin:"0 auto" }}>
        <div style={{ fontSize:"2.8rem", marginBottom:"1rem" }}>🏠</div>
        <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:900, color:"#f1f5f9", letterSpacing:"-.03em", marginBottom:"1rem" }}>
          Need help at home?<br/>Book trusted experts now.
        </h2>
        <p style={{ fontSize:"1.05rem", color:"#94a3b8", lineHeight:1.7, marginBottom:"2.5rem" }}>
          Join 10,000+ homeowners who solved their home problems in minutes with ServifyX.
        </p>
        <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-main" style={{
            padding:".9rem 2.5rem", borderRadius:"14px", border:"none",
            background:"linear-gradient(135deg,#6366f1,#06b6d4)", color:"#fff",
            fontSize:"1rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            boxShadow:"0 4px 28px rgba(99,102,241,.45)", transition:"all .3s",
          }}>Get Started Free</button>
          <button className="btn-ghost" style={{
            padding:".9rem 2.5rem", borderRadius:"14px",
            border:"1.5px solid rgba(99,102,241,.35)",
            background:"rgba(99,102,241,.07)", color:"#a5b4fc",
            fontSize:"1rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            transition:"background .25s",
          }}>Explore Services</button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const col = { fontSize:".84rem", color:"#64748b", fontFamily:"inherit" };
  return (
    <footer id="footer-sec" style={{ background:"#020617", padding:"4rem 2rem 2rem" }}>
      <div className="footer-grid" style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"3rem", paddingBottom:"3rem", borderBottom:"1px solid rgba(255,255,255,.06)" }}>

        <div>
          <div style={{ fontSize:"1.45rem", fontWeight:900, letterSpacing:"-.03em", background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:".7rem" }}>ServifyX</div>
          <p style={{ ...col, lineHeight:1.7, marginBottom:"1.5rem", maxWidth:"300px" }}>India's fastest-growing real-time home services marketplace. Built on the MERN stack with Socket.IO for instant bookings.</p>
          <div style={{ display:"flex", gap:".65rem" }}>
            {[[Twitter,"Twitter"],[Github,"Github"],[Linkedin,"Linkedin"]].map(([Icon, name]) => (
              <div key={name} className="soc" style={{
                width:"36px", height:"36px", borderRadius:"10px", padding:"8px",
                background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)",
                color:"#64748b", cursor:"pointer", transition:"all .25s",
              }}><Icon/></div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize:".8rem", fontWeight:700, color:"#e2e8f0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:"1.2rem" }}>Services</div>
          {["Electrician","Plumber","Carpenter","AC Repair","Cleaning","Painter"].map(l => (
            <a key={l} className="foot-link" style={{ ...col, display:"block", marginBottom:".55rem", cursor:"pointer", textDecoration:"none", transition:"color .2s" }}>{l}</a>
          ))}
        </div>

        <div>
          <div style={{ fontSize:".8rem", fontWeight:700, color:"#e2e8f0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:"1.2rem" }}>Company</div>
          {["About Us","Careers","Blog","Press","Partners"].map(l => (
            <a key={l} className="foot-link" style={{ ...col, display:"block", marginBottom:".55rem", cursor:"pointer", textDecoration:"none", transition:"color .2s" }}>{l}</a>
          ))}
        </div>

        <div>
          <div style={{ fontSize:".8rem", fontWeight:700, color:"#e2e8f0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:"1.2rem" }}>Contact</div>
          {["hello@servifyx.in","+91 98765 43210","Dehradun, Uttarakhand"].map(l => (
            <a key={l} className="foot-link" style={{ ...col, display:"block", marginBottom:".55rem", cursor:"pointer", textDecoration:"none", transition:"color .2s" }}>{l}</a>
          ))}
          <div style={{ marginTop:"1.2rem", fontSize:".8rem", fontWeight:700, color:"#e2e8f0", letterSpacing:".06em", textTransform:"uppercase", marginBottom:".8rem" }}>Legal</div>
          {["Privacy Policy","Terms of Service"].map(l => (
            <a key={l} className="foot-link" style={{ ...col, display:"block", marginBottom:".5rem", cursor:"pointer", textDecoration:"none", transition:"color .2s" }}>{l}</a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"2rem auto 0", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
        <div style={{ fontSize:".8rem", color:"#334155" }}>© 2025 ServifyX. Built with ❤️ on the MERN Stack.</div>
        <div style={{ fontSize:".8rem", color:"#334155" }}>Real-time · Verified · Instant</div>
      </div>
    </footer>
  );
}

// ── Shared tiny components ────────────────────────────────────────────────────
function Badge({ children }) {
  return (
    <div style={{
      display:"inline-block", padding:".28rem .95rem", borderRadius:"100px", marginBottom:"1rem",
      background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.28)",
      color:"#a5b4fc", fontSize:".76rem", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase",
    }}>{children}</div>
  );
}
function SectionTitle({ children }) {
  return <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.85rem)", fontWeight:900, letterSpacing:"-.028em", color:"#f1f5f9", margin:"0 0 1rem", lineHeight:1.12 }}>{children}</h2>;
}
function SectionSub({ children }) {
  return <p style={{ fontSize:"1rem", color:"#94a3b8", lineHeight:1.72, margin:"0 auto 3.5rem", maxWidth:"520px" }}>{children}</p>;
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar/>
      <Hero/>
      <Features/>
      <Services/>
      <HowItWorks/>
      <LiveBooking/>
      <Stats/>
      <Testimonials/>
      <CTA/>
      <Footer/>
    </>
  );
}