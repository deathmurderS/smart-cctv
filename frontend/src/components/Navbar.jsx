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
        <div style={{ background: '#001529', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🎥 Smart CCTV</h2>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span onClick={() => navigate('/dashboard')} style={{ color: 'white', cursor: 'pointer' }}>Dashboard</span>
                <span onClick={() => navigate('/cameras')} style={{ color: 'white', cursor: 'pointer' }}>Cameras</span>
                <span onClick={() => navigate('/events')} style={{ color: 'white', cursor: 'pointer' }}>Events</span>
                <span onClick={() => navigate('/map')} style={{ color: 'white', cursor: 'pointer' }}>Map</span>
                <span style={{ color: '#aaa' }}>|</span>
                <span style={{ color: 'white' }}>{user.name}</span>
                <button onClick={handleLogout} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar