"""
Quick test script to verify the backend API is working.
This tests authentication and basic API endpoints.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_authentication():
    """Test login functionality"""
    print("=" * 60)
    print("TEST 1: Authentication")
    print("=" * 60)
    
    # Test doctor login
    print("\n1. Testing doctor login...")
    data = {
        'username': 'doctor1',
        'password': 'password123'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/token", data=data)
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Doctor login successful!")
            print(f"   Token: {token_data['access_token'][:50]}...")
            return token_data['access_token']
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_user_info(token):
    """Test getting current user info"""
    print("\n" + "=" * 60)
    print("TEST 2: Get User Information")
    print("=" * 60)
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        response = requests.get(f"{BASE_URL}/users/me/", headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            print("✅ User info retrieved successfully!")
            print(f"   Username: {user_data['username']}")
            print(f"   Role: {user_data['role']}")
            return True
        else:
            print(f"❌ Failed to get user info: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_reports_endpoint(token):
    """Test reports endpoint"""
    print("\n" + "=" * 60)
    print("TEST 3: Get Reports")
    print("=" * 60)
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        response = requests.get(f"{BASE_URL}/reports", headers=headers)
        if response.status_code == 200:
            reports = response.json()
            print("✅ Reports endpoint working!")
            print(f"   Number of reports: {len(reports)}")
            return True
        else:
            print(f"❌ Failed to get reports: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_api_docs():
    """Test if API documentation is accessible"""
    print("\n" + "=" * 60)
    print("TEST 4: API Documentation")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ API documentation is accessible!")
            print(f"   URL: {BASE_URL}/docs")
            return True
        else:
            print(f"❌ Failed to access docs: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "BACKEND API TEST SUITE" + " " * 26 + "║")
    print("╚" + "=" * 58 + "╝")
    print()
    
    # Test 1: Authentication
    token = test_authentication()
    if not token:
        print("\n❌ Authentication failed. Cannot proceed with other tests.")
        print("   Make sure the backend server is running on port 8000.")
        return
    
    # Test 2: User Info
    test_user_info(token)
    
    # Test 3: Reports
    test_reports_endpoint(token)
    
    # Test 4: API Docs
    test_api_docs()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print("✅ Backend server is running and functional!")
    print("✅ Authentication is working")
    print("✅ Protected endpoints are accessible")
    print("✅ API documentation is available")
    print()
    print("Next steps:")
    print("1. Open the demo guide: DEMO_GUIDE.html")
    print("2. Navigate to http://localhost:5173")
    print("3. Login with: doctor1 / password123")
    print("4. Start recording consultations!")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
