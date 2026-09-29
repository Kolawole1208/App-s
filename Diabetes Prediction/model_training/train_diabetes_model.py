# model_training/train_diabetes_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import mlflow
import mlflow.sklearn
import seaborn as sns
import matplotlib.pyplot as plt
import os

def load_and_prepare_data():
    """Load and prepare diabetes dataset"""
    # Using the Pima Indians Diabetes Dataset
    # You can replace this with your actual data source
    from sklearn.datasets import make_classification
    
    # For demo purposes - replace with real diabetes data
    X, y = make_classification(
        n_samples=1000,
        n_features=8,
        n_informative=6,
        n_redundant=2,
        random_state=42
    )
    
    # Create feature names matching our API
    feature_names = [
        'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness',
        'insulin', 'bmi', 'diabetes_pedigree', 'age'
    ]
    
    df = pd.DataFrame(X, columns=feature_names)
    df['outcome'] = y
    
    return df, feature_names

def train_model():
    """Train the diabetes prediction model"""
    
    # Start MLflow experiment
    mlflow.set_experiment("Diabetes Prediction")
    
    with mlflow.start_run():
        # Load data
        df, feature_names = load_and_prepare_data()
        
        # Split data
        X = df[feature_names]
        y = df['outcome']
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Log parameters and metrics
        mlflow.log_param("n_estimators", 100)
        mlflow.log_param("max_depth", 10)
        mlflow.log_metric("accuracy", accuracy)
        
        # Log model
        mlflow.sklearn.log_model(model, "diabetes_model")
        
        # Save model locally
        os.makedirs('model', exist_ok=True)
        joblib.dump(model, 'model/diabetes_model.pkl')
        
        # Generate evaluation visuals
        generate_evaluation_plots(model, X_test, y_test, y_pred)
        
        print(f"Model trained with accuracy: {accuracy:.3f}")
        print("Model saved to model/diabetes_model.pkl")

def generate_evaluation_plots(model, X_test, y_test, y_pred):
    """Generate model evaluation plots"""
    os.makedirs('monitoring/plots', exist_ok=True)
    
    # Feature importance
    plt.figure(figsize=(10, 6))
    feature_imp = pd.DataFrame({
        'feature': X_test.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=True)
    
    plt.barh(feature_imp['feature'], feature_imp['importance'])
    plt.title('Feature Importance')
    plt.tight_layout()
    plt.savefig('monitoring/plots/feature_importance.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Confusion matrix
    plt.figure(figsize=(8, 6))
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.savefig('monitoring/plots/confusion_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    train_model()