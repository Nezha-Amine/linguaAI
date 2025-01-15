import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = "mongodb://localhost:27017/projectAI"
    JWT_SECRET_KEY = "your_secret_key"


    print(f"MONGO_URI: {MONGO_URI}")
    print(f"JWT_SECRET_KEY: {JWT_SECRET_KEY}")

