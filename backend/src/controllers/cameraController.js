const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllCameras = async (req, res) => {
    try {
        const cameras = await prisma.camera.findMany({
            include: { events: true }
        })
        res.json(cameras)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createCamera = async (req, res) => {
    try {
        const { name, location } = req.body
        const camera = await prisma.camera.create({
            data: { name, location }
        })
        res.status(201).json(camera)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateCamera = async (req, res) => {
    try {
        const { id } = req.params
        const { name, location, status } = req.body
        const camera = await prisma.camera.update({
            where: { id: parseInt(id) },
            data: { name, location, status }
        })
        res.json(camera)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteCamera = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.camera.delete({
            where: { id: parseInt(id) }
        })
        res.json({ message: 'Camera deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllCameras, createCamera, updateCamera, deleteCamera }