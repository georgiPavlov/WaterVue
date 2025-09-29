#!/usr/bin/env python3
"""
Complete System Integration Test
Tests the integration between WaterVue, WaterPlantApp, and WaterPlantOperator
"""

import requests
import json
import time
import sys
import os

# Change to parent directory to access all components
os.chdir('..')

class IntegrationTester:
    def __init__(self):
        self.waterplantapp_url = "http://localhost:8001"
        self.watervue_url = "http://localhost:3001"
        self.token = None
        
    def print_status(self, message, status="INFO"):
        colors = {
            "INFO": "\033[0;34m",
            "SUCCESS": "\033[0;32m",
            "ERROR": "\033[0;31m",
            "WARNING": "\033[0;33m"
        }
        reset = "\033[0m"
        print(f"{colors.get(status, '')}[{status}]{reset} {message}")
    
    def test_waterplantapp_server(self):
        """Test if WaterPlantApp server is running"""
        try:
            response = requests.get(f"{self.waterplantapp_url}/admin/", timeout=5)
            if response.status_code in [200, 302]:
                self.print_status("WaterPlantApp server is running", "SUCCESS")
                return True
            else:
                self.print_status(f"WaterPlantApp server returned status {response.status_code}", "WARNING")
                return False
        except requests.exceptions.RequestException as e:
            self.print_status(f"WaterPlantApp server is not accessible: {e}", "ERROR")
            return False
    
    def test_watervue_frontend(self):
        """Test if WaterVue frontend is running"""
        try:
            response = requests.get(f"{self.watervue_url}/", timeout=5)
            if response.status_code == 200:
                self.print_status("WaterVue frontend is running", "SUCCESS")
                return True
            else:
                self.print_status(f"WaterVue frontend returned status {response.status_code}", "WARNING")
                return False
        except requests.exceptions.RequestException as e:
            self.print_status(f"WaterVue frontend is not accessible: {e}", "ERROR")
            return False
    
    def test_authentication(self):
        """Test JWT authentication"""
        try:
            # Test user credentials
            auth_data = {
                "username": "testuser",
                "password": "testpass123"
            }
            
            response = requests.post(
                f"{self.waterplantapp_url}/api-token-auth/",
                json=auth_data,
                timeout=5
            )
            
            if response.status_code == 200:
                token_data = response.json()
                if 'access' in token_data:
                    self.token = token_data['access']
                    self.print_status("JWT authentication successful", "SUCCESS")
                    return True
                else:
                    self.print_status("JWT token not found in response", "ERROR")
                    return False
            else:
                self.print_status(f"Authentication failed with status {response.status_code}", "ERROR")
                return False
        except requests.exceptions.RequestException as e:
            self.print_status(f"Authentication request failed: {e}", "ERROR")
            return False
    
    def test_api_endpoints(self):
        """Test key API endpoints"""
        if not self.token:
            self.print_status("No authentication token available", "ERROR")
            return False
        
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        endpoints = [
            ("GET", "/gadget_communicator_pull/api/list_devices"),
            ("GET", "/gadget_communicator_pull/api/list_plans"),
        ]
        
        success_count = 0
        for method, endpoint in endpoints:
            try:
                if method == "GET":
                    response = requests.get(f"{self.waterplantapp_url}{endpoint}", headers=headers, timeout=5)
                else:
                    response = requests.post(f"{self.waterplantapp_url}{endpoint}", headers=headers, timeout=5)
                
                if response.status_code in [200, 201]:
                    self.print_status(f"{method} {endpoint} - OK", "SUCCESS")
                    success_count += 1
                else:
                    self.print_status(f"{method} {endpoint} - Status {response.status_code}", "WARNING")
            except requests.exceptions.RequestException as e:
                self.print_status(f"{method} {endpoint} - Error: {e}", "ERROR")
        
        return success_count > 0
    
    def test_device_creation(self):
        """Test device creation via API"""
        if not self.token:
            self.print_status("No authentication token available", "ERROR")
            return False
        
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        device_data = {
            "device_id": "INTEGRATION_TEST_DEVICE",
            "label": "Integration Test Device",
            "water_level": 75,
            "moisture_level": 45,
            "water_container_capacity": 2000,
            "is_connected": True
        }
        
        try:
            response = requests.post(
                f"{self.waterplantapp_url}/gadget_communicator_pull/api/create_device",
                json=device_data,
                headers=headers,
                timeout=5
            )
            
            if response.status_code in [200, 201]:
                self.print_status("Device creation successful", "SUCCESS")
                return True
            else:
                self.print_status(f"Device creation failed with status {response.status_code}", "WARNING")
                return False
        except requests.exceptions.RequestException as e:
            self.print_status(f"Device creation request failed: {e}", "ERROR")
            return False
    
    def run_all_tests(self):
        """Run all integration tests"""
        self.print_status("Starting Complete System Integration Test", "INFO")
        self.print_status("=" * 50, "INFO")
        
        tests = [
            ("WaterPlantApp Server", self.test_waterplantapp_server),
            ("WaterVue Frontend", self.test_watervue_frontend),
            ("JWT Authentication", self.test_authentication),
            ("API Endpoints", self.test_api_endpoints),
            ("Device Creation", self.test_device_creation),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            self.print_status(f"Testing {test_name}...", "INFO")
            if test_func():
                passed += 1
            time.sleep(1)  # Brief pause between tests
        
        self.print_status("=" * 50, "INFO")
        self.print_status(f"Integration Test Results: {passed}/{total} tests passed", 
                         "SUCCESS" if passed == total else "WARNING")
        
        if passed == total:
            self.print_status("🎉 All systems are integrated and working correctly!", "SUCCESS")
            return True
        else:
            self.print_status("⚠️  Some integration tests failed. Check the logs above.", "WARNING")
            return False

def main():
    tester = IntegrationTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
