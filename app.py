from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = "8156841245:AAF6iJLgxvI5VnpaMrWFyCNOYKhPEUYix3s"  # Replace with your actual bot token
CHAT_ID = "-4640834480"  # Replace with your actual chat ID

@app.route("/send-message", methods=["POST"])
def send_message():
    data = request.json  # Receive JSON data from frontend
    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    telegram_message = f"📩 New Message:\n👤 Name: {name}\n📧 Email: {email}\n📌 Subject: {subject}\n💬 Message: {message}"
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    params = {"chat_id": CHAT_ID, "text": telegram_message}

    response = requests.post(url, params=params)

    if response.status_code == 200:
        return jsonify({"message": "Message sent successfully!"})
    else:
        return jsonify({"message": "Failed to send message!"}), 500

if __name__ == "__main__":
    app.run(debug=True)
