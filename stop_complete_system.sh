#!/bin/bash

# Complete Water Plant Automation System Stop Script
# Stops all running components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}🛑 Stopping Water Plant Automation System${NC}"
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

print_header

# Function to stop process by PID file
stop_process() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill $pid 2>/dev/null || true
            sleep 2
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                print_warning "Force killing $service_name..."
                kill -9 $pid 2>/dev/null || true
            fi
            
            print_success "$service_name stopped"
        else
            print_warning "$service_name was not running"
        fi
        rm -f "$pid_file"
    else
        print_warning "No PID file found for $service_name"
    fi
}

# Stop services using PID files
stop_process "WaterPlantApp" "logs/waterplantapp.pid"
stop_process "WaterVue" "logs/watervue.pid"
stop_process "WaterPlantOperator" "logs/waterplantoperator.pid"

# Kill any remaining processes by name
print_status "Cleaning up any remaining processes..."

# Kill Django processes
pkill -f "manage.py runserver" 2>/dev/null || true

# Kill Vite processes
pkill -f "vite" 2>/dev/null || true

# Kill WaterPlantOperator processes
pkill -f "python.*main.py" 2>/dev/null || true

# Kill any Node.js processes related to our project
pkill -f "node.*water-me-automation" 2>/dev/null || true

print_success "All services stopped successfully!"

# Display final status
echo ""
print_status "Checking if all services are stopped..."

# Check if ports are free
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "$service_name may still be running on port $port"
        return 1
    else
        print_success "$service_name is stopped (port $port is free)"
        return 0
    fi
}

check_port 8001 "WaterPlantApp"
check_port 3000 "WaterVue (port 3000)"
check_port 3001 "WaterVue (port 3001)"
check_port 8000 "WaterPlantOperator"

echo ""
print_success "🌱 Water Plant Automation System stopped completely!"
echo ""
print_status "To start the system again, run: ./start_complete_system.sh"
