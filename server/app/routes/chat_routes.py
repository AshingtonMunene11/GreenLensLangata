from flask import Blueprint, request, jsonify
from app.chatbot import Multilingualchatbot

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    print("****Received request:****", data)
    message = data.get("message", "")
    language = data.get("language", "English")

    if not message:
        return jsonify({"response": "Please type a message."}), 400

    chatbot = Multilingualchatbot()
    try:
        response = chatbot.chat(message, language)
        print("****Response from Groq****:", response)
        return jsonify({"response": response}), 200
    except Exception as e:
        print("Chat error:", e)
        # return jsonify({"response": "Something went wrong."}), 500
        return jsonify({"response": "****Something went wrong.****" f"Error: {str(e)}"}), 500


# from flask import Blueprint, request, jsonify
# from app.utils.chatbot import MultilingualChatbot

# chat_bp = Blueprint("chat_bp", __name__, url_prefix="/api")
# chatbot = MultilingualChatbot()

# @chat_bp.route("/chat", methods=["POST"])
# def chat():
#     data = request.get_json()
#     message = data.get("message", "")
#     language = data.get("language", "English")

#     if not message:
#         return jsonify({"response": "Please enter a message."}), 400

#     try:
#         response = chatbot.chat(message, language)
#         return jsonify({"response": response})
#     except Exception as e:
#         return jsonify({"response": f"Error: {str(e)}"}), 500
