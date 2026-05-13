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

module.exports = app