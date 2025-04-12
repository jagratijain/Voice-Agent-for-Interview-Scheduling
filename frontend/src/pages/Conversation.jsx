import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Conversation = () => {
  // Constants and refs
  const COMPANY = "Interactly";
  const API_BASE_URL = "http://localhost:5000/api";
  const synth = window.speechSynthesis;
  const recognitionRef = useRef(null);

  // Combined state
  const [state, setState] = useState({
    // Conversation state
    currentQuestionIndex: -1,
    profile: null,
    jobTitle: "",
    answers: {},
    logs: [],
    isListening: false,
    isSpeaking: false,

    // UI state
    candidates: [],
    selectedCandidate: null,
    jobs: [],
    selectedJob: null,
    isLoading: false,
    activeInterview: false,
    errorMessage: ""
  });

  // Questions sequence
  const questions = [
    { field: "interest", question: "Are you interested in this role?" },
    { field: "notice_period", question: "What is your current notice period?" },
    { field: "ctc", question: "Can you share your current and expected CTC?" },
    { field: "availability", question: "When are you available for an interview next week?" },
    { field: "confirmation", question: "We've scheduled your interview on [Date/Time]. Is that correct?" }
  ];

  // Initialize speech recognition once
  useEffect(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      const recognition = recognitionRef.current;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
    }

    fetchInitialData();

    return () => stopEverything();
  }, []);

  // Fetch initial candidates and jobs
  const fetchInitialData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Fetch candidates and jobs in parallel
      const [candidatesRes, jobsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/candidates`),
        axios.get(`${API_BASE_URL}/jobs`)
      ]);

      // Set default job if available
      const defaultJob = jobsRes.data.length > 0 ? jobsRes.data[0] : null;

      setState(prev => ({
        ...prev,
        candidates: candidatesRes.data,
        jobs: jobsRes.data,
        selectedJob: defaultJob,
        isLoading: false
      }));
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setState(prev => ({
        ...prev,
        errorMessage: "Failed to load candidates or jobs",
        isLoading: false
      }));
    }
  };

  // Speech recognition setup
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (state.isListening) {
      // Set up handlers
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        stopListening();
        processUserResponse(transcript, state.currentQuestionIndex);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening();

        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          speak("Could you please repeat that?", () => startListening());
        }
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      // Start recognition with a small delay
      setTimeout(() => {
        try {
          recognition.start();
        } catch (error) {
          console.error("Failed to start recognition:", error);
          setState(prev => ({ ...prev, isListening: false }));
        }
      }, 50);
    } else {
      // Clean up handlers when not listening
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    }
  }, [state.isListening]);

  // Process user's response
  const processUserResponse = (text, questionIndex) => {
    const currentQ = questions[questionIndex];
    const entities = extractEntities(text, currentQ.field);

    // Update state with new log entry and answers
    setState(prev => {
      const newLog = {
        question: currentQ.question,
        answer: text,
        questionIndex: questionIndex
      };

      const newAnswers = { ...prev.answers };
      Object.keys(entities).forEach(key => {
        newAnswers[key] = entities[key];
      });

      return {
        ...prev,
        logs: [...prev.logs, newLog],
        answers: newAnswers
      };
    });

    // Either continue to next question or finish
    if (questionIndex + 1 < questions.length) {
      continueToNextQuestion(questionIndex + 1, entities);
    } else {
      speak("Thank you. We have saved your information.", saveData);
    }
  };

  // Move to next question
  const continueToNextQuestion = (nextIndex, entities) => {
    // Update question index
    setState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex
    }));

    // Add delay to ensure state is updated
    setTimeout(() => {
      let nextQuestion = questions[nextIndex].question;

      // Special handling for confirmation question
      if (questions[nextIndex].field === "confirmation") {
        const formattedDate = entities?.formatted_date ||
          state.answers.formatted_date ||
          "next Monday";
        const interviewTime = entities?.interview_time ||
          state.answers.interview_time ||
          "10:00 AM";
        nextQuestion = nextQuestion.replace("[Date/Time]", `${formattedDate} at ${interviewTime}`);
      }

      // Speak question then listen
      speak(nextQuestion, () => {
        setTimeout(startListening, 300);
      });
    }, 500);
  };

  const convertTimeToISO = (timeString) => {
    // Assuming timeString is in format like "3:00 PM" or "15:00"
    let hours, minutes;
    
    if (timeString.includes(':')) {
      const [hourPart, minutePart] = timeString.split(':');
      
      if (timeString.toLowerCase().includes('pm') && hourPart !== '12') {
        hours = parseInt(hourPart) + 12;
      } else if (timeString.toLowerCase().includes('am') && hourPart === '12') {
        hours = 0;
      } else {
        hours = parseInt(hourPart);
      }
      
      minutes = parseInt(minutePart.replace(/[^0-9]/g, ''));
    } else {
      // If time is just a number like "15"
      hours = parseInt(timeString);
      minutes = 0;
    }
    
    // Ensure 2 digits
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    
    return `${hoursStr}:${minutesStr}:00`;
  };

  // Extract entities from response
  const extractEntities = (text, field) => {
    switch (field) {
      case "interest":
        return { interest: text };

      case "notice_period":
        const period = text.match(/\d+\s*(?:day|week|month)s?/i)?.[0] || text;
        return { notice_period: period };

      case "ctc":
        const ctcNumbers = text.match(/\d+/g) || [];
        return {
          current_ctc: ctcNumbers[0] || "",
          expected_ctc: ctcNumbers[1] || ""
        };

      case "availability":
        // Extract day of week and time
        const dayMatch = text.match(/\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i);
        const dayOfWeek = dayMatch ? dayMatch[0] : null;

        const timeMatch = text.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i);
        const timeOfDay = timeMatch ? timeMatch[0] : "10:00 AM";

        // Calculate actual date
        let interviewDate = "";
        let formattedDate = "";

        if (dayOfWeek) {
          const today = new Date();
          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const targetDayIndex = daysOfWeek.findIndex(day =>
            day.toLowerCase() === dayOfWeek.toLowerCase()
          );

          if (targetDayIndex !== -1) {
            const currentDayIndex = today.getDay();
            let daysToAdd = targetDayIndex - currentDayIndex;
            if (daysToAdd <= 0) daysToAdd += 7;

            const interviewDateObj = new Date();
            interviewDateObj.setDate(today.getDate() + daysToAdd);

            interviewDate = interviewDateObj.toISOString().split('T')[0];
            formattedDate = `${dayOfWeek}, ${interviewDateObj.toLocaleDateString('en-US', {
              month: 'long', day: 'numeric'
            })}`;
          }
        } else {
          // Default to next Monday
          const today = new Date();
          const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7;

          const interviewDateObj = new Date();
          interviewDateObj.setDate(today.getDate() + daysUntilMonday);

          interviewDate = interviewDateObj.toISOString().split('T')[0];
          formattedDate = `Monday, ${interviewDateObj.toLocaleDateString('en-US', {
            month: 'long', day: 'numeric'
          })}`;
        }

        return {
          interview_date: interviewDate,
          formatted_date: formattedDate,
          interview_time: timeOfDay
        };

      case "confirmation":
        return { confirmation: text };

      default:
        return { [field]: text };
    }
  };

  // Text-to-speech with callback
  const speak = (text, callback) => {
    setState(prev => ({ ...prev, isSpeaking: true }));

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      if (callback) callback();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setState(prev => ({ ...prev, isSpeaking: false }));
      if (callback) callback();
    };

    synth.speak(utterance);
  };

  // Start listening
  const startListening = () => {
    if (!state.isSpeaking) {
      setState(prev => ({ ...prev, isListening: true }));
    } else {
      setTimeout(startListening, 500);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }
    setState(prev => ({ ...prev, isListening: false }));
  };

  // Stop all audio
  const stopEverything = () => {
    if (synth.speaking) {
      synth.cancel();
    }

    stopListening();

    setState(prev => ({
      ...prev,
      isListening: false,
      isSpeaking: false
    }));
  };

  // Start interview
  const startConversation = async () => {
    if (!state.selectedCandidate) {
      setState(prev => ({ ...prev, errorMessage: "Please select a candidate" }));
      return;
    }

    if (!state.selectedJob) {
      setState(prev => ({ ...prev, errorMessage: "Please select a job" }));
      return;
    }

    // Clear any previous errors and stop any active audio
    setState(prev => ({ ...prev, errorMessage: "" }));
    stopEverything();

    // Reset conversation state
    setState(prev => ({
      ...prev,
      currentQuestionIndex: -1,
      profile: null,
      jobTitle: "",
      answers: {},
      logs: [],
      isListening: false,
      isSpeaking: false,
      isLoading: true
    }));

    try {
      // Fetch candidate and job details
      const [candidateRes, jobRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/candidates/${state.selectedCandidate.id}`),
        axios.get(`${API_BASE_URL}/jobs/${state.selectedJob.id}`)
      ]);

      // Update state with profile and job info
      setState(prev => ({
        ...prev,
        profile: candidateRes.data,
        jobTitle: jobRes.data.title,
        isLoading: false,
        activeInterview: true
      }));

      // Start greeting
      setTimeout(() => {
        const { profile, jobTitle } = state;
        if (!profile || !jobTitle) return;

        setState(prev => ({ ...prev, currentQuestionIndex: 0 }));

        const greeting = `Hello ${profile.name}, this is ${COMPANY} regarding a ${jobTitle} opportunity.`;
        speak(greeting, () => {
          speak(questions[0].question, startListening);
        });
      }, 500);
    } catch (err) {
      console.error("Failed to start interview:", err);
      setState(prev => ({
        ...prev,
        errorMessage: "Failed to load candidate or job information",
        isLoading: false
      }));
    }
  };

  // Save collected data
  const saveData = async () => {
    const { profile, answers, logs } = state;

    try {
      // Update candidate information
      await axios.put(`${API_BASE_URL}/candidates/${profile.id}`, {
        current_ctc: answers.current_ctc,
        expected_ctc: answers.expected_ctc,
        notice_period: answers.notice_period
      });

      // Save conversation transcript and entities
      const transcriptText = logs.map(log =>
        `Q: ${log.question}\nA: ${log.answer}`
      ).join('\n\n');

      const entitiesExtracted = JSON.stringify({
        interest: answers.interest || null,
        notice_period: answers.notice_period || null,
        current_ctc: answers.current_ctc || null,
        expected_ctc: answers.expected_ctc || null,
        interview_date: answers.interview_date || null,
        interview_time: answers.interview_time || null,
        confirmation: answers.confirmation || null
      });

      await axios.post(`${API_BASE_URL}/conversations`, {
        candidate_id: profile.id,
        transcript: transcriptText,
        entities_extracted: entitiesExtracted
      });
      console.log(answers);

      await axios.post(`${API_BASE_URL}/appointments`, {
        candidate_id: profile.id,
        job_id: selectedJob.id,
        date_time: `${answers.interview_date}T${convertTimeToISO(answers.interview_time)}`,
        status: 'confirmed'
      });


      // Show success message and reset
      setState(prev => ({ ...prev, errorMessage: "" }));
      setTimeout(() => {
        alert("Interview information saved successfully!");
        setState(prev => ({ ...prev, activeInterview: false }));
      }, 1000);
    } catch (err) {
      console.error("Failed to save data:", err);
      setState(prev => ({ ...prev, errorMessage: "Failed to save interview information" }));
    }
  };

  // Cancel interview
  const cancelInterview = () => {
    if (window.confirm("Are you sure you want to cancel this interview?")) {
      stopEverything();

      setState(prev => ({
        ...prev,
        currentQuestionIndex: -1,
        profile: null,
        jobTitle: "",
        answers: {},
        logs: [],
        isListening: false,
        isSpeaking: false,
        activeInterview: false
      }));
    }
  };

  // Destructure state for easier access in render
  const {
    currentQuestionIndex, profile, jobTitle, answers, logs,
    isListening, isSpeaking, candidates, selectedCandidate,
    jobs, selectedJob, isLoading, activeInterview, errorMessage
  } = state;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Voice Interview Assistant</h2>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {errorMessage}
        </div>
      )}

      {!activeInterview ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Candidate Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Select Candidate</h3>

            {isLoading ? (
              <div className="flex justify-center py-6">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No candidates available</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-2">
                {candidates.map(candidate => (
                  <div
                    key={candidate.id}
                    onClick={() => setState(prev => ({ ...prev, selectedCandidate: candidate }))}
                    className={`mb-3 p-4 rounded-md cursor-pointer transition-colors ${selectedCandidate?.id === candidate.id
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-indigo-100 rounded-full p-2">
                          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.phone}</p>
                      </div>
                      {selectedCandidate?.id === candidate.id && (
                        <div className="ml-auto">
                          <div className="bg-indigo-500 rounded-full p-1">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Selection & Start Interview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Select Job</h3>

            {jobs.length === 0 ? (
              <div className="text-center py-3 mb-6">
                <p className="text-gray-500">No jobs available</p>
              </div>
            ) : (
              <div className="mb-6">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={selectedJob?.id || ""}
                  onChange={(e) => {
                    const jobId = parseInt(e.target.value);
                    const job = jobs.find(j => j.id === jobId);
                    setState(prev => ({ ...prev, selectedJob: job || null }));
                  }}
                >
                  <option value="" disabled>Select a job position</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-auto pt-4">
              <div className="mb-4">
                {selectedCandidate ? (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                    <p className="font-medium">Selected Candidate:</p>
                    <p className="text-gray-700">{selectedCandidate.name} ({selectedCandidate.phone})</p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                    Please select a candidate from the list
                  </div>
                )}
              </div>

              <button
                onClick={startConversation}
                disabled={!selectedCandidate || !selectedJob || isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${(!selectedCandidate || !selectedJob || isLoading) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing Interview...
                  </>
                ) : (
                  "Start Interview"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Interview Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">Interviewing: {profile?.name}</h3>
              <p className="text-indigo-100 text-sm">Position: {jobTitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              {isListening && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-white"></span>
                  Listening
                </span>
              )}
              {isSpeaking && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-white"></span>
                  Speaking
                </span>
              )}
              <button
                onClick={cancelInterview}
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-1 rounded text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Interview Body */}
          <div className="p-6">
            {/* Conversation Logs */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Conversation</h4>

              {logs.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-500">
                  The conversation will appear here...
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {logs.map((log, i) => (
                    <div key={i} className="rounded-lg overflow-hidden">
                      <div className="bg-indigo-50 p-3 border-l-4 border-indigo-400">
                        <p className="font-medium text-indigo-800">
                          Q{log.questionIndex + 1}: {log.question}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 border-l-4 border-gray-300">
                        <p className="text-gray-700">
                          <span className="font-medium">A:</span> {log.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Collected Data */}
            {Object.keys(answers).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Collected Data</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {answers.interest && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Interest</p>
                        <p className="font-medium">{answers.interest}</p>
                      </div>
                    )}
                    {answers.notice_period && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Notice Period</p>
                        <p className="font-medium">{answers.notice_period}</p>
                      </div>
                    )}
                    {answers.current_ctc && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Current CTC</p>
                        <p className="font-medium">{answers.current_ctc}</p>
                      </div>
                    )}
                    {answers.expected_ctc && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Expected CTC</p>
                        <p className="font-medium">{answers.expected_ctc}</p>
                      </div>
                    )}
                    {answers.formatted_date && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Interview Date</p>
                        <p className="font-medium">{answers.formatted_date}</p>
                      </div>
                    )}
                    {answers.interview_time && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Interview Time</p>
                        <p className="font-medium">{answers.interview_time}</p>
                      </div>
                    )}
                    {answers.confirmation && (
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Confirmation</p>
                        <p className="font-medium">{answers.confirmation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={stopEverything}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!isSpeaking && !isListening}
              >
                {isSpeaking ? "Stop Speaking" : isListening ? "Stop Listening" : "Paused"}
              </button>

              <button
                onClick={startConversation}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSpeaking || isListening}
              >
                Restart Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversation;