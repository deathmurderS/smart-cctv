const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })
        res.status(201).json({ message: 'User created', userId: user.id })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return res.status(401).json({ message: 'Wrong password' })

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, getProfile }