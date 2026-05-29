const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body
        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: { name, email },
            select: { id: true, name: true, email: true, role: true }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } })

        const isValid = await bcrypt.compare(oldPassword, user.password)
        if (!isValid) return res.status(400).json({ message: 'Password lama salah' })

        const hashed = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { password: hashed }
        })

        res.json({ message: 'Password berhasil diubah' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getProfile, updateProfile, changePassword }