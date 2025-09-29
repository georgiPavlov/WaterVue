# 🔄 Data Flow Architecture - WaterPlantOperator → WaterPlantApp → WaterVue

## 📋 Overview

The system now implements a proper **3-tier data flow architecture**:

1. **WaterPlantOperator Container** (Data Source) - Simulates hardware and pushes data
2. **WaterPlantApp Django Server** (Data Storage) - Receives and stores data in database
3. **WaterVue Frontend** (Data Display) - Retrieves and displays data from Django

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────┐    Push Data     ┌─────────────────────────┐    API Calls    ┌─────────────────────────┐
│                         │   Every 10s      │                         │                │                         │
│  WaterPlantOperator     │ ────────────────▶│   WaterPlantApp         │ ◀──────────────│      WaterVue           │
│     Container           │                  │   Django Server         │                │     Frontend             │
│                         │                  │                         │                │                         │
│ • Mock Hardware         │                  │ • Database Storage      │                │ • Device Dashboard      │
│ • Sensor Simulation     │                  │ • API Endpoints         │                │ • Real-time Updates     │
│ • Data Generation       │                  │ • Authentication        │                │ • User Interface        │
│ • HTTP Client           │                  │ • Business Logic        │                │ • Data Visualization    │
└─────────────────────────┘                  └─────────────────────────┘                └─────────────────────────┘
        Port 8000                                    Port 8001                                Port 3000
```

---

## 🚀 Quick Start

### **1. Start WaterPlantApp (Django Server)**
```bash
cd /Users/I336317/SAPDevelop/projects/local/WaterPlantApp
./start.sh
```

### **2. Start WaterPlantOperator Container**
```bash
cd /Users/I336317/SAPDevelop/projects/local/WaterPlantOperator
podman run -d --name waterplant-operator -p 8000:8000 \
  -v ./logs:/app/logs -v ./data:/app/data waterplant-operator
```

### **3. Start WaterVue Frontend**
```bash
cd /Users/I336317/SAPDevelop/projects/local/WaterVue
npm run dev
```

### **4. Access the System**
- **WaterVue Frontend**: http://localhost:3000
- **WaterPlantApp API**: http://localhost:8001
- **WaterPlantOperator API**: http://localhost:8000

---

## 📊 Data Pushing Mechanism

### **Automatic Data Pushing**
The WaterPlantOperator container automatically pushes data to WaterPlantApp every **10 seconds**:

#### **Data Types Pushed:**
1. **Device Information**
   - Device ID: `ab313658-5d84-47d6-a3f1-b609c0f1dd5e`
   - Connection status: `true`
   - Water container capacity: `2000ml`
   - Current sensor readings

2. **Water Level Data**
   - Real-time water level percentage
   - Timestamp
   - Device association

3. **Moisture Level Data**
   - Real-time moisture percentage
   - Timestamp
   - Device association

4. **Status Information**
   - Device operational status
   - Current sensor readings summary
   - Timestamp

### **API Endpoints Used for Pushing:**
- `POST /gadget_communicator_pull/api/create_device` - Device data
- `POST /gadget_communicator_pull/api/post_water` - Water level
- `POST /gadget_communicator_pull/api/post_moisture` - Moisture level
- `POST /gadget_communicator_pull/api/post_status` - Status data

---

## 🎛️ Data Push Control

### **Control Endpoints (WaterPlantOperator)**

#### **Start Data Pushing**
```bash
curl -X POST http://localhost:8000/data-push/start
```

#### **Stop Data Pushing**
```bash
curl -X POST http://localhost:8000/data-push/stop
```

#### **Check Push Status**
```bash
curl http://localhost:8000/data-push/status
```

### **Response Example:**
```json
{
    "active": true,
    "target_url": "http://host.docker.internal:8001",
    "interval": 10,
    "device_id": "ab313658-5d84-47d6-a3f1-b609c0f1dd5e"
}
```

---

## 🔧 Configuration

### **WaterPlantOperator Container Configuration**
```python
# In container_main.py
WATERPLANTAPP_URL = 'http://host.docker.internal:8001'  # Django server
PUSH_INTERVAL = 10  # seconds
DEVICE_GUID = 'ab313658-5d84-47d6-a3f1-b609c0f1dd5e'
```

### **WaterVue Configuration**
```javascript
// In src/store/index.js
baseURL: 'http://localhost:8001', // WaterPlantApp Django Server
```

---

## 📈 Real-Time Data Flow

### **1. Data Generation (WaterPlantOperator)**
- Mock hardware generates sensor readings
- Moisture: 0-100% (simulated)
- Water Level: 0-100% (simulated)
- Temperature: 20-30°C (simulated)
- Humidity: 40-80% (simulated)

### **2. Data Transmission**
- HTTP POST requests every 10 seconds
- JSON payload with device ID and sensor data
- Automatic retry on connection failure
- Logging of all push attempts

### **3. Data Storage (WaterPlantApp)**
- Django ORM stores data in SQLite database
- Device records updated with latest sensor readings
- Water charts created for historical data
- Status records logged for monitoring

### **4. Data Retrieval (WaterVue)**
- Vue app fetches data from Django API
- Real-time updates via periodic API calls
- Device connection status displayed
- Sensor readings visualized in dashboard

---

## 🔍 Monitoring and Logging

### **Container Logs**
```bash
# View WaterPlantOperator logs
podman logs -f waterplant-operator

