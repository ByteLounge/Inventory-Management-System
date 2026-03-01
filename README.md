# Inventory Management System (IMS)

A full-stack, SaaS-oriented Inventory Management System designed to handle products, stock levels, sales tracking, and low-stock alerts. 

## 🚀 Tech Stack

### Frontend
- **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** React Router v7
- **State/Data Fetching:** [TanStack React Query](https://tanstack.com/query/v5) & Axios
- **Animations:** Framer Motion
- **Charting:** Recharts
- **Icons:** Lucide React

### Backend
- **Framework:** [Flask](https://flask.palletsprojects.com/) (Python 3)
- **Database ORM:** SQLAlchemy with Alembic (Flask-Migrate)
- **Serialization:** Marshmallow
- **Authentication:** JWT (PyJWT) & bcrypt for password hashing
- **Server:** Gunicorn

### Database & Infrastructure
- **Database:** PostgreSQL 15
- **Containerization:** Docker & Docker Compose

## 📦 Project Structure

```
├── backend/                # Flask backend application
│   ├── app/                # Application modules and routes
│   ├── Dockerfile          # Backend container configuration
│   ├── requirements.txt    # Python dependencies
│   ├── run.py              # Application entry point
│   └── seed.py             # Database seeder script
├── frontend/               # React frontend application
│   ├── src/                # Source code (components, pages, styles)
│   ├── Dockerfile          # Frontend container configuration
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.ts      # Vite bundler configuration
└── docker-compose.yml      # Multi-container orchestration
```

## 🛠️ Local Development Setup

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed on your machine.
- Node.js (for running frontend natively without Docker, optional).
- Python 3.x (for running backend natively without Docker, optional).

### Running with Docker (Recommended)

The easiest way to get the entire stack—database, backend API, and frontend client—running is to use Docker Compose.

1. **Clone the repository** and navigate to the root directory:
   ```bash
   cd IMS
   ```

2. **Start the containers** in detached mode:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:5000/api
   - **Database:** Exposed on localhost:5432 (User: `postgres`, Password: `password`, DB: `inventory_saas`)

4. **Stop the containers:**
   ```bash
   docker-compose down
   ```

*(Note: If you run Docker locally, any changes in the `frontend` or `backend` folders will be synchronized into the containers via mapped volumes for a seamless developer experience.)*

## ✨ Features

- **Interactive Dashboard:** View total revenue, active products, inventory value, and low stock alerts via dynamic charts.
- **Inventory Tracking:** Categorize items, track real-time stock levels, and monitor multiple warehouses.
- **Sales & Orders:** Monitor recent transactions and historical revenue flow.
- **RESTful API:** Robust backend endpoints providing secure data access.
- **JWT Authentication:** Secure login and token-based protection for API routes. 

## 📝 Scripts & Commands

### Frontend
Navigate to `frontend/`:
- `npm run dev`: Start Vite development server (native).
- `npm run build`: Type-check and build for production.
- `npm run lint`: Run ESLint.

### Backend
Navigate to `backend/`:
- `python run.py`: Start the Flask server manually.
- `python seed.py`: Seed the database with initial dummy data.

---

*This project is container-ready out-of-the-box and set up with modern full-stack development patterns.*
