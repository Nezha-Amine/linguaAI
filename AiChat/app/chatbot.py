import google.generativeai as genai

def configure_genai():
    api_key = "YOUR_API_KEY" # Replace with your valid API key
    genai.configure(api_key=api_key)
    return {
        "model_name": "gemini-1.5-flash",
        "generation_config": {
            "temperature": 0.5,
            "top_p": 0.7,
            "top_k": 10,
            "max_output_tokens": 2048,
        },
        "system_instruction": """You are a professional Spanish instructor specializing in Spanish conversation.
        Always initiate the conversation with a topic and provide a list of example words or phrases related to the topic.
        Adjust your conversation style based on the student's level (beginner/intermediate).
        For example, you might say: "Hola! Hoy vamos a practicar estas palabras: salvaje, mosca, tigre, abeja, insecto, cerdo, conejo, delfín, serpiente, araña, ciervo, pato, caballo, cocodrilo, mascota, oveja, cangrejo, gato, animal, tortuga. Me gustan mucho los *animales*. ¿Tienes una *mascota* en casa?".
        Keep the conversation flowing by asking related questions and encouraging the student to respond in Spanish."""
    }

def start_chat_session():
    model_config = configure_genai()
    model = genai.GenerativeModel(**model_config)
    # Start the chat with a predefined opening based on level
    initial_history = [{"sender": "assistant", "text": """Hola! Hoy vamos a practicar estas palabras: salvaje, mosca, tigre, abeja, insecto, cerdo, conejo, delfín, serpiente, araña, ciervo, pato, caballo, cocodrilo, mascota, oveja, cangrejo, gato, animal, tortuga. Me gustan mucho los *animales*. ¿Tienes una *mascota* en casa?"""}]
    return model.start_chat(history=initial_history)

def process_chat_message(message, chat_history, user_level):
    # Format the history for the AI model
    formatted_history = [
        {"parts": [{"text": msg["text"]}], "role": msg["sender"]}
        for msg in chat_history
    ]
    chat = genai.GenerativeModel(**configure_genai())
    chat_history_obj = chat.start_chat(history=formatted_history)
    
    # Add the user's message to the chat
    response = chat_history_obj.send_message(message)
    
    # Adjust the AI's response based on the user's level
    response_text = response.text
    if user_level == "beginner":
        # Adjust response for beginners
        response_text = f"{response_text}"
    elif user_level == "intermediate":
        # Adjust response for intermediate 
        response_text = f"{response_text} How would you describe this in your own words?"

    # Update the history with only the assistant's response
    updated_history = chat_history + [{"sender": "assistant", "text": response_text}]
    
    return response_text, updated_history
