const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const cameraRoutes = require('./routes/cameras')
const eventRoutes = require('./routes/events')
const analyticsRoutes = require('./routes/analytics')
const authRoutes = require('./routes/auth')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' }
})

app.use(cors())
app.use(express.json())

app.use('/api/cameras', cameraRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/auth', authRoutes)

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
    })
})

app.set('io', io)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})