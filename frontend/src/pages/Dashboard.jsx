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

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (lastEvent) {
            setEvents(prev => [lastEvent, ...prev])
            setSummary(prev => ({ ...prev, totalEvents: prev.totalEvents + 1 }))
        }
    }, [lastEvent])

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <h2>Dashboard</h2>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <StatCard title="Total Cameras" value={summary.totalCameras || 0} color="#1890ff" />
                    <StatCard title="Online Cameras" value={summary.onlineCameras || 0} color="#52c41a" />
                    <StatCard title="Total Events" value={summary.totalEvents || 0} color="#fa8c16" />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ flex: 2, background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0 }}>Events by Hour</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={byHour}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#1890ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0 }}>Events by Location</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={byLocation} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="location" type="category" />
                                <Tooltip />
                                <Bar dataKey="total" fill="#52c41a" />
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