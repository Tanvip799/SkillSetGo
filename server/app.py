from flask import Flask, request, jsonify
from pymongo import MongoClient
import google.generativeai as genai
import pprint
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'sk'
CORS(app)

connection_string = 'mongodb+srv://shriharimahabal2:NObO44F5chwSglW7@cluster0.c0f3mdd.mongodb.net/'
client = MongoClient(connection_string)
db = client.get_database('ssg')

# Configure the Google Generative AI SDK
genai.configure(api_key="AIzaSyADLRDmiOintrh-0dZxZPOM0-QF2c4ks8g")

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8000,
    "response_mime_type": "text/plain",
}

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    users = db.users
    users.insert_one(data)
    return jsonify({
        'message': 'User registered successfully'
    }), 200
    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    users = db.users
    user = users.find_one({
        'email': data['email'],
        'password': data['password']
    })
    if user:
        return jsonify({
            'message': 'User logged in successfully',
            'creds': {
                '_id': str(user['_id']),
                'username': user['username'],
                'email': user['email']
            }
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 403

@app.route('/chatbot', methods=['POST'])
def chatbot():
    model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    )
    
    chat_session = model.start_chat(history=request.json['history'])
    msg = request.json['message']
    prefix = ''
    response = chat_session.send_message(prefix+msg)
    text = response.text
    return text

if __name__ == '__main__':
    app.run(debug=True)
