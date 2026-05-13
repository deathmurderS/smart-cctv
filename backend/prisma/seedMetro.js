const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const metroData = [
    { name: 'Bund. Alam Sutra Serpong', location: 'Alam Sutera', latitude: -6.24595, longitude: 106.54976, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/003_Bunderan+Alam+Sutera+Tangerang.stream/playlist.m3u8', status: 'online' },
    { name: 'Jl. Gading Raya Serpong', location: 'Kelapa Gading', latitude: -6.23091, longitude: 106.64186, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/009_MOI+Balai+Samudra+Kelapa+Gading.stream/playlist.m3u8', status: 'online' },
    { name: 'Gas Alam Cimanggis', location: 'Cimanggis Depok', latitude: -6.38196, longitude: 106.86689, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/015_Simpang+Jalan+Cimanggis+-+Depok.stream/playlist.m3u8', status: 'online' },
    { name: 'Gerbang MOI Balai Samudra', location: 'Kelapa Gading', latitude: -6.15240, longitude: 106.89182, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/013_Pos+Polisi+Gading+Serpong.stream/playlist.m3u8', status: 'online' },
    { name: 'Gereja Immanuel Jakarta', location: 'Jakarta Pusat', latitude: -6.17654, longitude: 106.83116, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/026_Gereja+Immanuel+Jkt.stream/playlist.m3u8', status: 'online' },
    { name: 'JICT', location: 'Tanjung Priok', latitude: -6.10759, longitude: 106.89316, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/049_TL+JICT.stream/playlist.m3u8', status: 'online' },
    { name: 'Marina Ancol', location: 'Ancol Jakarta Utara', latitude: -6.12962, longitude: 106.82930, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/027_Marina+Ancol.stream/playlist.m3u8', status: 'online' },
    { name: 'Merak Cikuasa Atas 1', location: 'Merak Banten', latitude: -5.93941, longitude: 106.00397, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/029_Merak+Cikuasa+Atas+1.stream/playlist.m3u8', status: 'online' },
    { name: 'Soekarno Hatta 1', location: 'Bandara Soetta', latitude: -6.12058, longitude: 106.66894, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/001_Bandara+Soetta+Arah+Jakarta.stream/playlist.m3u8', status: 'offline' },
    { name: 'Soekarno Hatta 2', location: 'Bandara Soetta', latitude: -6.12058, longitude: 106.66894, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/002_Bandara+Soetta+Arah+Tangerang.stream/playlist.m3u8', status: 'offline' },
    { name: 'Bund. Pondok Indah', location: 'Pondok Indah Jakarta Selatan', latitude: -6.28009, longitude: 106.78024, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/060_TL+Pondok+Indah.stream/playlist.m3u8', status: 'offline' },
    { name: 'Cibubur Junction', location: 'Cibubur Jakarta Timur', latitude: -6.36988, longitude: 106.89318, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/012_Pos+Polisi+Cibubur.stream/playlist.m3u8', status: 'offline' },
    { name: 'TL Fatmawati', location: 'Fatmawati Jakarta Selatan', latitude: -6.29191, longitude: 106.79512, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/016_Simpang+Jalan+Fatmawati+Raya.stream/playlist.m3u8', status: 'offline' },
    { name: 'Gereja Katedral Jakarta', location: 'Jakarta Pusat', latitude: -6.16988, longitude: 106.83295, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/005_Gereja+Katedral.stream/playlist.m3u8', status: 'offline' },
    { name: 'Gunung Sahari', location: 'Jakarta Pusat', latitude: -6.15887, longitude: 106.83755, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/016_Simpang+Jalan+Fatmawati+Raya.stream/playlist.m3u8', status: 'offline' },
    { name: 'Hyatt Bundaran HI', location: 'Jakarta Pusat', latitude: -6.19517, longitude: 106.82309, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/006_Grand+Hyatt+Hotel.stream/playlist.m3u8', status: 'offline' },
    { name: 'Jagakarsa', location: 'Jakarta Selatan', latitude: -6.30698, longitude: 106.86556, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/048_TL+Jagakarsa.stream/playlist.m3u8', status: 'offline' },
    { name: 'Merak Tower Air', location: 'Merak Banten', latitude: -5.93072, longitude: 105.99697, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/028_Merak.stream/playlist.m3u8', status: 'offline' },
    { name: 'Merak Cikuasa Atas 2', location: 'Merak Banten', latitude: -5.93941, longitude: 106.00397, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/030_Merak+Cikuasa+Atas+2.stream/playlist.m3u8', status: 'offline' },
    { name: 'Bakauheni', location: 'Bakauheni Lampung', latitude: -5.86761, longitude: 105.75230, streamUrl: 'https://vms.k3i-korlantas.id/K3i/METRO/024_Bakauheni.stream/playlist.m3u8', status: 'offline' },
]

async function main() {
    console.log('🌱 Seeding Metro Jaya cameras...')

    await Promise.all(
        metroData.map(camera =>
            prisma.camera.create({
                data: {
                    name: camera.name,
                    location: camera.location,
                    latitude: camera.latitude,
                    longitude: camera.longitude,
                    streamUrl: camera.streamUrl,
                    wilayah: 'POLDA METRO JAYA',
                    status: camera.status
                }
            })
        )
    )

    console.log(`✅ Created ${metroData.length} Metro Jaya cameras`)
    console.log('🎉 Done!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())