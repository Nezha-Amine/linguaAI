import os
from dotenv import load_dotenv

# Explicitly load the .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

print(f"Loaded MONGO_URI: {os.getenv('MONGO_URI')}")
print(f"Loaded JWT_SECRET_KEY: {os.getenv('JWT_SECRET_KEY')}")

from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))  # Default to port 5000 if PORT is not set
    app.run(debug=True, port=port)
