import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar'
import api from '../utils/api'

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

const Map = () => {
    const [cameras, setCameras] = useState([])
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        api.get('/cameras').then(res => {
            const withCoords = res.data.filter(c => c.latitude && c.longitude)
            setCameras(withCoords)
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
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <h2>Peta CCTV Metro Jaya</h2>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #1890ff' }}>
                        <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Total Kamera</p>
                        <h3 style={{ margin: '4px 0 0', color: '#1890ff' }}>{cameras.length}</h3>
                    </div>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #52c41a' }}>
                        <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Online</p>
                        <h3 style={{ margin: '4px 0 0', color: '#52c41a' }}>{online}</h3>
                    </div>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #ff4d4f' }}>
                        <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Offline</p>
                        <h3 style={{ margin: '4px 0 0', color: '#ff4d4f' }}>{offline}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                        {['all', 'online', 'offline'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '6px 16px', borderRadius: '4px', border: '1px solid #ddd',
                                    background: filter === f ? '#1890ff' : 'white',
                                    color: filter === f ? 'white' : '#333', cursor: 'pointer'
                                }}
                            >
                                {f === 'all' ? 'Semua' : f === 'online' ? 'Online' : 'Offline'}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
                    <MapContainer center={[-6.2, 106.8]} zoom={11} style={{ height: '500px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {filtered.map(camera => (
                            <Marker
                                key={camera.id}
                                position={[camera.latitude, camera.longitude]}
                                icon={camera.status === 'online' ? greenIcon : redIcon}
                            >
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <strong>{camera.name}</strong>
                                        <p style={{ margin: '4px 0', color: '#666', fontSize: '13px' }}>{camera.location}</p>
                                        <span style={{
                                            background: camera.status === 'online' ? '#f6ffed' : '#fff2f0',
                                            color: camera.status === 'online' ? '#52c41a' : '#ff4d4f',
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                                        }}>
                                            {camera.status === 'online' ? 'Online' : 'Offline'}
                                        </span>
                                        {camera.streamUrl && camera.status === 'online' && (
                                            <div style={{ marginTop: '8px' }}>
                                                <a href={camera.streamUrl} target="_blank" rel="noreferrer" style={{ color: '#1890ff', fontSize: '13px' }}>
                                                    Buka Stream
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0 }}>Daftar Kamera Metro Jaya</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Nama</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Lokasi</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Stream</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(camera => (
                                <tr key={camera.id}>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{camera.name}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{camera.location}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <span style={{
                                            background: camera.status === 'online' ? '#f6ffed' : '#fff2f0',
                                            color: camera.status === 'online' ? '#52c41a' : '#ff4d4f',
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                                        }}>
                                            {camera.status === 'online' ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        {camera.streamUrl && camera.status === 'online' ? (
                                            <a href={camera.streamUrl} target="_blank" rel="noreferrer" style={{ color: '#1890ff', fontSize: '13px' }}>
                                                Lihat
                                            </a>
                                        ) : (
                                            <span style={{ color: '#ccc', fontSize: '13px' }}>-</span>
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