#!/usr/bin/env python3
"""
🚀 Space Station Safety Monitor - Local Training Script
Based on your 70.ipynb implementation

This script replicates your Colab training setup for local execution.
"""

import os
import yaml
import urllib.request
from ultralytics import YOLO
from config import SAFETY_OBJECTS, TRAINING_CONFIG

def create_dataset_config():
    """Create dataset YAML config matching your implementation"""
    
    # Your exact configuration from 70.ipynb
    data_yaml_content = {
        'train': './dataset/train/images',
        'val': './dataset/val/images', 
        'test': './dataset/test/images',
        'nc': 7,
        'names': ['OxygenTank', 'NitrogenTank', 'FirstAidBox', 'FireAlarm',
                  'SafetySwitchPanel', 'EmergencyPhone', 'FireExtinguisher']
    }
    
    # Create dataset directory structure
    os.makedirs('./dataset/train/images', exist_ok=True)
    os.makedirs('./dataset/train/labels', exist_ok=True)
    os.makedirs('./dataset/val/images', exist_ok=True)
    os.makedirs('./dataset/val/labels', exist_ok=True)
    os.makedirs('./dataset/test/images', exist_ok=True)
    os.makedirs('./dataset/test/labels', exist_ok=True)
    
    # Save YAML config
    data_yaml_path = "./dataset/data.yaml"
    with open(data_yaml_path, "w") as f:
        yaml.dump(data_yaml_content, f)
    
    print(f"✅ Dataset config created at {data_yaml_path}")
    return data_yaml_path

def download_pretrained_weights():
    """Download YOLOv8m weights as in your notebook"""
    weights_path = "yolov8m.pt"
    
    if not os.path.exists(weights_path):
        print("📥 Downloading YOLOv8m pretrained weights...")
        url = "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8m.pt"
        urllib.request.urlretrieve(url, weights_path)
        print("✅ Pretrained YOLOv8m weights downloaded")
    else:
        print("✅ YOLOv8m weights already exist")
    
    return weights_path

def train_model(data_yaml_path, weights_path):
    """Train the model with your exact configuration"""
    
    print("🎯 Initializing YOLO model...")
    model = YOLO(weights_path)
    
    print("🚀 Starting training with your configuration...")
    print(f"   📊 Epochs: {TRAINING_CONFIG['epochs']}")
    print(f"   📦 Batch size: {TRAINING_CONFIG['batch']}")
    print(f"   🖼️ Image size: {TRAINING_CONFIG['imgsz']}")
    print(f"   🎨 Mosaic: {TRAINING_CONFIG['mosaic']}")
    print(f"   🔄 Mixup: {TRAINING_CONFIG['mixup']}")
    
    # Train with your exact parameters from 70.ipynb
    results = model.train(
        data=data_yaml_path,
        epochs=TRAINING_CONFIG['epochs'],
        batch=TRAINING_CONFIG['batch'],
        imgsz=TRAINING_CONFIG['imgsz'],
        augment=TRAINING_CONFIG['augment'],
        mosaic=TRAINING_CONFIG['mosaic'],
        mixup=TRAINING_CONFIG['mixup'],
        lr0=TRAINING_CONFIG['lr0'],
        lrf=TRAINING_CONFIG['lrf'],
        patience=TRAINING_CONFIG['patience'],
        flipud=0.5,
        fliplr=0.5,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        box=7.5,
        save_period=1,
        cache=TRAINING_CONFIG['cache'],
        workers=TRAINING_CONFIG['workers'],
        device=0 if os.environ.get('CUDA_VISIBLE_DEVICES') else 'cpu'
    )
    
    print("✅ Training completed!")
    return results

def validate_model(model_path, data_yaml_path):
    """Validate the trained model"""
    print("🔍 Validating trained model...")
    
    model = YOLO(model_path)
    metrics = model.val(
        data=data_yaml_path, 
        batch=TRAINING_CONFIG['batch'], 
        imgsz=TRAINING_CONFIG['imgsz']
    )
    
    print("✅ Validation completed!")
    print(f"📊 Validation metrics: {metrics}")
    return metrics

def copy_best_model():
    """Copy the best trained model to the models directory"""
    
    # Find the latest training run
    runs_dir = "runs/detect"
    if os.path.exists(runs_dir):
        train_dirs = [d for d in os.listdir(runs_dir) if d.startswith('train')]
        if train_dirs:
            latest_train = sorted(train_dirs)[-1]
            best_model_path = os.path.join(runs_dir, latest_train, "weights", "best.pt")
            
            if os.path.exists(best_model_path):
                # Create models directory and copy
                os.makedirs("models", exist_ok=True)
                import shutil
                shutil.copy2(best_model_path, "models/space_station_safety.pt")
                print(f"✅ Best model copied to models/space_station_safety.pt")
                return "models/space_station_safety.pt"
    
    print("❌ Could not find trained model")
    return None

def main():
    """Main training pipeline"""
    print("🚀 Space Station Safety Monitor - Training Pipeline")
    print("=" * 60)
    
    # Step 1: Create dataset configuration
    print("\n📋 Step 1: Creating dataset configuration...")
    data_yaml_path = create_dataset_config()
    
    # Step 2: Download pretrained weights
    print("\n📥 Step 2: Preparing pretrained weights...")
    weights_path = download_pretrained_weights()
    
    # Check if dataset exists
    if not os.path.exists('./dataset/train/images'):
        print("\n⚠️ Warning: No training images found!")
        print("Please extract your training data to ./dataset/")
        print("Expected structure:")
        print("  dataset/")
        print("    ├── train/")
        print("    │   ├── images/")
        print("    │   └── labels/")
        print("    ├── val/")
        print("    │   ├── images/")
        print("    │   └── labels/")
        print("    └── test/")
        print("        ├── images/")
        print("        └── labels/")
        return
    
    # Step 3: Train the model
    print("\n🎯 Step 3: Training the model...")
    try:
        results = train_model(data_yaml_path, weights_path)
        
        # Step 4: Validate the model
        print("\n🔍 Step 4: Validating the model...")
        best_model_path = copy_best_model()
        
        if best_model_path:
            validate_model(best_model_path, data_yaml_path)
            
            print("\n🎉 Training pipeline completed successfully!")
            print(f"📍 Trained model saved to: {best_model_path}")
            print("\n🚀 You can now use this model with your Flask backend!")
            
        else:
            print("\n❌ Training completed but could not locate best model")
            
    except Exception as e:
        print(f"\n❌ Training failed: {e}")
        print("💡 Make sure you have:")
        print("  - Sufficient disk space")
        print("  - GPU drivers installed (for faster training)")
        print("  - Training data in the correct format")

if __name__ == "__main__":
    main()