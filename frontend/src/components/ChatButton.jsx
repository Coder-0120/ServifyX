import { useEffect, useState } from "react";
import axios from "axios";

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/assistant", {
        message: userMessage,
      });
      setMessages((prev) => [...prev, { sender: "assistant", text: data.reply || "Sorry, I couldn't process that." }]);
    } catch (err) {
      setError("Unable to reach the assistant. Please try again later.");
      setMessages((prev) => [...prev, { sender: "assistant", text: "I couldn't process that request right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant chat"
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            border: "none",
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            color: "white",
            fontSize: 26,
            boxShadow: "0 10px 30px rgba(2,6,23,.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform .12s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          💬
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 96,
            zIndex: 10000,
            width: 360,
            maxWidth: "92vw",
            boxShadow: "0 30px 80px rgba(2,6,23,.45)",
            borderRadius: 16,
            overflow: "hidden",
            background: "linear-gradient(180deg,#0b1220,rgba(11,18,32,.96))",
            color: "#e6eef8",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,.07)",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#06b6d4,#6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>ServifyX Assistant</div>
                <div style={{ fontSize: 12, color: "#9fb0d0" }}>I can help you choose the right service.</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}
            >
              ✕
            </button>
          </div>

          <div style={{ maxHeight: 340, overflowY: "auto", padding: 14, display: "grid", gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ color: "#c8d8ee", fontSize: 14, lineHeight: 1.6 }}>
                Describe your home service issue and I'll recommend the best match from AC Repair, Deep Cleaning, Painter, Washing Machine Repair, or Pest Control.
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.sender === "assistant" ? "flex-start" : "flex-end",
                  background: message.sender === "assistant" ? "rgba(99,102,241,.12)" : "rgba(16,185,129,.12)",
                  border: message.sender === "assistant" ? "1px solid rgba(99,102,241,.18)" : "1px solid rgba(16,185,129,.18)",
                  padding: "10px 12px",
                  borderRadius: 14,
                  maxWidth: "100%",
                  whiteSpace: "pre-line",
                }}
              >
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  {message.sender === "assistant" ? "Assistant" : "You"}
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.5 }}>{message.text}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 14, borderTop: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
            {error && <div style={{ color: "#fecaca", marginBottom: 8 }}>{error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your issue..."
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "rgba(255,255,255,.04)",
                  color: "#f8fafc",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: loading ? "rgba(56,189,248,.6)" : "#38bdf8",
                  color: "#0f172a",
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                }}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
