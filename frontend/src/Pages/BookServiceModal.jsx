// BookingModal.jsx — fully standalone booking modal
// Opens when "Book Now" is clicked on a service card
// Props: service (object), onClose (fn), onSuccess (fn)

import axios from "axios";
import { useState } from "react";

const MODAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

  @keyframes backdropIn  { from{opacity:0} to{opacity:1} }
  @keyframes modalSlideUp{ from{opacity:0;transform:translateY(40px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes successPop  { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
  @keyframes shimmer     { 0%{left:-100%} 100%{left:110%} }
  @keyframes pulse       { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.88)} }

  /* ── Backdrop ── */
  .bm-backdrop {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(2, 6, 23, 0.82);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    animation: backdropIn .25s ease both;
  }

  /* ── Modal container ── */
  .bm-modal {
    width: 100%; max-width: 480px;
    background: rgba(13, 20, 40, 0.95);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 24px;
    padding: 0;
    box-shadow: 0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.08);
    position: relative; overflow: hidden;
    animation: modalSlideUp .35s cubic-bezier(.22,1,.36,1) both;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Gradient top bar ── */
  .bm-top-bar {
    height: 3px; width: 100%;
    background: linear-gradient(90deg, #6366f1, #06b6d4, #6366f1);
    background-size: 200% 100%;
  }

  /* ── Glow orb ── */
  .bm-glow {
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,.12), transparent 70%);
    pointer-events: none;
  }

  /* ── Header ── */
  .bm-header {
    padding: 1.5rem 1.75rem 0;
    display: flex; align-items: flex-start; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .bm-service-icon {
    width: 52px; height: 52px; border-radius: 15px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; flex-shrink: 0;
    margin-bottom: .75rem;
  }
  .bm-close {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid rgba(99,102,241,.2);
    background: rgba(99,102,241,.05);
    color: #64748b; font-size: 1.1rem; font-weight: 300;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .2s; font-family: 'Poppins', sans-serif;
    flex-shrink: 0; margin-top: 2px;
  }
  .bm-close:hover { border-color: rgba(99,102,241,.45); color: #a5b4fc; background: rgba(99,102,241,.1); }

  .bm-title  { font-size: 1.3rem; font-weight: 800; color: #f1f5f9; letter-spacing: -.02em; margin-bottom: .3rem; }
  .bm-subtitle { font-size: .82rem; color: #64748b; font-weight: 500; }

  /* ── Service summary card ── */
  .bm-summary {
    margin: 1.25rem 1.75rem;
    padding: 1rem 1.2rem;
    border-radius: 14px;
    background: rgba(99,102,241,.06);
    border: 1px solid rgba(99,102,241,.14);
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    position: relative; z-index: 1;
  }
  .bm-summary-name { font-size: .92rem; font-weight: 700; color: #e2e8f0; }
  .bm-summary-cat  { font-size: .72rem; color: #64748b; font-weight: 500; margin-top: 2px; }
  .bm-summary-price { font-size: 1.1rem; font-weight: 900; letter-spacing: -.02em; white-space: nowrap; }
  .bm-summary-price span { font-size: .7rem; font-weight: 500; color: #64748b; margin-left: 2px; }

  /* ── Form body ── */
  .bm-body { padding: 0 1.75rem 1.75rem; position: relative; z-index: 1; }

  .bm-label {
    display: block; font-size: .78rem; font-weight: 700; color: #94a3b8;
    letter-spacing: .05em; text-transform: uppercase; margin-bottom: .55rem;
  }
  .bm-field { margin-bottom: 1.25rem; }

  /* ── Date-time input ── */
  .bm-input {
    width: 100%;
    padding: .72rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(99,102,241,.2);
    background: rgba(15,23,42,.7);
    color: #f1f5f9; font-size: .92rem; font-family: 'Poppins', sans-serif; font-weight: 500;
    outline: none; transition: border-color .25s, box-shadow .25s;
    box-sizing: border-box;
    color-scheme: dark;
  }
  .bm-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }

  /* ── Note/address textarea ── */
  .bm-textarea {
    width: 100%;
    padding: .72rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(99,102,241,.2);
    background: rgba(15,23,42,.7);
    color: #f1f5f9; font-size: .88rem; font-family: 'Poppins', sans-serif; font-weight: 500;
    outline: none; transition: border-color .25s, box-shadow .25s;
    resize: vertical; min-height: 80px;
    box-sizing: border-box;
    color-scheme: dark;
  }
  .bm-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }
  .bm-textarea::placeholder, .bm-input::placeholder { color: #334155; }

  /* ── Info row ── */
  .bm-info-row {
    display: flex; gap: .65rem; align-items: flex-start;
    padding: .85rem 1rem; border-radius: 12px;
    background: rgba(6, 182, 212, .06);
    border: 1px solid rgba(6, 182, 212, .15);
    margin-bottom: 1.25rem;
  }
  .bm-info-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
  .bm-info-text { font-size: .78rem; color: #7dd3fc; font-weight: 500; line-height: 1.55; }

  /* ── Submit button ── */
  .bm-submit {
    width: 100%; padding: .85rem;
    border-radius: 13px; border: none;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: #fff; font-size: .95rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,.45);
    transition: all .25s; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: .6rem;
  }
  .bm-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.6); filter: brightness(1.08); }
  .bm-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .bm-submit-shine {
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
  }
  .bm-submit:hover:not(:disabled) .bm-submit-shine { animation: shimmer .6s ease forwards; }

  /* ── Spinner ── */
  .bm-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin .75s linear infinite; flex-shrink: 0;
  }

  /* ── Error message ── */
  .bm-error {
    display: flex; align-items: center; gap: .5rem;
    padding: .7rem 1rem; border-radius: 10px;
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2);
    color: #fca5a5; font-size: .82rem; font-weight: 600; margin-bottom: 1rem;
  }

  /* ── Success state ── */
  .bm-success {
    padding: 3rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
  }
  .bm-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #06b6d4);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; box-shadow: 0 8px 32px rgba(16,185,129,.4);
    animation: successPop .5s cubic-bezier(.22,1,.36,1) both;
  }
  .bm-success h3 { font-size: 1.3rem; font-weight: 800; color: #f1f5f9; letter-spacing: -.02em; }
  .bm-success p  { font-size: .88rem; color: #94a3b8; line-height: 1.6; max-width: 300px; }
  .bm-success-meta {
    padding: .85rem 1.4rem; border-radius: 12px;
    background: rgba(16,185,129,.07); border: 1px solid rgba(16,185,129,.18);
    font-size: .8rem; color: #6ee7b7; font-weight: 600; text-align: left; width: 100%;
  }
  .bm-success-meta div { margin-bottom: .3rem; }
  .bm-success-meta div:last-child { margin-bottom: 0; }
  .bm-done-btn {
    width: 100%; padding: .8rem; border-radius: 13px; border: none;
    background: linear-gradient(135deg, #10b981, #06b6d4); color: #fff;
    font-size: .92rem; font-weight: 700; font-family: 'Poppins', sans-serif;
    cursor: pointer; box-shadow: 0 4px 18px rgba(16,185,129,.4); transition: all .2s;
  }
  .bm-done-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(16,185,129,.55); }

  /* ── Live badge ── */
  .bm-live {
    display: inline-flex; align-items: center; gap: .35rem;
    font-size: .7rem; font-weight: 700; color: #10b981; letter-spacing: .05em;
  }
  .bm-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #10b981;
    animation: pulse 2s infinite; box-shadow: 0 0 6px #10b98180;
    display: inline-block;
  }

  @media(max-width:480px) {
    .bm-modal { border-radius: 20px; }
    .bm-header, .bm-body { padding-left: 1.25rem; padding-right: 1.25rem; }
    .bm-summary { margin-left: 1.25rem; margin-right: 1.25rem; }
  }
`;

// ── Helpers ─────────────────────────────────────────────────────────────────
function getMinDateTime() {
  // at least 1 hour from now
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── BookingModal Component ───────────────────────────────────────────────────
export default function BookServiceModal({ service, onClose, onSuccess }) {
  const [scheduledTime, setScheduledTime] = useState("");
  const [address, setAddress]             = useState("");
  const [note, setNote]                   = useState("");
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [booking, setBooking]             = useState(null);     // success state

  const color = service?.color || "#6366f1";
  const emoji = service?.emoji || "🛠️";

  const handleSubmit = async () => {
    if (!scheduledTime) { setError("Please select a scheduled date & time."); return; }

    const user = JSON.parse(localStorage.getItem("user")) || null;
    const token =localStorage.getItem("token") || null;
    if (!token) {
      setError("You must be logged in to book a service.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/booking/create",
        {
          serviceId: service._id,
          scheduledTime: new Date(scheduledTime).toISOString(),
          address: address.trim() || undefined,
            note: note.trim() || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBooking(res.data.booking);
      onSuccess?.(res.data);

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Close on backdrop click ──────────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{MODAL_CSS}</style>

      <div className="bm-backdrop" onClick={handleBackdropClick}>
        <div className="bm-modal">
          <div className="bm-top-bar"/>
          <div className="bm-glow"/>

          {/* ── SUCCESS STATE ── */}
          {booking ? (
            <div className="bm-success">
              <div className="bm-success-icon">✓</div>
              <h3>Booking Confirmed!</h3>
              <p>Your booking has been submitted. A verified pro will be assigned shortly.</p>

              <div className="bm-success-meta">
                <div>📋 <strong>Booking ID:</strong> #{booking._id?.slice(-8).toUpperCase()}</div>
                <div>🔧 <strong>Service:</strong> {service.name}</div>
                <div>📅 <strong>Scheduled:</strong> {formatDateTime(booking.scheduledTime)}</div>
                <div>💳 <strong>Payment:</strong> Pay after the job</div>
                <div>
                  <span className="bm-live"><span className="bm-live-dot"/>FINDING PRO NEARBY…</span>
                </div>
              </div>

              <button className="bm-done-btn" onClick={onClose}>Done</button>
            </div>

          ) : (
            <>
              {/* ── HEADER ── */}
              <div className="bm-header">
                <div>
                  <div className="bm-service-icon" style={{ background:`${color}15`, border:`1px solid ${color}28` }}>
                    {emoji}
                  </div>
                  <div className="bm-title">Book {service.name}</div>
                  <div className="bm-subtitle">Fill in the details below to confirm your booking</div>
                </div>
                <button className="bm-close" onClick={onClose}>✕</button>
              </div>

              {/* ── SERVICE SUMMARY ── */}
              <div className="bm-summary">
                <div>
                  <div className="bm-summary-name">{service.name}</div>
                  {service.category && (
                    <div className="bm-summary-cat">{service.category}</div>
                  )}
                </div>
                <div className="bm-summary-price" style={{ color }}>
                  ₹{service.basePrice}
                  <span>/ starting</span>
                </div>
              </div>

              {/* ── FORM ── */}
              <div className="bm-body">

                {/* Scheduled Time */}
                <div className="bm-field">
                  <label className="bm-label">📅 Schedule Date & Time *</label>
                  <input
                    className="bm-input"
                    type="datetime-local"
                    value={scheduledTime}
                    min={getMinDateTime()}
                    onChange={e => { setScheduledTime(e.target.value); setError(""); }}
                  />
                </div>

                {/* Address */}
                <div className="bm-field">
                  <label className="bm-label">📍 Service Address</label>
                  <input
                    className="bm-input"
                    type="text"
                    placeholder="Enter your full address…"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>

                {/* Note */}
                <div className="bm-field">
                  <label className="bm-label">📝 Additional Note (optional)</label>
                  <textarea
                    className="bm-textarea"
                    placeholder="Describe the issue or any special instructions…"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                {/* Info strip */}
                <div className="bm-info-row">
                  <span className="bm-info-icon">💡</span>
                  <div className="bm-info-text">
                    Payment is collected <strong>after the job is completed</strong>. No upfront charges. You can cancel up to 1 hour before the scheduled time.
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bm-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  className="bm-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <span className="bm-submit-shine"/>
                  {loading ? (
                    <>
                      <div className="bm-spinner"/>
                      Creating Booking…
                    </>
                  ) : (
                    <>Confirm Booking →</>
                  )}
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}