const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./config/db'); // Ensure DB connection is established

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- ROUTE IMPORTS -------------------
const candidateRoutes = require('./routes/candidateRoutes');
const jobRoutes = require('./routes/jobRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

// ------------------- MIDDLEWARES ---------------------
app.use(cors());
app.use(bodyParser.json());

// ------------------- ROUTE BINDINGS ------------------
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/conversations', conversationRoutes);

// ------------------- ROOT ROUTE ----------------------
app.get('/', (req, res) => {
  res.send('🎙️ Voice Agent API is running');
});

// ------------------- SERVER LISTEN -------------------
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
