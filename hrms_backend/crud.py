from sqlalchemy.orm import Session
import models, schemas
import uuid
from typing import List, Optional

# Equivalent of EmployeeRepository in C#
def get_employees(db: Session, skip: int = 0, limit: int = 100) -> List[models.Employee]:
    # Select * from employees limit 100 offset 0
    return db.query(models.Employee).offset(skip).limit(limit).all()

def get_employee_by_id(db: Session, employee_id: str) -> Optional[models.Employee]:
    # Select * from employees where employee_id = ?
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str) -> Optional[models.Employee]:
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def create_employee(db: Session, employee: schemas.EmployeeCreate) -> models.Employee:
    # Map DTO to Model
    db_employee = models.Employee(
        employee_id=employee.employee_id,
        email=employee.email,
        full_name=employee.full_name,
        department=employee.department
    )
    # db.Add(entity)
    db.add(db_employee)
    # db.SaveChanges()
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: str) -> bool:
    db_employee = get_employee_by_id(db, employee_id)
    if not db_employee:
        return False
    # db.Remove(entity)
    db.delete(db_employee)
    # db.SaveChanges()
    db.commit()
    return True

# Equivalent of AttendanceRepository in C#
def get_attendances_by_employee(db: Session, employee_id: str) -> List[models.Attendance]:
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).all()

def get_attendance_by_employee_and_date(db: Session, employee_id: str, date) -> Optional[models.Attendance]:
    return db.query(models.Attendance)\
        .filter(models.Attendance.employee_id == employee_id)\
        .filter(models.Attendance.date == date)\
        .first()

def create_attendance(db: Session, attendance: schemas.AttendanceCreate) -> models.Attendance:
    # Use uuid.uuid4() for the PK to keep it simple
    db_attendance = models.Attendance(
        id=str(uuid.uuid4()),
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance
