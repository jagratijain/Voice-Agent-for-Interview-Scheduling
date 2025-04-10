const express = require('express');
const router = express.Router();
const {
  getJobs,         // ✅ matches the controller
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

router.get('/', getJobs);         // ✅ ONLY ONE get route
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
