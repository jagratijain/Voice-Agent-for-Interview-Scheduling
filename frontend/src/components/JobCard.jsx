function JobCard ({ job, onDelete, onEdit, isDeleting }){
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(job)}
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              title="Edit job"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(job.id)}
              disabled={isDeleting}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete job"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
          <p className="text-gray-600 text-sm">{job.description}</p>
        </div>
        
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Requirements</h4>
          <p className="text-gray-600 text-sm italic">{job.requirements}</p>
        </div>
        
        {(job.company || job.location || job.job_type) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {job.company && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Company: {job.company}
                </span>
              )}
              
              {job.location && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Location: {job.location}
                </span>
              )}
              
              {job.job_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {job.job_type}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;