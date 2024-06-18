from flask import Flask, request, jsonify
from pymongo import MongoClient
import google.generativeai as genai
import pandas as pd
from bson.objectid import ObjectId
from bson.json_util import dumps
from bson.json_util import loads
import json
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
    mentors = pd.read_csv('extended_mentors.csv')

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
    
@app.route('/login', methods=['POST'])
def login():
    users = db.users
    data = request.json
    email = data['email']
    password = data['password']
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

# @app.route('/inset_user_data', methods=['POST'])
# def insert_user_data():
#     data = request.json
#     userId = data['userId']
#     userData = db.userData
#     userData.insert_one(data)
#     return jsonify({
#         'message': 'User data inserted successfully'
#     }), 200

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
    comment = {
        'communityId': data['communityId'],
        'commentHeading': data['commentHeading'],
        'commentContent': data['commentContent'],
        'commentorId': data['commentorId'],
        'likes': 0,
        'likedBy': [],
        'parentId': None,
        'reply': None
    }
    comments = db.comments
    comments.insert_one(comment)
    return jsonify({
        'message': 'Comment created successfully'
    }), 200

@app.route('/get_doubts/<string:community_id>/<string:user_id>', methods=['GET'])
def get_doubts(community_id, user_id):
    comments = db.comments
    users = db.users
    communities = db.communities
    communityData = communities.find_one({'_id': ObjectId(community_id)})
    communityData['_id'] = str(communityData['_id'])
    doubts = list(comments.find({'communityId': community_id, 'parentId': None}))
    commentors = []
    isLiked = []
    for doubt in doubts:
        doubt['_id'] = str(doubt['_id'])
        commentor = users.find_one({'_id': ObjectId(doubt['commentorId'])})
        if user_id in doubt['likedBy']:
            isLiked.append(True)
        else:
            isLiked.append(False)
        commentors.append(commentor['username'])
    if doubts:
        return jsonify({'doubts': doubts, 'commentors': commentors, 'isLiked': isLiked, 'communityData': communityData}), 200
    return jsonify({'message': 'No doubts found', 'communityData': communityData, 'doubts': []})

@app.route('/like_doubt', methods=['POST'])
def like_doubt():
    data = request.json
    comments = db.comments
    userId = data['userId']
    comment = comments.find_one({'_id': ObjectId(data['commentId'])})
    if data['like'] == True:
        comments.update_one({'_id': ObjectId(data['commentId'])}, {"$set": {'likes': comment['likes'] + 1}, "$addToSet": {'likedBy': userId}})
    else:
        comments.update_one({'_id': ObjectId(data['commentId'])}, {"$set": {'likes': comment['likes'] - 1}, "$pull": {'likedBy': userId}})
    return jsonify({
        'message': 'Like updated successfully'
    }), 200

@app.route('/answer_doubt', methods=['POST'])
def answer_doubt():
    data = request.json
    reply = data['reply']
    comment = {
        'communityId': data['communityId'],
        'commentHeading': data['commentHeading'],
        'commentContent': data['commentContent'],
        'commentorId': data['commentorId'],
        'likes': 0,
        'likedBy': [],
        'parentId': data['parentId'],
        'reply': reply
    }
    comments = db.comments
    comments.insert_one(comment)
    return jsonify({
        'message': 'Comment created successfully'
    }), 200


