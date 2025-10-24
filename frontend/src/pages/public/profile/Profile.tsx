import { useAuthState } from "../../../store";
import { useNavigate } from "react-router";


export default function Profile() {
  const navigate = useNavigate();
  const logout = useAuthState((state) => state.logout);
  // handle logout
  const logUserOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
      <h1>Profile</h1>
      <button className="" onClick={logUserOut}>
        Logout
      </button>
    </div>
  );
}
