from sqlalchemy import Column, String, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from database import Base

class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

# -----------------
# Employee Entity
# -----------------
class Employee(Base):
    __tablename__ = "employees"
    
    # In .NET, this is exactly: [Key] public string EmployeeId { get; set; }
    employee_id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    
    # Navigation Property in EF Core corresponding to a One-to-Many relationship
    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")

# -----------------
# Attendance Entity
# -----------------
class Attendance(Base):
    __tablename__ = "attendance"
    
    # We use a composite of employee_id and date for logical uniqueness,
    # but let's give it a simple surrogate primary key to be clean.
    # Actually, SQLAlchemy string primary keys without length limits are fine.
    
    id = Column(String, primary_key=True, index=True) # Let's use a UUID or simple concatenated string
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(SQLEnum(AttendanceStatus), nullable=False)
    
    # Navigation Property in EF Core
    employee = relationship("Employee", back_populates="attendances")
