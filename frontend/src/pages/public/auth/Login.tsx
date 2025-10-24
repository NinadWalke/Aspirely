import * as React from "react";
import { api } from "../../../utils";
import { useAuthState } from "../../../store";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  // Zustand store actions
  const loginToServerAndLocal = useAuthState((state) => state.login);

  // Input states
  const [loginFormData, setLoginFormData] = React.useState({
    username: "",
    password: "",
  });

  // UI state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // -- Helper functions --
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send login request to backend
      const { data } = await api.post("/auth/login", loginFormData);

      // Assume backend returns: { user, jwtToken }
      const { user, jwtToken } = data;

      // Store user + token in Zustand
      loginToServerAndLocal(user, jwtToken);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={loginFormData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={loginFormData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
