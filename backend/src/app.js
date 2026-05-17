const express = require('express')
const cors = require('cors')
require('dotenv').config()

const cameraRoutes = require('./routes/cameras')
const eventRoutes = require('./routes/events')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')

const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://smart-cctv-2xpc.vercel.app'
    ],
    credentials: true
}))

app.use(express.json())

app.use('/api/cameras', cameraRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/debug', (req, res) => {
    res.json({
        db: process.env.DATABASE_URL ? 'set' : 'missing',
        jwt: process.env.JWT_SECRET ? 'set' : 'missing'
    })
})

app.get('/api/seed-all', async (req, res) => {
    const secret = req.query.secret
    if (secret !== 'seed_metro_2026') return res.status(401).json({ message: 'Unauthorized' })

    try {
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()

        const response = await fetch('https://gist.githubusercontent.com/deathmurderS/945a558b6708232582bd679aadd6222d/raw/4f01874668ad73be7e921f88385d62bf18b5a33b/seedAll.json')
        const allCameras = await response.json()

        await prisma.camera.deleteMany({
            where: { wilayah: { not: 'POLDA METRO JAYA' } }
        })

        const batchSize = 100
        let total = 0
        for (let i = 0; i < allCameras.length; i += batchSize) {
            const batch = allCameras.slice(i, i + batchSize)
            await prisma.camera.createMany({ data: batch, skipDuplicates: true })
            total += batch.length
        }

        await prisma.$disconnect()
        res.json({ message: 'Done!', total })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = app