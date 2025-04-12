const db = require('../config/db');

// Create a new job
exports.createJob = (req, res) => {
  const { title, description, requirements, timeSlots  } = req.body;
  const timeSlotsSerialized = typeof timeSlots === 'object' ? 
  JSON.stringify(timeSlots) : timeSlots;

  const sql = `INSERT INTO jobs (title, description, requirements, timeSlots ) VALUES (?, ?, ?, ?)`;
  db.query(sql, [title, description, requirements, timeSlotsSerialized], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
  });
};

// Get all jobs
exports.getJobs = (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get single job
exports.getJobById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM jobs WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(results[0]);
  });
};

// Update job
exports.updateJob = (req, res) => {
  const { id } = req.params;
  const { title, description, requirements, timeSlots  } = req.body;
  const timeSlotsSerialized = typeof timeSlots === 'object' ? 
  JSON.stringify(timeSlots) : timeSlots;
  const sql = `UPDATE jobs SET title=?, description=?, requirements=?, timeSlots = ? WHERE id=?`;
  db.query(sql, [title, description, requirements, timeSlotsSerialized, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job updated successfully' });
  });
};

// Delete job
exports.deleteJob = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM jobs WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job deleted successfully' });
  });
};
