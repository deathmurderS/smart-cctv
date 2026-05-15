const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const { checkStreamHealth } = require('../controllers/cameraController')

router.post('/register', register)
router.post('/login', login)

module.exports = router