import { useEffect, useState } from "react";
import axios from "axios";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    job_id: "",
    candidate_id: "",
    date_time: "",
    status: "scheduled"
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/appointments")
      .then((res) => setAppointments(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/appointments", formData);
      setAppointments([...appointments, res.data]);
      setFormData({ job_id: "", candidate_id: "", date_time: "", status: "scheduled" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input type="text" placeholder="Job ID" value={formData.job_id} onChange={(e) => setFormData({ ...formData, job_id: e.target.value })} className="border px-3 py-1 rounded w-full" required />
        <input type="text" placeholder="Candidate ID" value={formData.candidate_id} onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })} className="border px-3 py-1 rounded w-full" required />
        <input type="datetime-local" value={formData.date_time} onChange={(e) => setFormData({ ...formData, date_time: e.target.value })} className="border px-3 py-1 rounded w-full" required />
        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="border px-3 py-1 rounded w-full">
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Appointment</button>
      </form>
      <ul className="space-y-2">
        {appointments.map((a) => (
          <li key={a.id} className="border p-2 rounded">
            Job #{a.job_id} → Candidate #{a.candidate_id} on {a.date_time} [{a.status}]
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointment;
