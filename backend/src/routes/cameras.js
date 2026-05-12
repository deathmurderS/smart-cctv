const express = require('express')
const router = express.Router()
const { getAllCameras, createCamera, updateCamera, deleteCamera } = require('../controllers/cameraController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, getAllCameras)
router.post('/', authMiddleware, createCamera)
router.put('/:id', authMiddleware, updateCamera)
router.delete('/:id', authMiddleware, deleteCamera)

module.exports = router