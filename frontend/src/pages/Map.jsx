import { useState, useEffect, useRef, useMemo } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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
        <video ref={videoRef} controls autoPlay muted
            style={{ width: '100%', borderRadius: '8px', marginBottom: '8px', background: '#000' }}
        />
    )
}

const WILAYAH_LIST = [
    'Semua', 'POLDA METRO JAYA', 'POLDA JABAR', 'POLDA JAWA TENGAH',
    'POLDA JATIM', 'POLDA BALI', 'POLDA DIY', 'POLDA SUMUT',
    'POLDA RIAU', 'POLDA SULSEL', 'POLDA ACEH', 'POLDA BANTEN',
    'POLDA NTB', 'POLDA NTT', 'POLDA KALBAR', 'POLDA KALIMANTAN TIMUR',
    'POLDA  SUMSEL', 'POLDA BANGKA BELITUNG', 'POLDA BENGKULU',
    'POLDA GORONTALO', 'POLDA KALIMANTAN TENGAH', 'POLDA KEPRI',
    'POLDA MALUKU', 'POLDA MALUKU UTARA', 'POLDA SULAWESI BARAT',
    'POLDA SULAWESI TENGGARA', 'POLDA SULAWESI UTARA', 'POLDA SULTENG',
    'POLDA SUMATERA BARAT', 'POLDA TA',
]

const WILAYAH_COORDS = {
    'POLDA METRO JAYA': { center: [-6.2, 106.8], zoom: 11 },
    'POLDA JABAR': { center: [-6.9, 107.6], zoom: 9 },
    'POLDA JAWA TENGAH': { center: [-7.15, 110.4], zoom: 9 },
    'POLDA JATIM': { center: [-7.5, 112.7], zoom: 9 },
    'POLDA BALI': { center: [-8.4, 115.1], zoom: 10 },
    'POLDA DIY': { center: [-7.8, 110.4], zoom: 11 },
    'POLDA SUMUT': { center: [3.5, 98.7], zoom: 9 },
    'POLDA RIAU': { center: [0.5, 101.4], zoom: 9 },
    'POLDA SULSEL': { center: [-5.1, 119.4], zoom: 9 },
    'POLDA ACEH': { center: [4.7, 96.7], zoom: 9 },
    'POLDA BANTEN': { center: [-6.4, 106.4], zoom: 10 },
    'POLDA NTB': { center: [-8.6, 116.3], zoom: 10 },
    'POLDA NTT': { center: [-8.7, 121.1], zoom: 8 },
    'POLDA KALBAR': { center: [0.0, 109.3], zoom: 8 },
    'POLDA KALIMANTAN TIMUR': { center: [0.5, 116.8], zoom: 8 },
    'POLDA  SUMSEL': { center: [-3.8, 104.7], zoom: 9 },
    'POLDA BANGKA BELITUNG': { center: [-2.2, 106.1], zoom: 9 },
    'POLDA BENGKULU': { center: [-3.8, 102.3], zoom: 9 },
    'POLDA GORONTALO': { center: [0.5, 123.0], zoom: 10 },
    'POLDA KALIMANTAN TENGAH': { center: [-1.7, 113.9], zoom: 8 },
    'POLDA KEPRI': { center: [1.0, 104.0], zoom: 9 },
    'POLDA MALUKU': { center: [-3.7, 128.2], zoom: 8 },
    'POLDA MALUKU UTARA': { center: [1.5, 127.8], zoom: 8 },
    'POLDA SULAWESI BARAT': { center: [-2.8, 119.3], zoom: 9 },
    'POLDA SULAWESI TENGGARA': { center: [-4.1, 122.5], zoom: 9 },
    'POLDA SULAWESI UTARA': { center: [1.5, 124.8], zoom: 9 },
    'POLDA SULTENG': { center: [-1.4, 121.4], zoom: 8 },
    'POLDA SUMATERA BARAT': { center: [-0.9, 100.4], zoom: 9 },
    'POLDA TA': { center: [-2.5, 140.7], zoom: 8 },
}

const MapController = ({ wilayah }) => {
    const map = useMap()
    useEffect(() => {
        const coords = WILAYAH_COORDS[wilayah]
        if (coords) {
            map.flyTo(coords.center, coords.zoom, { duration: 1.5 })
        } else {
            map.flyTo([-2.5, 118], 5, { duration: 1.5 })
        }
    }, [wilayah, map])
    return null
}

