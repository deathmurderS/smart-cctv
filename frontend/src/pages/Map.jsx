import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import Hls from 'hls.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const StreamPlayer = ({ url }) => {
    const videoRef = useRef(null)

    useEffect(() => {
        if (!url || !videoRef.current) return
        if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(url)
            hls.attachMedia(videoRef.current)
            return () => hls.destroy()
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = url
        }
    }, [url])

    return (
        <video
            ref={videoRef}
            controls
            autoPlay
            muted
            style={{ width: '100%', borderRadius: '8px', marginBottom: '8px', background: '#000' }}
        />
    )
}

const Map = () => {
    const [cameras, setCameras] = useState([])
    const [filter, setFilter] = useState('all')
    const [checking, setChecking] = useState(false)

    useEffect(() => {
        const cached = sessionStorage.getItem('metro_cameras')
        if (cached) {
            setCameras(JSON.parse(cached))
            return
        }

        setChecking(true)
        api.get('/cameras').then(async res => {
            const withCoords = res.data.filter(c => c.latitude && c.longitude)
            setCameras(withCoords)

            const healthChecks = withCoords.map(camera =>
                api.get(`/cameras/${camera.id}/health`)
                    .then(r => ({ id: camera.id, status: r.data.status }))
                    .catch(() => ({ id: camera.id, status: 'offline' }))
            )

            const results = await Promise.all(healthChecks)
            const updated = withCoords.map(cam => {
                const health = results.find(r => r.id === cam.id)
                return health ? { ...cam, status: health.status } : cam
            })

            setCameras(updated)
            sessionStorage.setItem('metro_cameras', JSON.stringify(updated))
            setChecking(false)
        })
    }, [])

    const filtered = cameras.filter(c => {
        if (filter === 'online') return c.status === 'online'
        if (filter === 'offline') return c.status === 'offline'
        return true
    })

    const online = cameras.filter(c => c.status === 'online').length
    const offline = cameras.filter(c => c.status === 'offline').length

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>
            <Navbar />
            <div style={{ padding: '32px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, color: '#4a4a4a' }}>🗺️ Peta CCTV Metro Jaya</h2>
                    {checking && (
                        <p style={{ margin: '4px 0 0', color: '#c9b8e8', fontSize: '13px' }}>
                            ✨ Mengecek status stream...
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {[
                        { label: 'Total Kamera', value: cameras.length, color: '#f7c5d0', icon: '📷' },
                        { label: 'Online', value: online, color: '#b8e0d2', icon: '🟢' },
                        { label: 'Offline', value: offline, color: '#f7c5d0', icon: '🔴' },
                    ].map(item => (
                        <div key={item.label} style={{
                            background: 'white', borderRadius: '16px', padding: '16px 24px',
                            boxShadow: '0 4px 20px rgba(247,197,208,0.3)',
                            border: `1px solid ${item.color}40`, flex: 1
                        }}>
                            <p style={{ margin: 0, color: '#8a8a8a', fontSize: '13px' }}>{item.icon} {item.label}</p>
                            <h3 style={{ margin: '4px 0 0', color: item.color === '#b8e0d2' ? '#52c41a' : '#f7c5d0', fontSize: '28px' }}>{item.value}</h3>
                        </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                        {['all', 'online', 'offline'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '8px 20px', borderRadius: '20px',
                                    border: '1px solid #f7c5d0',
                                    background: filter === f ? 'linear-gradient(135deg, #f7c5d0, #c9b8e8)' : 'white',
                                    color: filter === f ? 'white' : '#4a4a4a',
                                    fontFamily: 'Zen Kaku Gothic New, sans-serif',
                                    fontSize: '13px', cursor: 'pointer'
                                }}
                            >
                                {f === 'all' ? 'Semua' : f === 'online' ? 'Online' : 'Offline'}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', marginBottom: '24px', border: '1px solid #f7c5d040' }}>
                    <MapContainer center={[-6.2, 106.8]} zoom={11} style={{ height: '500px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {filtered.map(camera => (
                            <Marker
                                key={camera.id}
                                position={[camera.latitude, camera.longitude]}
                                icon={camera.status === 'online' ? greenIcon : redIcon}
                            >
                                <Popup maxWidth={320}>
                                    <div style={{ width: '300px', fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                                        {camera.streamUrl && camera.status === 'online' && (
                                            <StreamPlayer url={camera.streamUrl} />
                                        )}
                                        {camera.status === 'offline' && (
                                            <div style={{
                                                width: '100%', height: '120px', background: '#2a2a2a',
                                                borderRadius: '8px', marginBottom: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <span style={{ color: '#666', fontSize: '13px' }}>📴 Stream tidak tersedia</span>
                                            </div>
                                        )}
                                        <strong style={{ color: '#4a4a4a' }}>{camera.name}</strong>
                                        <p style={{ margin: '4px 0', color: '#8a8a8a', fontSize: '13px' }}>{camera.location}</p>
                                        <span style={{
                                            background: camera.status === 'online' ? '#e8f7f2' : '#fff2f0',
                                            color: camera.status === 'online' ? '#52c41a' : '#ff4d4f',
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                                        }}>
                                            {camera.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                                        </span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', border: '1px solid #f7c5d040' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '18px' }}>📋</span>
                        <h3 style={{ margin: 0, color: '#4a4a4a' }}>Daftar Kamera Metro Jaya</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #fde8ed, #ede8f7)' }}>
                                {['Nama', 'Lokasi', 'Status', 'Stream'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((camera, i) => (
                                <tr key={camera.id} style={{ background: i % 2 === 0 ? 'white' : '#fdf6f0' }}>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '14px' }}>{camera.name}</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '14px', color: '#8a8a8a' }}>{camera.location}</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed' }}>
                                        <span style={{
                                            background: camera.status === 'online' ? '#e8f7f2' : '#fff2f0',
                                            color: camera.status === 'online' ? '#52c41a' : '#ff4d4f',
                                            padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                                        }}>
                                            {camera.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed' }}>
                                        {camera.streamUrl && camera.status === 'online' ? (
                                            <a href={camera.streamUrl} target="_blank" rel="noreferrer" style={{ color: '#c9b8e8', fontSize: '13px', fontWeight: '600' }}>
                                                🎥 Lihat
                                            </a>
                                        ) : (
                                            <span style={{ color: '#ccc', fontSize: '13px' }}>—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Map