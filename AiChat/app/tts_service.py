import edge_tts
import asyncio
import re
import os


def set_speech_rate(user_level):
    if user_level == "beginner":
        return "-25%"
    elif user_level == "intermediate":
        return "-10%"
    else:
        return "0%"

def clean_text_for_tts(text):
    return re.sub(r'[*_]', '', text)

async def generate_speech_async(text, user_level):
    # Ensure the output path is valid
    output_dir = os.path.join(os.getcwd(), "tts_output")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_path = os.path.join(output_dir, "output_es.mp3")
    rate = set_speech_rate(user_level)

    try:
        print(f"Saving TTS audio to: {output_path}")  # Debugging path
        communicate = edge_tts.Communicate(clean_text_for_tts(text), voice="es-ES-AlvaroNeural", rate=rate)
        await communicate.save(output_path)
        return output_path
    except Exception as e:
        print(f"Error generating speech: {e}")
        return None
def generate_speech(text, user_level):
    return asyncio.run(generate_speech_async(text, user_level))
