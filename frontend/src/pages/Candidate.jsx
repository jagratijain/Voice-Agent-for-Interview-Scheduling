import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import CandidateCard from '../components/CandidateCard';
import api from "../services/api";

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all candidates
  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load candidates. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a candidate
  const deleteCandidate = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/candidates/${id}`);
      setCandidates(candidates.filter(candidate => candidate.id !== id));
      toast.success('Candidate deleted successfully!')
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete candidate. Please try again.")
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  // To create a candidate
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await api.post("/candidates", formData);
      setCandidates([res.data, ...candidates]);
      setFormData({ name: "", phone: "", experience: "" });
      toast.success('Candidate added successfully!')
    } catch (err) {
      console.error(err);
      toast.error("Failed to add candidate. Please try again.")
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
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onDelete={deleteCandidate} 
                  deletingId={deletingId} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div><Toaster /></div>
    </div>
  );
};

export default Candidate;