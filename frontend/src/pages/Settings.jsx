import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile')
    const [profile, setProfile] = useState({ name: '', email: '' })
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id')
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium')
    const [defaultWilayah, setDefaultWilayah] = useState(localStorage.getItem('defaultWilayah') || 'Semua')
    const [notification, setNotification] = useState({
        emailAlert: localStorage.getItem('emailAlert') === 'true',
        pushNotif: localStorage.getItem('pushNotif') === 'true',
    })
    const [toast, setToast] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get('/users/profile').then(res => setProfile(res.data)).catch(console.error)
    }, [])

    useEffect(() => {
        document.body.style.fontSize = fontSize === 'small' ? '13px' : fontSize === 'large' ? '17px' : '15px'
    }, [fontSize])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleUpdateProfile = async () => {
        setLoading(true)
        try {
            const res = await api.put('/users/profile', profile)
            localStorage.setItem('user', JSON.stringify(res.data))
            showToast('Profile berhasil diupdate!')
        } catch {
            showToast('Gagal update profile', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            return showToast('Password baru tidak cocok', 'error')
        }
        if (passwords.newPassword.length < 6) {
            return showToast('Password minimal 6 karakter', 'error')
        }
        setLoading(true)
        try {
            await api.put('/users/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            })
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
            showToast('Password berhasil diubah!')
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal ganti password', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDarkMode = (val) => {
        setDarkMode(val)
        localStorage.setItem('darkMode', val)
        document.body.style.background = val ? '#1a1a2e' : '#fdf6f0'
        document.body.style.color = val ? '#eee' : '#4a4a4a'
    }

    const handleFontSize = (val) => {
        setFontSize(val)
        localStorage.setItem('fontSize', val)
    }

    const handleLanguage = (val) => {
        setLanguage(val)
        localStorage.setItem('language', val)
        showToast('Bahasa diubah — refresh untuk melihat perubahan')
    }

    const handleNotification = (key, val) => {
        setNotification(prev => ({ ...prev, [key]: val }))
        localStorage.setItem(key, val)
        showToast(val ? 'Notifikasi diaktifkan' : 'Notifikasi dinonaktifkan')
    }

    const handleDefaultWilayah = (val) => {
        setDefaultWilayah(val)
        localStorage.setItem('defaultWilayah', val)
        showToast('Default wilayah disimpan!')
    }

    const tabs = [
        { id: 'profile', label: '👤 Profile' },
        { id: 'appearance', label: '🎨 Appearance' },
        { id: 'notification', label: '🔔 Notifications' },
        { id: 'security', label: '🔐 Security' },
        { id: 'map', label: '🗺️ Map' },
        { id: 'about', label: 'ℹ️ About' },
    ]

    const inputStyle = {
        width: '100%', padding: '10px 16px', borderRadius: '12px',
        border: '1px solid #f7c5d0', background: '#fdf6f0',
        fontSize: '14px', fontFamily: 'Zen Kaku Gothic New, sans-serif',
        outline: 'none', boxSizing: 'border-box'
    }

    const cardStyle = {
        background: 'white', borderRadius: '16px', padding: '24px',
        boxShadow: '0 4px 20px rgba(247,197,208,0.3)',
        border: '1px solid #f7c5d040', marginBottom: '16px'
    }

    const toggleStyle = (active) => ({
        width: '48px', height: '26px', borderRadius: '13px',
        background: active ? 'linear-gradient(135deg, #f7c5d0, #c9b8e8)' : '#ddd',
        position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
        flexShrink: 0
    })

    const toggleDotStyle = (active) => ({
        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '3px', transition: 'left 0.3s',
        left: active ? '25px' : '3px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    })

    const Toggle = ({ active, onChange }) => (
        <div style={toggleStyle(active)} onClick={() => onChange(!active)}>
            <div style={toggleDotStyle(active)} />
        </div>
    )

    const WILAYAH_OPTIONS = [
        'Semua', 'POLDA METRO JAYA', 'POLDA JABAR', 'POLDA JAWA TENGAH',
        'POLDA JATIM', 'POLDA BALI', 'POLDA DIY', 'POLDA SUMUT', 'POLDA RIAU',
        'POLDA SULSEL', 'POLDA ACEH', 'POLDA BANTEN',
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>
            <Navbar />

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
                    background: toast.type === 'error' ? '#fff2f0' : '#f6ffed',
                    border: `1px solid ${toast.type === 'error' ? '#f7c5d0' : '#b8e0d2'}`,
                    color: toast.type === 'error' ? '#ff4d4f' : '#52c41a',
                    padding: '12px 20px', borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px'
                }}>
                    {toast.type === 'error' ? '❌' : '✅'} {toast.message}
                </div>
            )}

            <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, color: '#4a4a4a' }}>⚙️ Settings</h2>
                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>Kelola preferensi dan akun kamu</p>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Sidebar Tabs */}
                    <div style={{ width: '200px', minWidth: '160px' }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '12px 16px', borderRadius: '12px', border: 'none',
                                background: activeTab === tab.id ? 'linear-gradient(135deg, #f7c5d0, #c9b8e8)' : 'white',
                                color: activeTab === tab.id ? 'white' : '#4a4a4a',
                                fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px',
                                cursor: 'pointer', marginBottom: '8px',
                                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(247,197,208,0.4)' : '0 2px 8px rgba(247,197,208,0.2)'
                            }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: '280px' }}>

                        {/* Profile */}
                        {activeTab === 'profile' && (
                            <div style={cardStyle}>
                                <h3 style={{ margin: '0 0 20px', color: '#4a4a4a' }}>👤 Profile</h3>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>Nama</label>
                                    <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>Email</label>
                                    <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>Role</label>
                                    <input value={profile.role || 'admin'} disabled style={{ ...inputStyle, background: '#f5f5f5', color: '#aaa' }} />
                                </div>
                                <button onClick={handleUpdateProfile} disabled={loading} style={{
                                    padding: '10px 24px', background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                                    border: 'none', borderRadius: '12px', color: 'white',
                                    fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px',
                                    fontWeight: '600', cursor: 'pointer'
                                }}>
                                    {loading ? '✨ Menyimpan...' : '💾 Simpan Profile'}
                                </button>
                            </div>
                        )}

                        {/* Appearance */}
                        {activeTab === 'appearance' && (
                            <div style={cardStyle}>
                                <h3 style={{ margin: '0 0 20px', color: '#4a4a4a' }}>🎨 Appearance</h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '16px', background: '#fdf6f0', borderRadius: '12px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', color: '#4a4a4a' }}>Dark Mode</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#8a8a8a' }}>Ganti tampilan ke mode gelap</p>
                                    </div>
                                    <Toggle active={darkMode} onChange={handleDarkMode} />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 12px', fontWeight: '600', color: '#4a4a4a' }}>Ukuran Font</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {['small', 'medium', 'large'].map(size => (
                                            <button key={size} onClick={() => handleFontSize(size)} style={{
                                                padding: '8px 20px', borderRadius: '20px', border: '1px solid #f7c5d0',
                                                background: fontSize === size ? 'linear-gradient(135deg, #f7c5d0, #c9b8e8)' : 'white',
                                                color: fontSize === size ? 'white' : '#4a4a4a',
                                                fontFamily: 'Zen Kaku Gothic New, sans-serif', cursor: 'pointer',
                                                textTransform: 'capitalize'
                                            }}>
                                                {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p style={{ margin: '0 0 12px', fontWeight: '600', color: '#4a4a4a' }}>Bahasa</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {[{ val: 'id', label: '🇮🇩 Indonesia' }, { val: 'en', label: '🇬🇧 English' }].map(lang => (
                                            <button key={lang.val} onClick={() => handleLanguage(lang.val)} style={{
                                                padding: '8px 20px', borderRadius: '20px', border: '1px solid #f7c5d0',
                                                background: language === lang.val ? 'linear-gradient(135deg, #f7c5d0, #c9b8e8)' : 'white',
                                                color: language === lang.val ? 'white' : '#4a4a4a',
                                                fontFamily: 'Zen Kaku Gothic New, sans-serif', cursor: 'pointer'
                                            }}>
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeTab === 'notification' && (
                            <div style={cardStyle}>
                                <h3 style={{ margin: '0 0 20px', color: '#4a4a4a' }}>🔔 Notifications</h3>
                                {[
                                    { key: 'emailAlert', label: 'Email Alert', desc: 'Terima email saat kamera offline' },
                                    { key: 'pushNotif', label: 'Push Notification', desc: 'Notifikasi browser untuk event penting' },
                                ].map(item => (
                                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '16px', background: '#fdf6f0', borderRadius: '12px' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#4a4a4a' }}>{item.label}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#8a8a8a' }}>{item.desc}</p>
                                        </div>
                                        <Toggle active={notification[item.key]} onChange={(val) => handleNotification(item.key, val)} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === 'security' && (
                            <div style={cardStyle}>
                                <h3 style={{ margin: '0 0 20px', color: '#4a4a4a' }}>🔐 Security</h3>
                                {[
                                    { key: 'oldPassword', label: 'Password Lama', placeholder: '••••••••' },
                                    { key: 'newPassword', label: 'Password Baru', placeholder: 'Min. 6 karakter' },
                                    { key: 'confirmPassword', label: 'Konfirmasi Password Baru', placeholder: 'Ulangi password baru' },
                                ].map(field => (
                                    <div key={field.key} style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '6px', color: '#4a4a4a', fontSize: '13px', fontWeight: '500' }}>{field.label}</label>
                                        <input
                                            type="password" placeholder={field.placeholder}
                                            value={passwords[field.key]}
                                            onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                ))}
                                <button onClick={handleChangePassword} disabled={loading} style={{
                                    padding: '10px 24px', background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                                    border: 'none', borderRadius: '12px', color: 'white',
                                    fontFamily: 'Zen Kaku Gothic New, sans-serif', fontSize: '14px',
                                    fontWeight: '600', cursor: 'pointer'
                                }}>
                                    {loading ? '✨ Menyimpan...' : '🔐 Ganti Password'}
                                </button>
                            </div>
                        )}

                        {/* Map Preferences */}
                        {activeTab === 'map' && (
                            <div style={cardStyle}>
                                <h3 style={{ margin: '0 0 20px', color: '#4a4a4a' }}>🗺️ Map Preferences</h3>
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 12px', fontWeight: '600', color: '#4a4a4a' }}>Default Wilayah</p>
                                    <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#8a8a8a' }}>Wilayah yang otomatis dipilih saat buka halaman Map</p>
                                    <select value={defaultWilayah} onChange={e => handleDefaultWilayah(e.target.value)} style={{
                                        ...inputStyle, cursor: 'pointer'
                                    }}>
                                        {WILAYAH_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* About */}
                        {activeTab === 'about' && (
                            <div style={cardStyle}>
                                <h3 style={{ margin: '0 0 20px', color: '#4a4a4a' }}>ℹ️ About</h3>
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌸</div>
                                    <h2 style={{ margin: 0, color: '#4a4a4a' }}>Smart CCTV</h2>
                                    <p style={{ margin: '4px 0 0', color: '#8a8a8a', fontSize: '13px' }}>Version 1.0.0</p>
                                </div>
                                {[
                                    { label: 'Frontend', value: 'React + Vite' },
                                    { label: 'Backend', value: 'Express.js' },
                                    { label: 'Database', value: 'PostgreSQL + Prisma' },
                                    { label: 'Deployment', value: 'Vercel + Supabase' },
                                    { label: 'Map', value: 'React Leaflet' },
                                    { label: 'Charts', value: 'Recharts' },
                                    { label: 'Monitoring', value: 'Sentry' },
                                ].map(item => (
                                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #fde8ed' }}>
                                        <span style={{ color: '#8a8a8a', fontSize: '14px' }}>{item.label}</span>
                                        <span style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '600' }}>{item.value}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <a href="https://github.com/deathmurderS/smart-cctv" target="_blank" rel="noreferrer" style={{
                                        padding: '8px 20px', background: '#4a4a4a', color: 'white',
                                        borderRadius: '20px', fontSize: '13px', textDecoration: 'none'
                                    }}>
                                        🐙 GitHub
                                    </a>
                                    <a href="https://smart-cctv-xi.vercel.app" target="_blank" rel="noreferrer" style={{
                                        padding: '8px 20px', background: 'linear-gradient(135deg, #f7c5d0, #c9b8e8)',
                                        color: 'white', borderRadius: '20px', fontSize: '13px', textDecoration: 'none'
                                    }}>
                                        🚀 API Docs
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings