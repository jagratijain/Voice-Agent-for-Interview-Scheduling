const db = require('../config/db');

// Get all conversations
exports.getAllConversations = (req, res) => {
  db.query('SELECT * FROM conversations', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get single conversation
exports.getConversationById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM conversations WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

// Create conversation
exports.createConversation = (req, res) => {
  const { candidate_id, message } = req.body;
  db.query('INSERT INTO conversations (candidate_id, message) VALUES (?, ?)',
    [candidate_id, message], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, candidate_id, message });
    });
};

// Update conversation
exports.updateConversation = (req, res) => {
  const { id } = req.params;
  const { candidate_id, message } = req.body;
  db.query('UPDATE conversations SET candidate_id=?, message=? WHERE id=?',
    [candidate_id, message, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, candidate_id, message });
    });
};

// Delete conversation
exports.deleteConversation = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM conversations WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Conversation deleted' });
  });
};
