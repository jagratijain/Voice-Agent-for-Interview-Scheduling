import { useEffect, useState } from 'react';
import api from '../services/api'; // Axios instance with baseURL

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: ''
  });

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Submit new job
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', form);
      setForm({ title: '', description: '', requirements: '' });
      fetchJobs(); // Refresh list
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Job Descriptions</h2>

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Requirements"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Add Job</button>
      </form>

      {/* Job List */}
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="border p-4 rounded shadow-sm">
            <strong className="text-lg">{job.title}</strong>
            <p className="mt-1 text-sm">{job.description}</p>
            <p className="mt-1 italic text-gray-600">{job.requirements}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Job;
