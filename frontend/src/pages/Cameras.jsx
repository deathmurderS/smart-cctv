import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Cameras = () => {
    const [cameras, setCameras] = useState([])
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')

    const fetchCameras = async () => {
        try {
            const res = await api.get('/cameras')
            setCameras(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAdd = async () => {
        if (!name || !location) return
        try {
            await api.post('/cameras', { name, location })
            setName('')
            setLocation('')
            fetchCameras()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/cameras/${id}`)
            fetchCameras()
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchCameras()
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <h2>Cameras</h2>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0 }}>Add Camera</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            placeholder="Camera name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
                        />
                        <input
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
                        />
                        <button
                            onClick={handleAdd}
                            style={{ padding: '8px 20px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0 }}>Camera List</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Location</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cameras.map((camera) => (
                                <tr key={camera.id}>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{camera.name}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{camera.location}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <span style={{ background: camera.status === 'online' ? '#f6ffed' : '#fff2f0', color: camera.status === 'online' ? '#52c41a' : '#ff4d4f', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                            {camera.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <button
                                            onClick={() => handleDelete(camera.id)}
                                            style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Cameras