from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List, Optional
from models import AttendanceStatus

# -----------------
# Base Schemas (Shared properties)
# -----------------
class EmployeeBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=2, max_length=50)

class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus

# -----------------
# Create Schemas (DTOs for Incoming POST requests)
# -----------------
class EmployeeCreate(EmployeeBase):
    # For creation, we explicitly expect the ID from the client as per requirements
    employee_id: str = Field(..., min_length=1, max_length=50)

class AttendanceCreate(AttendanceBase):
    pass

# -----------------
# Response Schemas (DTOs for Outgoing Response)
# -----------------
class AttendanceResponse(AttendanceBase):
    id: str

    class Config:
        from_attributes = True  # Pydantic v2 equivalent of orm_mode=True, allows parsing from SQLAlchemy models

class EmployeeResponse(EmployeeBase):
    employee_id: str
    
    # We can optionally include attendances when returning Employee
    # attendances: List[AttendanceResponse] = []

    class Config:
        from_attributes = True
