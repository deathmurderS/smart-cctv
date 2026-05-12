const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: { camera: true },
            orderBy: { timestamp: 'desc' }
        })
        res.json(events)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createEvent = async (req, res) => {
    try {
        const { cameraId, type } = req.body
        const event = await prisma.event.create({
            data: { cameraId: parseInt(cameraId), type },
            include: { camera: true }
        })
        res.status(201).json(event)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getEventsByCamera = async (req, res) => {
    try {
        const { id } = req.params
        const events = await prisma.event.findMany({
            where: { cameraId: parseInt(id) },
            orderBy: { timestamp: 'desc' }
        })
        res.json(events)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllEvents, createEvent, getEventsByCamera }