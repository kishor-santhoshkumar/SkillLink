import os
from dotenv import load_dotenv
from pathlib import Path

# Get current directory
current_dir = Path.cwd()
env_file = current_dir / ".env"

print(f"Current directory: {current_dir}")
print(f".env file path: {env_file}")
print(f".env file exists: {env_file.exists()}")

print("\nBefore load_dotenv:")
print(f"OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY')}")

# Load with explicit path
load_dotenv(dotenv_path=env_file, verbose=True)

print("\nAfter load_dotenv:")
api_key = os.getenv('OPENAI_API_KEY')
if api_key:
    print(f"✓ OPENAI_API_KEY loaded: {api_key[:20]}...{api_key[-10:]}")
    print(f"✓ Length: {len(api_key)}")
else:
    print("✗ OPENAI_API_KEY not found")

print(f"\nDATABASE_URL: {os.getenv('DATABASE_URL')}")
print(f"APP_ENV: {os.getenv('APP_ENV')}")
