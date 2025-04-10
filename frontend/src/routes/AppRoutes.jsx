import { Route, Routes } from "react-router-dom";
import Job from "./pages/Job";
import Candidate from "./pages/Candidate";
import Appointment from "./pages/Appointment";
import Conversation from "./pages/Conversation";
import Dashboard from "./pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jobs" element={<Job />} />
      <Route path="/candidates" element={<Candidate />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route path="/conversations" element={<Conversation />} />
    </Routes>
  );
};

export default AppRoutes;
