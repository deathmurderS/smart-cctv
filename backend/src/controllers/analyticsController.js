const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getSummary = async (req, res) => {
    try {
        const totalCameras = await prisma.camera.count()
        const onlineCameras = await prisma.camera.count({ where: { status: 'online' } })
        const totalEvents = await prisma.event.count()

        res.json({ totalCameras, onlineCameras, totalEvents })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getEventsByLocation = async (req, res) => {
    try {
        const result = await prisma.event.groupBy({
            by: ['cameraId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } }
        })

        const enriched = await Promise.all(result.map(async (item) => {
            const camera = await prisma.camera.findUnique({ where: { id: item.cameraId } })
            return { location: camera.location, total: item._count.id }
        }))

        res.json(enriched)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getEventsByHour = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            select: { timestamp: true }
        })

        const hourCount = {}
        events.forEach(event => {
            const hour = new Date(event.timestamp).getHours()
            hourCount[hour] = (hourCount[hour] || 0) + 1
        })

        const result = Array.from({ length: 24 }, (_, hour) => ({
            hour: `${hour}:00`,
            total: hourCount[hour] || 0
        }))

        res.json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getSummary, getEventsByLocation, getEventsByHour }