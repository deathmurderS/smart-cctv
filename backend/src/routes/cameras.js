const express = require('express')
const router = express.Router()
const { getAllCameras, createCamera, updateCamera, deleteCamera, checkStreamHealth, checkAreaStreamHealth } = require('../controllers/cameraController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/wilayah/:wilayah/health', authMiddleware, checkAreaStreamHealth)
router.get('/:id/health', authMiddleware, checkStreamHealth)
router.get('/', authMiddleware, getAllCameras)
router.post('/', authMiddleware, createCamera)
router.put('/:id', authMiddleware, updateCamera)
router.delete('/:id', authMiddleware, deleteCamera)

module.exports = router