import { useEffect, useState } from 'react';
import api from '../services/api';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', requirements: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get('/jobs');
    setJobs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/jobs', form);
    setForm({ title: '', description: '', requirements: '' });
    fetchJobs();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Job Descriptions</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-2 w-full" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 w-full" />
        <textarea placeholder="Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Add Job</button>
      </form>

      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="border p-2 mb-2">
            <strong>{job.title}</strong>
            <p>{job.description}</p>
            <p><i>{job.requirements}</i></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Job;
