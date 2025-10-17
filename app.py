from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import base64
import io
from PIL import Image
import os
import threading
import time
from config import SAFETY_OBJECTS, DISPLAY_NAMES, CONFIDENCE_THRESHOLD, CRITICAL_OBJECTS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'orbital_guard_secret'
CORS(app, origins=["http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000"])

class SpaceStationYOLODetector:
    def __init__(self):
        self.model = None
        self.safety_objects = SAFETY_OBJECTS
        self.display_names = DISPLAY_NAMES
        self.confidence_threshold = CONFIDENCE_THRESHOLD
        self.critical_objects = CRITICAL_OBJECTS
        self.detection_active = False
        self.load_model()
        
    def load_model(self):
        """Load the trained YOLO model"""
        model_path = "models/space_station_safety.pt"
        
        if os.path.exists(model_path):
            try:
                self.model = YOLO(model_path)
                print(f"✅ Model loaded from {model_path}")
                return True
            except Exception as e:
                print(f"❌ Error loading custom model: {e}")
        
        # Fallback to pretrained model for demo
        try:
            self.model = YOLO('yolov8n.pt')
            print("⚠️ Using pretrained YOLOv8n for demo (replace with your trained model)")
            return True
        except Exception as e:
            print(f"❌ Error loading fallback model: {e}")
            return False
    
    def detect_objects(self, image):
        """Detect safety objects in image"""
        if self.model is None:
            return []
        
        try:
            results = self.model(image, conf=self.confidence_threshold)
            detections = []
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        # Get detection data
                        cls_id = int(box.cls[0])
                        confidence = float(box.conf[0])
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        
                        # Map class ID to object name
                        object_name = self.safety_objects.get(cls_id, f'Unknown_{cls_id}')
                        display_name = self.display_names.get(object_name, object_name)
                        
                        detection = {
                            'object': object_name,
                            'display_name': display_name,
                            'confidence': f"{confidence:.2f}",
                            'bbox': {
                                'x': float(x1),
                                'y': float(y1),
                                'width': float(x2 - x1),
                                'height': float(y2 - y1)
                            },
                            'status': 'detected'
                        }
                        detections.append(detection)
            
            return detections
            
        except Exception as e:
            print(f"Detection error: {e}")
            return []
    
    def generate_alerts(self, detections):
        """Generate alerts for missing critical objects"""
        alerts = []
        detected_objects = [d['object'] for d in detections]
        
        for critical_obj in self.critical_objects:
            if critical_obj not in detected_objects:
                alert = {
                    'id': f"alert_{critical_obj}_{int(time.time())}",
                    'message': f"{self.display_names.get(critical_obj, critical_obj)} not detected!",
                    'severity': 'critical',
                    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'object': critical_obj
                }
                alerts.append(alert)
        
        return alerts

# Initialize detector
detector = SpaceStationYOLODetector()

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    return jsonify({
        'status': 'operational',
        'model_loaded': detector.model is not None,
        'detection_active': detector.detection_active,
        'total_classes': len(detector.safety_objects),
        'critical_objects': len(detector.critical_objects)
    })

@app.route('/api/upload_detection', methods=['POST'])
def upload_detection():
    """Process uploaded image for detection"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Perform detection
        detections = detector.detect_objects(image_cv)
        alerts = detector.generate_alerts(detections)
        
        return jsonify({
            'detections': detections,
            'alerts': alerts,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@socketio.on('start_detection')
def handle_start_detection():
    """Start continuous detection"""
    detector.detection_active = True
    emit('detection_started', {'status': 'Detection started'})
    print("🎯 Detection started")

@socketio.on('stop_detection')
def handle_stop_detection():
    """Stop continuous detection"""
    detector.detection_active = False
    emit('detection_stopped', {'status': 'Detection stopped'})
    print("🛑 Detection stopped")

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('🔌 Client connected')
    emit('connected', {
        'status': 'Connected to Space Station Safety Monitor',
        'objects': list(detector.display_names.values())
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('🔌 Client disconnected')

def continuous_detection_loop():
    """Background thread for continuous detection (when camera is available)"""
    while True:
        if detector.detection_active:
            try:
                # This would be replaced with actual camera feed processing
                # For now, we'll emit demo data
                demo_detections = [
                    {
                        'object': 'FireExtinguisher',
                        'display_name': '🧯 Fire Extinguisher',
                        'confidence': '0.95',
                        'bbox': {'x': 100, 'y': 150, 'width': 80, 'height': 120},
                        'status': 'detected'
                    },
                    {
                        'object': 'FirstAidBox',
                        'display_name': '🩹 First Aid Box',
                        'confidence': '0.87',
                        'bbox': {'x': 300, 'y': 200, 'width': 90, 'height': 60},
                        'status': 'detected'
                    }
                ]
                
                alerts = detector.generate_alerts(demo_detections)
                
                socketio.emit('detection_result', {
                    'detections': demo_detections,
                    'alerts': alerts,
                    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
                })
                
            except Exception as e:
                print(f"Detection loop error: {e}")
        
        time.sleep(2)  # Detection interval

# Start background detection thread
detection_thread = threading.Thread(target=continuous_detection_loop, daemon=True)
detection_thread.start()

if __name__ == '__main__':
    # Ensure models directory exists
    os.makedirs('models', exist_ok=True)
    
    print("🚀 Starting Space Station Safety Monitor Backend...")
    print(f"📊 Monitoring {len(detector.safety_objects)} safety object classes")
    print(f"🚨 {len(detector.critical_objects)} critical objects configured")
    print("🌐 Server starting on http://localhost:5000")
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)