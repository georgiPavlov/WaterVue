# 🐳 Complete Containerized WaterPlant System Guide

This guide explains how to run the entire WaterPlant system using containers with podman-compose.

## 📋 Prerequisites

- **Podman**: Container runtime
- **podman-compose**: Container orchestration
- **Git**: For cloning repositories

### Installation (macOS)
```bash
# Install Podman
brew install podman

# Install podman-compose
pip install podman-compose
```

## 🏗️ System Architecture

The system consists of 3 containerized components:

1. **WaterPlantApp** (Django Backend) - Port 8001
2. **WaterPlantOperator** (Raspberry Pi Simulator) - Port 8000  
3. **WaterVue** (Vue.js Frontend) - Port 3000

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)
```bash
cd WaterVue
./start_all_containers.sh
```

### Option 2: Manual Container Startup
```bash
# 1. Create shared network
podman network create waterplant-network

# 2. Start WaterPlantApp
cd WaterPlantApp
podman-compose up -d --build

# 3. Start WaterPlantOperator  
cd ../WaterPlantOperator
podman-compose up -d --build

# 4. Start WaterVue
cd ../WaterVue
podman-compose up -d --build
```

## 🔧 Container Details

### WaterPlantApp Container
- **Image**: `python:3.9-slim`
- **Port**: 8001
- **Features**: Django REST API, JWT Authentication, SQLite Database
- **Health Check**: `http://localhost:8001/admin/`

### WaterPlantOperator Container  
- **Image**: `python:3.9-slim`
- **Port**: 8000
- **Features**: Mock Hardware, Flask API, Data Pushing
- **Health Check**: `http://localhost:8000/health`

### WaterVue Container
- **Image**: `node:18-alpine`
- **Port**: 3000
- **Features**: Vue.js Frontend, Vite Dev Server
- **Health Check**: `http://localhost:3000/`

## 🌐 Access Points

Once all containers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Operator API**: http://localhost:8000
- **Admin Interface**: http://localhost:8001/admin/

### Login Credentials
- **Username**: `testuser`
- **Password**: `testpass123`

## 📊 System Status

Check container status:
```bash
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## 🛑 Stopping the System

### Option 1: Automated Script
```bash
cd WaterVue
./stop_all_containers.sh
```

### Option 2: Manual Stop
```bash
# Stop all containers
cd WaterPlantApp && podman-compose down
cd ../WaterPlantOperator && podman-compose down  
cd ../WaterVue && podman-compose down

# Remove containers
podman rm waterplantapp watervue waterplant-operator 2>/dev/null || true
```

## 🔍 Troubleshooting

### Container Won't Start
1. Check if ports are available:
   ```bash
   lsof -i :3000 -i :8000 -i :8001
   ```

2. Check container logs:
   ```bash
   podman logs waterplantapp
   podman logs waterplant-operator
   podman logs watervue
   ```

### Network Issues
1. Recreate the network:
   ```bash
   podman network rm waterplant-network
   podman network create waterplant-network
   ```

### Database Issues
1. Reset the database:
   ```bash
   cd WaterPlantApp
   podman exec waterplantapp python3 pycharmtut/manage.py migrate
   podman exec waterplantapp python3 create_production_user.py
   ```

## 📁 File Structure

```
WaterPlantApp/
├── Dockerfile
├── podman-compose.yml
├── requirements.txt
└── ...

WaterPlantOperator/
├── Dockerfile  
├── podman-compose.yml
├── requirements.txt
└── ...

WaterVue/
├── Dockerfile
├── podman-compose.yml
├── start_all_containers.sh
├── stop_all_containers.sh
└── ...
```

## 🔄 Data Flow

1. **WaterPlantOperator** simulates Raspberry Pi hardware
2. **WaterPlantOperator** pushes sensor data to **WaterPlantApp** every 5 seconds
3. **WaterPlantApp** stores data in SQLite database
4. **WaterVue** frontend displays real-time data from **WaterPlantApp**

## 🎯 Key Features

- **Complete Isolation**: Each component runs in its own container
- **Automatic Health Checks**: Containers monitor their own health
- **Shared Network**: All containers communicate via `waterplant-network`
- **Persistent Data**: Database and logs are mounted as volumes
- **Easy Management**: Single script to start/stop entire system

## 📝 Development Notes

- Containers use development settings for easier debugging
- All containers restart automatically unless stopped
- Logs are available in each project's `logs/` directory
- Database is persisted in `WaterPlantApp/pycharmtut/db.sqlite3`

## 🚀 Production Considerations

For production deployment:
1. Use production Docker images
2. Configure proper secrets management
3. Set up reverse proxy (nginx)
4. Use external database (PostgreSQL)
5. Configure proper logging and monitoring
6. Set up SSL/TLS certificates

---

**🎉 Your containerized WaterPlant system is ready to use!**
