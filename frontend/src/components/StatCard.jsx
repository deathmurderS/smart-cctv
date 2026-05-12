const StatCard = ({ title, value, color }) => {
    return (
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
            <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{title}</p>
            <h2 style={{ margin: '8px 0 0', fontSize: '32px', color }}>{value}</h2>
        </div>
    )
}

export default StatCard