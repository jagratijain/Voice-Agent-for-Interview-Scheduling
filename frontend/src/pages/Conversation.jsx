import { useEffect, useState } from "react";
import axios from "axios";

const Conversation = () => {
  const [conversations, setConversations] = useState([]);
  const [formData, setFormData] = useState({
    candidate_id: "",
    transcript: "",
    entities_extracted: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/conversations")
      .then((res) => setConversations(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/conversations", formData);
      setConversations([...conversations, res.data]);
      setFormData({ candidate_id: "", transcript: "", entities_extracted: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Conversations</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input type="text" placeholder="Candidate ID" value={formData.candidate_id} onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })} className="border px-3 py-1 rounded w-full" required />
        <textarea placeholder="Transcript" value={formData.transcript} onChange={(e) => setFormData({ ...formData, transcript: e.target.value })} className="border px-3 py-1 rounded w-full" required />
        <input type="text" placeholder="Entities Extracted" value={formData.entities_extracted} onChange={(e) => setFormData({ ...formData, entities_extracted: e.target.value })} className="border px-3 py-1 rounded w-full" />
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Save Conversation</button>
      </form>
      <ul className="space-y-2">
        {conversations.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <p><strong>Candidate ID:</strong> {c.candidate_id}</p>
            <p><strong>Transcript:</strong> {c.transcript}</p>
            <p><strong>Entities:</strong> {c.entities_extracted}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversation;
