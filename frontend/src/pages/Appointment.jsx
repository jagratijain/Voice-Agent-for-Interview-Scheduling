import { useEffect, useState } from 'react';
import api from '../services/api';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    candidate_id: '',
    job_id: '',
    date_time: '',
    status: 'confirmed',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [appointmentsRes, candidatesRes, jobsRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/candidates'),
          api.get('/jobs')
        ]);
        
        setAppointments(appointmentsRes.data);
        setCandidates(candidatesRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ type: "error", text: "Failed to load data. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const date = new Date(form.date_time);
      const parsedDatetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      
      const updatedForm = {
        ...form,
        date_time: parsedDatetime,
      };
      
      await api.post('/appointments', updatedForm);
      
      // Reset form and refresh appointments
      setForm({ candidate_id: '', job_id: '', date_time: '', status: 'confirmed' });
      const res = await api.get('/appointments');
      setAppointments(res.data);
      
      setMessage({ type: "success", text: "Appointment scheduled successfully!" });
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setMessage({ type: "error", text: "Failed to schedule appointment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get candidate name from ID
  const getCandidateName = (id) => {
    const candidate = candidates.find(c => c.id === parseInt(id));
    return candidate ? candidate.name : `Candidate #${id}`;
  };

  // Get job title from ID
  const getJobTitle = (id) => {
    const job = jobs.find(j => j.id === parseInt(id));
    return job ? job.title : `Job #${id}`;
  };

  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (e) {
      return dateTimeStr;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Delete an appointment
  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(appointments.filter(a => a.id !== id));
      setMessage({ type: "success", text: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setMessage({ type: "error", text: "Failed to delete appointment" });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark appointment as completed
  const markAsCompleted = async (id) => {
    setIsLoading(true);
    try {
      await api.put(`/appointments/${id}`, { status: 'completed' });
      
      // Update appointment in local state
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: 'completed' } : a
      ));
      
      setMessage({ type: "success", text: "Appointment marked as completed" });
    } catch (error) {
      console.error("Error updating appointment:", error);
      setMessage({ type: "error", text: "Failed to update appointment status" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Management</h2>

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
        {/* Left side - Appointment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Interview Manually</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Use this form to manually schedule an interview when not using the voice assistant.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="candidate" className="block text-sm font-medium text-gray-700 mb-1">
                Select Candidate
              </label>
              <select
                id="candidate"
                value={form.candidate_id}
                onChange={(e) => setForm({ ...form, candidate_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a candidate</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">
                Select Position
              </label>
              <select
                id="job"
                value={form.job_id}
                onChange={(e) => setForm({ ...form, job_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a position</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date & Time
              </label>
              <input
                id="datetime"
                type="datetime-local"
                value={form.date_time}
                onChange={(e) => setForm({ ...form, date_time: e.target.value })}
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
                  Scheduling...
                </>
              ) : (
                "Schedule Interview"
              )}
            </button>
          </form>
        </div>
        
        {/* Right side - Appointments List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Interviews</h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No appointments scheduled yet</p>
              <p className="text-sm text-gray-400 mt-1">Scheduled interviews will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {getCandidateName(appointment.candidate_id)}
                        </h4>
                        <p className="text-gray-600 text-sm">{getJobTitle(appointment.job_id)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        
                        {/* Only show Complete button for confirmed appointments */}
                        {appointment.status.toLowerCase() === 'confirmed' && (
                          <button
                            onClick={() => markAsCompleted(appointment.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                            title="Mark as completed"
                            disabled={isLoading}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete appointment"
                          disabled={isLoading}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDateTime(appointment.date_time)}</span>
                    </div>
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

export default Appointment;