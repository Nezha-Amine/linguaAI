from flask import Flask ,  Blueprint, request, jsonify, render_template, session, redirect, url_for, flash, send_file
import google.generativeai as genai
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from flask_cors import CORS



# Create a Blueprint named 'api'
api = Blueprint('api', __name__)

# Enable CORS for the entire Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})




def generate_quiz(proficiency, theme):
    genai.configure(api_key="AIzaSyA7081fdTQAn_W9pTjK5s0hFB6qfwdv3k8")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        f"Generate a 10-question quiz for a Spanish language learner, proficiency {proficiency}, focusing on vocabulary and grammar. The theme is {theme}. "
        "Grammar questions should use the vocabulary introduced in the vocabulary questions. Each question should be in Spanish, and answers should have 4 choices. "
        "Additionally, provide the English translation for each question. Return the quiz in the following format:\n\n"
        "nb_question: question (in Spanish) ?\n"
        "Translation: question (in English)\n"
        "a) answer a\nb) answer b\nc) answer c\nd) answer d\nAnswer: correct_answer.\n\n"
        "Return only the questions, translations, and answers in the specified format."
    )

    # Process response
    questions = []
    tquestions = []
    answers = []
    pAnswers = []

    entries = response.text.strip().split("\n\n")

    for entry in entries:
        lines = entry.split("\n")
        # Extract the Spanish question
        question_line = next((line for line in lines if line.startswith("nb_question:")), None)
        if question_line:
            question = question_line.split(": ", 1)[-1].strip()
            questions.append(question)

        # Extract the English translation
        translation_line = next((line for line in lines if line.startswith("Translation:")), None)
        if translation_line:
            translation = translation_line.split(": ", 1)[-1].strip()
            tquestions.append(translation)

        # Extract the possible answers
        possible_answers = {}
        for line in lines:
            if any(line.startswith(opt + ")") for opt in ["a", "b", "c", "d"]):
                option = line.split(")", 1)
                if len(option) == 2:
                    key, value = option[0].strip(), option[1].strip()
                    possible_answers[key.lower()] = value
        pAnswers.append(possible_answers)

        # Extract the correct answer
        answer_line = next((line for line in lines if line.startswith("Answer:")), None)
        if answer_line:
            answer = answer_line.split(": ", 1)[-1].strip()
            answers.append(answer)
        else:
            answers.append("")  # If no answer is found, append an empty string

    return questions, tquestions, answers, pAnswers



##routes##



@api.route('/quiz', methods=['GET'])
def show_quiz():
    print(request.args)
    proficiency = request.args.get('proficiency', 'A0')
    theme = request.args.get('theme', 'animals')
    

    try:
        questions, tquestions, answers, pAnswers = generate_quiz(proficiency, theme)
        quiz_data = [
            {
                "question": questions[i],
                "translation": tquestions[i],
                "possible_answers": pAnswers[i],
                "correct_answer": answers[i],
            }
            for i in range(len(questions))
        ]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(quiz_data)  # Returning data as JSON
