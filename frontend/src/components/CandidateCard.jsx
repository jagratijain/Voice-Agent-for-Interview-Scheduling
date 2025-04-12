function CandidateCard ({ candidate, onDelete, deletingId }){
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
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
                  onDelete(candidate.id);
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
  );
};

export default CandidateCard;