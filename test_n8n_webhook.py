"""
Test n8n webhook to verify it's active and responding
"""
import httpx
import asyncio

async def test_webhook():
    webhook_url = "https://kishorsanthoshkumar.app.n8n.cloud/webhook/worker-application"
    
    test_payload = {
        "worker_name": "Test Worker",
        "trade": "Carpenter",
        "experience": "5 years",
        "location": "Chennai, Tamil Nadu",
        "job_title": "Senior Carpenter",
        "company_email": "test@example.com"
    }
    
    print("=" * 80)
    print("TESTING N8N WEBHOOK")
    print("=" * 80)
    print(f"\nWebhook URL: {webhook_url}")
    print(f"\nSending test payload...")
    print(f"Worker: {test_payload['worker_name']}")
    print(f"Trade: {test_payload['trade']}")
    print(f"Company Email: {test_payload['company_email']}")
    print("\n" + "-" * 80)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(webhook_url, json=test_payload)
            
            print(f"\n✅ Response Status: {response.status_code}")
            print(f"Response Body: {response.text[:500]}")
            
            if response.status_code == 200:
                print("\n" + "=" * 80)
                print("🎉 SUCCESS! Webhook is active and responding!")
                print("=" * 80)
                print("\nYour n8n workflow is working correctly.")
                print("When workers apply to jobs, emails will be sent automatically.")
            else:
                print("\n" + "=" * 80)
                print(f"⚠️  WARNING: Webhook returned status {response.status_code}")
                print("=" * 80)
                print("\nThe webhook is responding but may have an issue.")
                print("Check your n8n workflow configuration.")
                
    except httpx.TimeoutException:
        print("\n❌ ERROR: Webhook timeout")
        print("The webhook took too long to respond (>10 seconds)")
        print("Check your n8n workflow execution time.")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("Could not connect to webhook.")
        print("Make sure the workflow is active in n8n.")

if __name__ == "__main__":
    asyncio.run(test_webhook())
