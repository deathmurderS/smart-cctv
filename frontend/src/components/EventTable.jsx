const EventTable = ({ events }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(247, 197, 208, 0.3)',
            border: '1px solid #f7c5d040'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <h3 style={{ margin: 0, color: '#4a4a4a' }}>Recent Events</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #fde8ed, #ede8f7)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>Camera</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>Location</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>Event</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #f7c5d0', color: '#4a4a4a', fontWeight: '600', fontSize: '13px' }}>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#8a8a8a' }}>
                                <span style={{ fontSize: '32px' }}>🌸</span>
                                <p style={{ margin: '8px 0 0' }}>No events yet</p>
                            </td>
                        </tr>
                    ) : events.map((event, i) => (
                        <tr key={event.id} style={{ background: i % 2 === 0 ? 'white' : '#fdf6f0' }}>
                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '14px' }}>{event.camera?.name}</td>
                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', fontSize: '14px', color: '#8a8a8a' }}>{event.camera?.location}</td>
                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed' }}>
                                <span style={{
                                    background: 'linear-gradient(135deg, #fde8ed, #ede8f7)',
                                    color: '#c9b8e8',
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {event.type}
                                </span>
                            </td>
                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #fde8ed', color: '#8a8a8a', fontSize: '13px' }}>
                                {new Date(event.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EventTable