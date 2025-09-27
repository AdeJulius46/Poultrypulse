import cv2
from ultralytics import YOLO
import os
from datetime import datetime, timedelta
import time
import random
import numpy as np
import logging

# Supabase
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HackathonChickenDetector:
    def __init__(self, model_path='chick.pt', supabase_url=None, supabase_key=None):
        """Simplified MVP detector for hackathon demo"""
        
        # Supabase setup
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.supabase = None
        
        if supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
                logger.info("Supabase connected!")
            except Exception as e:
                logger.error(f"Supabase connection failed: {e}")
        
        # Load YOLO model
        logger.info("Loading YOLO model...")
        self.model = YOLO(model_path)
        self.class_names = ['coryza', 'crd', 'normal']
        logger.info("Model loaded!")
        
        # Initialize camera with OpenCV (like your working code)
        logger.info("Starting camera...")
        self.cap = cv2.VideoCapture(0)
        
        if not self.cap.isOpened():
            logger.info("Camera 0 not found, trying camera 1...")
            self.cap = cv2.VideoCapture(1)
            
        if not self.cap.isOpened():
            raise Exception("No camera found! Make sure camera is connected.")
        
        # Set camera properties
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        
        # Let camera warm up
        time.sleep(2)
        logger.info("Camera ready!")
        
        # Create directories
        os.makedirs('detections', exist_ok=True)
        
        # Detection history for outbreak prediction
        self.recent_detections = []
        self.detection_count = {'coryza': 0, 'crd': 0, 'normal': 0}
        
        # Settings
        self.confidence_threshold = 0.5
        self.frame_skip = 3  # Process every 3rd frame for speed
        self.frame_count = 0
        
        logger.info("Hackathon MVP ready!")

    def simulate_realistic_environment(self):
        """Generate realistic temperature and humidity with some patterns"""
        # Simulate daily patterns and some randomness
        hour = datetime.now().hour
        
        # Base temperature follows daily cycle
        base_temp = 28 + 4 * np.sin((hour - 6) * np.pi / 12)  # Peak at 2 PM, low at 2 AM
        temperature = base_temp + random.uniform(-2, 2)  # Add some noise
        
        # Humidity inversely related to temperature (somewhat)
        base_humidity = 75 - (temperature - 28) * 2
        humidity = base_humidity + random.uniform(-5, 5)
        
        # Keep in realistic ranges
        temperature = max(20, min(35, temperature))
        humidity = max(50, min(90, humidity))
        
        return round(temperature, 1), round(humidity, 1)

    def calculate_outbreak_risk(self, temp, humidity):
        """Simple but effective outbreak risk calculation for demo"""
        risk_score = 0.0
        
        # Get recent disease counts (last 10 detections or 5 minutes)
        recent_coryza = self.detection_count['coryza']
        recent_crd = self.detection_count['crd']
        total_diseases = recent_coryza + recent_crd
        
        # Base risk from disease detections (60% of score)
        if total_diseases >= 5:
            risk_score += 0.6
        elif total_diseases >= 3:
            risk_score += 0.4
        elif total_diseases >= 1:
            risk_score += 0.2
        
        # Environmental stress factors (30% of score)
        temp_stress = 0
        if temp > 32:
            temp_stress = min(0.15, (temp - 32) * 0.05)
        elif temp < 24:
            temp_stress = min(0.15, (24 - temp) * 0.05)
        
        humidity_stress = 0
        if humidity > 80:
            humidity_stress = min(0.15, (humidity - 80) * 0.02)
        elif humidity < 60:
            humidity_stress = min(0.15, (60 - humidity) * 0.02)
        
        risk_score += temp_stress + humidity_stress
        
        # Time-based factor (10% of score) - higher risk during day
        hour = datetime.now().hour
        if 8 <= hour <= 18:  # Daytime
            risk_score += 0.1
        
        # Add some randomness for demo variety (but keep it realistic)
        risk_score += random.uniform(-0.05, 0.05)
        
        return max(0.0, min(1.0, risk_score))  # Keep between 0-1

    def detect_diseases(self, frame):
        """Run YOLO detection and return results"""
        results = self.model(frame, verbose=False)
        detections = []
        
        if results[0].boxes is not None:
            for box in results[0].boxes:
                confidence = float(box.conf[0])
                if confidence > self.confidence_threshold:
                    class_id = int(box.cls[0])
                    class_name = self.class_names[class_id] if class_id < len(self.class_names) else 'unknown'
                    
                    detections.append({
                        'disease': class_name,
                        'confidence': round(confidence, 3),
                        'bbox': box.xyxy[0].cpu().numpy().tolist()
                    })
        
        return detections, results[0].plot() if detections else frame

    def save_detection_image(self, image, disease_type, confidence):
        """Save detection image locally"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"detection_{disease_type}_{confidence:.2f}_{timestamp}.jpg"
        filepath = f"detections/{filename}"
        cv2.imwrite(filepath, image)
        return filepath

    def push_to_supabase(self, data):
        """Push data to Supabase for frontend display"""
        if not self.supabase:
            logger.warning("Supabase not configured")
            return False
        
        try:
            # Insert into your table (adjust table name as needed)
            response = self.supabase.table('chicken_monitoring').insert(data).execute()
            logger.info("Data pushed to Supabase")
            return True
        except Exception as e:
            logger.error(f"Supabase push failed: {e}")
            return False

    def update_detection_counts(self, detections):
        """Update recent detection counts for outbreak calculation"""
        # Reset counts periodically (every 5 minutes for demo)
        current_time = datetime.now()
        if not hasattr(self, 'last_reset') or (current_time - self.last_reset).seconds > 300:
            self.detection_count = {'coryza': 0, 'crd': 0, 'normal': 0}
            self.last_reset = current_time
            logger.info("Detection counts reset")
        
        # Add new detections
        for detection in detections:
            disease = detection['disease']
            if disease in self.detection_count:
                self.detection_count[disease] += 1

    def run_detection_cycle(self):
        """Single detection cycle - perfect for hackathon demo"""
        # Capture frame using OpenCV
        ret, frame = self.cap.read()
        if not ret:
            logger.error("Failed to capture frame")
            return None, 0
        
        # Get environmental data
        temperature, humidity = self.simulate_realistic_environment()
        
        # Run disease detection
        detections, annotated_frame = self.detect_diseases(frame)
        
        # Update detection counts
        self.update_detection_counts(detections)
        
        # Calculate outbreak risk
        outbreak_risk = self.calculate_outbreak_risk(temperature, humidity)
        
        # Prepare data for database/frontend
        timestamp = datetime.now().isoformat()
        
        # Create summary record
        summary_data = {
            'timestamp': timestamp,
            'temperature': temperature,
            'humidity': humidity,
            'coryza_detected': len([d for d in detections if d['disease'] == 'coryza']),
            'crd_detected': len([d for d in detections if d['disease'] == 'crd']),
            'normal_detected': len([d for d in detections if d['disease'] == 'normal']),
            'total_coryza_count': self.detection_count['coryza'],
            'total_crd_count': self.detection_count['crd'],
            'total_normal_count': self.detection_count['normal'],
            'outbreak_risk': round(outbreak_risk, 3),
            'risk_level': 'HIGH' if outbreak_risk > 0.7 else 'MEDIUM' if outbreak_risk > 0.4 else 'LOW',
            'alert_message': self.generate_alert_message(outbreak_risk, detections)
        }
        
        # Process individual detections
        for detection in detections:
            if detection['disease'] in ['coryza', 'crd']:  # Only save disease detections
                # Save image
                image_path = self.save_detection_image(
                    annotated_frame, detection['disease'], detection['confidence']
                )
                
                # Individual detection record
                detection_data = {
                    **summary_data,
                    'detected_disease': detection['disease'],
                    'confidence': detection['confidence'],
                    'image_path': image_path,
                    'detection_id': f"{detection['disease']}_{int(time.time())}"
                }
                
                # Push to Supabase
                self.push_to_supabase(detection_data)
        
        # Always push summary data (even if no diseases detected)
        self.push_to_supabase(summary_data)
        
        # Console output for demo
        self.print_status(summary_data, detections)
        
        return annotated_frame, len(detections)

    def generate_alert_message(self, risk_level, detections):
        """Generate user-friendly alert messages"""
        if risk_level > 0.8:
            return "CRITICAL: Immediate veterinary attention required!"
        elif risk_level > 0.6:
            return "HIGH RISK: Monitor closely and consider preventive measures"
        elif risk_level > 0.3:
            return "MODERATE: Watch for symptoms and maintain good hygiene"
        elif len(detections) > 0:
            return "DETECTED: Diseases found but risk is currently low"
        else:
            return "ALL CLEAR: No diseases detected, conditions normal"

    def print_status(self, data, detections):
        """Print colorful status for demo"""
        print("\n" + "="*60)
        print(f"CHICKEN HEALTH MONITORING - {datetime.now().strftime('%H:%M:%S')}")
        print("="*60)
        print(f"Temperature: {data['temperature']}°C")
        print(f"Humidity: {data['humidity']}%")
        print(f"Diseases Found: Coryza({data['coryza_detected']}) | CRD({data['crd_detected']}) | Normal({data['normal_detected']})")
        print(f"Total Counts: Coryza({data['total_coryza_count']}) | CRD({data['total_crd_count']}) | Normal({data['total_normal_count']})")
        print(f"Outbreak Risk: {data['outbreak_risk']*100:.1f}% ({data['risk_level']})")
        print(f"Status: {data['alert_message']}")
        
        if detections:
            print("Current Detections:")
            for i, det in enumerate(detections, 1):
                print(f"   {i}. {det['disease'].upper()} (confidence: {det['confidence']:.2f})")
        print("="*60)

    def run(self):
        """Main demo loop"""
        print("Starting Hackathon MVP Demo...")
        print("Press 'q' to quit, 's' to force save screenshot")
        
        last_detection_time = time.time()
        
        try:
            while True:
                self.frame_count += 1
                
                # Run detection every N frames or every 10 seconds (whichever comes first)
                if (self.frame_count % self.frame_skip == 0) or (time.time() - last_detection_time > 10):
                    result = self.run_detection_cycle()
                    if result[0] is not None:
                        processed_frame, detection_count = result
                        display_frame = processed_frame
                        last_detection_time = time.time()
                    else:
                        # Fallback to regular camera feed if detection fails
                        ret, display_frame = self.cap.read()
                        if not ret:
                            print("Camera feed lost!")
                            break
                else:
                    # Just show camera feed
                    ret, display_frame = self.cap.read()
                    if not ret:
                        print("Camera feed lost!")
                        break
                
                # Add frame counter for demo
                cv2.putText(display_frame, f"Frame: {self.frame_count}", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                cv2.putText(display_frame, "Hackathon MVP Demo", (10, 460), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
                
                # Show frame
                cv2.imshow('Chicken Disease Detection MVP', display_frame)
                
                # Handle keys
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    break
                elif key == ord('s'):
                    # Force save current frame
                    cv2.imwrite(f'detections/manual_save_{int(time.time())}.jpg', display_frame)
                    print("Screenshot saved!")
                
                time.sleep(0.1)  # Small delay for stability
                
        except KeyboardInterrupt:
            print("\nDemo stopped by user")
        
        finally:
            self.cleanup()

    def cleanup(self):
        """Clean up resources"""
        print("Cleaning up...")
        self.cap.release()
        cv2.destroyAllWindows()
        print("Cleanup complete!")

# Hackathon Quick Start
if __name__ == "__main__":
    print("HACKATHON MVP - Chicken Disease Detection")
    print("=" * 50)
    
    # Replace with your Supabase credentials
    SUPABASE_URL = "https://adeyewwecyvakdnrtqfm.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZXlld3dlY3l2YWtkbnJ0cWZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg4NDIwNywiZXhwIjoyMDc0NDYwMjA3fQ.pwjW1BD-3yJYq6SL4uERQpS3nXW5rw3EZsOoASwRRvU"
    
    # Quick setup check
    if SUPABASE_URL == "https://adeyewwecyvakdnrtqfm.supabase.co":
        print("Don't forget to add your Supabase credentials!")
        print("Set SUPABASE_URL and SUPABASE_KEY in the code")
        SUPABASE_URL = None
        SUPABASE_KEY = None
    
    # Initialize and run
    try:
        detector = HackathonChickenDetector(
            model_path='chick.pt',
            supabase_url=SUPABASE_URL,
            supabase_key=SUPABASE_KEY
        )
        
        detector.run()
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure your camera is connected and 'chick.pt' model file exists!")