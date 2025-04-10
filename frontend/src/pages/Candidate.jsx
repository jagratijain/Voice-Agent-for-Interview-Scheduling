import { useEffect, useState } from "react";
import axios from "axios";

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    current_ctc: "",
    expected_ctc: "",
    notice_period: "",
    experience: "",
    email: "",
    location: ""
  });

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/candidates", formData);
      // Add new candidate with full object including created_at
      setCandidates([...candidates, res.data]);
      setFormData({
        name: "",
        phone: "",
        current_ctc: "",
        expected_ctc: "",
        notice_period: "",
        experience: "",
        email: "",
        location: ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>

      {/* Candidate Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6 max-w-md">
        {["name", "phone", "email", "location", "current_ctc", "expected_ctc", "notice_period", "experience"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            placeholder={field.replace(/_/g, " ")}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="border px-3 py-2 rounded w-full"
            required
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Candidate</button>
      </form>

      {/* Candidate List */}
      <ul className="space-y-2">
        {candidates.map((c) => (
          <li key={c.id} className="border p-3 rounded shadow-sm">
            <strong>{c.name}</strong> ({c.phone})<br />
            <span className="text-sm block text-gray-700">
              Email: {c.email} | Location: {c.location}
            </span>
            <span className="text-sm block text-gray-700">
              CTC: {c.current_ctc}/{c.expected_ctc} | Notice: {c.notice_period} | Exp: {c.experience}
            </span>
            {c.created_at && (
              <span className="text-xs text-gray-500">
                Added on: {new Date(c.created_at).toLocaleString()}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Candidate;
