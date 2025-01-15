from flask import Flask, Blueprint, request, jsonify, send_file
from flask_cors import CORS
from app.chatbot import start_chat_session, process_chat_message
from app.tts_service import generate_speech
from threading import Thread


chat_bp = Blueprint('chat', __name__)

# Enable CORS for the entire Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

def generate_tts_async(text, user_level):
    Thread(target=generate_speech, args=(text, user_level)).start()




@chat_bp.route('/start_chat', methods=['POST'])
def start_chat():
    chat = start_chat_session()
    return jsonify({"message": "Chat started", "history": [{"sender": "assistant", "text": """Hola! Hoy vamos a practicar estas palabras: salvaje, mosca, tigre, abeja, insecto, cerdo, conejo, delfín, serpiente, araña, ciervo, pato, caballo, cocodrilo, mascota, oveja, cangrejo, gato, animal, tortuga. Me gustan mucho los *animales*. ¿Tienes una *mascota* en casa?"""}]})
@chat_bp.route('/chat', methods=['OPTIONS', 'POST'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    if request.method == 'POST':
        # Handle POST request
        data = request.json
        message = data.get('message')
        chat_history = data.get('history', [])
        user_level = data.get('user_level', 'beginner')

        try:
            response, updated_history = process_chat_message(message, chat_history, user_level)

            # Start TTS generation in a separate thread
            generate_tts_async(response, user_level)

            return jsonify({
                "response": response,
                "history": updated_history
            })
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    
@chat_bp.route('/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get('text')
    user_level = data.get('user_level', 'beginner')

    try:
        audio_path = generate_speech(text, user_level)
        if audio_path:
            return send_file(audio_path, mimetype="audio/mpeg")
        else:
            return jsonify({"error": "Failed to generate speech"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500




