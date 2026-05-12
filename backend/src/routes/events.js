const express = require('express')
const router = express.Router()
const { getAllEvents, createEvent, getEventsByCamera } = require('../controllers/eventController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, getAllEvents)
router.post('/', authMiddleware, createEvent)
router.get('/camera/:id', authMiddleware, getEventsByCamera)

module.exports = router