from flask_sqlalchemy import SQLAlchemy
from models import db
import psycopg2
from config import Config

def init_db(app):
    """Initialize the database"""
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        create_sample_data()

def create_sample_data():
    """Create sample data for testing"""
    from models import User, UserRole, PatientProfile, DoctorProfile
    
    # Check if sample data already exists
    if User.query.first() is None:
        # Create sample doctor
        doctor = User(
            email="dr.smith@telemedicine.com",
            first_name="John",
            last_name="Smith",
            role=UserRole.DOCTOR,
            is_verified=True
        )
        doctor.set_password("doctor123")
        db.session.add(doctor)
        
        # Create doctor profile
        doctor_profile = DoctorProfile(
            user=doctor,
            specialization="Cardiology",
            license_number="MD123456",
            years_of_experience=15,
            consultation_fee=100.00
        )
        db.session.add(doctor_profile)
        
        # Create sample patient
        patient = User(
            email="patient@example.com",
            first_name="Jane",
            last_name="Doe",
            role=UserRole.PATIENT,
            is_verified=True
        )
        patient.set_password("patient123")
        db.session.add(patient)
        
        # Create patient profile
        patient_profile = PatientProfile(
            user=patient,
            emergency_contact="+1234567890",
            insurance_provider="Blue Cross",
            blood_type="O+",
            allergies="Penicillin, Peanuts",
            current_medications="Vitamin D, Aspirin"
        )
        db.session.add(patient_profile)
        
        db.session.commit()