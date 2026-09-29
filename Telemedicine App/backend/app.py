from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import json

from config import Config
from database import init_db
from models import db, User, UserRole, Appointment, AppointmentStatus, PatientProfile, DoctorProfile, Prescription, MedicalRecord, AuditLog

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)
init_db(app)

# Audit logging middleware
@app.before_request
def log_request():
    if request.endpoint and request.endpoint != 'static':
        user_id = get_jwt_identity() if request.headers.get('Authorization') else None
        audit_log = AuditLog(
            user_id=user_id,
            action=request.method,
            resource=request.endpoint or 'unknown',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        db.session.add(audit_log)
        db.session.commit()

# Auth Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')) and user.is_active:
        access_token = create_access_token(
            identity=user.id,
            additional_claims={'role': user.role.value, 'email': user.email}
        )
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role.value
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    
    user = User(
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        role=UserRole(data['role']),
        phone=data.get('phone'),
        date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date() if data.get('date_of_birth') else None
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    
    # Create profile based on role
    if data['role'] == 'patient':
        profile = PatientProfile(user=user)
    elif data['role'] == 'doctor':
        profile = DoctorProfile(
            user=user,
            specialization=data.get('specialization', 'General Medicine'),
            license_number=data.get('license_number', '')
        )
    
    db.session.add(profile)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

# Dashboard Routes
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role == UserRole.PATIENT:
        total_appointments = Appointment.query.filter_by(patient_id=current_user_id).count()
        upcoming_appointments = Appointment.query.filter(
            Appointment.patient_id == current_user_id,
            Appointment.status.in_([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
        ).count()
        completed_appointments = Appointment.query.filter_by(
            patient_id=current_user_id,
            status=AppointmentStatus.COMPLETED
        ).count()
        
    elif user.role == UserRole.DOCTOR:
        total_appointments = Appointment.query.filter_by(doctor_id=current_user_id).count()
        upcoming_appointments = Appointment.query.filter(
            Appointment.doctor_id == current_user_id,
            Appointment.status.in_([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
        ).count()
        completed_appointments = Appointment.query.filter_by(
            doctor_id=current_user_id,
            status=AppointmentStatus.COMPLETED
        ).count()
    
    return jsonify({
        'total_appointments': total_appointments,
        'upcoming_appointments': upcoming_appointments,
        'completed_appointments': completed_appointments
    })

@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role == UserRole.PATIENT:
        appointments = Appointment.query.filter_by(patient_id=current_user_id).all()
    elif user.role == UserRole.DOCTOR:
        appointments = Appointment.query.filter_by(doctor_id=current_user_id).all()
    else:
        appointments = Appointment.query.all()
    
    appointments_data = []
    for appointment in appointments:
        appointments_data.append({
            'id': appointment.id,
            'patient_name': f"{appointment.patient.first_name} {appointment.patient.last_name}",
            'doctor_name': f"{appointment.doctor.first_name} {appointment.doctor.last_name}",
            'scheduled_date': appointment.scheduled_date.isoformat(),
            'scheduled_time': appointment.scheduled_time.strftime('%H:%M'),
            'status': appointment.status.value,
            'symptoms': appointment.symptoms
        })
    
    return jsonify(appointments_data)

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    appointment = Appointment(
        patient_id=current_user_id,
        doctor_id=data['doctor_id'],
        scheduled_date=datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date(),
        scheduled_time=datetime.strptime(data['scheduled_time'], '%H:%M').time(),
        symptoms=data.get('symptoms', ''),
        status=AppointmentStatus.SCHEDULED
    )
    
    db.session.add(appointment)
    db.session.commit()
    
    return jsonify({'message': 'Appointment created successfully'}), 201

# Video Call Routes
@app.route('/api/video/token', methods=['POST'])
@jwt_required()
def generate_video_token():
    # In production, integrate with Twilio Video or similar service
    data = request.get_json()
    appointment_id = data.get('appointment_id')
    
    # For demo purposes, return a mock token
    return jsonify({
        'token': 'mock_video_token_12345',
        'room_name': f'appointment_{appointment_id}'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)