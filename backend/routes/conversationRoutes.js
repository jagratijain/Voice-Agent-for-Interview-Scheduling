const express = require('express');
const router = express.Router();
const {
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation
} = require('../controllers/conversationController');

router.get('/', getAllConversations);
router.get('/:id', getConversationById);
router.post('/', createConversation);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

module.exports = router;