@app.route('/get_responses/<string:comment_id>/<string:user_id>', methods=['GET'])
def get_responses(comment_id, user_id):
    comments = db.comments
    users = db.users
    
    responses = list(comments.find({'parentId': comment_id}))
    parentComment = comments.find_one({'_id': ObjectId(comment_id)})
    parentComment['_id'] = str(parentComment['_id'])
    
    doubtAsker = users.find_one({'_id': ObjectId(parentComment['commentorId'])})
    doubtAsker = doubtAsker['username']
    
    if responses:
        responses.sort(key=lambda x: x['likes'], reverse=True)
        commentors = []
        isLiked = []
        repliedTo = []
        
        for response in responses:
            if response['reply']:
                repliedTo.append(users.find_one({'_id': ObjectId(response['reply'])})['username'])
                
            response['_id'] = str(response['_id'])
            commentor = users.find_one({'_id': ObjectId(response['commentorId'])})
            commentors.append(commentor['username'])
            
            if user_id in response.get('likedBy', []):
                isLiked.append(True)
            else:
                isLiked.append(False)
        
        return jsonify({
            'responses': responses,
            'commentors': commentors,
            'isLiked': isLiked,
            'parentComment': parentComment,
            'doubtAsker': doubtAsker,
            'repliedTo': repliedTo  # Include repliedTo here
        }), 200
    
    # If there are no responses
    return jsonify({
        'message': 'No responses found',
        'responses': [],
        'doubtAsker': doubtAsker,
        'parentComment': parentComment,
        'repliedTo': []  # Ensure repliedTo is initialized as an empty list
    }), 200

@app.route('/delete_comment/<string:comment_id>/', methods=['DELETE'])
def delete_comment(comment_id):
    comments = db.comments
    comments.delete_one({'_id': ObjectId(comment_id)})
    comments.delete_many({'parentId': comment_id})
    return jsonify({
        'message': 'Comment deleted successfully'
    }), 200

@app.route('/mentorship',methods=['GET'])
def mentor():
    student_id = 455
    students, mentors = load_data()
    cosine_similarities = calculate_similarity_matrices(students, mentors)
    recommended_mentors = recommend_mentors_for_student(student_id, students, mentors, cosine_similarities)
    recommended_mentors_json = recommended_mentors.to_json(orient='records')

    return jsonify(recommended_mentors_json)

mentors_df = pd.read_csv('extended_mentors.csv')
@app.route('/mentorship/<int:mentor_id>')
def get_mentor(mentor_id):
    mentor = mentors_df[mentors_df['id'] == mentor_id].to_dict(orient='records')
    print(mentor)
    if mentor:
        return jsonify(mentor[0]) 
    else:
        return jsonify({'error': 'Mentor not found'}), 404
    
@app.route('/assign_mentor', methods=['POST'])
def assign_mentor():
    data = request.json
    mentors = db.mentors
    mentors.insert_one(data['mentorDetails'])
    return jsonify({
        'message': 'Mentor assigned successfully'
    }), 200

@app.route('/chatbot', methods=['POST'])
def chatbot():
    model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    )
    
    chat_session = model.start_chat(history=request.json['history'])
    msg = request.json['message']
    response = chat_session.send_message(msg)
    text = response.text
    return text

