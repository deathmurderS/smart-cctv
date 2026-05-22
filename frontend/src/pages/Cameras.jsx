import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Cameras = () => {
    const [cameras, setCameras] = useState([])
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')

    const fetchCameras = async () => {
        try {
            const res = await api.get('/cameras')
            setCameras(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAdd = async () => {
        if (!name || !location) return
        try {
            await api.post('/cameras', { name, location })
            setName('')
            setLocation('')
            fetchCameras()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/cameras/${id}`)
            fetchCameras()
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => { fetchCameras() }, [])

    const inputStyle = {
        padding: '10px 16px', borderRadius: '12px',
        border: '1px solid #f7c5d0', background: '#fdf6f0',
        fontSize: '14px', fontFamily: 'Zen Kaku Gothic New, sans-serif',
        outline: 'none', flex: 1
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>
            <Navbar />
            <div style={{ padding: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, color: '#4a4a4a', fontSize: '20px' }}>📷 Cameras</h2>
                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>Manage your CCTV cameras.</p>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', border: '1px solid #f7c5d040' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '18px' }}>✨</span>
                        <h3 style={{ margin: 0, color: '#4a4a4a', fontSize: '15px' }}>Add Camera</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            placeholder="Camera name" value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #f7c5d0', background: '#fdf6f0', fontSize: '14px', fontFamily: 'Zen Kaku Gothic New, sans-serif', outline: 'none' }}
                        />
                        <input
                            placeholder="Location" value={location}
                            onChange={e => setLocation(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #f7c5d0', background: '#fdf6f0', fontSize: '14px', fontFamily: 'Zen Kaku Gothic New, sans-serif', outline: 'none' }}
                        />
                        <button onClick={handleAdd} style={{
                            padding: '10px 24px', background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                            border: 'none', borderRadius: '12px', color: 'white',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px',
                            fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(247,197,208,0.4)'
                        }}>
                            🌸 Add Camera
                        </button>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', border: '1px solid #f7c5d040' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '18px' }}>📋</span>
                        <h3 style={{ margin: 0, color: '#4a4a4a', fontSize: '15px' }}>Camera List</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                            <thead>
                                <tr style={{ background: 'linear-gradient(135deg, #fde8ed, #ede8f7)' }}>
                                    {['Name', 'Location', 'Status', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cameras.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#8a8a8a' }}>
                                            <span style={{ fontSize: '32px' }}>🌸</span>
                                            <p style={{ margin: '8px 0 0' }}>No cameras yet</p>
                                        </td>
                                    </tr>
                                ) : cameras.map((camera, i) => (
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
                                            <button onClick={() => handleDelete(camera.id)} style={{
                                                background: 'linear-gradient(135deg, #f7c5d0, #e8a0b0)',
                                                border: 'none', borderRadius: '8px', color: 'white',
                                                padding: '6px 14px', fontFamily: 'Zen Kaku Gothic New, sans-serif',
                                                fontSize: '13px', cursor: 'pointer'
                                            }}>
                                                Delete
                                            </button>
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

export default Cameras