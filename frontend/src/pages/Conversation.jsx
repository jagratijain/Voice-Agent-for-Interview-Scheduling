import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Conversation = () => {
  // Constants
  const COMPANY = "Interactly";
  const API_BASE_URL = "http://localhost:5000/api";
  
  // Speech objects
  const synth = window.speechSynthesis;
  const recognitionRef = useRef(null);
  
  // States
  const [conversationState, setConversationState] = useState({
    currentQuestionIndex: -1,
    profile: null,
    jobTitle: "",
    answers: {},
    logs: [],
    isListening: false,
    isSpeaking: false,
    isReady: false
  });
  
  // Questions
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
      console.log("Initializing speech recognition");
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      const recognition = recognitionRef.current;
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false; // Ensure it stops after detecting speech
      recognition.maxAlternatives = 1;
    }
    
    return () => {
      console.log("Component unmounting, stopping everything");
      stopEverything();
    };
  }, []);
  
  // Setup recognition handlers when listening state changes
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    
    if (conversationState.isListening) {
      console.log("Setting up recognition handlers");
      
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      
      recognition.onresult = handleRecognitionResult;
      recognition.onerror = handleRecognitionError;
      recognition.onend = handleRecognitionEnd;
      
      // Start recognition after a small delay to ensure handlers are set
      setTimeout(() => {
        try {
          console.log("Actually starting recognition");
          recognition.start();
        } catch (error) {
          console.error("Failed to start recognition:", error);
          setConversationState(prev => ({...prev, isListening: false}));
        }
      }, 50);
    } else {
      
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    }
  }, [conversationState.isListening]);
  
  // Handle speech recognition result
  const handleRecognitionResult = (event) => {
    const transcript = event.results[0][0].transcript;
    const currentIndex = conversationState.currentQuestionIndex;
    
    // Immediately stop listening to prevent duplicate handling
    stopListening();
    
    // Process the user's response
    processUserResponse(transcript, currentIndex);
  };
  
  const handleRecognitionError = (event) => {
    console.error("Speech recognition error:", event.error);
    stopListening();
    
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      speak("Could you please repeat that?", () => {
        startListening();
      });
    }
  };
  
  const handleRecognitionEnd = () => {
    
    setConversationState(prev => ({...prev, isListening: false}));
  };
  
  // Process user's response to current question
  const processUserResponse = (text, questionIndex) => {
    // Get current question details
    const currentQ = questions[questionIndex];
    const field = currentQ.field;
    
    // Extract entities based on question type
    const entities = extractEntities(text, field);
    
    // Update conversation state atomically
    setConversationState(prev => {
      // Create the new log entry
      const newLog = { 
        question: currentQ.question, 
        answer: text,
        questionIndex: questionIndex
      };
      
      // Combine new answers with existing ones
      const newAnswers = {...prev.answers};
      Object.keys(entities).forEach(key => {
        newAnswers[key] = entities[key];
      });
      
      return {
        ...prev,
        logs: [...prev.logs, newLog],
        answers: newAnswers
      };
    });
    
    // Determine next step
    if (questionIndex + 1 < questions.length) {
      // Move to next question
      continueToNextQuestion(questionIndex + 1, entities);
    } else {
      speak("Thank you. We have saved your information.", saveData);
    }
  };
  
  // Move to the next question
  const continueToNextQuestion = (nextIndex, entities) => {
    console.log(`Moving to question ${nextIndex}`);
    
    // Update question index first
    setConversationState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex
    }));
    
    // Get latest answers from state to ensure we have all data
    const currentAnswers = {...conversationState.answers};
    
    // Prepare next question text
    let nextQuestion = questions[nextIndex].question;
    
    // Special handling for confirmation question
    if (questions[nextIndex].field === "confirmation") {
      // Use full formatted date and time information
      const formattedDate = entities?.formatted_date || updatedAnswers.formatted_date || "next Monday";
      const interviewTime = entities?.interview_time || updatedAnswers.interview_time || "10:00 AM";
      nextQuestion = nextQuestion.replace("[Date/Time]", `${formattedDate} at ${interviewTime}`);
    }
    
    // Add delay to ensure state is updated
    setTimeout(() => {
      // Speak question then listen for response
      console.log(`Speaking question ${nextIndex}: ${nextQuestion}`);
      speak(nextQuestion, () => {
        console.log("Question spoken, now starting to listen");
        // Add a short delay after speaking before listening
        setTimeout(startListening, 300);
      });
    }, 500);
  };
  
  // Extract entities from response text
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
        // Extract day of week
        const dayMatch = text.match(/\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i);
        const dayOfWeek = dayMatch ? dayMatch[0] : null;
        
        // Extract time if mentioned
        const timeMatch = text.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i);
        const timeOfDay = timeMatch ? timeMatch[0] : "10:00 AM"; // Default to 10 AM if no time specified
        
        // Calculate actual date from day name
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
            // Calculate days to add (if today is the same day, go to next week)
            let daysToAdd = targetDayIndex - currentDayIndex;
            if (daysToAdd <= 0) daysToAdd += 7; // Go to next week if day has passed
            
            // Calculate the actual date
            const interviewDateObj = new Date();
            interviewDateObj.setDate(today.getDate() + daysToAdd);
            
            // Format the date as YYYY-MM-DD for storage
            interviewDate = interviewDateObj.toISOString().split('T')[0];
            
            // Format for display (e.g., "Tuesday, April 16")
            formattedDate = `${dayOfWeek}, ${interviewDateObj.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            })}`;
          }
        } else {
          // If no day specified, default to next Monday
          const today = new Date();
          const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7; // Calculate days until next Monday
          
          const interviewDateObj = new Date();
          interviewDateObj.setDate(today.getDate() + daysUntilMonday);
          
          interviewDate = interviewDateObj.toISOString().split('T')[0];
          formattedDate = `Monday, ${interviewDateObj.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
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
    // Set speaking state
    setConversationState(prev => ({...prev, isSpeaking: true}));
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onend = () => {
      setConversationState(prev => ({...prev, isSpeaking: false}));
      if (callback) callback();
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setConversationState(prev => ({...prev, isSpeaking: false}));
      if (callback) callback();
    };
    
    synth.speak(utterance);
  };
  
  // Start listening for user response
  const startListening = () => {
    // Only start listening if we're not already speaking
    if (!conversationState.isSpeaking) {
      console.log("Starting listening...");
      setConversationState(prev => ({...prev, isListening: true}));
    } else {
      // If we're speaking, wait until speaking is done
      console.log("Can't start listening while speaking, scheduling for later");
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
    setConversationState(prev => ({...prev, isListening: false}));
  };
  
  // Stop all audio activities
  const stopEverything = () => {
    // Stop speech synthesis
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Stop speech recognition
    stopListening();
    
    // Update state
    setConversationState(prev => ({
      ...prev,
      isListening: false,
      isSpeaking: false
    }));
  };
  
  // Load candidate and job data
  const fetchCandidateProfile = async (candidateId, jobId) => {
    try {
      const [candidateRes, jobRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/candidates/${candidateId}`),
        axios.get(`${API_BASE_URL}/jobs/${jobId}`)
      ]);
      
      setConversationState(prev => ({
        ...prev,
        profile: candidateRes.data,
        jobTitle: jobRes.data.title,
        isReady: true
      }));
      
      return true;
    } catch (err) {
      console.error("Failed to load profile:", err);
      alert("Failed to load candidate or job information");
      return false;
    }
  };
  
  // Start the interview
  const startConversation = async () => {
    // Prevent multiple clicks
    if (conversationState.isSpeaking || conversationState.isListening) {
      console.log("Cannot start conversation while speaking or listening");
      return;
    }
    
    // Reset everything
    stopEverything();
    
    setConversationState({
      currentQuestionIndex: -1,
      profile: null,
      jobTitle: "",
      answers: {},
      logs: [],
      isListening: false,
      isSpeaking: false,
      isReady: false
    });
    
    // Load data
    console.log("Fetching candidate profile...");
    const success = await fetchCandidateProfile(1, 1);
    if (success) {
      // Start with greeting after a short delay
      console.log("Profile loaded, starting greeting soon...");
      setTimeout(startGreeting, 500);
    }
  };
  
  // Start with greeting
  const startGreeting = () => {
    const { profile, jobTitle } = conversationState;
    if (!profile || !jobTitle) return;
    
    // Set first question index
    setConversationState(prev => ({
      ...prev,
      currentQuestionIndex: 0
    }));
    
    // Speak greeting followed by first question
    const greeting = `Hello ${profile.name}, this is ${COMPANY} regarding a ${jobTitle} opportunity.`;
    speak(greeting, () => {
      speak(questions[0].question, startListening);
    });
  };
  
  // Save collected data to server
  const saveData = async () => {
    const { profile, answers, logs } = conversationState;
    
    try {
      // Save or update candidate information
      console.log(profile);
      
      const candidateResponse = await axios.post(`${API_BASE_URL}/candidates/${profile.id}`, {
        current_ctc: answers.current_ctc,
        expected_ctc: answers.expected_ctc,
        notice_period: answers.notice_period
      });
      
      // Get candidate ID (either from response or use default for demo)
      const candidateId = candidateResponse.data?.id || 1;
      
      // Save conversation transcript to conversations table
      await saveConversationData(candidateId, logs, answers);
      
      // Save appointment if confirmed
      if (answers.confirmation && answers.confirmation.toLowerCase().includes('yes')) {
        await axios.post(`${API_BASE_URL}/appointments`, {
          candidate_id: candidateId,
          job_id: 1, // Assuming job ID is 1 for demo
          date_time: `${answers.interview_date}T${convertTimeToISO(answers.interview_time)}`,
          status: 'confirmed'
        });
      }
      
      alert("Interview information saved successfully!");
    } catch (err) {
      console.error("Failed to save data:", err);
      alert("Failed to save interview information");
    }
  };
  
  // Save conversation data to conversations table
  const saveConversationData = async (candidateId, logs, answers) => {
    try {
      // Prepare transcript text (format: Q: question A: answer)
      const transcriptText = logs.map(log => 
        `Q: ${log.question}\nA: ${log.answer}`
      ).join('\n\n');
      
      // Prepare entities extracted as JSON string
      // This is crucial - we need to stringify the JSON object for MySQL
      const entitiesExtracted = JSON.stringify({
        interest: answers.interest || null,
        notice_period: answers.notice_period || null,
        current_ctc: answers.current_ctc || null,
        expected_ctc: answers.expected_ctc || null,
        interview_date: answers.interview_date || null,
        interview_time: answers.interview_time || null,
        confirmation: answers.confirmation || null
      });
      
      // Save to conversations table
      await axios.post(`${API_BASE_URL}/conversations`, {
        candidate_id: candidateId,
        transcript: transcriptText,
        entities_extracted: entitiesExtracted
      });
      
      console.log("Conversation data saved successfully");
    } catch (error) {
      console.error("Error saving conversation data:", error);
      // Don't throw error to allow the rest of the process to continue
    }
  };
  
  // Helper to convert 12h time format to 24h ISO format
  const convertTimeToISO = (timeStr) => {
    if (!timeStr) return '10:00:00'; // Default
    
    let hours, minutes, period;
    
    // Try to parse different time formats
    const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      period = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
      
      // Convert to 24h format
      if (period === 'pm' && hours < 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;
      
      // Format with leading zeros
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }
    
    return '10:00:00'; // Default fallback
  };

  const { currentQuestionIndex, logs, answers, isListening, isSpeaking } = conversationState;
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Voice Interview Assistant</h2>
      
      <button 
        onClick={startConversation} 
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        disabled={isSpeaking || isListening}
      >
        {currentQuestionIndex === -1 ? "Start Interview" : "Restart Interview"}
      </button>
      
      {isListening && <p className="text-green-600 font-semibold mt-2">Listening...</p>}
      {isSpeaking && <p className="text-blue-600 font-semibold mt-2">Speaking...</p>}

      <div className="mt-4 space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="bg-gray-100 p-3 rounded shadow">
            <p className="font-medium">Q{log.questionIndex + 1}: {log.question}</p>
            <p>A: <em>{log.answer}</em></p>
          </div>
        ))}
      </div>

      {Object.keys(answers).length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Collected Data</h3>
          <pre className="bg-white border rounded p-4 text-sm">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Conversation;