@app.route('/make_roadmap', methods=['POST'])
def get_roadmap():
    data = request.json
    roadmaps = db.roadmaps
    userData = db.userData
    userData.insert_one(data)
    model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    )
    chat_session = model.start_chat(history=[])
    prompt = f"""
        User Inputs:

        Current Year of Engineering: {data['currentYear']}
        Desired Job Role: {data['jobRole']}
        Preferred Industry: {data['industry']}
        Technology Interests: {data['techInterests']}
        Career Aspirations: {data['aspirations']}
        Academic Background:
        Field of study: {data['curFieldOfStudy']}
        GPA: {data['gpa']}
        Academic achievements: {data['achievements']}
        Coursework:
        Relevant courses: {data['coursework']}
        Projects: {data['projects']}
        Time of Campus Placement: {data['placementTime']}
        Brief Description of Previous Experience and Knowledge: {data['prevExperience']}
        Frequency of Study Sessions: {data['studyFrequency']}
        Length of Each Study Session: {data['studyDuration']}
        Roadmap Design Structure:
        This roadmap is for an Indian student studying in an Indian engineering college. The roadmap generated should also take into consideration the other inputs provided by the user. Say, for example, the user has entered Finance as their preferred industry; then there should be a module dedicated to the application of the job role in that industry and how the learned modules are important in that field. Another example would be if the user entered their career aspirations as MNC, then the Interview prep module should be according to the interview setting of an MNC. Similarly, other input parameters of the user should also be considered.
        
        Next, the entered description of their previous experience should be analyzed, and all the topics that the user already knows but are to be included in the roadmap should be given less emphasis on, and the allotted time should be adjusted accordingly. It is crucial that every module will end with a project which would be a real-life application of all the subtopics covered in the entire module. It is also important that the last milestone/module of the roadmap would be the interview prep module, which would include important interview questions subtopics and everything relevant to the interview prep for the desired job role according to the Indian job placement environment.
        
        Now, each module will be designated a time, like it could be one week or two weeks, and this should be based on the subtopics in the module. It should take into account the frequency of the study sessions and the length of each study session entered by the user and then accordingly calculate a suitable time in weeks for each module. The last important thing is that the roadmap's total time should be such that it aligns with the campus placement time. It should be completed before the month of campus placement and should provide the user enough time to prepare for their placement. The time assigned to each module should be such that the total aligns with the time of campus placement starting from the day of the roadmap generation.
        
        JSON Format:
        The output should strictly be in JSON format(no additional text required) with the following structure, ensuring consistency across all outputs:
        
        {{
          "roadmap": [
            {{
              "module": "Module Name",
              "subtopics": [
                {{
                  "subtopic": "Subtopic1",
                  "difficulty_level": 1-10
                }},
                {{
                  "subtopic": "Subtopic2",
                  "difficulty_level": 1-10
                }}
                ...
              ],
              "project": "Project Description",
              "duration_weeks": Number of Weeks
            }}
            ...
          ],
          "total_duration_weeks": Total Duration in Weeks,
          "completion_date": "Completion Date"
        }}
        Additional Notes:
        
        Ensure each module is specific and well-divided, avoiding overly broad or generic coverage.
        Take into account the user's previous experience and knowledge, giving less emphasis on topics the user is already familiar with.
        Align the total duration of the roadmap with the time of campus placement, ensuring the user is fully prepared by the start of the placement season.
        Another important thing to take care of is that the projects that you provide at the end of each module should not be generic like build a simple app or build a simple website etc. Instead, give the user a specific project like analyze the given dataset and train so-and-so model, build a calculator app with a UI description that you will give, or a proper case study of a company for EDA and model development etc.
        Your task is to generate a personalized roadmap for the user based on the provided inputs. The roadmap structure and modules should be according to the given roadmap structure design. The final output should be in the given JSON format and should only contain the JSON object and nothing else.
    """
    
    response = chat_session.send_message(prompt)
    try:
        # Remove the "```json" and "```" markers from the response text
        cleaned_response_text = response.text.strip().strip("```json").strip("```")
        
        # Parse the cleaned response text to a JSON object
        roadmap_json = json.loads(cleaned_response_text)
        
        # Insert the JSON object into the 'roadmaps' collection
        roadmaps.insert_one({'userId': data['userId'], 'roadmap': roadmap_json})
        
        return jsonify({'response': roadmap_json, 'message': 'Roadmap generated and stored successfully'}), 200
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode JSON from response'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_roadmap/<string:user_id>', methods=['GET'])
def get_roadmap_data(user_id):
    roadmaps = db.roadmaps
    roadmap = roadmaps.find_one({'userId': user_id})
    if roadmap:
        roadmap['_id'] = str(roadmap['_id'])
        return jsonify(roadmap), 200
    return jsonify({'message': 'No roadmap found'}), 404

@app.route('/get_todo_list/<string:user_id>',methods = ['GET'])
def get_todo(user_id):
    todos = db.todos
    todoList = list(todos.find({'userId':user_id}))
    print(todoList)
    for todo in todoList:
        todo["_id"]=str(todo["_id"])
    return jsonify({"todoList": todoList})   

@app.route('/add_todo',methods = ['POST'])
def add_todo():
    data = request.json
    todos = db.todos
    todos.insert_one(data)
    return jsonify({"message":"Todo added successfully"})

if __name__ == '__main__':
    app.run(debug=True)
