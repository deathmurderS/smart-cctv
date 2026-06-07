const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllCameras = async (req, res) => {
    try {
        const { wilayah } = req.query
        const cameras = await prisma.camera.findMany({
            where: wilayah ? { wilayah } : undefined,
            select: {
                id: true,
                name: true,
                location: true,
                status: true,
                latitude: true,
                longitude: true,
                streamUrl: true,
                wilayah: true
            }
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
        if (!camera || !camera.streamUrl) return res.json({ status: 'offline', responseTime: null })

        const startTime = Date.now()
        const response = await fetch(camera.streamUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
        const responseTime = Date.now() - startTime
        
        // Threshold: 3000ms untuk rendering/loading yang dianggap online
        const isOnline = response.ok && responseTime < 3000
        console.log(responseTime)

        await prisma.camera.update({
            where: { id: parseInt(id) },
            data: { status: isOnline ? 'online' : 'offline' }
        })

        res.json({ status: isOnline ? 'online' : 'offline', responseTime })
    } catch (error) {
        await prisma.camera.update({
            where: { id: parseInt(id) },
            data: { status: 'offline' }
        })
        res.json({ status: 'offline', responseTime: null })
    }
}

const checkAreaStreamHealth = async (req, res) => {
    const { wilayah } = req.params
    try {
        const cameras = await prisma.camera.findMany({ where: { wilayah } })
        if (!cameras.length) return res.status(404).json({ message: 'No cameras found in this area' })

        const results = await Promise.all(cameras.map(async (camera) => {
            if (!camera.streamUrl) {
                await prisma.camera.update({ where: { id: camera.id }, data: { status: 'offline' } })
                return { id: camera.id, name: camera.name, status: 'offline', responseTime: null }
            }

            const startTime = Date.now()
            try {
                const response = await fetch(camera.streamUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
                const responseTime = Date.now() - startTime
                const isOnline = response.ok && responseTime < 3000
                const status = isOnline ? 'online' : 'offline'

                await prisma.camera.update({ where: { id: camera.id }, data: { status } })
                return { id: camera.id, name: camera.name, status, responseTime }
            } catch (error) {
                await prisma.camera.update({ where: { id: camera.id }, data: { status: 'offline' } })
                return { id: camera.id, name: camera.name, status: 'offline', responseTime: null }
            }
        }))

        res.json({ wilayah, results })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllCameras, createCamera, updateCamera, deleteCamera, checkStreamHealth, checkAreaStreamHealth }