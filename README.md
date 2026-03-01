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

## UI

<img width="1919" height="911" alt="Screenshot 2026-03-01 105932" src="https://github.com/user-attachments/assets/2bbdb709-8139-412e-92e1-2e603f64e4a7" />

<img width="1919" height="919" alt="Screenshot 2026-03-01 105946" src="https://github.com/user-attachments/assets/03492231-c947-47aa-9dfc-3763baf2d53d" />

<img width="1917" height="908" alt="Screenshot 2026-03-01 105957" src="https://github.com/user-attachments/assets/a6496a45-ed0f-4dc7-af34-3dd2a4f359e5" />

<img width="1919" height="913" alt="Screenshot 2026-03-01 110020" src="https://github.com/user-attachments/assets/ec167122-99cf-40b1-893a-f03f11eed0b5" />

<img width="1919" height="912" alt="Screenshot 2026-03-01 110030" src="https://github.com/user-attachments/assets/7465746d-8f2a-4f89-97e1-b76ec3ff79c6" />

<img width="1919" height="910" alt="Screenshot 2026-03-01 110041" src="https://github.com/user-attachments/assets/e03ac80a-40ec-44d3-a590-57ce66de0888" />

<img width="1919" height="904" alt="Screenshot 2026-03-01 110052" src="https://github.com/user-attachments/assets/8eac011d-86a8-426d-aee5-c915f645c540" />

<img width="1919" height="907" alt="Screenshot 2026-03-01 110416" src="https://github.com/user-attachments/assets/d714b6ce-ed8f-4bac-8430-0c1978fa4ddd" />


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
