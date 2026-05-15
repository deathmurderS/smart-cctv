const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🗑️ Menghapus data dummy lama...')
    await prisma.event.deleteMany({
        where: {
            camera: {
                wilayah: null
            }
        }
    })
    await prisma.camera.deleteMany({
        where: {
            wilayah: null
        }
    })
    console.log('✅ Data dummy lama berhasil dihapus!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())