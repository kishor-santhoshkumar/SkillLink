"""Test database connection"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print(f"Attempting to connect with URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()
        print(f"✓ Successfully connected to PostgreSQL!")
        print(f"✓ PostgreSQL version: {version[0]}")
except Exception as e:
    print(f"✗ Connection failed!")
    print(f"Error: {e}")
