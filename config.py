# 🎯 Object Detection Classes Configuration

# Your trained model classes (from 70.ipynb)
SAFETY_OBJECTS = {
    0: 'OxygenTank',
    1: 'NitrogenTank', 
    2: 'FirstAidBox',
    3: 'FireAlarm',
    4: 'SafetySwitchPanel',
    5: 'EmergencyPhone',
    6: 'FireExtinguisher'
}

# Display names for frontend
DISPLAY_NAMES = {
    'OxygenTank': '🫁 Oxygen Tank',
    'NitrogenTank': '🧪 Nitrogen Tank',
    'FirstAidBox': '🩹 First Aid Box', 
    'FireAlarm': '🚨 Fire Alarm',
    'SafetySwitchPanel': '⚡ Safety Switch Panel',
    'EmergencyPhone': '📞 Emergency Phone',
    'FireExtinguisher': '🧯 Fire Extinguisher'
}

# Critical safety thresholds
CONFIDENCE_THRESHOLD = 0.25
CRITICAL_OBJECTS = ['OxygenTank', 'FirstAidBox', 'FireAlarm', 'EmergencyPhone', 'FireExtinguisher']

# Training configuration (from your notebook)
TRAINING_CONFIG = {
    'epochs': 30,
    'batch': 16,
    'imgsz': 640,
    'mosaic': 0.7,
    'mixup': 0.2,
    'lr0': 0.0003,
    'lrf': 0.01,
    'patience': 10,
    'augment': True,
    'cache': True,
    'workers': 4
}