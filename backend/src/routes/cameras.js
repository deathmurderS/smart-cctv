const express = require('express')
const router = express.Router()
const { getAllCameras, createCamera, updateCamera, deleteCamera, checkStreamHealth } = require('../controllers/cameraController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:id/health', authMiddleware, checkStreamHealth)
router.get('/', authMiddleware, getAllCameras)
router.post('/', authMiddleware, createCamera)
router.put('/:id', authMiddleware, updateCamera)
router.delete('/:id', authMiddleware, deleteCamera)
router.get('/', authMiddleware, getAllCameras)

module.exports = router