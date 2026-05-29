import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    const navItems = [
        { label: '🏠 Dashboard', path: '/dashboard' },
        { label: '📷 Cameras', path: '/cameras' },
        { label: '⚡ Events', path: '/events' },
        { label: '🗺️ Map', path: '/map' },
        { label: '⚙️ Settings', path: '/settings' },
    ]

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #f7c5d0 0%, #c9b8e8 100%)',
            padding: '0 24px',
            boxShadow: '0 4px 20px rgba(247, 197, 208, 0.4)',
            position: 'sticky', top: 0, zIndex: 1000
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🌸</span>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: '#fff', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        Smart CCTV
                    </span>
                </div>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    className="desktop-menu">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                background: 'rgba(255,255,255,0.3)', border: 'none',
                                borderRadius: '20px', padding: '6px 16px',
                                color: '#fff', fontFamily: 'Zen Kaku Gothic New, sans-serif',
                                fontSize: '14px', cursor: 'pointer'
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                    <span style={{ color: 'rgba(255,255,255,0.7)', margin: '0 4px' }}>|</span>
                    <span style={{ color: '#fff', fontSize: '14px' }}>✨ {user.name}</span>
                    <button onClick={handleLogout} style={{
                        background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '20px', padding: '6px 16px', color: '#fff',
                        fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px', cursor: 'pointer'
                    }}>
                        Logout
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="mobile-menu-btn"
                    style={{
                        background: 'rgba(255,255,255,0.3)', border: 'none',
                        borderRadius: '8px', padding: '8px 12px',
                        color: '#fff', fontSize: '18px', cursor: 'pointer'
                    }}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="mobile-dropdown" style={{
                    background: 'rgba(255,255,255,0.95)', borderRadius: '16px',
                    padding: '16px', marginBottom: '12px',
                    boxShadow: '0 8px 30px rgba(247,197,208,0.4)'
                }}>
                    <p style={{ margin: '0 0 12px', color: '#8a8a8a', fontSize: '13px' }}>✨ {user.name}</p>
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => { navigate(item.path); setMenuOpen(false) }}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                background: 'none', border: 'none', padding: '10px 8px',
                                color: '#4a4a4a', fontFamily: 'Zen Kaku Gothic New, sans-serif',
                                fontSize: '15px', cursor: 'pointer', borderBottom: '1px solid #fde8ed'
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button onClick={handleLogout} style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        background: 'none', border: 'none', padding: '10px 8px',
                        color: '#ff4d4f', fontFamily: 'Zen Kaku Gothic New, sans-serif',
                        fontSize: '15px', cursor: 'pointer', marginTop: '4px'
                    }}>
                        🚪 Logout
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar