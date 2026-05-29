const express = require('express')
const router = express.Router()
const { getUsers, getUserById, createUser, deleteUser } = require('../controllers/usersController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, getUsers)
router.get('/:id', authMiddleware, getUserById)
router.post('/', authMiddleware, createUser)
router.delete('/:id', authMiddleware, deleteUser)

module.exports = router