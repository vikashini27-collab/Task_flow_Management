import urllib.request
import urllib.error
import json

base_url = 'http://localhost:8080/api/auth'

def req(path, data):
    req = urllib.request.Request(
        base_url + path,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8'), response.status
    except urllib.error.HTTPError as e:
        return e.read().decode('utf-8'), e.code

print("Registering...")
resp, code = req('/register', {
    'fullName': 'Test Agent',
    'username': 'agent',
    'email': 'agent@test.com',
    'password': 'password123'
})
print("Register Response:", code, resp)

print("Logging in...")
resp, code = req('/login', {
    'username': 'agent',
    'password': 'password123'
})
print("Login Response:", code, resp)
