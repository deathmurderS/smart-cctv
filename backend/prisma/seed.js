const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const locations = ['Lobby', 'Parking Lot', 'Warehouse', 'Office Floor', 'Server Room', 'Rooftop']
const eventTypes = ['motion_detected', 'person_detected', 'camera_offline', 'camera_online']

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const randomDate = () => {
    const now = new Date()
    const past = new Date(now - 7 * 24 * 60 * 60 * 1000) // 7 hari terakhir
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
}

async function main() {
    console.log('🌱 Seeding database...')

    // Hapus data lama
    await prisma.event.deleteMany()
    await prisma.camera.deleteMany()

    // Buat cameras
    const cameras = await Promise.all(
        locations.map((location, i) =>
            prisma.camera.create({
                data: {
                    name: `Camera ${String(i + 1).padStart(2, '0')}`,
                    location,
                    status: Math.random() > 0.2 ? 'online' : 'offline'
                }
            })
        )
    )

    console.log(`✅ Created ${cameras.length} cameras`)

    // Buat events
    const events = []
    for (let i = 0; i < 500; i++) {
        events.push({
            cameraId: randomItem(cameras).id,
            type: randomItem(eventTypes),
            timestamp: randomDate()
        })
    }

    await prisma.event.createMany({ data: events })
    console.log(`✅ Created ${events.length} events`)

    console.log('🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })