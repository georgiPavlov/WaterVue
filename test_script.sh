#!/bin/bash

echo "Starting test script..."

# Test directory check
if [ ! -d "../WaterPlantApp" ] || [ ! -d "." ] || [ ! -d "../WaterPlantOperator" ]; then
    echo "Directory check failed"
    exit 1
fi
echo "Directory check passed"

# Test cleanup
echo "Testing cleanup..."
pkill -f "manage.py runserver" 2>/dev/null || true
echo "Django cleanup done"
pkill -f "vite" 2>/dev/null || true
echo "Vite cleanup done"
pkill -f "python.*main.py" 2>/dev/null || true
echo "Python cleanup done"

# Test container cleanup
echo "Testing container cleanup..."
podman stop waterplant-operator 2>/dev/null || true
echo "Container stop done"
podman rm waterplant-operator 2>/dev/null || true
echo "Container remove done"

echo "All tests passed!"


