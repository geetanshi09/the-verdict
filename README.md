# Orbital Guardian - Space Station Safety Monitor

A comprehensive intelligent object detection system using YOLO to monitor critical safety equipment in space station environments. Built with React frontend and Python Flask backend, designed to work with Duality AI's Falcon digital twin synthetic data.

## 🚀 Features

- **Real-time Object Detection**: YOLO-powered detection of 7 critical safety objects
- **Space Station Theme**: Modern dark UI with sci-fi aesthetics  
- **Live Camera Feed**: Real-time monitoring with WebSocket integration
- **Alert System**: Automated alerts for missing/misplaced equipment
- **Dashboard Analytics**: Detection trends and system status monitoring
- **File Upload**: Process images/videos for detection analysis
- **Falcon Integration**: Designed for Duality AI's synthetic training data

## 🎯 Monitored Safety Objects

1. Fire Extinguisher
2. Emergency Oxygen Mask
3. First Aid Kit
4. Emergency Tool Kit
5. Radiation Detector
6. Emergency Communication Device
7. Backup Power Supply

## 🛠 Technology Stack

**Frontend**:
- React 18
- Framer Motion (animations)
- Socket.io Client (WebSocket)
- Recharts (analytics)
- Lucide React (icons)

**Backend**:
- Python Flask + SocketIO
- YOLOv8 (Ultralytics)
- OpenCV
- NumPy, Pillow

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Webcam (for live detection)

### 1. Clone and Install Frontend
```powershell
# Navigate to project directory
cd the-verdict

# Install React dependencies
npm install

# Start development server
npm start
```

### 2. Setup Python Backend
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Setup dataset structure for training
python train_model.py

# Start backend server
python app.py
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- WebSocket: ws://localhost:5000

## 🎓 Training Your Model

### Using Duality AI's Falcon Data

1. **Export synthetic data** from Falcon digital twin:
   - High-quality images with varying lighting
   - Different angles and orientations
   - Occlusions and complex backgrounds
   - Missing/misplaced safety equipment scenarios

2. **Prepare dataset structure**:
   ```
   backend/dataset/
   ├── train/
   │   ├── images/     # Training images
   │   └── labels/     # YOLO format annotations
   ├── val/
   │   ├── images/     # Validation images
   │   └── labels/     # YOLO format annotations
   └── test/
       ├── images/     # Test images
       └── labels/     # YOLO format annotations
   ```

3. **Create YOLO annotations** (one .txt file per image):
   ```
   # Format: class_id center_x center_y width height (normalized 0-1)
   0 0.5 0.5 0.2 0.2  # Fire extinguisher at center
   1 0.2 0.3 0.15 0.1 # Emergency mask in upper left
   ```

4. **Train the model**:
   ```powershell
   cd backend
   python train_model.py --train
   ```

5. **Validate performance**:
   ```powershell
   python train_model.py --validate
   ```

## 🔧 API Endpoints

- `GET /api/status` - System status and statistics
- `GET /api/detection_history` - Recent detection data
- `POST /upload_detection` - Upload image/video for analysis

## 🌐 WebSocket Events

**Client → Server**:
- `start_detection` - Begin live camera detection
- `stop_detection` - Stop live detection

**Server → Client**:
- `detection_result` - Real-time detection results
- `status` - System status updates

## 🎨 UI Components

### Dashboard
- System statistics and metrics
- Detection trends visualization
- Recent alerts panel
- Critical objects monitoring

### Live Detection
- Real-time camera feed
- Object detection overlays
- Control panel
- Alert notifications

## 🚀 Deployment

### Docker Setup (Coming Soon)
```powershell
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build React app: `npm run build`
2. Configure backend for production
3. Set up reverse proxy (nginx)
4. Deploy to cloud platform

## 🔬 Continuous Learning

The system supports continuous learning with new Falcon data:

1. **Monitor model performance** on new conditions
2. **Collect new synthetic data** from Falcon
3. **Retrain model** when accuracy drops
4. **Deploy updated model** automatically

## 🛡 Safety & Compliance

- **Audit Trail**: All detections logged with timestamps
- **Alert System**: Critical safety failures trigger immediate alerts
- **Performance Monitoring**: Real-time system health tracking
- **Backup Systems**: Redundant safety monitoring

## 📈 Performance Optimization

- **Model Quantization**: Faster inference on edge devices
- **Batch Processing**: Efficient handling of multiple frames
- **Caching**: Optimized model loading and memory usage
- **Multi-threading**: Concurrent detection processing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add comprehensive tests
4. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Check the troubleshooting guide in `falcon_integration_guide.md`
- Review API documentation
- Contact the development team

---

**Built for space station safety monitoring with ❤️ and cutting-edge AI**

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
