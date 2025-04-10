import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Job from "../pages/Job";
import Candidate from "../pages/Candidate";
import Appointment from "../pages/Appointment";
import Conversation from "../pages/Conversation";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/job" element={<Job />} />
      <Route path="/candidate" element={<Candidate />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/conversation" element={<Conversation />} />
    </Routes>
  );
}
