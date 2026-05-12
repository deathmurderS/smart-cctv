const express = require('express')
const router = express.Router()
const { getSummary, getEventsByLocation, getEventsByHour } = require('../controllers/analyticsController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/summary', authMiddleware, getSummary)
router.get('/by-location', authMiddleware, getEventsByLocation)
router.get('/by-hour', authMiddleware, getEventsByHour)

module.exports = router