import axios from "axios";
import { useEffect, useState } from "react";

const Candidate = () => {
const [candidates, setCandidates] = useState([]);
const [formData, setFormData] = useState({
  name: "",
  phone: "",
  experience: ""
});
const [isLoading, setIsLoading] = useState(false);
const [message, setMessage] = useState({ type: "", text: "" });
const [deletingId, setDeletingId] = useState(null);

// Fetch all candidates
const fetchCandidates = async () => {
  setIsLoading(true);
  try {
    const res = await axios.get("http://localhost:5000/api/candidates");
    setCandidates(res.data);
  } catch (err) {
    console.error(err);
    setMessage({ type: "error", text: "Failed to load candidates" });
  } finally {
    setIsLoading(false);
  }
};

// Delete a candidate
const deleteCandidate = async (id) => {
  setDeletingId(id);
  try {
    await axios.delete(`http://localhost:5000/api/candidates/${id}`);
    setCandidates(candidates.filter(candidate => candidate.id !== id));
    setMessage({ type: "success", text: "Candidate deleted successfully" });
  } catch (err) {
    console.error(err);
    setMessage({ type: "error", text: "Failed to delete candidate" });
  } finally {
    setDeletingId(null);
  }
}

useEffect(() => {
  fetchCandidates();
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage({ type: "", text: "" });
  
  try {
    const res = await axios.post("http://localhost:5000/api/candidates", formData);
    setCandidates([res.data, ...candidates]);
    setFormData({ name: "", phone: "", experience: "" });
    setMessage({ type: "success", text: "Candidate added successfully" });
  } catch (err) {
    console.error(err);
    setMessage({ type: "error", text: "Failed to add candidate" });
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="max-w-6xl mx-auto p-6">
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column - Add Candidate Form */}
      <div className="md:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Candidate</h2>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter candidate's name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            
            <button 
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Add Candidate"
              )}
            </button>
          </form>
          
          <p className="mt-4 text-sm text-gray-600">
            *Other candidate details will be collected during the interview conversation
          </p>
        </div>
      </div>
      
      {/* Right Column - Candidates List */}
      <div className="md:w-2/3">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidates List</h2>
        
        {isLoading && candidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="animate-spin mx-auto h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-500">Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new candidate.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                          <p className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {candidate.phone}
                          </p>
                          
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {candidate.created_at && (
                        <span className="hidden md:inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {new Date(candidate.created_at).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
                            deleteCandidate(candidate.id);
                          }
                        }}
                        className={`p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ${
                          deletingId === candidate.id ? "opacity-50 pointer-events-none" : ""
                        }`}
                        disabled={deletingId === candidate.id}
                        title="Delete candidate"
                      >
                        {deletingId === candidate.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {(candidate.current_ctc || candidate.expected_ctc || candidate.notice_period || candidate.experience) && (
                    <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t">
                      {candidate.current_ctc && (
                        <div className="text-sm">
                          <span className="text-gray-500">Current CTC:</span>{" "}
                          <span className="font-medium">{candidate.current_ctc}</span>
                        </div>
                      )}
                      {candidate.expected_ctc && (
                        <div className="text-sm">
                          <span className="text-gray-500">Expected CTC:</span>{" "}
                          <span className="font-medium">{candidate.expected_ctc}</span>
                        </div>
                      )}
                      {candidate.notice_period && (
                        <div className="text-sm">
                          <span className="text-gray-500">Notice Period:</span>{" "}
                          <span className="font-medium">{candidate.notice_period}</span>
                        </div>
                      )}
                      {candidate.experience && (
                        <div className="text-sm">
                          <span className="text-gray-500">Experience:</span>{" "}
                          <span className="font-medium">{candidate.experience} {parseInt(candidate.experience) === 1 ? 'year' : 'years'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Candidate;