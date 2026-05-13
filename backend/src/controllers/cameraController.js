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

const checkStreamHealth = async (req, res) => {
    const { id } = req.params
    try {
        const camera = await prisma.camera.findUnique({ where: { id: parseInt(id) } })
        if (!camera || !camera.streamUrl) return res.json({ status: 'offline' })

        const response = await fetch(camera.streamUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
        const isOnline = response.ok

        await prisma.camera.update({
            where: { id: parseInt(id) },
            data: { status: isOnline ? 'online' : 'offline' }
        })

        res.json({ status: isOnline ? 'online' : 'offline' })
    } catch {
        await prisma.camera.update({
            where: { id: parseInt(id) },
            data: { status: 'offline' }
        })
        res.json({ status: 'offline' })
    }
}

module.exports = { getAllCameras, createCamera, updateCamera, deleteCamera, checkStreamHealth }