import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import api from '../services/api';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const initialFormState = {
    title: '',
    description: '',
    requirements: '',
    company: '',
    location: '',
    job_type: 'Full-time'
  };
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
      setMessage({ type: "", text: "" });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage({ type: "error", text: "Failed to load jobs. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit handler for both add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      if (formMode === 'add') {
        // Add new job
        await api.post('/jobs', form);
        setMessage({ type: "success", text: "Job posting added successfully!" });
      } else {
        // Update existing job
        await api.put(`/jobs/${editingId}`, form);
        setMessage({ type: "success", text: "Job posting updated successfully!" });
      }
      
      // Reset form and fetch updated jobs
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error(`Error ${formMode === 'add' ? 'adding' : 'updating'} job:`, error);
      setMessage({ 
        type: "error", 
        text: `Failed to ${formMode === 'add' ? 'add' : 'update'} job posting. Please try again.` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }
    
    setIsDeleting(true);
    setMessage({ type: "", text: "" });
    
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(job => job.id !== id));
      setMessage({ type: "success", text: "Job posting deleted successfully!" });
    } catch (error) {
      console.error('Error deleting job:', error);
      setMessage({ type: "error", text: "Failed to delete job posting. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle edit button click
  const handleEdit = (job) => {
    setFormMode('edit');
    setEditingId(job.id);
    setForm({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      company: job.company || '',
      location: job.location || '',
      job_type: job.job_type || 'Full-time'
    });
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset form and go back to add mode
  const resetForm = () => {
    setFormMode('add');
    setEditingId(null);
    setForm(initialFormState);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Descriptions</h2>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side - Job Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {formMode === 'add' ? 'Add New Job Posting' : 'Edit Job Posting'}
            </h3>
            
            {formMode === 'edit' && (
              <button
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Frontend Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isSubmitting}
              />
            </div>
            

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                id="description"
                placeholder="Describe the job role, responsibilities, etc."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                id="requirements"
                placeholder="List skills, qualifications, experience needed..."
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button 
              type="submit" 
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {formMode === 'add' ? 'Adding Job...' : 'Updating Job...'}
                </>
              ) : (
                formMode === 'add' ? 'Add Job Posting' : 'Update Job Posting'
              )}
            </button>
          </form>
        </div>
        
        {/* Right side - Jobs List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Jobs</h3>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No job postings yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first job posting</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;