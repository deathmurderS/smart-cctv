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

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (lastEvent) {
            setEvents(prev => [lastEvent, ...prev])
        }
    }, [lastEvent])

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <h2>Events</h2>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0 }}>Simulate Event</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select
                            value={cameraId}
                            onChange={(e) => setCameraId(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
                        >
                            <option value="">Select Camera</option>
                            {cameras.map((camera) => (
                                <option key={camera.id} value={camera.id}>{camera.name} - {camera.location}</option>
                            ))}
                        </select>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
                        >
                            <option value="motion_detected">Motion Detected</option>
                            <option value="person_detected">Person Detected</option>
                            <option value="camera_offline">Camera Offline</option>
                            <option value="camera_online">Camera Online</option>
                        </select>
                        <button
                            onClick={handleAdd}
                            style={{ padding: '8px 20px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Simulate
                        </button>
                    </div>
                </div>

                <EventTable events={events} />
            </div>
        </div>
    )
}

export default Events