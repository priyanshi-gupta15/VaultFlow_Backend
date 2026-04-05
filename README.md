# VaultFlow: Premium Finance Intelligence

VaultFlow is a professional-grade financial management platform designed for clarity, precision, and strategic insight. It features a sophisticated dark-mode aesthetic with glassmorphism, smooth Framer Motion animations, and real-time data visualization.

---

## Core Features

- **Strategic Dashboard**: Multi-dimensional overview of capital flows with interactive charts (Pie/Bar charts with Recharts).
- **Audit-Ready Ledger**: Records page with pagination, search, filtering, and staggered entrance animations.
- **Identity & Access Matrix**: Administrative control center for managing user roles (Admin, Analyst, Viewer) and system access.
- **Premium Aesthetics**: Custom glassmorphism design system built with Tailwind CSS and Framer Motion.
- **Robust Backend**: Node.js/Express architecture with SQLite persistence via Prisma ORM.
- **Role-Based Access Control (RBAC)**: Middleware-enforced role-based permissions across all API endpoints.
- **Soft Delete**: Financial records use soft-delete with `isDeleted` and `deletedAt` fields.
- **Rate Limiting**: Built-in rate limiting for API protection (100 req/15min global, 20 req/15min auth).

---

## Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Prisma ORM, Zod validation, JWT authentication.
- **Database**: SQLite (Local development via Prisma).
- **State Management**: Context API (AuthContext).

---

## Project Structure

```
PriyanshiGupta_Backend/
├── prisma/
│   └── schema.prisma          # Database schema with User & FinancialRecord models
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js  # Login & Register handlers
│   │   ├── finance.controller.js # CRUD + Summary endpoints
│   │   └── user.controller.js  # User management (Admin only)
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT token verification
│   │   ├── error.middleware.js  # Global error handler
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   ├── role.middleware.js   # Role-based access control
│   │   └── validation.middleware.js # Zod schema validation
│   ├── routes/
│   │   ├── auth.routes.js      # POST /api/auth/register, /api/auth/login
│   │   ├── finance.routes.js   # GET/POST/PATCH/DELETE /api/finance
│   │   ├── index.js            # Route aggregator
│   │   └── user.routes.js      # GET/PATCH/DELETE /api/users
│   ├── services/
│   │   ├── auth.service.js     # Auth business logic
│   │   └── finance.service.js  # Finance business logic + aggregations
│   ├── utils/
│   │   └── AppError.js         # Custom error class
│   ├── validation/
│   │   ├── auth.schema.js      # Zod schemas for auth
│   │   └── finance.schema.js   # Zod schemas for finance records
│   ├── app.js                  # Express app setup
│   ├── prisma.js               # Prisma client singleton
│   ├── seed.js                 # Database seeder
│   └── server.js               # Server entry point
├── client/
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with JWT interceptor
│   │   ├── components/layout/  # Sidebar & Navbar
│   │   ├── context/AuthContext.jsx # Auth state management
│   │   └── pages/              # Dashboard, Records, AdminPanel, Login
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── .env
├── package.json
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Financial Records
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/finance` | List records (paginated, filterable) | All authenticated |
| GET | `/api/finance/summary` | Dashboard summary data | Analyst, Admin |
| POST | `/api/finance` | Create record | Admin only |
| PATCH | `/api/finance/:id` | Update record | Admin only |
| DELETE | `/api/finance/:id` | Soft-delete record | Admin only |

### User Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List all users | Admin only |
| PATCH | `/api/users/:id/status` | Update user role/status | Admin only |
| DELETE | `/api/users/:id` | Delete user | Admin only |

### Query Parameters (GET /api/finance)
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20)
- `search` - Search in description & category
- `type` - Filter by INCOME or EXPENSE
- `category` - Filter by category
- `startDate` / `endDate` - Date range filter

---

## Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_premium_secret_key"
NODE_ENV=development
```

### 3. Installation
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### 4. Database Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Sync schema to SQLite Database
npx prisma db push

# Seed the database with sample data
npm run seed
```

### 5. Launch
```bash
# Terminal 1 - Backend (port 3000)
npm run dev

# Terminal 2 - Frontend (port 5173)
cd client
npm run dev
```

---

## Useful Prisma Commands

During development, you may find these commands helpful:
- **View Database**: `npx prisma studio` (Opens a web-based GUI to view/edit data)
- **Reset Database**: `npx prisma migrate reset` (Deletes all data and re-runs migrations/seed)
- **Generate Client**: `npm run prisma:generate` (Updates the Client after schema changes)

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@vaultflow.com` | `admin123` |
| Analyst | `analyst@vaultflow.com` | `admin123` |
| Viewer | `viewer@vaultflow.com` | `admin123` |

---

## Design System

The application utilizes a custom-built premium design system defined in `client/src/index.css`:
- **Glassmorphism**: `.glass-card` - Frosted glass effect with backdrop blur
- **Premium Buttons**: `.premium-btn` - Indigo gradient with glow effects
- **Premium Inputs**: `.premium-input` - Dark themed with focus ring
- **Mesh Gradients**: `.mesh-gradient` - Multi-color radial gradient backgrounds
- **Responsive Layouts**: Designed for professional workstations

---

## License

VaultFlow Proprietary System. All rights reserved by priyanshi gupta.
