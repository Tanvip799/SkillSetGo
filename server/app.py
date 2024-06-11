from flask import Flask, request, jsonify
from pymongo import MongoClient
import google.generativeai as genai
import pprint
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
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
    mentors = pd.read_csv('mentors.csv')

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
