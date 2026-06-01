import { useEffect, useState } from "react";

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  // Only show to logged-in customers (not providers)
  if (!user || user.role !== "user") return null;

  return (
    <>
      <div style={{position:"fixed",right:20,bottom:20,zIndex:9999}}>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant chat"
          style={{
            width:64,
            height:64,
            borderRadius:18,
            border:"none",
            background:"linear-gradient(135deg,#6366f1,#06b6d4)",
            color:"white",
            fontSize:26,
            boxShadow:"0 10px 30px rgba(2,6,23,.35)",
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            transition:"transform .12s ease",
          }}
          onMouseEnter={(e)=>e.currentTarget.style.transform="translateY(-4px)"}
          onMouseLeave={(e)=>e.currentTarget.style.transform="none"}
        >
          💬
        </button>
      </div>

      {open && (
        <div style={{position:"fixed",right:20,bottom:96,zIndex:10000,width:360,maxWidth:"92vw",boxShadow:"0 30px 80px rgba(2,6,23,.45)",borderRadius:12,overflow:"hidden",background:"linear-gradient(180deg,#0b1220,rgba(11,18,32,.96))",color:"#e6eef8"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#06b6d4,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
              <div>
                <div style={{fontWeight:800}}>Assistant</div>
                <div style={{fontSize:12,color:"#9fb0d0"}}>I'm here to help — coming soon</div>
              </div>
            </div>
            <div>
              <button onClick={() => setOpen(false)} style={{background:"transparent",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
          </div>

          <div style={{padding:14,fontSize:14,color:"#c8d8ee",minHeight:120}}>
            <div style={{opacity:.9}}>This is a placeholder chat panel. You can integrate a chat service or assistant here later.</div>
          </div>

          <div style={{display:"flex",gap:8,padding:12,borderTop:"1px solid rgba(255,255,255,.02)",background:"rgba(255,255,255,.01)"}}>
            <input placeholder="Type a message..." style={{flex:1,padding:"10px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,.04)",background:"rgba(255,255,255,.02)",color:"#e6eef8",outline:"none"}}/>
            <button style={{padding:"10px 12px",borderRadius:8,border:"none",background:"#10b981",color:"white",fontWeight:700,cursor:"pointer"}}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
