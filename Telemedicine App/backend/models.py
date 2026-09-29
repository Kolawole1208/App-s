from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import enum

db = SQLAlchemy()

class UserRole(enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"
    CARE_COORDINATOR = "care_coordinator"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    profile_picture = db.Column(db.String(255))
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    patient_profile = db.relationship('PatientProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    doctor_profile = db.relationship('DoctorProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class PatientProfile(db.Model):
    __tablename__ = 'patient_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    emergency_contact = db.Column(db.String(100))
    insurance_provider = db.Column(db.String(100))
    insurance_id = db.Column(db.String(50))
    blood_type = db.Column(db.String(5))
    height = db.Column(db.Float)  # in cm
    weight = db.Column(db.Float)  # in kg
    
    # Medical History
    allergies = db.Column(db.Text)
    current_medications = db.Column(db.Text)
    past_surgeries = db.Column(db.Text)
    chronic_conditions = db.Column(db.Text)
    family_history = db.Column(db.Text)

class DoctorProfile(db.Model):
    __tablename__ = 'doctor_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50), nullable=False)
    years_of_experience = db.Column(db.Integer)
    consultation_fee = db.Column(db.Float, default=0.0)
    bio = db.Column(db.Text)
    is_available = db.Column(db.Boolean, default=True)
    
    # Availability
    working_hours_start = db.Column(db.Time, default='09:00')
    working_hours_end = db.Column(db.Time, default='17:00')

class AppointmentStatus(enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    scheduled_date = db.Column(db.Date, nullable=False)
    scheduled_time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, default=30)  # minutes
    status = db.Column(db.Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    symptoms = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Video call details
    video_call_id = db.Column(db.String(100))
    video_call_url = db.Column(db.String(255))
    
    # Relationships
    patient = db.relationship('User', foreign_keys=[patient_id], backref='patient_appointments')
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='doctor_appointments')
    prescription = db.relationship('Prescription', backref='appointment', uselist=False, cascade='all, delete-orphan')
    medical_record = db.relationship('MedicalRecord', backref='appointment', uselist=False, cascade='all, delete-orphan')

class Prescription(db.Model):
    __tablename__ = 'prescriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    medication_name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)
    frequency = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    instructions = db.Column(db.Text)
    prescribed_date = db.Column(db.Date, default=datetime.utcnow().date)
    is_active = db.Column(db.Boolean, default=True)

class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    diagnosis = db.Column(db.Text)
    symptoms_observed = db.Column(db.Text)
    treatment_plan = db.Column(db.Text)
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    resource = db.Column(db.String(100), nullable=False)
    resource_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    
    user = db.relationship('User', backref='audit_logs')