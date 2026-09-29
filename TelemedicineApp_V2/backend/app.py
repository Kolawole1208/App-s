from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import json

from config import Config
from models import db, User, UserRole, Appointment, AppointmentStatus

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Helper function to create sample data
def create_sample_data():
    if User.query.first() is None:
        # Create sample doctor
        doctor = User(
            email="dr.smith@telemedicine.com",
            first_name="John",
            last_name="Smith",
            role=UserRole.DOCTOR
        )
        doctor.set_password("doctor123")
        db.session.add(doctor)
        
        # Create sample patient
        patient = User(
            email="patient@example.com",
            first_name="Jane",
            last_name="Doe",
            role=UserRole.PATIENT
        )
        patient.set_password("patient123")
        db.session.add(patient)
        
        db.session.commit()
        print("Sample data created!")

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Telemedicine API is running!"})

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        if user and user.check_password(data.get('password')):
            access_token = create_access_token(
    identity=str(user.id),  # Convert to string
    additional_claims={'role': user.role.value, 'email': user.email}
)
            
            return jsonify({
                'success': True,
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role.value
                }
            }), 200
        
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'message': 'User already exists'}), 400
        
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=UserRole(data['role']),
            phone=data.get('phone', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'User created successfully'}), 201
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role == UserRole.PATIENT:
            total_appointments = Appointment.query.filter_by(patient_id=current_user_id).count()
            upcoming_appointments = Appointment.query.filter(
                Appointment.patient_id == current_user_id,
                Appointment.status.in_([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
            ).count()
        else:
            total_appointments = Appointment.query.filter_by(doctor_id=current_user_id).count()
            upcoming_appointments = Appointment.query.filter(
                Appointment.doctor_id == current_user_id,
                Appointment.status.in_([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
            ).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_appointments': total_appointments,
                'upcoming_appointments': upcoming_appointments,
                'completed_appointments': total_appointments - upcoming_appointments
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role == UserRole.PATIENT:
            appointments = Appointment.query.filter_by(patient_id=current_user_id).all()
        else:
            appointments = Appointment.query.filter_by(doctor_id=current_user_id).all()
        
        appointments_data = []
        for appointment in appointments:
            appointments_data.append({
                'id': appointment.id,
                'patient_name': f"{appointment.patient.first_name} {appointment.patient.last_name}",
                'doctor_name': f"{appointment.doctor.first_name} {appointment.doctor.last_name}",
                'scheduled_date': appointment.scheduled_date.isoformat() if appointment.scheduled_date else None,
                'scheduled_time': appointment.scheduled_time.strftime('%H:%M') if appointment.scheduled_time else None,
                'status': appointment.status.value,
                'symptoms': appointment.symptoms
            })
        
        return jsonify({'success': True, 'appointments': appointments_data})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        create_sample_data()
    app.run(debug=True, port=5000)
