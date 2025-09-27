import cv2
from ultralytics import YOLO
import os
from datetime import datetime, timedelta
import time
import random
import numpy as np
import logging
from io import BytesIO
import base64

# Supabase
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HackathonChickenDetector:
    def __init__(self, model_path='chick.pt', supabase_url=None, supabase_key=None):
        """Improved detector with proper Supabase integration and working camera"""
        
        # Supabase setup with error handling
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.supabase = None
        self.bucket_name = 'chicken-detection-images'
        
        if supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
                logger.info(" Supabase connected successfully!")
                self._test_supabase_connection()
            except Exception as e:
                logger.error(f" Supabase connection failed: {e}")
                logger.warning("  Continuing without Supabase - data will be stored locally only")
        else:
            logger.warning("  No Supabase credentials provided - running in local mode")
        
        # Load YOLO model
        logger.info(" Loading YOLO model...")
        try:
            self.model = YOLO(model_path)
            self.class_names = ['coryza', 'crd', 'normal']
            logger.info(" Model loaded successfully!")
        except Exception as e:
            logger.error(f" Failed to load model: {e}")
            raise
        
        # Initialize camera using the working method from pulse.py
        self._initialize_camera_working()
        
        # Create local directories
        os.makedirs('detections', exist_ok=True)
        os.makedirs('detections/images', exist_ok=True)
        
        # Detection tracking
        self.recent_detections = []
        self.detection_count = {'coryza': 0, 'crd': 0, 'normal': 0}
        self.last_reset = datetime.now()
        
        # Settings
        self.confidence_threshold = 0.5
        self.frame_skip = 3
        self.frame_count = 0
        
        logger.info(" Hackathon MVP ready!")

    def _initialize_camera_working(self):
        """Initialize camera using the working method from pulse.py"""
        logger.info("🎥 Starting camera...")
        
        # Try camera 0 first
        self.cap = cv2.VideoCapture(0)
        
        if not self.cap.isOpened():
            logger.info("Camera 0 not found, trying camera 1...")
            self.cap = cv2.VideoCapture(1)
            
        if not self.cap.isOpened():
            raise Exception(" No camera found! Make sure camera is connected.")
        
        # Set camera properties (same as working pulse.py)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        
        # Let camera warm up (same as working pulse.py)
        time.sleep(2)
        logger.info(" Camera ready!")

    def _test_supabase_connection(self):
        """Test Supabase connection and bucket access"""
        try:
            # Test database connection
            response = self.supabase.table('chicken_monitoring').select("count", count="exact").limit(1).execute()
            logger.info(f" Database connection verified - {response.count} records in table")
            
            # Test storage bucket
            buckets = self.supabase.storage.list_buckets()
            bucket_names = [bucket.name for bucket in buckets]
            if self.bucket_name in bucket_names:
                logger.info(f"Storage bucket '{self.bucket_name}' verified")
            else:
                logger.warning(f"  Storage bucket '{self.bucket_name}' not found. Available: {bucket_names}")
                
        except Exception as e:
            logger.error(f" Supabase connection test failed: {e}")

    def simulate_realistic_environment(self):
        """Generate realistic temperature and humidity"""
        hour = datetime.now().hour
        
        # Daily temperature cycle
        base_temp = 28 + 4 * np.sin((hour - 6) * np.pi / 12)
        temperature = base_temp + random.uniform(-2, 2)
        
        # Humidity inversely related to temperature
        base_humidity = 75 - (temperature - 28) * 2
        humidity = base_humidity + random.uniform(-5, 5)
        
        # Keep in realistic ranges
        temperature = max(20, min(35, temperature))
        humidity = max(50, min(90, humidity))
        
        return round(temperature, 1), round(humidity, 1)

    def calculate_outbreak_risk(self, temp, humidity):
        """Calculate outbreak risk based on multiple factors"""
        risk_score = 0.0
        
        # Disease detection factor (60% weight)
        recent_coryza = self.detection_count['coryza']
        recent_crd = self.detection_count['crd']
        total_diseases = recent_coryza + recent_crd
        
        if total_diseases >= 5:
            risk_score += 0.6
        elif total_diseases >= 3:
            risk_score += 0.4
        elif total_diseases >= 1:
            risk_score += 0.2
        
        # Environmental stress (30% weight)
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
        
        # Time-based factor (10% weight)
        hour = datetime.now().hour
        if 8 <= hour <= 18:
            risk_score += 0.1
        
        # Add controlled randomness for demo variety
        risk_score += random.uniform(-0.05, 0.05)
        
        return max(0.0, min(1.0, risk_score))

    def detect_diseases(self, frame):
        """Run YOLO detection"""
        try:
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
            
            annotated_frame = results[0].plot() if detections else frame
            return detections, annotated_frame
            
        except Exception as e:
            logger.error(f"Detection error: {e}")
            return [], frame

    def upload_image_to_supabase(self, image, disease_type, confidence):
        """Upload image to Supabase storage and return public URL"""
        if not self.supabase:
            return None, None
        
        try:
            # Generate unique filename
            timestamp = datetime.now()
            filename = f"{timestamp.strftime('%Y%m%d_%H%M%S')}_{disease_type}_{confidence:.2f}_{int(time.time())}.jpg"
            
            # Convert image to bytes
            _, buffer = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 90])
            image_bytes = buffer.tobytes()
            
            # Upload to Supabase storage
            response = self.supabase.storage.from_(self.bucket_name).upload(
                filename, 
                image_bytes,
                {
                    "content-type": "image/jpeg",
                    "cache-control": "3600"  # Cache for 1 hour
                }
            )
            
            if response.path:
                # Get public URL
                public_url = self.supabase.storage.from_(self.bucket_name).get_public_url(filename)
                logger.info(f"📤 Image uploaded: {filename}")
                return filename, public_url
            else:
                logger.error(f" Upload failed: {response}")
                return None, None
                
        except Exception as e:
            logger.error(f" Image upload error: {e}")
            return None, None

    def save_detection_image_locally(self, image, disease_type, confidence):
        """Save image locally as backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"detection_{disease_type}_{confidence:.2f}_{timestamp}.jpg"
        filepath = f"detections/images/{filename}"
        cv2.imwrite(filepath, image)
        return filepath

    def push_to_supabase(self, data):
        """Push data to Supabase database"""
        if not self.supabase:
            logger.warning("Supabase not available - data saved locally only")
            return False
        
        try:
            response = self.supabase.table('chicken_monitoring').insert(data).execute()
            if response.data:
                logger.info(" Data pushed to Supabase successfully")
                return True
            else:
                logger.error(f" Database insert failed: {response}")
                return False
                
        except Exception as e:
            logger.error(f" Supabase push error: {e}")
            return False

    def update_detection_counts(self, detections):
        """Update detection counts with periodic reset"""
        current_time = datetime.now()
        
        # Reset counts every 5 minutes
        if (current_time - self.last_reset).seconds > 300:
            self.detection_count = {'coryza': 0, 'crd': 0, 'normal': 0}
            self.last_reset = current_time
            logger.info(" Detection counts reset")
        
        # Add new detections
        for detection in detections:
            disease = detection['disease']
            if disease in self.detection_count:
                self.detection_count[disease] += 1

    def run_detection_cycle(self):
        """Main detection cycle with improved error handling"""
        try:
            # Capture frame using the working method
            ret, frame = self.cap.read()
            if not ret:
                logger.error(" Failed to capture frame")
                return None, 0
            
            # Get environmental data
            temperature, humidity = self.simulate_realistic_environment()
            
            # Run detection
            detections, annotated_frame = self.detect_diseases(frame)
            
            # Update counts
            self.update_detection_counts(detections)
            
            # Calculate risk
            outbreak_risk = self.calculate_outbreak_risk(temperature, humidity)
            
            # Prepare base data
            timestamp = datetime.now().isoformat()
            
            base_data = {
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
                'risk_level': self._get_risk_level(outbreak_risk),
                'alert_message': self._generate_alert_message(outbreak_risk, detections)
            }
            
            # Process individual detections
            for detection in detections:
                if detection['disease'] in ['coryza', 'crd']:  # Only save disease detections
                    
                    # Save image locally first (always works)
                    local_path = self.save_detection_image_locally(
                        annotated_frame, detection['disease'], detection['confidence']
                    )
                    
                    # Try to upload to Supabase
                    supabase_filename, public_url = self.upload_image_to_supabase(
                        annotated_frame, detection['disease'], detection['confidence']
                    )
                    
                    # Prepare detection record
                    detection_data = {
                        **base_data,
                        'detected_disease': detection['disease'],
                        'confidence': detection['confidence'],
                        'image_path': local_path,
                        'image_url': public_url,
                        'detection_id': f"{detection['disease']}_{int(time.time())}"
                    }
                    
                    # Push to database
                    self.push_to_supabase(detection_data)
            
            # Always push summary data
            # self.push_to_supabase(base_data)
            
            # Console output
            self._print_status(base_data, detections)
            
            return annotated_frame, len(detections)
            
        except Exception as e:
            logger.error(f" Detection cycle error: {e}")
            return None, 0

    def _get_risk_level(self, risk_value):
        """Convert numeric risk to level"""
        if risk_value > 0.8:
            return 'CRITICAL'
        elif risk_value > 0.6:
            return 'HIGH'
        elif risk_value > 0.3:
            return 'MEDIUM'
        else:
            return 'LOW'

    def _generate_alert_message(self, risk_level, detections):
        """Generate appropriate alert messages"""
        if risk_level > 0.8:
            return "CRITICAL: Immediate veterinary attention required!"
        elif risk_level > 0.6:
            return "HIGH RISK: Monitor closely and consider preventive measures"
        elif risk_level > 0.3:
            return "MODERATE: Watch for symptoms and maintain good hygiene"
        elif len(detections) > 0:
            return "DETECTED: Diseases found but risk is currently low"
        else:
            return " ALL CLEAR: No diseases detected, conditions normal"

    def _print_status(self, data, detections):
        """Print colorful status for demo"""
        print("\n" + "="*70)
        print(f"🐓 CHICKEN HEALTH MONITORING - {datetime.now().strftime('%H:%M:%S')} 🐓")
        print("="*70)
        print(f"Temperature: {data['temperature']}°C")
        print(f"Humidity: {data['humidity']}%")
        print(f" Current Frame: Coryza({data['coryza_detected']}) | CRD({data['crd_detected']}) | Normal({data['normal_detected']})")
        print(f"total Counts: Coryza({data['total_coryza_count']}) | CRD({data['total_crd_count']}) | Normal({data['total_normal_count']})")
        print(f"⚡ Outbreak Risk: {data['outbreak_risk']*100:.1f}% ({data['risk_level']})")
        print(f"Status: {data['alert_message']}")
        
        if detections:
            print("Current Detections:")
            for i, det in enumerate(detections, 1):
                confidence_emoji = "" if det['confidence'] > 0.8 else "" if det['confidence'] > 0.6 else ""
                print(f"   {i}. {confidence_emoji} {det['disease'].upper()} (confidence: {det['confidence']:.2f})")
        print("="*70)

    def run(self):
        """Main demo loop with improved UI"""
        print("\n Starting Hackathon MVP Demo...")
        print("Controls:")
        print("   • Press 'q' to quit")
        print("   • Press 's' to save screenshot")
        print("   • Press 'r' to reset detection counts")
        print("   • Press 'i' to show system info")
        
        last_detection_time = time.time()
        
        try:
            while True:
                self.frame_count += 1
                
                # Run detection cycle
                if (self.frame_count % self.frame_skip == 0) or (time.time() - last_detection_time > 10):
                    result = self.run_detection_cycle()
                    if result[0] is not None:
                        processed_frame, detection_count = result
                        display_frame = processed_frame
                        last_detection_time = time.time()
                    else:
                        # Fallback to camera feed
                        ret, display_frame = self.cap.read()
                        if not ret:
                            logger.error(" Camera feed lost!")
                            break
                else:
                    # Show live camera feed
                    ret, display_frame = self.cap.read()
                    if not ret:
                        logger.error(" Camera feed lost!")
                        break
                
                # Add UI elements to frame
                self._add_ui_overlay(display_frame)
                
                # Show frame
                cv2.imshow('Chicken Disease Detection MVP', display_frame)
                
                # Handle keyboard input
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    print("\n Stopping demo...")
                    break
                elif key == ord('s'):
                    screenshot_path = f'detections/screenshot_{int(time.time())}.jpg'
                    cv2.imwrite(screenshot_path, display_frame)
                    print(f"Screenshot saved: {screenshot_path}")
                elif key == ord('r'):
                    self.detection_count = {'coryza': 0, 'crd': 0, 'normal': 0}
                    self.last_reset = datetime.now()
                    print(" Detection counts manually reset!")
                elif key == ord('i'):
                    self._show_system_info()
                
                time.sleep(0.1)  # Small delay for stability
                
        except KeyboardInterrupt:
            print("\n Demo stopped by user")
        
        finally:
            self.cleanup()

    def _add_ui_overlay(self, frame):
        """Add informative overlay to the video frame"""
        height, width = frame.shape[:2]
        
        # Status bar background
        cv2.rectangle(frame, (0, 0), (width, 80), (0, 0, 0), -1)
        cv2.rectangle(frame, (0, height-60), (width, height), (0, 0, 0), -1)
        
        # Current time
        current_time = datetime.now().strftime('%H:%M:%S')
        cv2.putText(frame, f"Time: {current_time}", (10, 25), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        # Frame counter
        cv2.putText(frame, f"Frame: {self.frame_count}", (10, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        # Detection counts
        counts_text = f"Coryza:{self.detection_count['coryza']} CRD:{self.detection_count['crd']} Normal:{self.detection_count['normal']}"
        cv2.putText(frame, counts_text, (200, 25), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 255, 255), 1)
        
        # Connection status
        connection_status = "ONLINE" if self.supabase else "OFFLINE"
        cv2.putText(frame, f"Supabase: {connection_status}", (200, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0) if self.supabase else (0, 0, 255), 1)
        
        # Bottom info
        cv2.putText(frame, "Press 'q'=quit, 's'=screenshot, 'r'=reset, 'i'=info", 
                   (10, height-15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Hackathon branding
        cv2.putText(frame, "Hackathon MVP Demo", (10, height-35), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

    def _show_system_info(self):
        """Display system information"""
        print("\n" + "="*50)
        print("🔧 SYSTEM INFORMATION")
        print("="*50)
        print(f"Camera Status: {' Active' if self.cap.isOpened() else ' Inactive'}")
        print(f"Supabase Status: {' Connected' if self.supabase else ' Disconnected'}")
        print(f"Model: YOLO with classes {self.class_names}")
        print(f"Confidence Threshold: {self.confidence_threshold}")
        print(f"Frame Skip: {self.frame_skip}")
        print(f"Local Storage: detections/")
        if self.supabase:
            print(f"Cloud Storage: {self.bucket_name}")
            print(f"Supabase URL: {self.supabase_url}")
        print(f"Last Reset: {self.last_reset.strftime('%H:%M:%S')}")
        print("="*50)

    def cleanup(self):
        """Clean up resources properly"""
        print("🧹 Cleaning up resources...")
        
        if hasattr(self, 'cap') and self.cap:
            self.cap.release()
            print(" Camera released")
        
        cv2.destroyAllWindows()
        print(" Windows closed")
        
        # Final summary
        total_detections = sum(self.detection_count.values())
        print(f"Final Statistics:")
        print(f"   Total Detections: {total_detections}")
        print(f"   Coryza: {self.detection_count['coryza']}")
        print(f"   CRD: {self.detection_count['crd']}")
        print(f"   Normal: {self.detection_count['normal']}")
        print(" Cleanup complete!")

    def get_detection_summary(self):
        """Get current detection summary for external use"""
        return {
            'timestamp': datetime.now().isoformat(),
            'detection_count': self.detection_count.copy(),
            'total_detections': sum(self.detection_count.values()),
            'supabase_connected': self.supabase is not None,
            'frame_count': self.frame_count
        }

# Enhanced Quick Start for Hackathon
if __name__ == "__main__":
    print("\n" + "="*60)
    print(" HACKATHON MVP - Chicken Disease Detection System")
    print("="*60)
    print("Features:")
    print("   • Real-time disease detection (Coryza, CRD, Normal)")
    print("   • Environmental monitoring simulation")
    print("   • Outbreak risk assessment")
    print("   • Cloud storage with Supabase")
    print("   • Local backup storage")
    print("="*60)
    
    # Configuration - UPDATE THESE WITH YOUR CREDENTIALS
    SUPABASE_URL = "https://adeyewwecyvakdnrtqfm.supabase.co"  # Replace with your URL
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZXlld3dlY3l2YWtkbnJ0cWZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg4NDIwNywiZXhwIjoyMDc0NDYwMjA3fQ.pwjW1BD-3yJYq6SL4uERQpS3nXW5rw3EZsOoASwRRvU"  # Replace with your service role key
    
    # Pre-flight checks
    print("\nPre-flight checks:")
    
    # Check model file
    model_path = 'chick.pt'
    if os.path.exists(model_path):
        print(f" Model file found: {model_path}")
    else:
        print(f" Model file not found: {model_path}")
        print("Please ensure your YOLO model file is in the current directory")
        exit(1)
    
    # Check camera availability (using the working method)
    test_cap = cv2.VideoCapture(0)
    if test_cap.isOpened():
        print(" Camera detected")
        test_cap.release()
    else:
        print(" No camera detected - please connect a camera")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            exit(1)
    
    print("\nStarting system...")
    
    # Initialize and run
    try:
        detector = HackathonChickenDetector(
            model_path=model_path,
            supabase_url=SUPABASE_URL,
            supabase_key=SUPABASE_KEY
        )
        
        print("\nSystem ready! Starting detection...")
        detector.run()
        
    except KeyboardInterrupt:
        print("\nSystem stopped by user")
    except Exception as e:
        print(f"\n System error: {e}")
        print("🔧 Check your setup and try again")
    finally:
        print("🙏 Thank you for using the Chicken Disease Detection MVP!")