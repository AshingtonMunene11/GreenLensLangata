from flask import Blueprint, request, jsonify
from app.utils.chatbot import MultilingualChatbot

chat_bp = Blueprint("chat_bp", __name__, url_prefix="/api")
chatbot = MultilingualChatbot()

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "English")

    if not message:
        return jsonify({"response": "Please enter a message."}), 400

    try:
        response = chatbot.chat(message, language)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500
