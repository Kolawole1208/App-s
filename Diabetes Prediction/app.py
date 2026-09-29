# app.py
from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
from monitoring import ModelMonitor
from ehr_integration import EHRIntegration

app = Flask(__name__)

# Initialize components
model = None
model_monitor = ModelMonitor()
ehr_system = EHRIntegration('sqlite:///diabetes_ehr.db')

def load_model():
    """Load the trained diabetes model"""
    global model
    try:
        model = joblib.load('model/diabetes_model.pkl')
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        # Create a dummy model for development
        from sklearn.ensemble import RandomForestClassifier
        model = RandomForestClassifier()
        print("Loaded dummy model for development")

# Load model when app starts
load_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 
                          'insulin', 'bmi', 'diabetes_pedigree', 'age']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Prepare features for prediction
        features = np.array([[
            data['pregnancies'],
            data['glucose'],
            data['blood_pressure'],
            data['skin_thickness'],
            data['insulin'],
            data['bmi'],
            data['diabetes_pedigree'],
            data['age']
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        
        # Log prediction for monitoring
        model_monitor.log_prediction(data, prediction, probability)
        
        # Store in EHR (if patient_id provided)
        if 'patient_id' in data:
            ehr_system.store_prediction(
                data['patient_id'],
                data,
                prediction,
                probability
            )
        
        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability),
            'risk_level': 'High' if prediction == 1 else 'Low',
            'timestamp': datetime.now().isoformat(),
            'recommendation': get_recommendation(prediction, probability, data)
        })
    
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/monitoring/dashboard')
def monitoring_dashboard():
    """Endpoint for model monitoring dashboard"""
    report = model_monitor.generate_performance_report()
    alerts = model_monitor.check_for_alerts({}, 0, 0.0)  # Get recent alerts
    
    return jsonify({
        'performance_report': report,
        'recent_alerts': alerts,
        'system_health': 'healthy' if len(alerts) == 0 else 'needs_attention'
    })

@app.route('/patient/<patient_id>/history')
def get_patient_history(patient_id):
    """Get prediction history for a patient"""
    history = ehr_system.get_patient_history(patient_id)
    
    history_data = []
    for record in history:
        history_data.append({
            'timestamp': record.timestamp.isoformat(),
            'glucose': record.glucose,
            'prediction': record.prediction,
            'probability': record.probability,
            'notes': record.clinician_notes
        })
    
    return jsonify({'patient_id': patient_id, 'history': history_data})

def get_recommendation(prediction, probability, features):
    """Generate clinical recommendations based on prediction"""
    recommendations = []
    
    if prediction == 1:
        recommendations.append("Consider HbA1c test for confirmation")
        recommendations.append("Schedule follow-up with endocrinologist")
        
        if features.get('glucose', 0) > 180:
            recommendations.append("Immediate dietary consultation recommended")
    else:
        recommendations.append("Maintain regular annual check-ups")
        
        if features.get('bmi', 0) > 25:
            recommendations.append("Consider weight management program")
        
        if features.get('age', 0) > 45:
            recommendations.append("Annual diabetes screening recommended")
    
    return "; ".join(recommendations)

if __name__ == '__main__':
    # Use waitress for production
    from waitress import serve
    print("Starting Diabetes Prediction API...")
    serve(app, host='0.0.0.0', port=5000)