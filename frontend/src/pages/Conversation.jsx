import { useEffect, useState } from 'react';
import api from '../services/api';

const Conversation = () => {
  const [conversations, setConversations] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await api.get('/conversations');
    setConversations(res.data);
  };

  // Web Speech API
  const handleStartListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      saveTranscript(speechResult);
      setListening(false);
    };

    recognition.onerror = (err) => {
      console.error(err);
      setListening(false);
    };

    recognition.start();
  };

  const saveTranscript = async (text) => {
    try {
      await api.post('/conversations', {
        candidate_id: 1, // hardcoded for now or use dropdown
        transcript: text,
        entities_extracted: JSON.stringify({ notice_period: extractNoticePeriod(text) })
      });
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const extractNoticePeriod = (text) => {
    const match = text.match(/\b(\d+)\s*(weeks?|months?|days?)\b/i);
    return match ? match[0] : 'Not found';
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Conversation Simulator</h2>

      <div className="space-y-4 mb-6">
        <button onClick={() => speak('Hello! What is your current notice period?')} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Ask Notice Period
        </button>

        <button onClick={handleStartListening} className="bg-green-600 text-white px-4 py-2 rounded">
          {listening ? 'Listening...' : 'Start Listening'}
        </button>

        {transcript && (
          <p className="border p-2 rounded bg-gray-50">
            <strong>You said:</strong> {transcript}
          </p>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">Conversation Logs</h3>
      <ul className="space-y-2">
        {conversations.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <strong>Candidate #{c.candidate_id}</strong>: "{c.transcript}" <br />
            <em>Entities: {c.entities_extracted}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversation;
