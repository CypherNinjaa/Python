import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://techphilia-80.vercel.app"])

# 🔹 Replace these with your actual Bot Token & Chat ID
BOT_TOKEN = "8156841245:AAF6iJLgxvI5VnpaMrWFyCNOYKhPEUYix3s"
CHAT_ID = "-4640834480"

@app.route("/")
def home():
    return "Flask server is running!"

@app.route("/send-message", methods=["POST"])
def send_message():
    try:
        data = request.json  # Get JSON data from the request
        message = data.get("message", "")

        if not message:
            return jsonify({"status": "error", "message": "Message cannot be empty!"}), 400

        # 🔹 Send message to Telegram bot
        telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": CHAT_ID,
            "text": message
        }
        response = requests.post(telegram_url, json=payload)

        # Check if the request was successful
        if response.status_code == 200:
            return jsonify({"status": "success", "message": "Message sent to Telegram!"})
        else:
            return jsonify({"status": "error", "message": "Failed to send message to Telegram!"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
