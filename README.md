# 📋 Task Management API

A **scalable REST API** with JWT authentication, role-based access control (RBAC), and a React.js frontend. Built as part of the Backend Developer Intern assignment.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)

---

## 🚀 Features

### Backend
- ✅ **User Authentication** - Registration & login with password hashing (bcrypt)
- ✅ **JWT Authorization** - Secure token-based auth with httpOnly cookies
- ✅ **Role-Based Access** - User and Admin roles with protected routes
- ✅ **Task CRUD API** - Full create, read, update, delete operations
- ✅ **API Versioning** - All routes prefixed with `/api/v1`
- ✅ **Input Validation** - Zod schema validation on all endpoints
- ✅ **Error Handling** - Global error handler with consistent responses
- ✅ **API Documentation** - Interactive Swagger UI

### Frontend
- ✅ **User Registration & Login** - Complete auth flow
- ✅ **Protected Dashboard** - JWT-required access
- ✅ **Task Management** - Create, edit, delete tasks
- ✅ **Filtering & Search** - Filter by status, priority; search by title
- ✅ **Toast Notifications** - Success/error feedback
- ✅ **Responsive Design** - Mobile-friendly UI

### Security
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT stored in httpOnly cookies
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input sanitization via Zod

---

## 📁 Project Structure

```
Backend Project/
├── backend/
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth, error, validation
│   │   ├── routes/         # API routes (v1)
│   │   ├── services/       # Business logic
│   │   ├── validators/     # Zod schemas
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helpers
│   │   └── app.ts          # Express app
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth context
│   │   ├── services/       # API client
│   │   └── App.jsx
│   └── package.json
│
├── docs/
│   ├── SCALABILITY.md
│   └── postman_collection.json
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |
| **Docs** | Swagger/OpenAPI |
| **Frontend** | React + Vite |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Backend Project"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from example)
copy .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL credentials
# Example: postgresql://postgres:password@localhost:5432/taskapi

# Generate Prisma client
npm run db:generate

# Push database schema (creates tables)
npm run db:push

# Start development server
npm run dev
```

The backend will start at **http://localhost:5000**

### 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at **http://localhost:5173**

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/v1/health

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| POST | `/api/v1/auth/logout` | Logout user | Required |
| GET | `/api/v1/auth/me` | Get current user | Required |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/tasks` | List user's tasks | Required |
| GET | `/api/v1/tasks/stats` | Get task statistics | Required |
| GET | `/api/v1/tasks/:id` | Get single task | Required |
| POST | `/api/v1/tasks` | Create task | Required |
| PUT | `/api/v1/tasks/:id` | Update task | Required |
| DELETE | `/api/v1/tasks/:id` | Delete task | Required |

### Admin (Admin Role Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/admin/tasks` | List all tasks | Admin |
| GET | `/api/v1/admin/users` | List all users | Admin |
| DELETE | `/api/v1/admin/users/:id` | Delete user | Admin |

---

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taskapi"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:5173"
```

---

## 📊 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  userId      String
  user        User       @relation(...)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Role { USER, ADMIN }
enum TaskStatus { PENDING, IN_PROGRESS, COMPLETED }
enum Priority { LOW, MEDIUM, HIGH }
```

---

## 🧪 Testing the API

### Using Swagger UI
1. Start the backend server
2. Open http://localhost:5000/api/docs
3. Use the "Try it out" feature on any endpoint

### Using Postman
1. Import `docs/postman_collection.json`
2. Set environment variable `baseUrl` to `http://localhost:5000/api/v1`
3. Run requests from the collection

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

**Create a task (with token):**
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My First Task","priority":"HIGH"}'
```

---

## 🌐 Scalability

See [docs/SCALABILITY.md](docs/SCALABILITY.md) for detailed notes on:
- Microservices architecture
- Caching strategies (Redis)
- Load balancing
- Database optimization
- Horizontal scaling

---

## 🌍 Deployment

This project is configured for easy deployment:

- **Backend**: Deploy to [Render](https://render.com) with the included `render.yaml` blueprint
- **Frontend**: Deploy to [Netlify](https://netlify.com) with the included `netlify.toml` config

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step instructions.

### Live Demo
- **Frontend**: [https://task-api-frontend.netlify.app](https://task-api-frontend.netlify.app) _(Replace with your actual Netlify URL)_
- **Backend API**: [https://task-api-backend-2qy2.onrender.com/api/v1](https://task-api-backend-2qy2.onrender.com/api/v1)
- **API Documentation**: [https://task-api-backend-2qy2.onrender.com/api/docs](https://task-api-backend-2qy2.onrender.com/api/docs)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |
| **Docs** | Swagger/OpenAPI |
| **Frontend** | React + Vite |
| **Deployment** | Render (Backend) + Netlify (Frontend) |

---

## 📝 License

MIT License - feel free to use this project as a template.

---

## 👤 Author

**Syed Shujatullah**

---
