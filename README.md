# 🎥 Smart CCTV Monitoring & Analytics Dashboard

A full-stack real-time CCTV monitoring dashboard built for portfolio purposes, demonstrating backend, database, analytics, and frontend skills.

## 🌐 Live Demo

- **Frontend:** _coming soon_
- **Backend API:** _coming soon_

---

## 🧠 System Overview

---

## 🛠 Tech Stack

### Backend
- **Express.js** — REST API & middleware
- **Prisma ORM** — database queries
- **PostgreSQL** — relational database
- **JWT** — authentication
- **Socket.IO** — realtime updates
- **bcryptjs** — password hashing

### Frontend
- **React** — UI framework
- **Recharts** — data visualization
- **Axios** — HTTP client
- **Socket.IO Client** — realtime updates
- **React Router** — client-side routing

---

## 📁 Project Structure
smart-cctv/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
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
│   │   └── index.js
│   ├── .env
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
│   │   └── Events.jsx
│   ├── utils/
│   │   └── api.js
│   └── App.jsx
└── package.json

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/username/smart-cctv.git
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

Start backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Default Login
Email: admin@smartcctv.com
Password: 123456

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
| GET | /api/cameras | Get all cameras | ✅ |
| POST | /api/cameras | Create camera | ✅ |
| PUT | /api/cameras/:id | Update camera | ✅ |
| DELETE | /api/cameras/:id | Delete camera | ✅ |

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

## 📊 Features

- 🔐 **JWT Authentication** — secure login & protected routes
- 📷 **Camera Management** — add, update, delete cameras
- ⚡ **Realtime Updates** — live event notifications via Socket.IO
- 📈 **Analytics Dashboard** — events by hour & location charts
- 🗄️ **PostgreSQL Database** — relational data with Prisma ORM
- 🌱 **Seed Data** — 500 dummy events across 7 days

---

## 👤 Author

**Zaky**
- GitHub: [@deathmurderS](https://github.com/deathmurderS)
- LinkedIn: [linkedin.com/in/username](https://www.linkedin.com/in/muhammad-zaky-zamzami-b872b7306/)
