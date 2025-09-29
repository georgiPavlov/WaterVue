# WaterVue - Water Plant Automation Frontend

WaterVue is the frontend component of the complete Water Plant Automation System. It provides a modern, responsive web interface for managing water plant operations, devices, and monitoring.

## 🌱 Complete System Overview

The Water Plant Automation System consists of three main components:

1. **WaterVue** (Frontend) - Vue.js web application (this project)
2. **WaterPlantApp** (Backend) - Django REST API server
3. **WaterPlantOperator** (Hardware) - Raspberry Pi hardware control

## 🚀 Quick Start

### Prerequisites

- **For Containerized Setup**: Podman and podman-compose
- **For Local Development**: Node.js 16+, Python 3.9+, Git

### Option 1: Containerized Setup (Recommended)

From the WaterVue directory, run:

```bash
./start_containers_simple.sh
```

This script will:
- Start all three components in containers
- Create shared network for communication
- Set up the database and create a test user
- Display all access URLs and credentials

**Container Access Points:**
- Frontend: http://localhost:3001
- Backend: http://localhost:8001
- Operator: http://localhost:8000

### Option 2: Local Development

From the WaterVue directory, run:

```bash
./start_complete_system.sh
```

This script will:
- Start the Django backend (WaterPlantApp) on port 8001
- Start the Vue.js frontend (WaterVue) on port 3000
- Start the hardware controller (WaterPlantOperator) on port 8000
- Set up the database and create a test user
- Display all access URLs and credentials

### 2. Access the Application

Open your browser and navigate to: **http://localhost:3000**

**Default Login Credentials:**
- Username: `testuser`
- Password: `testpass123`

### 3. Stop the System

```bash
./stop_complete_system.sh
```

## 📋 Available Scripts

### System Management Scripts

| Script | Description |
|--------|-------------|
| `./start_containers_simple.sh` | Start all components in containers (recommended) |
| `./stop_all_containers.sh` | Stop all containerized services |
| `./start_complete_system.sh` | Start all three components (local development) |
| `./stop_complete_system.sh` | Stop all running services |
| `./check_system_status.sh` | Check the status of all services |
| `./test_complete_integration.py` | Run integration tests for the complete system |

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vue.js development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 System URLs

### Containerized Setup
When running in containers, you can access:

- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **Admin Panel**: http://localhost:8001/admin/
- **API Documentation**: http://localhost:8001/gadget_communicator_pull/api/
- **Hardware Control**: http://localhost:8000

### Local Development Setup
When running locally, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Admin Panel**: http://localhost:8001/admin/
- **API Documentation**: http://localhost:8001/gadget_communicator_pull/api/
- **Hardware Control**: http://localhost:8000

## 🔧 Configuration

### Frontend Configuration

The frontend is configured to communicate with the local backend:

- **API Base URL**: `http://localhost:8001`
- **Authentication**: JWT tokens via `/api-token-auth/`
- **CORS**: Configured for local development

### Backend Configuration

The Django backend is configured with:

- **Database**: SQLite (development)
- **Authentication**: JWT with SimpleJWT
- **CORS**: Enabled for frontend communication
- **Allowed Hosts**: localhost, 127.0.0.1

## 🧪 Testing

### Integration Testing

Run the complete system integration test:

```bash
python3 test_complete_integration.py
```

This test verifies:
- ✅ WaterPlantApp server is running
- ✅ WaterVue frontend is accessible
- ✅ JWT authentication works
- ✅ API endpoints respond correctly
- ✅ Device creation works

### Manual Testing

1. **Login Test**: Use the provided credentials to log in
2. **Device Management**: Create, view, and manage devices
3. **Plan Management**: Create and manage watering plans
4. **Status Monitoring**: View device status and logs
5. **Photo Management**: View and manage device photos

## 📁 Project Structure

```
WaterVue/
├── src/
│   ├── components/          # Vue components
│   ├── views/              # Page views
│   ├── store/              # Vuex state management
│   │   ├── modules/        # Store modules
│   │   │   ├── login.js    # Authentication
│   │   │   ├── device.js   # Device management
│   │   │   ├── plan.js     # Plan management
│   │   │   └── ...
│   │   └── index.js        # Store configuration
│   └── assets/             # Static assets
├── public/                 # Public assets
├── scripts/                # System management scripts
│   ├── start_complete_system.sh
│   ├── stop_complete_system.sh
│   ├── check_system_status.sh
│   └── test_complete_integration.py
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. **Login**: POST to `/api-token-auth/` with username/password
2. **Token Storage**: Access token stored in Vuex store
3. **API Requests**: Token included in Authorization header
4. **Token Refresh**: Automatic token refresh when needed

## 🛠️ Development

### Frontend Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Make Changes**: Edit files in `src/` directory

4. **Build for Production**:
   ```bash
   npm run build
   ```

### Backend Development

The backend (WaterPlantApp) is located in `../WaterPlantApp/`. To work on the backend:

1. Navigate to the backend directory
2. Make changes to Django models, views, or serializers
3. Run migrations if needed
4. Restart the system using the scripts

## 📊 Monitoring and Logs

### Log Files

System logs are stored in the `logs/` directory:

- `logs/waterplantapp.log` - Django backend logs
- `logs/watervue.log` - Vue.js frontend logs
- `logs/waterplantoperator.log` - Hardware controller logs

### Process Management

Check running processes:

```bash
ps aux | grep -E '(manage.py|vite|main.py)'
```

View logs in real-time:

```bash
tail -f logs/*.log
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   ./stop_complete_system.sh
   ./start_complete_system.sh
   ```

2. **Database Issues**:
   ```bash
   cd ../WaterPlantApp/pycharmtut
   python3 manage.py migrate
   ```

3. **Authentication Issues**:
   ```bash
   python3 create_production_user.py
   ```

4. **CORS Issues**: Check that CORS is properly configured in Django settings

5. **Frontend Not Loading**: Ensure the Vue.js dev server is running on port 3000

### Getting Help

1. Check the log files for error messages
2. Run the integration test to identify issues
3. Verify all services are running with `./check_system_status.sh`
4. Ensure all dependencies are installed

## 🔄 System Integration

The three components work together as follows:

1. **WaterVue** (Frontend) → **WaterPlantApp** (Backend) → **WaterPlantOperator** (Hardware)
2. User interactions in the frontend trigger API calls to the backend
3. The backend processes requests and communicates with hardware
4. Hardware status and data flow back through the system to the frontend

## 📝 API Endpoints

Key API endpoints used by the frontend:

- `POST /api-token-auth/` - Authentication
- `GET /gadget_communicator_pull/api/list_devices` - List devices
- `POST /gadget_communicator_pull/api/create_device` - Create device
- `GET /gadget_communicator_pull/api/list_plans` - List plans
- `POST /gadget_communicator_pull/api/create_plan` - Create plan
- `GET /gadget_communicator_pull/api/list_status/{device_id}` - Get device status

## 🎯 Features

- **Device Management**: Create, view, and manage water plant devices
- **Plan Management**: Create and schedule watering plans
- **Status Monitoring**: Real-time device status and health monitoring
- **Photo Management**: View and manage device photos
- **User Authentication**: Secure login and session management
- **Responsive Design**: Works on desktop and mobile devices

## 📄 License

This project is part of the Water Plant Automation System.

---

**🌱 Happy Watering! 🌱**
