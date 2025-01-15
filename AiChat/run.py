import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables
load_dotenv()

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))  # Default to port 5000 if PORT is not set
    app.run(debug=True, port=port)
