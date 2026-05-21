# 🎥 Smart CCTV Monitoring & Analytics Dashboard

A full-stack real-time CCTV monitoring dashboard built for portfolio purposes, demonstrating backend, database, analytics, and frontend skills. Features a live map of **3,600+ CCTV cameras** across Indonesia sourced from Korlantas RTMC.

## 🌐 Live Demo

- **Frontend:** [smart-cctv-2xpc.vercel.app](https://smart-cctv-2xpc.vercel.app)
- **Backend API:** [smart-cctv-xi.vercel.app](https://smart-cctv-xi.vercel.app)

> Default login: `admin@smartcctv.com` / `123456`

---

## ✨ Features

- 🔐 **JWT Authentication** — secure login & protected routes
- 📷 **Camera Management** — add, update, delete cameras
- ⚡ **Event Simulation** — simulate motion detection, person detected, camera online/offline
- 📈 **Analytics Dashboard** — events by hour & location with interactive charts
- 🗺️ **Interactive Map** — 3,600+ CCTV cameras across Indonesia with marker clustering
- 🎥 **Live Stream Viewer** — HLS stream player embedded directly in map popup
- 🌸 **Japanese Pastel UI** — soft pastel aesthetic with Zen Kaku Gothic font
- 🗄️ **PostgreSQL + Prisma** — relational database with ORM

---

## 🛠 Tech Stack

### Backend
- **Express.js** — REST API & middleware
- **Prisma ORM** — database queries
- **PostgreSQL** — relational database (Supabase)
- **JWT** — authentication
- **bcryptjs** — password hashing

### Frontend
- **React + Vite** — UI framework
- **React Leaflet** — interactive map
- **React Leaflet Cluster** — marker clustering for performance
- **HLS.js** — live stream player
- **Recharts** — data visualization
- **Axios** — HTTP client
- **React Router** — client-side routing

---

## 📁 Project Structure

```
smart-cctv/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── seedMetro.js
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── cameraController.js
│   │   │   ├── eventController.js
│   │   │   └── analyticsController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── cameras.js
│   │   │   ├── events.js
│   │   │   └── analytics.js
│   │   ├── app.js
│   │   └── index.js
│   ├── api/
│   │   └── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatCard.jsx
    │   │   └── EventTable.jsx
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Cameras.jsx
    │   │   ├── Events.jsx
    │   │   └── Map.jsx
    │   ├── utils/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/deathmurderS/smart-cctv.git
cd smart-cctv
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/smart_cctv"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

Run database migration:

```bash
npx prisma migrate dev --name init
```

Seed dummy data:

```bash
npm run seed
```

Seed Metro Jaya CCTV data:

```bash
npm run seedMetro
```

Start backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Default Login

```
Email: admin@smartcctv.com
Password: 123456
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get token |

### Cameras
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/cameras | Get all cameras (filter by ?wilayah=) | ✅ |
| POST | /api/cameras | Create camera | ✅ |
| PUT | /api/cameras/:id | Update camera | ✅ |
| DELETE | /api/cameras/:id | Delete camera | ✅ |
| GET | /api/cameras/:id/health | Check stream health | ✅ |

### Events
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/events | Get all events | ✅ |
| POST | /api/events | Create event | ✅ |
| GET | /api/events/camera/:id | Get events by camera | ✅ |

### Analytics
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/analytics/summary | Total cameras & events | ✅ |
| GET | /api/analytics/by-location | Events per location | ✅ |
| GET | /api/analytics/by-hour | Events per hour | ✅ |

---

## 🗺️ CCTV Map

The map features **3,600+ real CCTV cameras** from across Indonesia sourced from Korlantas RTMC, including:

- POLDA Metro Jaya (Jakarta)
- POLDA Jawa Barat
- POLDA Jawa Tengah
- POLDA Jawa Timur
- POLDA Bali
- POLDA Sumatera Utara
- And 20+ other regions

Each camera marker shows:
- 🟢 Online / 🔴 Offline status
- Live HLS stream (for online cameras)
- Camera name & location

---

## 💼 Skills Demonstrated

| Area | Skills |
|---|---|
| Backend | Express.js, REST API, JWT Auth, Middleware, Error Handling |
| Database | PostgreSQL, Prisma ORM, SQL, Relationships |
| Frontend | React, Component Design, State Management |
| Data Viz | Recharts, Analytics Dashboard |
| Maps | React Leaflet, Marker Clustering, HLS Streaming |
| DevOps | Vercel Deployment, Supabase, Environment Variables |

---

## 👤 Author

**Muhammad Zaky Zamzami**
- GitHub: [@deathmurderS](https://github.com/deathmurderS)
- LinkedIn: [linkedin.com/in/username](https://www.linkedin.com/in/muhammad-zaky-zamzami-b872b7306/)