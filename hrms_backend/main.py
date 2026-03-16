from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from routers import employee, attendance

# Create database tables.
# In EF Core, this is like running db.Database.EnsureCreated() or db.Database.Migrate()
models.Base.metadata.create_all(bind=engine)

# Initialize the Application
# This is like builder.Build() in Program.cs
app = FastAPI(
    title="HRMS Lite API",
    description="Backend API for the HRMS Lite application.",
    version="1.0.0"
)

# Configure CORS so the React app can talk to the backend
# app.UseCors() in ASP.NET Core
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since this is a demo, we allow all origins
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, DELETE, etc.
    allow_headers=["*"],
)

# Register our controllers
# app.MapControllers() in ASP.NET Core
app.include_router(employee.router)
app.include_router(attendance.router)

# Health check endpoint
@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "HRMS API is running!"}
