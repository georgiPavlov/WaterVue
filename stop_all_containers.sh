#!/bin/bash

# 🛑 Stop All WaterPlant System Containers
# This script stops all three components running in containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to stop containers
stop_containers() {
    print_status "Stopping all WaterPlant containers..."
    
    # Stop WaterVue
    print_status "Stopping WaterVue..."
    cd ../WaterVue
    podman-compose down 2>/dev/null || true
    
    # Stop WaterPlantOperator
    print_status "Stopping WaterPlantOperator..."
    cd ../WaterPlantOperator
    podman-compose down 2>/dev/null || true
    
    # Stop WaterPlantApp
    print_status "Stopping WaterPlantApp..."
    cd ../WaterPlantApp
    podman-compose down 2>/dev/null || true
    
    cd ../WaterVue
    print_success "All containers stopped"
}

# Function to remove containers
remove_containers() {
    print_status "Removing containers..."
    
    # Remove containers if they exist
    podman rm waterplantapp 2>/dev/null || true
    podman rm watervue 2>/dev/null || true
    podman rm waterplant-operator 2>/dev/null || true
    
    print_success "Containers removed"
}

# Function to show final status
show_status() {
    print_status "Final container status:"
    podman ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(waterplant|watervue)" || echo "No WaterPlant containers running"
}

# Main execution
main() {
    echo "🛑 Stopping All WaterPlant System Containers"
    echo "============================================="
    
    stop_containers
    remove_containers
    show_status
    
    print_success "All containers stopped successfully! 🎉"
}

# Run main function
main "$@"
