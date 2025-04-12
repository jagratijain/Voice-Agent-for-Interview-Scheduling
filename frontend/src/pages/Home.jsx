import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 rounded-full p-4">
              <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to the Interactly Dashboard</h1>
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/job" className="bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-gray-200 p-5 rounded-lg transition-colors group">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-200 transition-colors">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">Jobs</h3>
                <p className="text-sm text-gray-500 mt-1">Manage job postings</p>
              </div>
            </Link>
            
            <Link to="/candidate" className="bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-gray-200 p-5 rounded-lg transition-colors group">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="bg-green-100 rounded-full p-2 group-hover:bg-green-200 transition-colors">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">Candidates</h3>
                <p className="text-sm text-gray-500 mt-1">Manage candidates</p>
              </div>
            </Link>
            
            <Link to="/appointment" className="bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-gray-200 p-5 rounded-lg transition-colors group">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="bg-purple-100 rounded-full p-2 group-hover:bg-purple-200 transition-colors">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">Appointments</h3>
                <p className="text-sm text-gray-500 mt-1">Schedule interviews</p>
              </div>
            </Link>
            
            <Link to="/conversation" className="bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-gray-200 p-5 rounded-lg transition-colors group">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="bg-red-100 rounded-full p-2 group-hover:bg-red-200 transition-colors">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">Voice Agent</h3>
                <p className="text-sm text-gray-500 mt-1">Interview simulation</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;