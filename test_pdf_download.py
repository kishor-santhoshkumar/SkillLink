import requests

# Test PDF download
response = requests.get('http://127.0.0.1:8000/resumes/28/download')

print(f'Status: {response.status_code}')
print(f'Content-Type: {response.headers.get("Content-Type")}')
print(f'PDF Size: {len(response.content)} bytes')

if response.status_code == 200:
    print('✅ PDF generated successfully!')
    print('✅ HRFlowable import fix worked!')
else:
    print('❌ PDF generation failed')
    print(f'Error: {response.text}')
