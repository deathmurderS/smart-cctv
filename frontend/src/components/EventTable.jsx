const EventTable = ({ events }) => {
    return (
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0 }}>Recent Events</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Camera</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Location</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Event</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{event.camera?.name}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{event.camera?.location}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                <span style={{ background: '#fff7e6', color: '#fa8c16', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                    {event.type}
                                </span>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#888', fontSize: '13px' }}>
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