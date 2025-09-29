# 🐳 Using Containerized WaterPlantOperator with WaterVue

## 📋 Overview

You can now use the containerized WaterPlantOperator as a backend for your WaterVue frontend application! The container provides all the necessary API endpoints that the Vue app expects.

---

## 🔧 Configuration

### **1. Vue App Configuration**

The WaterVue app has been configured to use the containerized operator:

**File**: `src/store/index.js`
```javascript
baseURL: 'http://localhost:8000', // WaterPlantOperator Container
```

### **2. Container Endpoints**

The containerized WaterPlantOperator now provides **Vue app compatible endpoints**:

| **Vue App Endpoint** | **Container Endpoint** | **Purpose** |
|---------------------|------------------------|-------------|
| `/gadget_communicator_pull/api/list_devices` | ✅ Available | List all devices |
| `/gadget_communicator_pull/api/create_device` | ✅ Available | Create new device |
| `/gadget_communicator_pull/api/delete_device/<id>` | ✅ Available | Delete device |
| `/gadget_communicator_pull/api/update_device` | ✅ Available | Update device |
| `/gadget_communicator_pull/api/list_device_charts/<id>` | ✅ Available | Get device charts |
| `/api-token-auth/` | ✅ Available | Authentication |

---

## 🚀 Quick Start

### **1. Start the Container**
```bash
cd /Users/I336317/SAPDevelop/projects/local/WaterPlantOperator
podman run -d --name waterplant-operator -p 8000:8000 \
  -v ./logs:/app/logs -v ./data:/app/data waterplant-operator
```

### **2. Start the Vue App**
```bash
cd /Users/I336317/SAPDevelop/projects/local/WaterVue
npm run dev
```

### **3. Access the Application**
- **Vue App**: http://localhost:3000
- **Container API**: http://localhost:8000

---

## 🔐 Authentication

The container provides **mock authentication** that accepts any credentials:

### **Login Credentials**
- **Username**: Any username (e.g., `testuser`)
- **Password**: Any password (e.g., `testpass`)

### **Authentication Flow**
1. Vue app sends login request to `/api-token-auth/`
2. Container returns mock JWT tokens
3. Vue app uses tokens for authenticated requests

---

## 📊 Available Data

### **Default Device**
The container provides a default device:
```json
{
    "device_id": "ab313658-5d84-47d6-a3f1-b609c0f1dd5e",
    "label": "Container Water Plant Device",
    "water_level": 75,
    "moisture_level": 45,
    "water_container_capacity": 2000,
    "send_email": true,
    "is_connected": true,
    "id": 1
}
```

### **Mock Data Features**
- ✅ **Device Management**: Create, read, update, delete devices
- ✅ **Water Charts**: Mock water level and moisture data
- ✅ **Authentication**: Mock JWT token system
- ✅ **Real-time Data**: Simulated sensor readings
- ✅ **Hardware Control**: Mock relay and camera control

---

## 🧪 Testing the Integration

### **1. Test Authentication**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  http://localhost:8000/api-token-auth/
```

### **2. Test Device Listing**
```bash
curl http://localhost:8000/gadget_communicator_pull/api/list_devices
```

### **3. Test Device Creation**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"device_id":"my-device","label":"My Plant","water_container_capacity":2000}' \
  http://localhost:8000/gadget_communicator_pull/api/create_device
```

---

## 🔄 Complete API Endpoints

### **Device Management**
- `GET /gadget_communicator_pull/api/list_devices` - List all devices
- `POST /gadget_communicator_pull/api/create_device` - Create device
- `DELETE /gadget_communicator_pull/api/delete_device/<id>` - Delete device
- `POST /gadget_communicator_pull/api/update_device` - Update device
- `GET /gadget_communicator_pull/api/list_device_charts/<id>` - Get charts

### **Authentication**
- `POST /api-token-auth/` - Get JWT tokens

### **Hardware Control**
- `GET /health` - Health check
- `GET /status` - System status
- `GET /sensors` - Sensor readings
- `GET/POST /relays` - Relay control
- `POST /camera/capture` - Take photo
- `POST /watering/start` - Start watering
- `POST /watering/stop` - Stop watering

### **Server Communicator Interface**
- `GET /getPlan` - Get watering plans
- `POST /postWater` - Send water level
- `POST /postMoisture` - Send moisture level
- `POST /postPhoto` - Upload photo
- `GET /getPhoto` - Get photo request
- `POST /postStatus` - Send execution status
- `GET /getWaterLevel` - Get water level request

---

## 🎯 Benefits of Using Containerized Operator

### **1. Complete Independence**
- ✅ No need for WaterPlantApp Django server
- ✅ Self-contained with all necessary endpoints
- ✅ Mock hardware simulation
- ✅ Complete API compatibility

### **2. Easy Development**
- ✅ Quick startup with single container
- ✅ Consistent environment
- ✅ No database setup required
- ✅ Mock authentication for testing

### **3. Full Feature Set**
- ✅ Device management
- ✅ Sensor data simulation
- ✅ Hardware control simulation
- ✅ Photo capture simulation
- ✅ Watering operation simulation

---

## 🔧 Customization

### **1. Change Device ID**
Edit `run/container_main.py`:
```python
DEVICE_GUID = 'your-custom-device-id'
```

### **2. Modify Mock Data**
Update the mock responses in the endpoint functions to return your desired data.

### **3. Add New Endpoints**
Add new Flask routes to `run/container_main.py` for additional functionality.

---

## 🐛 Troubleshooting

### **Container Not Starting**
```bash
# Check container logs
podman logs waterplant-operator

# Check if port is in use
lsof -i :8000
```

### **Vue App Connection Issues**
```bash
# Test container health
curl http://localhost:8000/health

# Check Vue app configuration
# Ensure baseURL is set to http://localhost:8000
```

### **Authentication Issues**
- Use any username/password combination
- Check browser developer tools for network errors
- Verify CORS is enabled in the container

---

## 📈 Next Steps

### **1. Production Deployment**
- Replace mock authentication with real JWT
- Add database persistence
- Configure real hardware interfaces

### **2. Enhanced Features**
- Add more sensor types
- Implement real photo capture
- Add email notifications
- Create device management UI

### **3. Integration**
- Connect to real WaterPlantApp backend
- Add device synchronization
- Implement real-time updates

---

## 🎉 Success!

**Your WaterVue app can now run completely with the containerized WaterPlantOperator!**

- ✅ **Frontend**: WaterVue on http://localhost:3000
- ✅ **Backend**: Containerized Operator on http://localhost:8000
- ✅ **Authentication**: Mock JWT system
- ✅ **Device Management**: Full CRUD operations
- ✅ **Hardware Simulation**: Complete mock hardware
- ✅ **API Compatibility**: All Vue app endpoints supported

**🚀 You now have a complete, self-contained water plant management system! 🚀**
