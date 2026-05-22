const StatCard = ({ title, value, color, icon }) => {
    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            boxShadow: '0 4px 20px rgba(247, 197, 208, 0.3)',
            border: `1px solid ${color}40`, position: 'relative', overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default'
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(247, 197, 208, 0.5)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(247, 197, 208, 0.3)'
            }}
        >
            <div style={{
                position: 'absolute', top: '-20px', right: '-20px',
                width: '80px', height: '80px', borderRadius: '50%',
                background: `${color}20`
            }} />
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
            <p style={{ margin: 0, color: '#8a8a8a', fontSize: '12px', letterSpacing: '0.5px' }}>{title}</p>
            <h2 style={{ margin: '4px 0 0', fontSize: '28px', color, fontWeight: '700' }}>{value}</h2>
        </div>
    )
}

export default StatCard