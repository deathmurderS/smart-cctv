import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () => {
        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/dashboard')
        } catch {
            setError('Email atau password salah')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fde8ed 0%, #ede8f7 50%, #e8f7f2 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Zen Kaku Gothic New, sans-serif'
        }}>
            {/* decorative circles */}
            <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(247,197,208,0.3)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(201,184,232,0.3)', pointerEvents: 'none' }} />

            <div style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                padding: '48px 40px',
                borderRadius: '24px',
                width: '380px',
                boxShadow: '0 8px 40px rgba(247,197,208,0.4)',
                border: '1px solid rgba(255,255,255,0.8)',
                position: 'relative'
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
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 16px',
                            borderRadius: '12px', border: '1px solid #f7c5d0',
                            background: '#fdf6f0', fontSize: '14px',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif',
                            outline: 'none', boxSizing: 'border-box',
                            transition: 'border 0.2s'
                        }}
                        onFocus={e => e.target.style.border = '1px solid #c9b8e8'}
                        onBlur={e => e.target.style.border = '1px solid #f7c5d0'}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{
                            width: '100%', padding: '12px 16px',
                            borderRadius: '12px', border: '1px solid #f7c5d0',
                            background: '#fdf6f0', fontSize: '14px',
                            fontFamily: 'Zen Kaku Gothic New, sans-serif',
                            outline: 'none', boxSizing: 'border-box',
                            transition: 'border 0.2s'
                        }}
                        onFocus={e => e.target.style.border = '1px solid #c9b8e8'}
                        onBlur={e => e.target.style.border = '1px solid #f7c5d0'}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '14px',
                        background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                        border: 'none', borderRadius: '12px',
                        color: 'white', fontSize: '15px', fontWeight: '600',
                        fontFamily: 'Zen Kaku Gothic New, sans-serif',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(247,197,208,0.5)',
                        transition: 'opacity 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? '✨ Logging in...' : '🌸 Login'}
                </button>
            </div>
        </div>
    )
}

export default Login