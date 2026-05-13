const express = require('express')
const router = express.Router()
const { getUsers, getUserById, createUser, deleteUser } = require('../controllers/userController')
const { getProfile } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/users', authMiddleware, getUsers)
router.get('/users/:id', authMiddleware, getUserById)
router.post('/users', authMiddleware, createUser)
router.post('/users/:id', authMiddleware, getProfile)
router.delete('/users/:id', authMiddleware, deleteUser)

module.exports = router