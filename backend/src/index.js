const app = require('./app')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
    console.log(`📅 Hari ini: ${new Date().toLocaleString('id-ID', { dateStyle: 'full' })}`)
    console.log(`🔄 API Docs: http://localhost:${PORT}/api/docs`)
})