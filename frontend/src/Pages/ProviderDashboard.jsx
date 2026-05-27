// ProviderDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProviderDashboard = () => {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // SAFE USER PARSE
  const user = (() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  })();

  const token = localStorage.getItem("token");

  // FETCH BOOKINGS
  const fetchBookings = async () => {

    try {

      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:5000/api/booking/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // IMPORTANT FIX
      setBookings(data || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    const checkProviderProfile = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }
        await axios.get(
          "http://localhost:5000/api/provider/my-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchBookings();
      } catch (error) {
        navigate("/create-provider-profile");
      }
    };
    checkProviderProfile();
  }, []);
  // ACCEPT BOOKING
  const acceptBooking = async (bookingId) => {

    try {

      await axios.patch(
        `http://localhost:5000/api/booking/accept/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking accepted successfully ✅");

      fetchBookings();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to accept booking"
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>

        <h2 style={styles.logo}>
          ServifyX
        </h2>

        <div style={styles.navRight}>

          <div style={styles.providerName}>
            🔧 {user?.name || "Provider"}
          </div>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* HERO */}
      <div style={styles.hero}>

        <h1 style={styles.heading}>
          Provider Dashboard
        </h1>

        <p style={styles.subheading}>
          Manage all your service bookings
        </p>

      </div>

      {/* STATS */}
      <div style={styles.statsContainer}>

        <div style={styles.statCard}>
          <h2>{bookings.length}</h2>
          <p>Total Requests</p>
        </div>

        <div style={styles.statCard}>
          <h2>
            {
              bookings.filter(
                (b) => b.status === "requested"
              ).length
            }
          </h2>
          <p>Pending</p>
        </div>

        <div style={styles.statCard}>
          <h2>
            {
              bookings.filter(
                (b) => b.status === "accepted"
              ).length
            }
          </h2>
          <p>Accepted</p>
        </div>

      </div>

      {/* BOOKINGS */}
      <div style={styles.container}>

        <h2 style={styles.sectionTitle}>
          Incoming Requests
        </h2>

        {
          loading ? (

            <div style={styles.loading}>
              Loading bookings...
            </div>

          ) : bookings.length === 0 ? (

            <div style={styles.empty}>
              No bookings available
            </div>

          ) : (

            <div style={styles.grid}>

              {
                bookings.map((booking) => (

                  <div
                    key={booking._id}
                    style={styles.card}
                  >

                    {/* TOP */}
                    <div style={styles.cardTop}>

                      <div style={styles.icon}>
                        {
                          getEmoji(
                            booking?.serviceId?.name
                          )
                        }
                      </div>

                      <div>

                        <h3 style={styles.serviceName}>
                          {
                            booking?.serviceId?.name ||
                            "Service"
                          }
                        </h3>

                        <p style={styles.customer}>
                          👤 {
                            booking?.userId?.name ||
                            "Customer"
                          }
                        </p>

                      </div>

                    </div>

                    {/* INFO */}
                    <div style={styles.info}>

                      <p>
                        📅 {
                          booking?.scheduledTime
                            ? new Date(
                              booking.scheduledTime
                            ).toLocaleString()
                            : "No date"
                        }
                      </p>

                      <p>
                        📌 Status:

                        <span
                          style={{
                            color:
                              booking.status === "requested"
                                ? "#f59e0b"
                                : "#10b981",

                            marginLeft: "8px",
                            fontWeight: "700",
                            textTransform: "capitalize",
                          }}
                        >
                          {booking.status}
                        </span>

                      </p>

                    </div>

                    {/* BUTTON */}
                    {
                      booking.status === "requested" && (

                        <button
                          style={styles.acceptBtn}
                          onClick={() =>
                            acceptBooking(
                              booking._id
                            )
                          }
                        >
                          Accept Booking
                        </button>

                      )
                    }

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </div>
  );
};

export default ProviderDashboard;



// ICONS
const getEmoji = (name = "") => {

  switch ((name || "").toLowerCase()) {

    case "electrician":
      return "⚡";

    case "plumber":
      return "🔧";

    case "carpenter":
      return "🪚";

    case "ac repair":
      return "❄️";

    case "deep cleaning":
      return "🧹";

    default:
      return "🏠";
  }
};



// STYLES
const styles = {

  page: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "Poppins, sans-serif",
  },

  navbar: {
    height: "70px",
    background: "rgba(15,23,42,0.95)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    borderBottom:
      "1px solid rgba(99,102,241,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
  },

  logo: {
    color: "#6366f1",
    fontWeight: "800",
    fontSize: "1.7rem",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  providerName: {
    color: "white",
    fontWeight: "600",
  },

  logoutBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  hero: {
    textAlign: "center",
    padding: "50px 20px 20px",
  },

  heading: {
    color: "white",
    fontSize: "2.8rem",
    marginBottom: "10px",
  },

  subheading: {
    color: "#94a3b8",
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    padding: "30px 50px",
  },

  statCard: {
    background:
      "linear-gradient(135deg,#1e293b,#0f172a)",
    padding: "25px",
    borderRadius: "20px",
    border:
      "1px solid rgba(99,102,241,0.2)",
    color: "white",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.3)",
  },

  container: {
    padding: "10px 50px 50px",
  },

  sectionTitle: {
    color: "white",
    marginBottom: "25px",
    fontSize: "1.8rem",
  },

  loading: {
    color: "white",
    textAlign: "center",
    marginTop: "60px",
    fontSize: "1.1rem",
  },

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: "50px",
    fontSize: "1.1rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "25px",
  },

  card: {
    background:
      "rgba(15,23,42,0.9)",
    border:
      "1px solid rgba(99,102,241,0.2)",
    borderRadius: "22px",
    padding: "25px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.3)",
  },

  cardTop: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginBottom: "18px",
  },

  icon: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#6366f1,#06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
  },

  serviceName: {
    color: "white",
    marginBottom: "5px",
  },

  customer: {
    color: "#94a3b8",
  },

  info: {
    color: "#cbd5e1",
    lineHeight: "2",
    marginBottom: "20px",
  },

  acceptBtn: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#10b981,#06b6d4)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
  },
};