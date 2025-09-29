#!/bin/bash

# Complete Water Plant Automation System Startup Script
# Starts WaterPlantApp, WaterVue, and WaterPlantOperator in background

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}🌱 Water Plant Automation System${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_url() {
    echo -e "${CYAN}🌐 $1${NC}"
}

# Check if running from correct directory
if [ ! -d "../WaterPlantApp" ] || [ ! -d "." ] || [ ! -d "../WaterPlantOperator" ]; then
    print_error "Please run this script from the WaterVue directory"
    print_error "Expected directories: ../WaterPlantApp, ., ../WaterPlantOperator"
    exit 1
fi

print_header

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing processes
print_status "Cleaning up existing processes..."
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "python.*main.py" 2>/dev/null || true
sleep 2

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null | grep -q "200\|302"; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_warning "$service_name may not be fully ready yet"
    return 1
}

# Start WaterPlantApp (Backend)
print_status "Starting WaterPlantApp (Django Backend)..."
cd ../WaterPlantApp

# Check if setup is needed
if [ ! -f "pycharmtut/db.sqlite3" ]; then
    print_status "Setting up WaterPlantApp database..."
    cd pycharmtut
    python3 manage.py makemigrations --settings=pycharmtut.test_settings
    python3 manage.py migrate --settings=pycharmtut.test_settings
    cd ..
fi

# Create production user if needed
print_status "Creating production user for authentication..."
python3 create_production_user.py

# Start Django server in background
cd pycharmtut
nohup python3 manage.py runserver 8001 --settings=pycharmtut.settings > ../../logs/waterplantapp.log 2>&1 &
WATERPLANTAPP_PID=$!
echo $WATERPLANTAPP_PID > ../../logs/waterplantapp.pid

cd ../..
print_success "WaterPlantApp started (PID: $WATERPLANTAPP_PID)"

# Start WaterVue (Frontend)
print_status "Starting WaterVue (Vue.js Frontend)..."
cd ../WaterVue

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing WaterVue dependencies..."
    npm install
fi

# Start Vite dev server in background
nohup npm run dev > ../logs/watervue.log 2>&1 &
WATERVUE_PID=$!
echo $WATERVUE_PID > ../logs/watervue.pid

cd ..
print_success "WaterVue started (PID: $WATERVUE_PID)"

# Start WaterPlantOperator (Hardware Control)
print_status "Starting WaterPlantOperator (Hardware Control)..."
cd ../WaterPlantOperator

# Check if requirements are installed
if [ ! -d "venv" ]; then
    print_status "Setting up WaterPlantOperator virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt 2>/dev/null || print_warning "Some hardware dependencies may not be available on macOS"
    deactivate
fi

# Start WaterPlantOperator in background
source venv/bin/activate
nohup python3 run/main.py > ../logs/waterplantoperator.log 2>&1 &
WATERPLANTOPERATOR_PID=$!
echo $WATERPLANTOPERATOR_PID > ../logs/waterplantoperator.pid
deactivate

cd ../WaterVue
print_success "WaterPlantOperator started (PID: $WATERPLANTOPERATOR_PID)"

# Create logs directory if it doesn't exist
mkdir -p logs

# Wait for services to be ready
print_status "Waiting for services to initialize..."
sleep 5

# Check WaterPlantApp
if wait_for_service "http://localhost:8001/admin/" "WaterPlantApp"; then
    WATERPLANTAPP_STATUS="✅ Running"
else
    WATERPLANTAPP_STATUS="⚠️  Starting"
fi

# Check WaterVue (try both ports)
if wait_for_service "http://localhost:3000/" "WaterVue (port 3000)"; then
    WATERVUE_URL="http://localhost:3000"
    WATERVUE_STATUS="✅ Running"
elif wait_for_service "http://localhost:3001/" "WaterVue (port 3001)"; then
    WATERVUE_URL="http://localhost:3001"
    WATERVUE_STATUS="✅ Running"
else
    WATERVUE_URL="http://localhost:3000 or http://localhost:3001"
    WATERVUE_STATUS="⚠️  Starting"
fi

