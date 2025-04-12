function JobCard({ job, onDelete, onEdit, isDeleting }) {
  // Parse time slots from job data
  const getTimeSlots = () => {
    if (!job.timeSlots) return null;
    
    try {
      // Handle both string and object formats
      const slots = typeof job.timeSlots === 'string' 
        ? JSON.parse(job.timeSlots)
        : job.timeSlots;
        
      // Check if we have any time slots
      const hasSlots = Object.entries(slots).some(([_, timeArray]) => 
        Array.isArray(timeArray) && timeArray.length > 0
      );
      
      if (!hasSlots) return null;
      
      return slots;
    } catch (error) {
      console.error('Error parsing time slots:', error);
      return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get parsed time slots
  const timeSlots = getTimeSlots();

  // Count total available slots
  const totalSlots = timeSlots ? 
    Object.values(timeSlots).reduce((total, slots) => 
      total + (Array.isArray(slots) ? slots.length : 0), 0) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-indigo-900">{job.title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(job)}
            className="p-1.5 rounded-full text-indigo-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit job"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(job.id)}
            disabled={isDeleting}
            className="p-1.5 rounded-full text-indigo-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete job"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <svg className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </h4>
            <p className="text-gray-600 text-sm ml-5.5">{job.description}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <svg className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Requirements
            </h4>
            <p className="text-gray-600 text-sm italic ml-5.5">{job.requirements}</p>
          </div>
        </div>
        
        {/* Time Slots Display */}
        {timeSlots && (
          <div className="mt-5 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <svg className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Interview Availability 
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                {totalSlots} slots
              </span>
            </h4>
            
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(timeSlots)
                .filter(([_, slots]) => Array.isArray(slots) && slots.length > 0)
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([date, slots]) => (
                  <div key={date} className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1.5 flex items-center">
                      <svg className="h-3.5 w-3.5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {formatDate(date)}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {slots.sort().map(time => (
                        <span 
                          key={`${date}-${time}`} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                        >
                          <svg className="h-3 w-3 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {job.created_at && (
          <div className="mt-4 text-xs text-gray-400 text-right">
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobCard;