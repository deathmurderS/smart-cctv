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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fde8ed 0%, #ede8f7 50%, #e8f7f2 100%)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: 'Zen Kaku Gothic New, sans-serif',
            padding: '16px'
        }}>
            <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(247,197,208,0.3)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(201,184,232,0.3)', pointerEvents: 'none' }} />

            <div style={{
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
                padding: '40px 32px', borderRadius: '24px',
                width: '100%', maxWidth: '380px',
                boxShadow: '0 8px 40px rgba(247,197,208,0.4)',
                border: '1px solid rgba(255,255,255,0.8)', position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌸</div>
                    <h2 style={{ margin: 0, color: '#4a4a4a', fontSize: '24px', fontWeight: '700' }}>Smart CCTV</h2>
                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>Monitor. Analyze. Protect.</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fff2f0', border: '1px solid #f7c5d0',
                        borderRadius: '12px', padding: '10px 16px',
                        marginBottom: '16px', color: '#e8a0b0', fontSize: '13px', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>Email</label>
                    <input
                        type="email" placeholder="your@email.com" value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                            border: '1px solid #f7c5d0', background: '#fdf6f0', fontSize: '14px',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        onFocus={e => e.target.style.border = '1px solid #c9b8e8'}
                        onBlur={e => e.target.style.border = '1px solid #f7c5d0'}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>Password</label>
                    <input
                        type="password" placeholder="••••••••" value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                            border: '1px solid #f7c5d0', background: '#fdf6f0', fontSize: '14px',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif', outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        onFocus={e => e.target.style.border = '1px solid #c9b8e8'}
                        onBlur={e => e.target.style.border = '1px solid #f7c5d0'}
                    />
                </div>

                <button onClick={handleLogin} disabled={loading} style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                    border: 'none', borderRadius: '12px', color: 'white',
                    fontSize: '15px', fontWeight: '600',
                    fontFamily: 'Zen Kaku Gothic New, sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(247,197,208,0.5)', opacity: loading ? 0.7 : 1
                }}>
                    {loading ? '✨ Logging in...' : '🌸 Login'}
                </button>
            </div>
        </div>
    )
}

export default Dashboard