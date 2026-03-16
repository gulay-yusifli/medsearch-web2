# MedSearch – Dərman Axtarış Platforması

MedSearch is a full-stack medical platform built for Azerbaijan that allows users to search for medicines, find nearby pharmacies, compare prices, set medicine reminders, and consult an AI health assistant.

---

## 🗂 Project Structure

```
medsearch-web2/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript + MongoDB
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (Docker)

```bash
# Copy and configure environment variables
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build
```

- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:5000  
- **MongoDB**: localhost:27017

---

## ⚙️ Manual Setup

### Prerequisites
- Node.js 18+
- MongoDB 6+

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit with your credentials
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### backend/.env

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/medsearch` |
| `JWT_SECRET` | JWT signing secret | — (required) |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `OPENAI_API_KEY` | OpenAI key for AI consultation | Optional |
| `GOOGLE_MAPS_API_KEY` | Google Maps key | Optional |
| `TWILIO_*` | SMS reminders via Twilio | Optional |
| `SMTP_*` | Email notifications | Optional |
| `ADMIN_EMAIL` | Default admin email | `admin@medsearch.az` |
| `ADMIN_PASSWORD` | Default admin password | `Admin123!` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |

---

## 📡 API Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login → returns JWT |
| GET | `/api/auth/profile` | Get authenticated user |
| PUT | `/api/auth/profile` | Update profile |

### Pharmacies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pharmacies` | List pharmacies |
| GET | `/api/pharmacies/nearby?lat=&lng=` | Nearby pharmacies |
| GET | `/api/pharmacies/search?medicine=` | Search by medicine |
| GET | `/api/pharmacies/:id` | Pharmacy details |
| POST | `/api/pharmacies` | Create (admin) |

### Medicines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | List medicines |
| GET | `/api/medicines/search?q=` | Full-text search |
| POST | `/api/medicines` | Create (admin) |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations/my` | My reservations |
| PUT | `/api/reservations/:id/cancel` | Cancel reservation |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/analytics` | Analytics data |
| GET | `/api/users` | List users |
| GET | `/api/reservations` | All reservations |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send AI message |
| GET | `/api/chat/history` | Chat history |

---

## 🧱 Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client, Lucide React  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Socket.IO, OpenAI SDK  
**Infrastructure:** Docker, Docker Compose, MongoDB 6

---

## 🌐 Features

- 🔍 Medicine search across pharmacies
- 📍 Nearby pharmacy map (Google Maps)
- 💰 Price comparison
- 📅 Reservation system
- 💊 Daily medicine schedule & reminders
- 🤖 AI health consultation (OpenAI GPT)
- 🔔 Real-time chat (Socket.IO)
- 👑 Full admin panel
