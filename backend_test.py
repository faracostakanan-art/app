#!/usr/bin/env python3

import requests
import sys
from datetime import datetime

class SGSecuripassAPITester:
    def __init__(self, base_url="https://code-web-dev.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Response Status: {response.status_code}")
            print(f"   Response Body: {response.text[:200]}...")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")

            return success, response.json() if response.content and response.status_code < 500 else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Timeout error")
            return False, {}
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Failed - Connection error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test health check endpoint"""
        return self.run_test(
            "Health Check Endpoint",
            "GET",
            "api/health",
            200
        )

    def test_root_api_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_frontend_loading(self):
        """Test if frontend loads"""
        return self.run_test(
            "Frontend Loading",
            "GET",
            self.base_url,
            200
        )

def main():
    print("🚀 Starting SG Securipass API Tests")
    print("=" * 50)
    
    # Setup
    tester = SGSecuripassAPITester()
    
    # Test frontend loading first
    print("\n📱 Testing Frontend Availability...")
    frontend_success, _ = tester.test_frontend_loading()
    
    # Test API endpoints
    print("\n🔧 Testing Backend API Endpoints...")
    health_success, health_response = tester.test_health_endpoint()
    root_success, root_response = tester.test_root_api_endpoint()

    # Print results summary
    print("\n" + "=" * 50)
    print(f"📊 RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    print("=" * 50)
    
    if frontend_success:
        print("✅ Frontend: Loading successfully")
    else:
        print("❌ Frontend: Failed to load")
        
    if health_success:
        print("✅ Backend Health Check: Working")
    else:
        print("❌ Backend Health Check: Failed")
        
    if root_success:
        print("✅ Backend Root API: Working")
        print(f"   Message: {root_response.get('message', 'N/A')}")
    else:
        print("❌ Backend Root API: Failed")

    # Return exit code
    success_rate = tester.tests_passed / tester.tests_run if tester.tests_run > 0 else 0
    if success_rate >= 0.8:
        print("\n🎉 Overall Status: HEALTHY")
        return 0
    else:
        print("\n⚠️  Overall Status: ISSUES DETECTED")
        return 1

if __name__ == "__main__":
    sys.exit(main())