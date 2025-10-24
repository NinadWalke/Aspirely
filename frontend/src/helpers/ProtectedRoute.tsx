import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "../store";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth, isLoggedIn } = useAuthState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      if (!isLoggedIn()) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };
    verify();
  }, [checkAuth, isLoggedIn, navigate]);

  if (loading) return <p>Loading...</p>;

  return <Outlet />;
};

export default ProtectedRoute;
