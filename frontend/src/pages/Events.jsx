import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import EventTable from '../components/EventTable'
import useSocket from '../hooks/useSocket'
import api from '../utils/api'

const Events = () => {
    const [events, setEvents] = useState([])
    const [cameras, setCameras] = useState([])
    const [cameraId, setCameraId] = useState('')
    const [type, setType] = useState('motion_detected')
    const { lastEvent } = useSocket()

    const fetchData = async () => {
        try {
            const [eventsRes, camerasRes] = await Promise.all([
                api.get('/events'),
                api.get('/cameras')
            ])
            setEvents(eventsRes.data)
            setCameras(camerasRes.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAdd = async () => {
        if (!cameraId) return
        try {
            await api.post('/events', { cameraId, type })
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => { fetchData() }, [])

    useEffect(() => {
        if (lastEvent) setEvents(prev => [lastEvent, ...prev])
    }, [lastEvent])

    const selectStyle = {
        padding: '10px 16px', borderRadius: '12px',
        border: '1px solid #f7c5d0', background: '#fdf6f0',
        fontSize: '14px', fontFamily: 'Zen Kaku Gothic New, sans-serif',
        outline: 'none', flex: 1, cursor: 'pointer'
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>
            <Navbar />
            <div className="page-container">
                <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, color: '#4a4a4a', fontSize: '20px' }}>⚡ Events</h2>
                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>Simulate and monitor CCTV events.</p>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', border: '1px solid #f7c5d040' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '18px' }}>🎮</span>
                        <h3 style={{ margin: 0, color: '#4a4a4a', fontSize: '15px' }}>Simulate Event</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <select value={cameraId} onChange={e => setCameraId(e.target.value)} style={{
                            padding: '10px 16px', borderRadius: '12px', border: '1px solid #f7c5d0',
                            background: '#fdf6f0', fontSize: '14px',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', outline: 'none', cursor: 'pointer'
                        }}>
                            <option value="">Select Camera</option>
                            {cameras.map(camera => (
                                <option key={camera.id} value={camera.id}>{camera.name} - {camera.location}</option>
                            ))}
                        </select>
                        <select value={type} onChange={e => setType(e.target.value)} style={{
                            padding: '10px 16px', borderRadius: '12px', border: '1px solid #f7c5d0',
                            background: '#fdf6f0', fontSize: '14px',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', outline: 'none', cursor: 'pointer'
                        }}>
                            <option value="motion_detected">🏃 Motion Detected</option>
                            <option value="person_detected">👤 Person Detected</option>
                            <option value="camera_offline">📴 Camera Offline</option>
                            <option value="camera_online">📳 Camera Online</option>
                        </select>
                        <button onClick={handleAdd} style={{
                            padding: '10px 24px', background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                            border: 'none', borderRadius: '12px', color: 'white',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px',
                            fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(247,197,208,0.4)'
                        }}>
                            ✨ Simulate
                        </button>
                    </div>
                </div>

                <EventTable events={events} />
            </div>
        </div>
    )
}

export default Events