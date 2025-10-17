import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  Camera, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Upload
} from 'lucide-react';

const ObjectDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const videoRef = useRef(null);

  const criticalObjects = [
    '🫁 Oxygen Tank',
    '🧪 Nitrogen Tank',
    '🩹 First Aid Box',
    '🚨 Fire Alarm',
    '⚡ Safety Switch Panel',
    '📞 Emergency Phone',
    '🧯 Fire Extinguisher'
  ];

  // Demo mode - simulate detections
  useEffect(() => {
    if (isDetecting) {
      const interval = setInterval(() => {
        // Simulate random detections for demo
        const mockDetections = [
          { 
            object: criticalObjects[Math.floor(Math.random() * criticalObjects.length)],
            confidence: (0.8 + Math.random() * 0.2).toFixed(2),
            bbox: { x: Math.random() * 400, y: Math.random() * 300, w: 50 + Math.random() * 100, h: 50 + Math.random() * 100 },
            status: Math.random() > 0.3 ? 'detected' : 'missing'
          },
          { 
            object: criticalObjects[Math.floor(Math.random() * criticalObjects.length)],
            confidence: (0.7 + Math.random() * 0.3).toFixed(2),
            bbox: { x: Math.random() * 400, y: Math.random() * 300, w: 50 + Math.random() * 100, h: 50 + Math.random() * 100 },
            status: Math.random() > 0.2 ? 'detected' : 'misplaced'
          }
        ];
        
        setDetections(mockDetections);
        
        // Add alerts for missing/misplaced items
        const newAlerts = mockDetections
          .filter(d => d.status !== 'detected')
          .map(d => ({
            id: Date.now() + Math.random(),
            message: `${d.object} is ${d.status}!`,
            severity: d.status === 'missing' ? 'critical' : 'warning',
            timestamp: new Date().toISOString()
          }));
          
        if (newAlerts.length > 0) {
          setAlerts(prev => [...prev, ...newAlerts].slice(-10));
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isDetecting]);

  const startDetection = async () => {
    try {
      setIsDetecting(true);
      setCameraActive(true);
      
      // Start camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Send start signal to backend
      if (socketRef.current) {
        socketRef.current.emit('start_detection');
      }
    } catch (error) {
      console.error('Error starting detection:', error);
      setIsDetecting(false);
      setCameraActive(false);
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setCameraActive(false);
    
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Demo mode - simulate detection results
      setTimeout(() => {
        const mockFileDetections = [
          { 
            object: 'Fire Extinguisher',
            confidence: '0.95',
            bbox: { x: 120, y: 80, w: 100, h: 150 },
            status: 'detected'
          },
          { 
            object: 'First Aid Kit',
            confidence: '0.88',
            bbox: { x: 300, y: 200, w: 80, h: 60 },
            status: 'detected'
          },
          { 
            object: 'Emergency Oxygen Mask',
            confidence: '0.00',
            bbox: null,
            status: 'missing'
          }
        ];
        
        setDetections(mockFileDetections);
        
        const fileAlerts = mockFileDetections
          .filter(d => d.status !== 'detected')
          .map(d => ({
            id: Date.now() + Math.random(),
            message: `${d.object} not detected in uploaded image!`,
            severity: 'critical',
            timestamp: new Date().toISOString()
          }));
          
        if (fileAlerts.length > 0) {
          setAlerts(prev => [...prev, ...fileAlerts].slice(-10));
        }
      }, 1500);
    }
  };

  const renderDetectionBoxes = () => {
    if (!detections || detections.length === 0) return null;

    return detections.map((detection, index) => (
      <div
        key={index}
        className="detection-box"
        style={{
          left: `${detection.x}%`,
          top: `${detection.y}%`,
          width: `${detection.width}%`,
          height: `${detection.height}%`,
          borderColor: detection.confidence > 0.8 ? 'var(--accent-green)' : 'var(--accent-orange)'
        }}
      >
        <div 
          className="detection-label"
          style={{
            backgroundColor: detection.confidence > 0.8 ? 'var(--accent-green)' : 'var(--accent-orange)'
          }}
        >
          {detection.class} ({(detection.confidence * 100).toFixed(1)}%)
        </div>
      </div>
    ));
  };

  return (
    <div className="object-detection">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="dashboard-title">Live Object Detection</h1>
        <p className="dashboard-subtitle">
          Real-time YOLO-powered detection of critical safety equipment in space station environments
        </p>
      </motion.div>

      <div className="detection-grid">
        <motion.div 
          className="video-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="video-feed">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  autoPlay
                  muted
                />
                <div className="detection-overlay">
                  {renderDetectionBoxes()}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Camera size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <div>Camera Feed Inactive</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                  Click "Start Detection" to begin monitoring
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="controls-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>
            <Settings style={{ display: 'inline', marginRight: '0.5rem' }} />
            Detection Controls
          </h3>

          {!isDetecting ? (
            <button className="control-button" onClick={startDetection}>
              <Play style={{ display: 'inline', marginRight: '0.5rem' }} />
              Start Detection
            </button>
          ) : (
            <button className="control-button stop" onClick={stopDetection}>
              <Square style={{ display: 'inline', marginRight: '0.5rem' }} />
              Stop Detection
            </button>
          )}

          <div style={{ margin: '1.5rem 0' }}>
            <label className="control-button" style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}>
              <Upload style={{ display: 'inline', marginRight: '0.5rem' }} />
              Upload Image/Video
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {selectedFile && (
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(0, 212, 255, 0.1)', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              Selected: {selectedFile.name}
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--accent-green)' }}>
              <CheckCircle style={{ display: 'inline', marginRight: '0.5rem' }} />
              Monitored Objects
            </h4>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              {criticalObjects.map((obj, index) => (
                <div key={index} style={{ 
                  padding: '0.25rem 0', 
                  borderBottom: index < criticalObjects.length - 1 ? '1px solid var(--border-color)' : 'none' 
                }}>
                  {obj}
                </div>
              ))}
            </div>
          </div>

          <div className="alerts-panel">
            <h4 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>
              <AlertTriangle style={{ display: 'inline', marginRight: '0.5rem' }} />
              Live Alerts
            </h4>
            {alerts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem',
                padding: '1rem'
              }}>
                No active alerts
              </div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {alerts.map((alert, index) => (
                  <div key={index} className="alert-item">
                    <AlertTriangle className="alert-icon" />
                    <div className="alert-text">
                      <div style={{ fontWeight: 600 }}>{alert.type}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        {alert.message} • {alert.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ObjectDetection;