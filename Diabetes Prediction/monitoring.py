# monitoring.py (continued)
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
import logging
import os

class ModelMonitor:
    def __init__(self, logs_dir='monitoring/logs'):
        self.predictions_log = []
        self.performance_metrics = {
            'total_predictions': 0,
            'high_risk_predictions': 0,
            'average_confidence': 0.0,
            'last_updated': datetime.now()
        }
        self.logs_dir = logs_dir
        os.makedirs(logs_dir, exist_ok=True)
        
        # Setup logging
        logging.basicConfig(
            filename=os.path.join(logs_dir, 'model_monitor.log'),
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
    
    def log_prediction(self, features, prediction, probability, actual_outcome=None):
        """Log each prediction for monitoring"""
        log_entry = {
            'timestamp': datetime.now(),
            'features': features,
            'prediction': prediction,
            'probability': probability,
            'actual_outcome': actual_outcome
        }
        
        self.predictions_log.append(log_entry)
        self.update_performance_metrics(prediction, probability)
        self.save_prediction_log()
        
        # Alert for high-risk patterns
        self.check_for_alerts(features, prediction, probability)
    
    def update_performance_metrics(self, prediction, probability):
        """Update real-time performance metrics"""
        self.performance_metrics['total_predictions'] += 1
        if prediction == 1:
            self.performance_metrics['high_risk_predictions'] += 1
        
        # Update rolling average confidence
        total = self.performance_metrics['average_confidence'] * (self.performance_metrics['total_predictions'] - 1)
        self.performance_metrics['average_confidence'] = (total + probability) / self.performance_metrics['total_predictions']
        self.performance_metrics['last_updated'] = datetime.now()
    
    def check_for_alerts(self, features, prediction, probability):
        """Check for conditions that might require alerts"""
        alerts = []
        
        # Alert for very high glucose with low risk prediction
        if features.get('glucose', 0) > 200 and prediction == 0:
            alert_msg = f"High glucose ({features['glucose']}) with low risk prediction"
            alerts.append(alert_msg)
            logging.warning(alert_msg)
        
        # Alert for low confidence predictions
        if 0.4 < probability < 0.6:
            alert_msg = f"Low confidence prediction: {probability:.3f}"
            alerts.append(alert_msg)
            logging.info(alert_msg)
        
        return alerts
    
    def save_prediction_log(self):
        """Save prediction log to CSV"""
        if self.predictions_log:
            df = pd.DataFrame(self.predictions_log)
            log_file = os.path.join(self.logs_dir, f"predictions_{datetime.now().strftime('%Y%m%d')}.csv")
            df.to_csv(log_file, index=False)
    
    def generate_performance_report(self):
        """Generate comprehensive performance report"""
        if not self.predictions_log:
            return {"error": "No predictions to analyze"}
        
        df = pd.DataFrame(self.predictions_log)
        
        report = {
            'summary': {
                'total_predictions': len(df),
                'high_risk_predictions': (df['prediction'] == 1).sum(),
                'high_risk_rate': (df['prediction'] == 1).mean(),
                'average_confidence': df['probability'].mean(),
                'predictions_last_24h': len([p for p in self.predictions_log 
                                           if p['timestamp'] > datetime.now() - timedelta(hours=24)])
            },
            'feature_stats': {
                'avg_glucose': df['features'].apply(lambda x: x.get('glucose', 0)).mean(),
                'avg_bmi': df['features'].apply(lambda x: x.get('bmi', 0)).mean(),
                'avg_age': df['features'].apply(lambda x: x.get('age', 0)).mean()
            }
        }
        
        return report
    
    def plot_prediction_trends(self, save_path=None):
        """Create visualization of prediction trends"""
        if len(self.predictions_log) < 2:
            return None
        
        df = pd.DataFrame(self.predictions_log)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)
        
        # Create visualization
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Plot 1: Daily prediction counts
        daily_counts = df['prediction'].resample('D').count()
        axes[0,0].plot(daily_counts.index, daily_counts.values, marker='o')
        axes[0,0].set_title('Daily Prediction Volume')
        axes[0,0].set_ylabel('Number of Predictions')
        
        # Plot 2: Risk distribution
        risk_counts = df['prediction'].value_counts()
        axes[0,1].pie(risk_counts.values, labels=['Low Risk', 'High Risk'], autopct='%1.1f%%')
        axes[0,1].set_title('Diabetes Risk Distribution')
        
        # Plot 3: Confidence distribution
        axes[1,0].hist(df['probability'], bins=20, alpha=0.7, edgecolor='black')
        axes[1,0].set_title('Prediction Confidence Distribution')
        axes[1,0].set_xlabel('Confidence')
        axes[1,0].set_ylabel('Frequency')
        
        # Plot 4: Feature correlation (if we have enough data)
        if len(df) > 10:
            feature_df = pd.json_normalize(df['features'])
            numeric_cols = feature_df.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 1:
                corr_matrix = feature_df[numeric_cols].corr()
                sns.heatmap(corr_matrix, annot=True, ax=axes[1,1])
                axes[1,1].set_title('Feature Correlations')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        
        return fig