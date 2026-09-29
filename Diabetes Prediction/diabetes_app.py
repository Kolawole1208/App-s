# diabetes_app.py - Complete Diabetes Prediction Application
from flask import Flask, request, jsonify, render_template, render_template_string
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from datetime import datetime

app = Flask(__name__)

print("🚀 Initializing Diabetes Prediction System...")

# Create a demo ML model
def create_diabetes_model():
    print("🤖 Training diabetes prediction model...")
    
    # Generate realistic synthetic diabetes data
    np.random.seed(42)
    n_samples = 1000
    
    # Features: [pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree, age]
    X = np.column_stack([
        np.random.randint(0, 10, n_samples),  # pregnancies
        np.random.normal(120, 30, n_samples),  # glucose
        np.random.normal(70, 15, n_samples),   # blood_pressure
        np.random.normal(29, 10, n_samples),   # skin_thickness
        np.random.normal(120, 60, n_samples),  # insulin
        np.random.normal(26, 5, n_samples),    # bmi
        np.random.normal(0.5, 0.2, n_samples), # diabetes_pedigree
        np.random.randint(21, 70, n_samples)   # age
    ])
    
    # Create target based on realistic diabetes risk factors
    y = (
        (X[:, 1] > 140) |  # high glucose
        (X[:, 5] > 30) |   # high bmi
        (X[:, 7] > 45) & (X[:, 0] > 2)  # older age with multiple pregnancies
    ).astype(int)
    
    model = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=10)
    model.fit(X, y)
    
    print("✅ Model trained successfully!")
    return model

# Initialize the model
try:
    model = create_diabetes_model()
    ML_MODEL_READY = True
except Exception as e:
    print(f"⚠️ ML model training failed: {e}")
    print("🔄 Using clinical algorithm as fallback...")
    model = None
    ML_MODEL_READY = False

