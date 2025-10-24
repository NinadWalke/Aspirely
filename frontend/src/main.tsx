import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";

// -- Imports --
// Common
import PublicNav from "./pages/public/common/PublicNav";
import DashNav from "./pages/dashboard/common/DashNav";
import NotFound from "./pages/common/NotFound";

// Auth
import Login from "./pages/public/auth/Login";
import SignUp from "./pages/public/auth/SignUp";
import Forgot from "./pages/public/auth/Forgot";

// User & Public
import Home from "./pages/public/landing/Home";
import Profile from "./pages/public/profile/Profile";

// Dashboard & Features
import DashboardLanding from "./pages/dashboard/DashboardLanding";
import Task from "./pages/dashboard/task-manager/Task";
import Notes from "./pages/dashboard/notes-manager/Notes";
import Meditation from "./pages/dashboard/meditation-logs/Meditation";

const Layout = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname.startsWith("/dashboard") ? <DashNav /> : <PublicNav />}
      <Routes>
        {/* Home */}
        <Route path={"/"} element={<Home />} />
        {/* Auth */}
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/forgot"} element={<Forgot />} />
        <Route path={"*"} element={<NotFound />} />
        {/* User */}
        <Route path={"/profile"} element={<Profile />} />
        {/* Dashboard & Features */}
        <Route path="/dashboard" element={<DashboardLanding />} />
        <Route path="/dashboard/task" element={<Task />} />
        <Route path="/dashboard/notes" element={<Notes />} />
        <Route path="/dashboard/meditation" element={<Meditation />} />
      </Routes>
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
