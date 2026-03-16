import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables (e.g., from a .env file locally)
load_dotenv()

# We will use a SQLite database by default if DATABASE_URL is not provided (for fast local dev),
# but when deploying to Render it will use the Supabase Postgres URL.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hrms.db")

# Create the SQLAlchemy engine.
# In .NET, this is similar to configuring options.UseNpgsql(connectionString) in Program.cs
# connect_args={"check_same_thread": False} is only needed for SQLite
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

# Create a SessionLocal class. Each instance will be a database session.
# This is the equivalent of configuring your ApplicationDbContext in Entity Framework.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models.
# All our database models (Entities) will inherit from this class.
Base = declarative_base()

# Dependency to get a database session per API request
# This handles open/close of DB connection, exactly like Scoped lifetime in .NET Dependency Injection!
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
