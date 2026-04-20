import json, urllib.request

for payload, path in [
    ({'email': 'admin@example.com', 'password': 'admin123'}, '/api/auth/admin/login'),
    ({'email': 'student_test@example.com', 'password': 'Test1234'}, '/api/auth/student/login')
]:
    req = urllib.request.Request(
        'http://localhost:5000' + path,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(path, resp.status)
            print(resp.read().decode('utf-8'))
    except Exception as e:
        print(path, type(e).__name__)
        if hasattr(e, 'read'):
            print(e.read().decode('utf-8'))
        else:
            print(e)