# Web Interface HTML Content
HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diabetes Risk Assessment</title>
    <style>
        :root {
            --primary: #2c7fb8;
            --primary-dark: #1d5a82;
            --secondary: #7fcdbb;
            --light: #f0f9ff;
            --dark: #333;
            --danger: #e74c3c;
            --success: #2ecc71;
            --warning: #f39c12;
            --gray: #95a5a6;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 20px 0;
            border-radius: 8px 8px 0 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .card-header {
            background-color: var(--light);
            padding: 15px 20px;
            border-bottom: 1px solid #e1e8ed;
            font-weight: 600;
            color: var(--primary-dark);
        }
        
        .card-body {
            padding: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }
        
        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            transition: border 0.3s;
        }
        
        .form-control:focus {
            border-color: var(--primary);
            outline: none;
            box-shadow: 0 0 0 2px rgba(44, 127, 184, 0.2);
        }
        
        .form-row {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -10px;
        }
        
        .form-col {
            flex: 1;
            padding: 0 10px;
            min-width: 200px;
        }
        
        .btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: var(--primary-dark);
        }
        
        .btn-block {
            display: block;
            width: 100%;
        }
        
        .result-container {
            display: none;
            margin-top: 20px;
            padding: 20px;
            border-radius: 8px;
            background-color: var(--light);
        }
        
        .risk-low {
            border-left: 5px solid var(--success);
        }
        
        .risk-medium {
            border-left: 5px solid var(--warning);
        }
        
        .risk-high {
            border-left: 5px solid var(--danger);
        }
        
        .risk-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .risk-value {
            font-size: 28px;
            font-weight: 700;
            margin: 10px 0;
        }
        
        .risk-description {
            margin-top: 15px;
            line-height: 1.6;
        }
        
        .progress-bar {
            height: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
            margin: 15px 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 5px;
            transition: width 0.5s ease-in-out;
        }
        
        .info-text {
            font-size: 14px;
            color: var(--gray);
            margin-top: 5px;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 20px 0;
        }
        
        footer {
            text-align: center;
            margin-top: 30px;
            color: var(--gray);
            font-size: 14px;
        }
        
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }
        
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: var(--primary);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .form-col {
                flex: 100%;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Diabetes Risk Assessment</h1>
            <p>Clinical tool for diabetes prediction and risk assessment</p>
        </header>
        
        <div class="card">
            <div class="card-header">Patient Assessment</div>
            <div class="card-body">
                <form id="diabetesForm">
                    <div class="form-row">
                        <div class="form-col">
                            <div class="form-group">
                                <label for="pregnancies">Pregnancies:</label>
                                <input type="number" id="pregnancies" class="form-control" min="0" max="20" value="2">
                            </div>
                        </div>
                        <div class="form-col">
                            <div class="form-group">
                                <label for="glucose">Glucose (mg/dL):</label>
                                <input type="number" id="glucose" class="form-control" min="0" max="500" value="150">
                                <div class="info-text">Normal range: 70-100 mg/dL (fasting)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-col">
                            <div class="form-group">
                                <label for="bloodPressure">Blood Pressure (mm Hg):</label>
                                <input type="number" id="bloodPressure" class="form-control" min="0" max="200" value="85">
                                <div class="info-text">Normal: < 120/80 mm Hg</div>
                            </div>
                        </div>
                        <div class="form-col">
                            <div class="form-group">
                                <label for="skinThickness">Skin Thickness (mm):</label>
                                <input type="number" id="skinThickness" class="form-control" min="0" max="100" value="28">
                                <div class="info-text">Triceps skin fold thickness</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-col">
                            <div class="form-group">
                                <label for="insulin">Insulin (mu U/ml):</label>
                                <input type="number" id="insulin" class="form-control" min="0" max="1000" value="120">
                                <div class="info-text">Normal: 2.6-24.9 μU/mL</div>
                            </div>
                        </div>
                        <div class="form-col">
                            <div class="form-group">
                                <label for="bmi">BMI:</label>
                                <input type="number" id="bmi" class="form-control" min="10" max="70" step="0.1" value="33.6">
                                <div class="info-text">Normal: 18.5-24.9</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-col">
                            <div class="form-group">
                                <label for="diabetesPedigree">Diabetes Pedigree Function:</label>
                                <input type="number" id="diabetesPedigree" class="form-control" min="0" max="3" step="0.001" value="0.627">
                                <div class="info-text">Diabetes family history likelihood</div>
                            </div>
                        </div>
                        <div class="form-col">
                            <div class="form-group">
                                <label for="age">Age:</label>
                                <input type="number" id="age" class="form-control" min="1" max="120" value="30">
                            </div>
                        </div>
                    </div>
                    
                    <button type="button" id="assessBtn" class="btn btn-block">Assess Diabetes Risk</button>
                </form>
                
                <div class="loading" id="loadingIndicator">
                    <div class="spinner"></div>
                    <p>Analyzing patient data...</p>
                </div>
                
                <div class="result-container" id="resultContainer">
                    <div class="risk-title">Assessment Results</div>
                    <div class="risk-value" id="riskValue">Low Risk</div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="riskProgress" style="width: 20%; background-color: var(--success);"></div>
                    </div>
                    <div class="risk-description" id="riskDescription">
                        Based on the provided data, this patient shows a low probability of diabetes. 
                        Continue to monitor glucose levels and maintain a healthy lifestyle.
                    </div>
                    <div class="divider"></div>
                    <div>
                        <p><strong>Recommendations:</strong></p>
                        <ul id="recommendations">
                            <li>Maintain regular physical activity</li>
                            <li>Follow a balanced diet with controlled carbohydrate intake</li>
                            <li>Schedule annual check-ups for glucose monitoring</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">About This Tool</div>
            <div class="card-body">
                <p>This system uses machine learning and clinical algorithms to assess diabetes risk based on established medical parameters.</p>
                <p>The prediction model analyzes multiple factors including glucose levels, BMI, age, and family history to provide a risk assessment.</p>
                <p><strong>Note:</strong> This tool is for clinical decision support only and should not replace professional medical diagnosis.</p>
            </div>
        </div>
        
        <footer>
            <p>Diabetes Risk Assessment Tool &copy; 2023 | For Clinical Use</p>
        </footer>
    </div>

    <script>
        document.getElementById('assessBtn').addEventListener('click', async function() {
            // Show loading indicator
            document.getElementById('loadingIndicator').style.display = 'block';
            document.getElementById('resultContainer').style.display = 'none';
            
            try {
                // Get form values
                const formData = {
                    pregnancies: parseInt(document.getElementById('pregnancies').value),
                    glucose: parseInt(document.getElementById('glucose').value),
                    blood_pressure: parseInt(document.getElementById('bloodPressure').value),
                    skin_thickness: parseInt(document.getElementById('skinThickness').value),
                    insulin: parseInt(document.getElementById('insulin').value),
                    bmi: parseFloat(document.getElementById('bmi').value),
                    diabetes_pedigree: parseFloat(document.getElementById('diabetesPedigree').value),
                    age: parseInt(document.getElementById('age').value)
                };

                // Make API call to your Flask backend
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';
                
                // Display results from actual API
                displayResults(result);
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('loadingIndicator').style.display = 'none';
                alert('Error connecting to prediction service. Please try again.');
            }
        });
        
        function displayResults(result) {
            const resultContainer = document.getElementById('resultContainer');
            const riskValue = document.getElementById('riskValue');
            const riskProgress = document.getElementById('riskProgress');
            const riskDescription = document.getElementById('riskDescription');
            const recommendations = document.getElementById('recommendations');

            // Remove previous risk classes
            resultContainer.classList.remove('risk-low', 'risk-medium', 'risk-high');
            
            // Use the actual response from your API
            const prediction = result.prediction;
            const probability = result.probability;
            const riskLevel = result.risk_level.toLowerCase();
            
            if (riskLevel === 'low' || prediction === 0) {
                resultContainer.classList.add('risk-low');
                riskValue.textContent = 'Low Risk';
                riskValue.style.color = 'var(--success)';
                riskProgress.style.width = (probability * 100) + '%';
                riskProgress.style.backgroundColor = 'var(--success)';
                riskDescription.textContent = `Based on the analysis, this patient shows a low probability of diabetes (${(probability * 100).toFixed(1)}%). Continue to monitor glucose levels and maintain a healthy lifestyle.`;
                
                recommendations.innerHTML = result.recommendations.map(rec => 
                    `<li>${rec.replace('🔴', '').replace('🟢', '').replace('⚠️', '').replace('✅', '').replace('🩺', '').replace('🩸', '').replace('🍽️', '').replace('📋', '').replace('⚖️', '').replace('🏃‍♂️', '').replace('👁️', '').replace('🦶', '').replace('📊', '').trim()}</li>`
                ).join('');
            } else if (riskLevel === 'medium') {
                resultContainer.classList.add('risk-medium');
                riskValue.textContent = 'Medium Risk';
                riskValue.style.color = 'var(--warning)';
                riskProgress.style.width = (probability * 100) + '%';
                riskProgress.style.backgroundColor = 'var(--warning)';
                riskDescription.textContent = `This patient shows moderate risk factors for diabetes (${(probability * 100).toFixed(1)}%). Further evaluation and lifestyle modifications are recommended.`;
                
                recommendations.innerHTML = result.recommendations.map(rec => 
                    `<li>${rec.replace('🔴', '').replace('🟢', '').replace('⚠️', '').replace('✅', '').replace('🩺', '').replace('🩸', '').replace('🍽️', '').replace('📋', '').replace('⚖️', '').replace('🏃‍♂️', '').replace('👁️', '').replace('🦶', '').replace('📊', '').trim()}</li>`
                ).join('');
            } else {
                resultContainer.classList.add('risk-high');
                riskValue.textContent = 'High Risk';
                riskValue.style.color = 'var(--danger)';
                riskProgress.style.width = (probability * 100) + '%';
                riskProgress.style.backgroundColor = 'var(--danger)';
                riskDescription.textContent = `This patient shows significant risk factors for diabetes (${(probability * 100).toFixed(1)}%). Immediate medical evaluation and intervention are strongly recommended.`;
                
                recommendations.innerHTML = result.recommendations.map(rec => 
                    `<li>${rec.replace('🔴', '').replace('🟢', '').replace('⚠️', '').replace('✅', '').replace('🩺', '').replace('🩸', '').replace('🍽️', '').replace('📋', '').replace('⚖️', '').replace('🏃‍♂️', '').replace('👁️', '').replace('🦶', '').replace('📊', '').trim()}</li>`
                ).join('');
            }
            
            // Show result container
            resultContainer.style.display = 'block';
        }
        
        // Initialize with default values
        document.addEventListener('DOMContentLoaded', function() {
            // Set default BMI value if empty
            if (!document.getElementById('bmi').value) {
                document.getElementById('bmi').value = '33.6';
            }
        });
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Serve the web interface"""
    return render_template_string(HTML_CONTENT)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print(f"📊 Received prediction request for patient data: {data}")
        
        # Extract and validate features
        features = np.array([[
            float(data.get('pregnancies', 0)),
            float(data.get('glucose', 0)),
            float(data.get('blood_pressure', 0)),
            float(data.get('skin_thickness', 0)),
            float(data.get('insulin', 0)),
            float(data.get('bmi', 0)),
            float(data.get('diabetes_pedigree', 0)),
            float(data.get('age', 0))
        ]])
        
        # Make prediction
        if ML_MODEL_READY and model:
            prediction = model.predict(features)[0]
            probability = model.predict_proba(features)[0][1]
            model_type = "Machine Learning Model"
        else:
            # Clinical algorithm fallback
            prediction, probability = clinical_algorithm(features[0])
            model_type = "Clinical Algorithm"
        
        # Generate recommendations
        recommendations = generate_recommendations(data, prediction, probability)
        
        response = {
            'prediction': int(prediction),
            'probability': float(probability),
            'risk_level': 'High' if prediction == 1 else 'Low',
            'timestamp': datetime.now().isoformat(),
            'recommendations': recommendations,
            'model_used': model_type,
            'confidence': 'high' if probability > 0.7 or probability < 0.3 else 'medium'
        }
        
        print(f"✅ Prediction completed: {response['risk_level']} risk ({probability:.1%})")
        return jsonify(response)
    
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

def clinical_algorithm(features):
    """Clinical algorithm based on medical guidelines"""
    pregnancies, glucose, bp, skin, insulin, bmi, pedigree, age = features
    
    risk_score = 0
    
    # Glucose level (most important factor)
    if glucose >= 200: risk_score += 0.4
    elif glucose >= 140: risk_score += 0.3
    elif glucose >= 100: risk_score += 0.1
    
    # BMI
    if bmi >= 30: risk_score += 0.2
    elif bmi >= 25: risk_score += 0.1
    
    # Age
    if age >= 45: risk_score += 0.15
    elif age >= 35: risk_score += 0.1
    
    # Other factors
    if pregnancies >= 3: risk_score += 0.1
    if pedigree >= 0.8: risk_score += 0.05
    
    prediction = 1 if risk_score > 0.5 else 0
    probability = min(risk_score, 0.95)
    
    return prediction, probability

def generate_recommendations(data, prediction, probability):
    """Generate clinical recommendations based on prediction"""
    recommendations = []
    glucose = data.get('glucose', 0)
    bmi = data.get('bmi', 0)
    age = data.get('age', 0)
    
    if prediction == 1:
        recommendations.append("🔴 **High Diabetes Risk Detected**")
        recommendations.append("🩺 Schedule consultation with endocrinologist")
        recommendations.append("🩸 Consider HbA1c test for confirmation")
        
        if glucose > 180:
            recommendations.append("🍽️ Immediate dietary consultation recommended")
            recommendations.append("📋 Monitor blood glucose levels regularly")
        
        if bmi > 30:
            recommendations.append("⚖️ Weight management program advised")
            recommendations.append("🏃‍♂️ Regular physical activity recommended")
        
        if age > 45:
            recommendations.append("👁️ Regular eye examinations recommended")
            recommendations.append("🦶 Annual foot examination advised")
    else:
        recommendations.append("🟢 **Low Diabetes Risk**")
        recommendations.append("✅ Maintain regular annual health check-ups")
        
        if glucose > 140:
            recommendations.append("⚠️ Monitor blood glucose levels")
            recommendations.append("🥗 Consider dietary modifications")
        
        if bmi > 25:
            recommendations.append("⚖️ Maintain healthy weight")
            recommendations.append("🏃‍♂️ Regular exercise beneficial")
        
        if probability > 0.3:
            recommendations.append("📊 Consider annual diabetes screening")
    
    return recommendations

@app.route('/health')
def health():
    health_status = {
        "status": "healthy",
        "service": "Diabetes Prediction API",
        "version": "2.0",
        "model_status": "ready" if ML_MODEL_READY else "clinical_fallback",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "web_interface": "/",
            "prediction": "/predict (POST)",
            "health_check": "/health"
        }
    }
    return jsonify(health_status)

@app.route('/model-info')
def model_info():
    if ML_MODEL_READY and model:
        info = {
            "model_type": "Random Forest Classifier",
            "n_estimators": model.n_estimators,
            "features_used": [
                "Pregnancies", "Glucose", "Blood Pressure", "Skin Thickness",
                "Insulin", "BMI", "Diabetes Pedigree", "Age"
            ],
            "status": "active"
        }
    else:
        info = {
            "model_type": "Clinical Algorithm",
            "features_used": [
                "Pregnancies", "Glucose", "Blood Pressure", "Skin Thickness",
                "Insulin", "BMI", "Diabetes Pedigree", "Age"
            ],
            "status": "active"
        }
    return jsonify(info)

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🩺 DIABETES PREDICTION API STARTED SUCCESSFULLY!")
    print("="*50)
    print("📍 Web Interface: http://localhost:5000")
    print("❤️  Health Check: http://localhost:5000/health")
    print("🤖 Model Info: http://localhost:5000/model-info")
    print("🎯 Predict Endpoint: POST http://localhost:5000/predict")
    print("⏹️  Press Ctrl+C to stop the server")
    print("="*50)
    
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000)