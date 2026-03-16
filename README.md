# HRMS Lite

A lightweight Human Resource Management System built with React and Python (FastAPI).

## Project Overview
HRMS Lite allows an administrator to manage employee records and track their daily attendance. It has an easy-to-use professional interface and utilizes a fast, decoupled Client-Server architecture.

### Features
*   **Employee Management**: Add, View, and Delete employees. 
*   **Attendance Tracking**: Mark attendance for any employee (Present/Absent).
*   **Dashboard**: View a summary of the total number of employees registered.

## Tech Stack
*   **Frontend**: React, Vite, Axios, React Router Dom
*   **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn
*   **Database**: PostgreSQL
*   **Deployment Platforms**: Vercel (Frontend), Render (Backend), Supabase (Database)

## Steps to Run Locally

### 1. Backend (FastAPI)
Navigate to the backend directory:
```bash
cd hrms_backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Run the server (it will automatically create an SQLite database named `hrms.db` for local testing):
```bash
uvicorn main:app --reload --port 8000
```
Your backend will be live at `http://localhost:8000`. You can view the Auto-Generated API Documentation at `http://localhost:8000/docs`.

### 2. Frontend (React)
Open a new terminal and navigate to the frontend directory:
```bash
cd hrms-frontend
```

Install the NPM packages and run the development server:
```bash
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`. 

---

## Deployment Instructions (Vercel + Render + Supabase)

### 1. Database Setup
1. Create a free PostgreSQL database on [Supabase](https://supabase.com/). 
2. Copy your Connection String (URI).

### 2. Backend Setup (Render)
1. Push this entire repository to your GitHub account.
2. Log into [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and point Render to the `hrms_backend` folder as the Root Directory.
4. Render will automatically detect the settings in `render.yaml`. 
5. Under Environment Variables in the Render Dashboard, add a new variable:
   * **Key**: `DATABASE_URL` 
   * **Value**: *(Paste your Supabase Connection String here)*
6. Deploy! Copy the live Render backend URL once it finishes.

### 3. Frontend Setup (Vercel)
1. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Set the Root Directory to `hrms-frontend`. Vercel will auto-detect Vite via the `vercel.json`.
4. Add an Environment Variable:
   *   **Key**: `VITE_API_BASE_URL`
   *   **Value**: *(Paste your Render backend URL here, ensuring it ends with `/api/`, e.g., `https://your-backend.onrender.com/api/`)*
5. Deploy!

## Assumptions & Limitations
*   The application currently assumes a single admin user, so no authentication or JWT tokens are required or implemented.
*   The SQLite DB is only used locally for ease-of-use. When deployed, the application seamlessly switches to PostgreSQL via the `DATABASE_URL` environment variable.
*   Data validation ensures Employee IDs and Emails must be unique. The frontend will alert the user if duplicate constraints are violated.
