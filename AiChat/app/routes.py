from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import mongo, bcrypt
from app.models import User

auth_bp = Blueprint('auth', __name__)
user_model = User(mongo)
@auth_bp.route('/register', methods=['OPTIONS', 'POST'])
def register():
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    data = request.get_json()
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    level = data.get('level')
    password = data.get('password')

    if not all([email, first_name, last_name, level, password]):
        return jsonify(message="All fields are required"), 400

    if user_model.find_user_by_email(email):
        return jsonify(message="User already exists"), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = {
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "level": level,
        "password": hashed_password
    }

    inserted_id = user_model.create_user(new_user)
    if not inserted_id:
        return jsonify(message="Failed to register user"), 500

    return jsonify(message="User registered successfully"), 201
@auth_bp.route('/login', methods=['OPTIONS', 'POST'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify(message="Email and password are required"), 400

        user = user_model.find_user_by_email(email)
        if not user or not bcrypt.check_password_hash(user['password'], password):
            return jsonify(message="Invalid credentials"), 400

        user_data = {
            "id": str(user['_id']),
            "email": user['email'],
            "first_name": user['first_name'],
            "last_name": user['last_name'],
            "level": user['level']
        }

        access_token = create_access_token(identity=user_data)
        response = jsonify(token=access_token, user=user_data)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 200

    except Exception as e:
        # Log the error for debugging
        print(f"Error during login: {e}")
        return jsonify(message="An internal error occurred"), 500
