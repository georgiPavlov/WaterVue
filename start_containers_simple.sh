#!/bin/bash

# 🐳 Simple Container Startup Script
# This script starts containers individually to avoid dependency issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check if podman is installed
check_podman() {
    if ! command -v podman &> /dev/null; then
        print_error "Podman is not installed. Please install podman first."
        exit 1
    fi
    print_success "Podman is available"
}

# Function to create shared network
create_network() {
    print_status "Creating shared network..."
    if ! podman network exists waterplant-network; then
        podman network create waterplant-network
        print_success "Created waterplant-network"
    else
        print_warning "waterplant-network already exists"
    fi
}

# Function to stop existing containers
stop_existing_containers() {
    print_status "Stopping existing containers..."
    
    podman stop waterplantapp 2>/dev/null || true
    podman stop watervue 2>/dev/null || true
    podman stop waterplant-operator 2>/dev/null || true
    
    podman rm waterplantapp 2>/dev/null || true
    podman rm watervue 2>/dev/null || true
    podman rm waterplant-operator 2>/dev/null || true
    
    print_success "Stopped existing containers"
}

# Function to start WaterPlantApp
start_waterplantapp() {
    print_status "Starting WaterPlantApp container..."
    cd ../WaterPlantApp
    
    # Build the image
    podman build -t waterplantapp .
    
    # Run the container
    podman run -d \
        --name waterplantapp \
        --network waterplant-network \
        -p 8001:8001 \
        -v ./logs:/app/logs \
        -v ./data:/app/data \
        -v ./pycharmtut/db.sqlite3:/app/pycharmtut/db.sqlite3 \
        -e PYTHONPATH=/app \
        -e DJANGO_SETTINGS_MODULE=pycharmtut.settings \
        waterplantapp
    
    # Wait for WaterPlantApp to be ready
    print_status "Waiting for WaterPlantApp to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:8001/admin/ > /dev/null 2>&1; then
            print_success "WaterPlantApp is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "WaterPlantApp failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    cd ../WaterVue
}

# Function to start WaterPlantOperator
start_waterplantoperator() {
    print_status "Starting WaterPlantOperator container..."
    cd ../WaterPlantOperator
    
    # Build the image
    podman build -t waterplant-operator .
    
    # Run the container
    podman run -d \
        --name waterplant-operator \
        --network waterplant-network \
        -p 8000:8000 \
        -v ./logs:/app/logs \
        -v ./data:/app/data \
        waterplant-operator
    
    # Wait for WaterPlantOperator to be ready
    print_status "Waiting for WaterPlantOperator to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            print_success "WaterPlantOperator is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "WaterPlantOperator failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    cd ../WaterVue
}

# Function to start WaterVue
start_watervue() {
    print_status "Starting WaterVue container..."
    
    # Build the image
    podman build -t watervue .
    
    # Run the container
    podman run -d \
        --name watervue \
        --network waterplant-network \
        -p 3000:3000 \
        -v ./logs:/app/logs \
        -v ./src:/app/src \
        -v ./public:/app/public \
        -e NODE_ENV=development \
        -e VITE_API_BASE_URL=http://waterplantapp:8001 \
        watervue
    
    # Wait for WaterVue to be ready
    print_status "Waiting for WaterVue to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/ > /dev/null 2>&1; then
            print_success "WaterVue is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "WaterVue failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
}

# Function to create production user
create_production_user() {
    print_status "Creating production user..."
    cd ../WaterPlantApp
    
    # Create production user
    podman exec waterplantapp python3 create_production_user.py
    
    cd ../WaterVue
    print_success "Production user created"
}

# Function to show system status
show_status() {
    print_status "System Status:"
    echo ""
    echo "🌐 WaterVue Frontend:     http://localhost:3000"
    echo "🔧 WaterPlantApp API:     http://localhost:8001"
    echo "📱 WaterPlantOperator:    http://localhost:8000"
    echo ""
    echo "👤 Login Credentials:"
    echo "   Username: testuser"
    echo "   Password: testpass123"
    echo ""
    echo "📊 Container Status:"
    podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main execution
main() {
    echo "🐳 Starting WaterPlant System Containers (Simple Mode)"
    echo "======================================================"
    
    # Check prerequisites
    check_podman
    
    # Create shared network
    create_network
    
    # Stop existing containers
    stop_existing_containers
    
    # Start services in order
    start_waterplantapp
    start_waterplantoperator
    start_watervue
    
    # Create production user
    create_production_user
    
    # Show final status
    echo ""
    show_status
    
    print_success "All containers started successfully! 🎉"
    print_status "You can now access the system at http://localhost:3000"
}

# Run main function
main "$@"
