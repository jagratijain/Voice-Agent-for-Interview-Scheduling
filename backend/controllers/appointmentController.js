const db = require('../config/db');

// Get all appointments
exports.getAllAppointments = (req, res) => {
  db.query('SELECT * FROM appointments', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get single appointment
exports.getAppointmentById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM appointments WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

// Create appointment
exports.createAppointment = (req, res) => {
  const { job_id, candidate_id, date, status } = req.body;
  console.log(date);
  
  db.query('INSERT INTO appointments (job_id, candidate_id, date_time, status) VALUES (?, ?, ?, ?)',
    [job_id, candidate_id, date, status], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, job_id, candidate_id, date, status });
    });
};

// Update appointment
exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const { job_id, candidate_id, date, status } = req.body;
  db.query('UPDATE appointments SET job_id=?, candidate_id=?, date=?, status=? WHERE id=?',
    [job_id, candidate_id, date, status, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, job_id, candidate_id, date, status });
    });
};

// Delete appointment
exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM appointments WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Appointment deleted' });
  });
};