# View WaterPlantApp logs
tail -f /Users/I336317/SAPDevelop/projects/local/WaterPlantApp/logs/waterplantapp.log
```

### **Log Messages**
- ✅ `Successfully pushed device data to WaterPlantApp`
- ✅ `Successfully pushed water level: 75%`
- ✅ `Successfully pushed moisture level: 45%`
- ⚠️ `Could not connect to WaterPlantApp: Connection refused`
- ❌ `Error in data pushing loop: [error details]`

---

## 🛠️ Troubleshooting

### **Device Shows as Disconnected**
1. **Check WaterPlantApp is running:**
   ```bash
   curl http://localhost:8001/health
   ```

2. **Check data pushing is active:**
   ```bash
   curl http://localhost:8000/data-push/status
   ```

3. **Check container logs:**
   ```bash
   podman logs waterplant-operator | grep "pushed"
   ```

### **No Data Updates in Vue App**
1. **Verify WaterPlantApp API:**
   ```bash
   curl http://localhost:8001/gadget_communicator_pull/api/list_devices
   ```

2. **Check Vue app network requests in browser dev tools**

3. **Restart data pushing:**
   ```bash
   curl -X POST http://localhost:8000/data-push/stop
   curl -X POST http://localhost:8000/data-push/start
   ```

### **Connection Issues**
- Ensure WaterPlantApp is running on port 8001
- Check firewall settings
- Verify container can reach host.docker.internal:8001
- Check Django CORS settings

---

## 🎯 Benefits of This Architecture

### **1. Separation of Concerns**
- **WaterPlantOperator**: Hardware simulation and data generation
- **WaterPlantApp**: Data storage, business logic, and API
- **WaterVue**: User interface and data visualization

### **2. Scalability**
- Multiple operators can push to same Django server
- Django can handle multiple frontend clients
- Easy to add new data sources

### **3. Reliability**
- Data persistence in Django database
- Automatic retry mechanisms
- Independent component failure handling

### **4. Development**
- Each component can be developed independently
- Easy testing of individual components
- Clear data flow and responsibilities

---

## 🔄 Data Flow Summary

**Every 10 seconds:**
1. WaterPlantOperator generates mock sensor data
2. Container pushes data to WaterPlantApp via HTTP POST
3. Django stores data in database
4. Vue app fetches latest data from Django API
5. Dashboard displays real-time sensor readings

**Result:** Your device with ID `ab313658-5d84-47d6-a3f1-b609c0f1dd5e` will show as **connected** with real-time sensor data! 🎉

---

**🔄 The complete data flow is now implemented: WaterPlantOperator → WaterPlantApp → WaterVue! 🔄**
