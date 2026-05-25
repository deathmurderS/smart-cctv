import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import EventTable from '../components/EventTable'
import useSocket from '../hooks/useSocket'
import api from '../utils/api'

const Dashboard = () => {
    const [summary, setSummary] = useState({})
    const [events, setEvents] = useState([])
    const [byHour, setByHour] = useState([])
    const [byLocation, setByLocation] = useState([])
    const { lastEvent } = useSocket()

    const fetchData = async () => {
        try {
            const [summaryRes, eventsRes, hourRes, locationRes] = await Promise.all([
                api.get('/analytics/summary'),
                api.get('/events'),
                api.get('/analytics/by-hour'),
                api.get('/analytics/by-location')
            ])
            setSummary(summaryRes.data)
            setEvents(eventsRes.data)
            setByHour(hourRes.data)
            setByLocation(locationRes.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => { fetchData() }, [])

    useEffect(() => {
        if (lastEvent) {
            setEvents(prev => [lastEvent, ...prev])
            setSummary(prev => ({ ...prev, totalEvents: prev.totalEvents + 1 }))
        }
    }, [lastEvent])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', border: '1px solid #f7c5d0', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)' }}>
                    <p style={{ margin: 0, color: '#8a8a8a', fontSize: '12px' }}>{label}</p>
                    <p style={{ margin: '4px 0 0', color: '#c9b8e8', fontWeight: '700' }}>{payload[0].value} events</p>
                </div>
            )
        }
        return null
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>
            <Navbar />
            <div style={{ padding: '16px' }}>

                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, color: '#4a4a4a', fontSize: '24px' }}>🌸 Dashboard</h2>
                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>Welcome back! Here is your CCTV overview.</p>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}><StatCard title="Total Cameras" value={summary.totalCameras || 0} color="#f7c5d0" icon="📷" /></div>
                    <div style={{ flex: '1 1 200px' }}><StatCard title="Online Cameras" value={summary.onlineCameras || 0} color="#b8e0d2" icon="🟢" /></div>
                    <div style={{ flex: '1 1 200px' }}><StatCard title="Total Events" value={summary.totalEvents || 0} color="#c9b8e8" icon="⚡" /></div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 300px', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', border: '1px solid #f7c5d040' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '20px' }}>📊</span>
                            <h3 style={{ margin: 0, color: '#4a4a4a' }}>Events by Hour</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={byHour}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#fde8ed" />
                                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#8a8a8a' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#8a8a8a' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total" fill="url(#pinkGradient)" radius={[6, 6, 0, 0]} />
                                <defs>
                                    <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f7c5d0" />
                                        <stop offset="100%" stopColor="#c9b8e8" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ flex: '1 1 300px', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(247,197,208,0.3)', border: '1px solid #f7c5d040' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '20px' }}>📍</span>
                            <h3 style={{ margin: 0, color: '#4a4a4a' }}>Events by Location</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={byLocation} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#fde8ed" />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#8a8a8a' }} />
                                <YAxis dataKey="location" type="category" tick={{ fontSize: 10, fill: '#8a8a8a' }} width={80} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total" fill="url(#mintGradient)" radius={[0, 6, 6, 0]} />
                                <defs>
                                    <linearGradient id="mintGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#b8e0d2" />
                                        <stop offset="100%" stopColor="#c9b8e8" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <EventTable events={events.slice(0, 10)} />
            </div>
        </div>
    )
}

export default Dashboard