import { useEffect, useState } from 'react';
import api from '../services/api';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    candidate_id: '',
    job_id: '',
    date_time: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    fetchAppointments();
    fetchCandidates();
    fetchJobs();
  }, []);

  const fetchAppointments = async () => {
    const res = await api.get('/appointments');
    setAppointments(res.data);
  };

  const fetchCandidates = async () => {
    const res = await api.get('/candidates');
    setCandidates(res.data);
  };

  const fetchJobs = async () => {
    const res = await api.get('/jobs');
    setJobs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date(form.date_time);
    const parsedDatetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    

    const updatedForm = {
      ...form,
      date_time: parsedDatetime,
    };
  
    await api.post('/appointments', updatedForm);
    setForm({ candidate_id: '', job_id: '', date_time: '', status: 'Scheduled' });
    fetchAppointments();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Appointments</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <select
          value={form.candidate_id}
          onChange={(e) => setForm({ ...form, candidate_id: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Candidate</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={form.job_id}
          onChange={(e) => setForm({ ...form, job_id: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Job</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.date_time}
          onChange={(e) => setForm({ ...form, date_time: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>

      <ul className="space-y-2">
        {appointments.map((a) => (
          <li key={a.id} className="border p-3 rounded">
            <strong>{a.status}</strong> — Candidate #{a.candidate_id}, Job #{a.job_id} at {new Date(a.date_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointment;
