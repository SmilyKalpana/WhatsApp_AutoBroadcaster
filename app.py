from flask import Flask, request, jsonify
from flask_cors import CORS
from whatsapp_script import start_whatsapp_automation
import threading
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend to call Flask

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/send-whatsapp", methods=["POST"])
def send_whatsapp():
    file = request.files.get("file")
    message = request.form.get("message")

    if not file or not message:
        return jsonify({"status": "Missing file or message"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Start automation in background thread
    threading.Thread(target=start_whatsapp_automation, args=(file_path, print, message)).start()

    return jsonify({"status": "WhatsApp automation started"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
