import { useEffect, useState } from "react";
import type { ReactNode} from 'react'
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

  return <>{children}</>;
};

export default ProtectedRoute;
