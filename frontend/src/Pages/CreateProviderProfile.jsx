import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateProviderProfile = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceType: "",
    experience: "",
    isAvailable: true,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/provider/create-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile created successfully ✅");

      navigate("/provider/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to create profile"
      );
    }
  };

  return (
    <div style={styles.page}>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <h1 style={styles.heading}>
          Create Provider Profile
        </h1>

        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">
            Select Service
          </option>

          <option value="electrician">
            Electrician
          </option>

          <option value="plumber">
            Plumber
          </option>

          <option value="carpenter">
            Carpenter
          </option>

          <option value="ac repair">
            AC Repair
          </option>

          <option value="deep cleaning">
            Deep Cleaning
          </option>

        </select>

        <input
          type="number"
          name="experience"
          placeholder="Years of experience"
          value={formData.experience}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
        >
          Create Profile
        </button>

      </form>

    </div>
  );
};

export default CreateProviderProfile;

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },

  form: {
    width: "400px",
    background: "#1e293b",
    padding: "40px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  heading: {
    color: "white",
    textAlign: "center",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
  },

  button: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#6366f1",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },
};
