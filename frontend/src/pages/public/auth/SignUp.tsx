import * as React from "react";
import { api } from "../../../utils";

export default function SignUp() {
  const [signUpFormData, setSignUpFormData] = React.useState({
    username: "",
    email: "",
    name: "",
    dob: "", // Date of Birth
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Handles form submission
  const handleSignUp = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", signUpFormData);
      setSuccess("Account created successfully!");
    } catch (err: any) {
      console.error("Sign Up Error:", err);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // -- Helper functions --
  // handleChange updates form state on every input change
  function handleChange(e: any) {
    setSignUpFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <h1>Sign Up</h1>

      <form onSubmit={handleSignUp}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={signUpFormData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={signUpFormData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={signUpFormData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={signUpFormData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={signUpFormData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