const Map = () => {
    const [cameras, setCameras] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all')
    const [wilayah, setWilayah] = useState('Semua')
    const [page, setPage] = useState(1)
    const pageSize = 20

    useEffect(() => {
        setPage(1)
        setFilter('all')

        if (wilayah === 'Semua') {
            setCameras([])
            setLoading(false)
            return
        }

        const cached = sessionStorage.getItem(`cameras_${wilayah}`)
        if (cached) {
            setCameras(JSON.parse(cached))
            setLoading(false)
            return
        }

        setLoading(true)
        setCameras([])
        api.get(`/cameras?wilayah=${encodeURIComponent(wilayah)}`).then(res => {
            const withCoords = res.data.filter(c => c.latitude && c.longitude)
            setCameras(withCoords)
            sessionStorage.setItem(`cameras_${wilayah}`, JSON.stringify(withCoords))
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [wilayah])

    const filtered = useMemo(() => {
        if (filter === 'all') return cameras
        return cameras.filter(c => c.status === filter)
    }, [cameras, filter])

    const mapCameras = useMemo(() => {
        return filtered.slice(0, 500)
    }, [filtered])

    const online = cameras.filter(c => c.status === 'online').length
    const offline = cameras.filter(c => c.status === 'offline').length

    const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(filtered.length / pageSize)

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>
            <Navbar />
            <div className="page-container">
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, color: '#4a4a4a' }}>🗺️ Peta CCTV Indonesia</h2>
                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>
                        {wilayah === 'Semua'
                            ? 'Pilih wilayah untuk menampilkan kamera'
                            : loading
                                ? '✨ Memuat data kamera...'
                                : `${cameras.length} kamera di ${wilayah}`}
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Kamera', value: cameras.length, color: '#f7c5d0', icon: '📷' },
                        { label: 'Online', value: online, color: '#b8e0d2', icon: '🟢' },
                        { label: 'Offline', value: offline, color: '#f7c5d0', icon: '🔴' },
                        { label: 'Ditampilkan', value: filtered.length, color: '#c9b8e8', icon: '🔍' },
                    ].map(item => (
                        <div key={item.label} className="stats-card" style={{
                            background: 'white', borderRadius: '16px',
                            boxShadow: 'var(--shadow)',
                            border: `1px solid ${item.color}40`, flex: 1, minWidth: '120px'
                        }}>
                            <p style={{ margin: 0, color: '#8a8a8a', fontSize: '13px' }}>{item.icon} {item.label}</p>
                            <h3 style={{ margin: '4px 0 0', color: '#4a4a4a', fontSize: '28px' }}>{item.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div className="filter-controls" style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <select
                        value={wilayah}
                        onChange={e => { setWilayah(e.target.value); setPage(1) }}
                        style={{
                            padding: '8px 16px', borderRadius: '20px', border: '1px solid #f7c5d0',
                            background: 'white', fontFamily: 'Zen Kaku Gothic New, sans-serif',
                            fontSize: '13px', cursor: 'pointer', outline: 'none',
                            position: 'relative', zIndex: 1001
                        }}
                    >
                        {WILAYAH_LIST.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>

                    {['all', 'online', 'offline'].map(f => (
                        <button key={f} onClick={() => { setFilter(f); setPage(1) }} style={{
                            padding: '8px 20px', borderRadius: '20px', border: '1px solid #f7c5d0',
                            background: filter === f ? 'linear-gradient(135deg, #f7c5d0, #c9b8e8)' : 'white',
                            color: filter === f ? 'white' : '#4a4a4a',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '13px', cursor: 'pointer'
                        }}>
                            {f === 'all' ? 'Semua' : f === 'online' ? '🟢 Online' : '🔴 Offline'}
                        </button>
                    ))}
                </div>

                {filtered.length > 500 && (
                    <p style={{ color: '#c9b8e8', fontSize: '12px', marginBottom: '8px', background: '#ede8f7', padding: '8px 16px', borderRadius: '12px' }}>
                        ⚠️ Menampilkan 500 dari {filtered.length} kamera di peta. Lihat semua di tabel di bawah.
                    </p>
                )}

                {/* Map - selalu mounted */}
                <div style={{
                    borderRadius: '16px', overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(247,197,208,0.3)',
                    marginBottom: '24px', border: '1px solid #f7c5d040',
                    position: 'relative'
                }}>
                    {/* Overlay: belum pilih wilayah */}
                    {wilayah === 'Semua' && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(253,246,240,0.95)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '16px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗾</div>
                                <h3 style={{ color: '#4a4a4a', margin: '0 0 8px' }}>Pilih Wilayah</h3>
                                <p style={{ color: '#8a8a8a', fontSize: '13px' }}>Pilih wilayah dari dropdown di atas</p>
                            </div>
                        </div>
                    )}

                    {/* Overlay: loading */}
                    {loading && wilayah !== 'Semua' && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(253,246,240,0.85)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '16px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
                                <p style={{ color: '#c9b8e8', fontWeight: '600' }}>Memuat kamera {wilayah}...</p>
                            </div>
                        </div>
                    )}

                    <MapContainer center={[-2.5, 118]} zoom={5} className="map-wrapper">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapController wilayah={wilayah} />
                        <MarkerClusterGroup
                            chunkedLoading
                            maxClusterRadius={60}
                            spiderfyOnMaxZoom={true}
                            showCoverageOnHover={false}
                            zoomToBoundsOnClick={true}
                            chunkInterval={100}
                            chunkDelay={50}
                        >
                            {mapCameras.map(camera => (
                                <Marker
                                    key={`${camera.id}-${camera.status}`}
                                    position={[camera.latitude, camera.longitude]}
                                    icon={camera.status === 'online' ? greenIcon : redIcon}
                                >
                                    <Popup maxWidth={320}>
                                        <div style={{ width: '300px', fontFamily: 'Zen Kaku Gothic New, sans-serif' }}>
                                            {camera.streamUrl && camera.status === 'online' && <StreamPlayer url={camera.streamUrl} />}
                                            {camera.status === 'offline' && (
                                                <div style={{ width: '100%', height: '120px', background: '#2a2a2a', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#666', fontSize: '13px' }}>📴 Stream tidak tersedia</span>
                                                </div>
                                            )}
                                            <strong style={{ color: '#4a4a4a' }}>{camera.name}</strong>
                                            <p style={{ margin: '4px 0', color: '#8a8a8a', fontSize: '13px' }}>{camera.location}</p>
                                            <p style={{ margin: '2px 0', color: '#c9b8e8', fontSize: '12px' }}>{camera.wilayah}</p>
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
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>

                {/* Table with pagination */}
                <div className="table-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>📋</span>
                            <h3 style={{ margin: 0, color: '#4a4a4a' }}>Daftar Kamera</h3>
                            <span style={{ color: '#8a8a8a', fontSize: '13px' }}>({filtered.length} kamera)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                style={{ padding: '6px 14px', borderRadius: '12px', border: '1px solid #f7c5d0', background: page === 1 ? '#fdf6f0' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#4a4a4a' }}>
                                ←
                            </button>
                            <span style={{ color: '#8a8a8a', fontSize: '13px' }}>{page} / {totalPages || 1}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                                style={{ padding: '6px 14px', borderRadius: '12px', border: '1px solid #f7c5d0', background: page === totalPages ? '#fdf6f0' : 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: '#4a4a4a' }}>
                                →
                            </button>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -16px', padding: '0 16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ background: 'linear-gradient(135deg, #fde8ed, #ede8f7)' }}>
                                {['Nama', 'Lokasi', 'Wilayah', 'Status', 'Stream'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paged.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#8a8a8a' }}>
                                        <span style={{ fontSize: '32px' }}>🌸</span>
                                        <p style={{ margin: '8px 0 0' }}>
                                            {wilayah === 'Semua' ? 'Pilih wilayah terlebih dahulu' : 'Tidak ada kamera ditemukan'}
                                        </p>
                                    </td>
                                </tr>
                            ) : paged.map((camera, i) => (
                                <tr key={camera.id} style={{ background: i % 2 === 0 ? 'white' : '#fdf6f0' }}>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '14px' }}>{camera.name}</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '14px', color: '#8a8a8a' }}>{camera.location}</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '12px', color: '#c9b8e8' }}>{camera.wilayah}</td>
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
                                            <a href={camera.streamUrl} target="_blank" rel="noreferrer" style={{ color: '#c9b8e8', fontSize: '13px', fontWeight: '600' }}>🎥 Lihat</a>
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
        </div>
    )
}

export default Map