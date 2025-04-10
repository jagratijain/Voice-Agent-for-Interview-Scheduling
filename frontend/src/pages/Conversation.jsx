import React, { useState } from 'react';
import axios from 'axios';

const questions = [
  { field: 'name', question: 'What is your full name?' },
  { field: 'email', question: 'What is your email address?' },
  { field: 'notice_period', question: 'What is your notice period?' },
  { field: 'current_ctc', question: 'What is your current CTC?' },
  { field: 'expected_ctc', question: 'What is your expected CTC?' },
  { field: 'location', question: 'Where are you located?' }
];

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const Conversation = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [listening, setListening] = useState(false);
  const [logs, setLogs] = useState([]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const startConversation = () => {
    setStep(0);
    setAnswers({});
    setLogs([]);
    speak(questions[0].question);
    setTimeout(() => {
      startListening();
    }, 1500);
  };

  const startListening = () => {
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSpeechResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleSpeechResult = (text) => {
    const currentField = questions[step].field;
    const currentQuestion = questions[step].question;

    const newLog = { question: currentQuestion, answer: text };
    setLogs(prev => [...prev, newLog]);

    const updatedAnswers = { ...answers, [currentField]: text };
    setAnswers(updatedAnswers);

    if (step + 1 < questions.length) {
      setStep(prev => prev + 1);
      speak(questions[step + 1].question);
      setTimeout(() => {
        startListening();
      }, 1500);
    } else {
      // All answers collected
      speak("Thank you! Saving your information.");
      saveCandidate(updatedAnswers);
    }
  };

  const saveCandidate = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/candidates', data); // Update URL if needed
      alert('Candidate information saved!');
    } catch (error) {
      console.error('Failed to save candidate:', error);
      alert('Failed to save candidate. Check console.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Conversation Simulator</h2>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={startConversation}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Start Conversation
        </button>
        {listening && (
          <span className="text-green-600 font-semibold">Listening...</span>
        )}
      </div>

      <div className="mb-4">
        {logs.length > 0 && (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="border p-3 rounded bg-white shadow text-sm"
              >
                <strong>{log.question}</strong><br />
                <span className="text-gray-700">You said: {log.answer}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {Object.keys(answers).length === questions.length && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Final Collected Data:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Conversation;