# Check WaterPlantOperator
if wait_for_service "http://localhost:8000/" "WaterPlantOperator"; then
    WATERPLANTOPERATOR_STATUS="✅ Running"
else
    WATERPLANTOPERATOR_STATUS="⚠️  Starting"
fi

# Display system status
echo ""
print_header
echo -e "${GREEN}🎉 Complete Water Plant Automation System Started!${NC}"
echo ""
echo -e "${CYAN}📊 System Status:${NC}"
echo -e "  WaterPlantApp (Backend):  $WATERPLANTAPP_STATUS"
echo -e "  WaterVue (Frontend):      $WATERVUE_STATUS"
echo -e "  WaterPlantOperator:       $WATERPLANTOPERATOR_STATUS"
echo ""

echo -e "${CYAN}🌐 Access URLs:${NC}"
print_url "Frontend Application: $WATERVUE_URL"
print_url "Backend API:          http://localhost:8001"
print_url "Admin Panel:          http://localhost:8001/admin/"
print_url "API Documentation:    http://localhost:8001/gadget_communicator_pull/api/"
print_url "Hardware Control:     http://localhost:8000"
echo ""

echo -e "${CYAN}🔐 Default Credentials:${NC}"
echo -e "  Username: ${YELLOW}testuser${NC}"
echo -e "  Password: ${YELLOW}testpass123${NC}"
echo ""

echo -e "${CYAN}📁 Process Information:${NC}"
echo -e "  WaterPlantApp PID:  ${YELLOW}$WATERPLANTAPP_PID${NC}"
echo -e "  WaterVue PID:       ${YELLOW}$WATERVUE_PID${NC}"
echo -e "  WaterPlantOperator: ${YELLOW}$WATERPLANTOPERATOR_PID${NC}"
echo ""

echo -e "${CYAN}📋 Log Files:${NC}"
echo -e "  WaterPlantApp:  ${YELLOW}logs/waterplantapp.log${NC}"
echo -e "  WaterVue:       ${YELLOW}logs/watervue.log${NC}"
echo -e "  WaterPlantOperator: ${YELLOW}logs/waterplantoperator.log${NC}"
echo ""

echo -e "${CYAN}🛠️  Management Commands:${NC}"
echo -e "  Stop all services:    ${YELLOW}./stop_complete_system.sh${NC}"
echo -e "  View logs:           ${YELLOW}tail -f logs/*.log${NC}"
echo -e "  Check status:        ${YELLOW}ps aux | grep -E '(manage.py|vite|main.py)'${NC}"
echo ""

echo -e "${CYAN}🧪 Test Integration:${NC}"
echo -e "  Run integration test: ${YELLOW}python3 test_complete_integration.py${NC}"
echo ""

echo -e "${GREEN}✨ System is ready! Open your browser and navigate to:${NC}"
echo -e "${PURPLE}   $WATERVUE_URL${NC}"
echo ""

# Create a simple status check script
cat > check_system_status.sh << 'EOF'
#!/bin/bash
echo "🌱 Water Plant Automation System Status"
echo "========================================"

# Check WaterPlantApp
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:8001/admin/" 2>/dev/null | grep -q "200\|302"; then
    echo "✅ WaterPlantApp (Backend): Running on http://localhost:8001"
else
    echo "❌ WaterPlantApp (Backend): Not responding"
fi

# Check WaterVue
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/" 2>/dev/null | grep -q "200"; then
    echo "✅ WaterVue (Frontend): Running on http://localhost:3000"
elif curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/" 2>/dev/null | grep -q "200"; then
    echo "✅ WaterVue (Frontend): Running on http://localhost:3001"
else
    echo "❌ WaterVue (Frontend): Not responding"
fi

# Check WaterPlantOperator
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/" 2>/dev/null | grep -q "200"; then
    echo "✅ WaterPlantOperator (Hardware): Running on http://localhost:8000"
else
    echo "❌ WaterPlantOperator (Hardware): Not responding"
fi

echo ""
echo "🔐 Login Credentials:"
echo "   Username: testuser"
echo "   Password: testpass123"
EOF

chmod +x check_system_status.sh

print_success "System startup complete! Use './check_system_status.sh' to verify all services."
