const db = require('../config/db');

// Get all candidates
exports.getAllCandidates = (req, res) => {
  db.query('SELECT * FROM candidates', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get candidate by ID
exports.getCandidateById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM candidates WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Candidate not found' });
    res.json(result[0]);
  });
};

// Create a candidate
exports.createCandidate = (req, res) => {
  const {
    name,
    phone,
    current_ctc,
    expected_ctc,
    notice_period,
    experience,
    email,
    location,
    booking_status = 'pending',
  } = req.body;

  db.query(
    `INSERT INTO candidates 
      (name, phone, current_ctc, expected_ctc, notice_period, experience, email, location, booking_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, phone, current_ctc, expected_ctc, notice_period, experience, email, location, booking_status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // 👇 Fetch full row including created_at after insert
      db.query('SELECT * FROM candidates WHERE id = ?', [result.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.status(201).json(rows[0]);
      });
    }
  );
};

// Update a candidate
exports.updateCandidate = (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    current_ctc,
    expected_ctc,
    notice_period,
    experience,
    email,
    location,
    booking_status,
  } = req.body;

  db.query(
    `UPDATE candidates 
     SET name = ?, phone = ?, current_ctc = ?, expected_ctc = ?, notice_period = ?, experience = ?, email = ?, location = ?, booking_status = ? 
     WHERE id = ?`,
    [name, phone, current_ctc, expected_ctc, notice_period, experience, email, location, booking_status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        id,
        name,
        phone,
        current_ctc,
        expected_ctc,
        notice_period,
        experience,
        email,
        location,
        booking_status
      });
    }
  );
};

// Delete a candidate
exports.deleteCandidate = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM candidates WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  });
};
