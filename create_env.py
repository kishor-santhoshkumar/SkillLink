with open('.env', 'w', encoding='utf-8') as f:
    f.write('DATABASE_URL=postgresql://postgres:Kiss1234@localhost:5432/skilllink\n')
    f.write('APP_ENV=development\n')
    f.write('OPENAI_API_KEY=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\n')

print("✓ .env file created successfully")
