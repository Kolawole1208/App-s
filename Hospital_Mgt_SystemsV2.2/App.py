from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # ✅ Import CORS
from datetime import datetime

app = Flask(__name__)

# ✅ Restrict CORS to your dashboard origin (change if needed)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# -------------------------
# Database Models
# -------------------------
class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100))
    contact = db.Column(db.String(20))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    blood_type = db.Column(db.String(5))
    admission_date = db.Column(db.DateTime, default=datetime.utcnow)

class Nurse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100))
    contact = db.Column(db.String(20))

class Pharmacist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50))
    contact = db.Column(db.String(20))

class Laboratory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    test_type = db.Column(db.String(100))
    contact = db.Column(db.String(20))

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    amount = db.Column(db.Float, nullable=False)
    issued_date = db.Column(db.DateTime, default=datetime.utcnow)
    paid = db.Column(db.Boolean, default=False)

class BloodBank(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blood_type = db.Column(db.String(5), nullable=False)
    units_available = db.Column(db.Integer, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    expiry_date = db.Column(db.DateTime)

# -------------------------
# Dashboard route
# -------------------------
@app.route('/')
def dashboard():
    stats = {
        'total_doctors': Doctor.query.count(),
        'total_patients': Patient.query.count(),
        'total_nurses': Nurse.query.count(),
        'due_invoices': Invoice.query.filter_by(paid=False).count(),
        'total_payments': db.session.query(db.func.sum(Invoice.amount)).filter_by(paid=True).scalar() or 0
    }
    users = [
        {'name': 'Breath Smart', 'status': 'admin'},
        {'name': 'Nurse Princess Timothy', 'status': 'nurse'},
        {'name': 'Breath Mirabel', 'status': 'admin'}
    ]
    return render_template('dashboard.html', **stats, users=users)

# -------------------------
# HTML Routes for Entities
# -------------------------
@app.route('/doctor')
def doctor():
    return render_template('Doctor.html', doctors=Doctor.query.all())

@app.route('/patient')
def patient():
    return render_template('Patient.html', patients=Patient.query.all())

@app.route('/pharmacist')
def pharmacist():
    return render_template('Pharmacist.html', pharmacists=Pharmacist.query.all())

@app.route('/laboratory')
def laboratory():
    return render_template('Laboratory.html', labs=Laboratory.query.all())

# -------------------------
# API Endpoints
# -------------------------
@app.route('/api/doctors', methods=['GET', 'POST'])
def api_doctors():
    if request.method == 'POST':
        data = request.get_json()
        doctor = Doctor(name=data['name'], specialization=data.get('specialization'), contact=data.get('contact'))
        db.session.add(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor added successfully'}), 201
    return jsonify({'doctors': [{'id': d.id, 'name': d.name} for d in Doctor.query.all()]})

@app.route('/api/patients', methods=['GET', 'POST'])
def api_patients():
    if request.method == 'POST':
        data = request.get_json()
        patient = Patient(name=data['name'], age=data.get('age'), gender=data.get('gender'), blood_type=data.get('blood_type'))
        db.session.add(patient)
        db.session.commit()
        return jsonify({'message': 'Patient added successfully'}), 201
    return jsonify({'patients': [{'id': p.id, 'name': p.name} for p in Patient.query.all()]})

@app.route('/api/pharmacists', methods=['GET', 'POST'])
def api_pharmacists():
    if request.method == 'POST':
        data = request.get_json()
        pharmacist = Pharmacist(name=data['name'], license_number=data.get('license_number'), contact=data.get('contact'))
        db.session.add(pharmacist)
        db.session.commit()
        return jsonify({'message': 'Pharmacist added successfully'}), 201
    return jsonify({'pharmacists': [{'id': ph.id, 'name': ph.name} for ph in Pharmacist.query.all()]})

@app.route('/api/laboratories', methods=['GET', 'POST'])
def api_laboratories():
    if request.method == 'POST':
        data = request.get_json()
        lab = Laboratory(name=data['name'], test_type=data.get('test_type'), contact=data.get('contact'))
        db.session.add(lab)
        db.session.commit()
        return jsonify({'message': 'Laboratory added successfully'}), 201
    return jsonify({'laboratories': [{'id': l.id, 'name': l.name} for l in Laboratory.query.all()]})

# -------------------------
# DB Initializer
# -------------------------
def init_db():
    with app.app_context():
        db.create_all()

        if Doctor.query.count() == 0:
            db.session.bulk_save_objects([
                Doctor(name="Dr. Smith", specialization="Cardiology", contact="1234567890"),
                Doctor(name="Dr. Johnson", specialization="Neurology", contact="2345678901")
            ])

        if Patient.query.count() == 0:
            db.session.bulk_save_objects([
                Patient(name="John Doe", age=45, gender="Male", blood_type="A+"),
                Patient(name="Jane Smith", age=32, gender="Female", blood_type="O-")
            ])

        if Pharmacist.query.count() == 0:
            db.session.bulk_save_objects([
                Pharmacist(name="Pharma One", license_number="LIC123", contact="9876543210"),
                Pharmacist(name="Pharma Two", license_number="LIC456", contact="8765432109")
            ])

        if Laboratory.query.count() == 0:
            db.session.bulk_save_objects([
                Laboratory(name="Lab A", test_type="Blood Test", contact="1122334455"),
                Laboratory(name="Lab B", test_type="X-Ray", contact="2233445566")
            ])

        db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
