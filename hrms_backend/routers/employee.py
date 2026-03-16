from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import schemas, crud
from database import get_db

# This is the equivalent of [Route("api/[controller]")] in C#
router = APIRouter(prefix="/api/employees", tags=["Employees"])

# Equivalent of a GET Endpoint
@router.get("/", response_model=List[schemas.EmployeeResponse])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Depends(get_db) injects the database session like .NET Dependency Injection
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

# Equivalent of a GET by ID Endpoint
@router.get("/{employee_id}", response_model=schemas.EmployeeResponse)
def read_employee(employee_id: str, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_id(db, employee_id=employee_id)
    if db_employee is None:
        # Returning a 404 cleanly
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

# Equivalent of a POST Endpoint
@router.post("/", response_model=schemas.EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Validate uniqueness
    if crud.get_employee_by_id(db, employee_id=employee.employee_id):
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    if crud.get_employee_by_email(db, email=employee.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_employee(db=db, employee=employee)

# Equivalent of a DELETE Endpoint
@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    success = crud.delete_employee(db, employee_id=employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    # Return empty success response
    return None
