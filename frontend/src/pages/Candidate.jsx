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
    experience: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/candidates")
      .then((res) => setCandidates(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/candidates", formData);
      setCandidates([...candidates, res.data]);
      setFormData({ name: "", phone: "", current_ctc: "", expected_ctc: "", notice_period: "", experience: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        {["name", "phone", "current_ctc", "expected_ctc", "notice_period", "experience"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="border px-3 py-1 rounded w-full"
            required
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Candidate</button>
      </form>
      <ul className="space-y-2">
        {candidates.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            {c.name} ({c.phone}) - {c.current_ctc}/{c.expected_ctc}, {c.notice_period}, {c.experience}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Candidate;
