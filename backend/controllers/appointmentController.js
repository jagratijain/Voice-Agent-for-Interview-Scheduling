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
  console.log(req.body);

  const { job_id, candidate_id, date_time, status } = req.body;
  console.log(date_time);

  db.query('INSERT INTO appointments (job_id, candidate_id, date_time, status) VALUES (?, ?, ?, ?)',
    [job_id, candidate_id, date_time, status], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, job_id, candidate_id, date_time, status });
    });
};

// Update appointment
exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const {status } = req.body;
  db.query('UPDATE appointments SET status=? WHERE id=?',
    [status, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, status });
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
