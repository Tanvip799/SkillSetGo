from flask import Flask, request, jsonify
from pymongo import MongoClient
import google.generativeai as genai
import pprint
import pandas as pd
from bson.objectid import ObjectId
from bson.json_util import dumps
from bson.json_util import loads
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'sk'
CORS(app)

connection_string = 'mongodb+srv://shriharimahabal2:NObO44F5chwSglW7@cluster0.c0f3mdd.mongodb.net/'
client = MongoClient(connection_string)
db = client.get_database('ssg')

def preprocess_data_mentors(df, skills_column, role_column, aimed_column):
    df[skills_column] = df[skills_column].fillna('').str.lower()
    df[skills_column] = df[skills_column].apply(lambda x: ' '.join(x.split(', ')))
    df[role_column] = df[role_column].fillna('').str.lower().str.replace(' ', '_')
    df[aimed_column] = df[aimed_column].fillna('').str.lower().str.replace(' ', '_')
    return df

def preprocess_data_students(df, skills_column, aimed_column):
    df[skills_column] = df[skills_column].fillna('').str.lower()
    df[skills_column] = df[skills_column].apply(lambda x: ' '.join(x.split(', ')))
    df[aimed_column] = df[aimed_column].fillna('').str.lower().str.replace(' ', '_')
    return df

def load_data():
    students = pd.read_csv('students.csv')
    mentors = pd.read_csv('mentors_with_id.csv')

    students.reset_index(inplace=True)
    students.rename(columns={'index': 'id'}, inplace=True)

    students = preprocess_data_students(students, 'current_skills','aimed_career_role')
    mentors = preprocess_data_mentors(mentors, 'skills', 'current_position', 'field_of_expertise')

    students['combined_features'] = students['current_skills'] + ' '  + students['aimed_career_role']
    mentors['combined_features'] = mentors['skills'] + ' ' + mentors['current_position'] + ' ' + mentors['field_of_expertise']
    
    return students, mentors

def calculate_similarity_matrices(students, mentors):
    tfidf_vectorizer = TfidfVectorizer()
    student_features_matrix = tfidf_vectorizer.fit_transform(students['combined_features'])
    mentor_features_matrix = tfidf_vectorizer.transform(mentors['combined_features'])

    cosine_similarities = linear_kernel(student_features_matrix, mentor_features_matrix)
    return cosine_similarities

def recommend_mentors_for_student(student_id, students, mentors, cosine_similarities, top_n=8):
    student_index = students[students['id'] == student_id].index[0]
    similarity_scores = list(enumerate(cosine_similarities[student_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_mentor_indices = [i[0] for i in similarity_scores[:top_n]]
    return mentors.iloc[top_mentor_indices]

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
    
@app.route('/login/<string:email>/<string:password>', methods=['GET'])
def login(email, password):
    users = db.users
    user = users.find_one({
        'email': email,
        'password': password
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

@app.route('/community_list/<string:userId>', methods=['GET'])
def get_community(userId):
    communities = db.communities
    communityList = list(communities.find({ 'memberIds': { '$nin': [userId] } }))
    memberCommunities = list(communities.find({'memberIds': userId}))
    owners = []
    memberOwners = []
    for community in communityList:
        community['_id'] = str(community['_id'])
        owner = db.users.find_one({'_id': ObjectId(community['adminId'])})
        owners.append(owner['username'])
    for community in memberCommunities:
        community['_id'] = str(community['_id'])
        owner = db.users.find_one({'_id': ObjectId(community['adminId'])})
        memberOwners.append(owner['username'])
    return jsonify({'communityList': communityList, 'memberCommunities': memberCommunities, 'owners': owners, 'memberOwners': memberOwners}), 200

@app.route('/create_community', methods=['POST'])
def create_community():
    data = request.json
    communities = db.communities
    communities.insert_one(data)
    return jsonify({
        'message': 'Community created successfully'
    }), 200
    
@app.route('/join_community', methods=['POST'])
def join_community():
    data = request.json
    communityId = ObjectId(data['communityId'])
    memberId = data['userId']
    communities = db.communities
    communities.update_one({'_id': communityId}, {"$addToSet": {'memberIds': memberId}})
    return jsonify({
        'message': 'User joined successfully'
    }), 200
    
@app.route('/create_doubt', methods=['POST'])
def create_doubt():
    data = request.json
    communityId = data['communityId']
    comment = {
        'communityId': communityId,
        'comment': data['comment'],
        'commentorId': data['commentor'],
        'likes': 0,
        'dislikes': 0,
        'parentId': None,
        'isReply': False
    }
    comments = db.comments
    comments.insert_one(comment)
    return jsonify({
        'message': 'Comment created successfully'
    }), 200

@app.route('/get_doubts/<string:community_id>', methods=['GET'])
def get_doubts(community_id):
    comments = db.comments
    doubts = list(comments.find({'_id': ObjectId(community_id), 'parent': None}))
    for doubt in doubts:
        doubt['_id'] = str(doubt['_id'])
    if doubts:
        return jsonify({'doubts': doubts}), 200
    return jsonify({'message': 'No doubts found'}), 404

@app.route('/answer_doubt', methods=['POST'])
def answer_doubt():
    data = request.json
    comment = {
        'communityId': ObjectId(data['communityId']),
        'comment': data['comment'],
        'commentorId': data['commentor'],
        'likes': 0,
        'dislikes': 0,
        'parentId': data['parentId'],
        'isReply': False
    }
    comments = db.comments
    comments.insert_one(comment)
    return jsonify({
        'message': 'Comment created successfully'
    }), 200

@app.route('/get_responses/<string:comment_id>', methods=['GET'])
def get_responses(comment_id):
    comments = db.comments
    responses = comments.find({'parentId': ObjectId(comment_id)})
    for response in responses:
        response['_id'] = str(response['_id'])
    if responses:
        return jsonify({'responses': responses}), 200
    return jsonify({'message': 'No responses found'}), 404

@app.route('/create_reply', methods=['POST'])
def create_reply():
    data = request.json
    comment = {
        'communityId': ObjectId(data['communityId']),
        'comment': data['comment'],
        'commentorId': data['commentor'],
        'likes': 0,
        'dislikes': 0,
        'parentId': ObjectId(data['parentId']),
        'isReply': True
    }
    comments = db.comments
    comments.insert_one(comment)
    return jsonify({
        'message': 'Comment created successfully'
    }), 200
    
# @app.route('/get_replies/<string:comment_id>', methods=['GET'])
# def get_replies(comment_id):
#     data = request.json

@app.route('/mentorship',methods=['GET'])
def mentor():
    student_id = 11
    # Load data
    students, mentors = load_data()
    # Calculate cosine similarities
    cosine_similarities = calculate_similarity_matrices(students, mentors)
    # Recommend mentors for the given student ID
    recommended_mentors = recommend_mentors_for_student(student_id, students, mentors, cosine_similarities)
    # Convert recommended mentors to JSON format
    recommended_mentors_json = recommended_mentors.to_json(orient='records')

    return jsonify(recommended_mentors_json)

mentors_df = pd.read_csv('mentors_with_id.csv')
@app.route('/mentors/<int:mentor_id>')
def get_mentor(mentor_id):
    mentor = mentors_df[mentors_df['id'] == mentor_id].to_dict(orient='records')
    print(mentor)
    if mentor:
        return jsonify(mentor[0]) 
    else:
        return jsonify({'error': 'Mentor not found'}), 404

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
