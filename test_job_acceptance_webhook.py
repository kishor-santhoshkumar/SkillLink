"""
Test the job acceptance n8n webhook
"""
import httpx
import asyncio

async def test_acceptance_webhook():
    webhook_url = "https://kishorsanthoshkumar.app.n8n.cloud/webhook/job-accepted"
    
    test_payload = {
        "worker_name": "Aravind Kumar",
        "worker_email": "worker@example.com",
        "job_title": "Senior Carpenter",
        "company_name": "ABC Construction",
        "company_email": "company@example.com",
        "company_location": "Chennai, Tamil Nadu",
        "contact_phone": "+91 98765 43210"
    }
    
    print("=" * 80)
    print("TESTING JOB ACCEPTANCE WEBHOOK")
    print("=" * 80)
    print(f"\nWebhook URL: {webhook_url}")
    print(f"\nSending test payload...")
    print(f"Worker: {test_payload['worker_name']} ({test_payload['worker_email']})")
    print(f"Job: {test_payload['job_title']}")
    print(f"Company: {test_payload['company_name']}")
    print(f"Location: {test_payload['company_location']}")
    print(f"Phone: {test_payload['contact_phone']}")
    print("\n" + "-" * 80)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(webhook_url, json=test_payload)
            
            print(f"\n✅ Response Status: {response.status_code}")
            print(f"Response Body: {response.text[:500]}")
            
            if response.status_code == 200:
                print("\n" + "=" * 80)
                print("🎉 SUCCESS! Job acceptance webhook is active!")
                print("=" * 80)
                print("\nYour n8n workflow is working correctly.")
                print("When companies accept applications, workers will receive emails.")
            elif response.status_code == 404:
                print("\n" + "=" * 80)
                print("⚠️  WARNING: Webhook not found (404)")
                print("=" * 80)
                print("\nThe n8n workflow is not activated yet.")
                print("Please activate the workflow at:")
                print("https://kishorsanthoshkumar.app.n8n.cloud/")
                print("\nWorkflow setup:")
                print("1. Create new workflow")
                print("2. Add Webhook node with path: job-accepted")
                print("3. Add Gmail node to send email to worker")
                print("4. ACTIVATE the workflow (toggle ON)")
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
    asyncio.run(test_acceptance_webhook())
