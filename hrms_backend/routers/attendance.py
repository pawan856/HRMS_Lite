from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import schemas, crud
from database import get_db

# This is the equivalent of [Route("api/[controller]")] in C#
router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

# Equivalent of GET /api/attendance/{employeeId}
@router.get("/{employee_id}", response_model=List[schemas.AttendanceResponse])
def get_employee_attendance(employee_id: str, db: Session = Depends(get_db)):
    # First ensure employee actually exists, otherwise return 404
    employee = crud.get_employee_by_id(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return crud.get_attendances_by_employee(db, employee_id)

# Equivalent of POST /api/attendance
@router.post("/", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def create_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists before we mark attendance for them!
    employee = crud.get_employee_by_id(db, attendance.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Prevent duplicate attendance for the exact same date and employee
    existing = crud.get_attendance_by_employee_and_date(db, attendance.employee_id, attendance.date)
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    return crud.create_attendance(db=db, attendance=attendance)
