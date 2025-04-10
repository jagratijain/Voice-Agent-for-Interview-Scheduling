import { Route, Routes } from "react-router-dom";
import Job from "../pages/Job";
import Candidate from "../pages/Candidate";
import Appointment from "../pages/Appointment";
import Conversation from "../pages/Conversation";
import Home from "../pages/Home";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/job" element={<Job />} />
      <Route path="/candidate" element={<Candidate />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/conversation" element={<Conversation />} />
    </Routes>
  );
};

export default AppRoutes;
