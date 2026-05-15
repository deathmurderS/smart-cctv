import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #f7c5d0 0%, #c9b8e8 100%)',
            padding: '0 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
            boxShadow: '0 4px 20px rgba(247, 197, 208, 0.4)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🌸</span>
                <span style={{ fontWeight: '700', fontSize: '18px', color: '#fff', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    Smart CCTV
                </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[
                    { label: '🏠 Dashboard', path: '/dashboard' },
                    { label: '📷 Cameras', path: '/cameras' },
                    { label: '⚡ Events', path: '/events' },
                    { label: '🗺️ Map', path: '/map' },
                ].map(item => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            color: '#fff',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backdropFilter: 'blur(4px)'
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.5)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    >
                        {item.label}
                    </button>
                ))}

                <span style={{ color: 'rgba(255,255,255,0.7)', margin: '0 4px' }}>|</span>
                <span style={{ color: '#fff', fontSize: '14px' }}>✨ {user.name}</span>

                <button
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        color: '#fff',
                        fontFamily: 'Zen Kaku Gothic New, sans-serif',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar