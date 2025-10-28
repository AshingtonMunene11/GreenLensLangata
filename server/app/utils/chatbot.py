import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class MultilingualChatbot:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def chat(self, message, language="English", history=[]):
        messages = [
            {"role": "system", "content": f"You are a helpful assistant that communicates in {language}."},
            *history,
            {"role": "user", "content": message},
        ]

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
