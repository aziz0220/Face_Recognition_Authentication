from flask import Flask, render_template, Response, request, redirect, session, url_for, jsonify
import face_recognition
import cv2
from flask_cors import CORS
import threading
import pymysql
import base64
import io
import numpy as np
from test import test


# Create a connection to the MySQL database using PyMySQL
import pymysql

db = pymysql.connect(
    host='db',
    user='root',
    password='',
    database='face_recognition',
    port=3306
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in the app

# Global variables
cap = None
current_frame = None
embeddings_unknown = np.empty((1, 128))
placeholder_image = cv2.imread('/app/static/placeholder.jpg')
ret, buffer = cv2.imencode('.jpg', placeholder_image)
no_frame = buffer.tobytes()
saved_frame = no_frame



def capture_frame():
    global cap, current_frame
    while True:
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                current_frame = frame
                
                

def generate_frames():
    global current_frame
    global frame
    if current_frame is None:
        print("Error: Failed to capture the frame")
        frame = no_frame
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        return
    while True:
        ret, buffer = cv2.imencode('.jpg', current_frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')




@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')



@app.route('/save_shot')
def save_shot():
    global saved_frame
    global current_frame
    global embeddings_unknown
    if current_frame is not None:
        embeddings_unknown = face_recognition.face_encodings(current_frame)
        if len(embeddings_unknown) == 0:
            return 'no person found'
        else:
            saved_frame = frame
        return 'picture saved successfully'
    else:
        return 'Camera is off.'


@app.route('/delete')
def delete():
    global saved_frame
    saved_frame = no_frame
    return 'Image deleted.'


@app.route('/register', methods=['POST'])
def register():
    global saved_frame
    username = request.form.get('username')
    password = request.form.get('password')
    if current_frame is not None:
        try:
            cursor = db.cursor()
            sql = "INSERT INTO users (username, password, face_image) VALUES (%s, %s, %s)"
            values = (username, password, saved_frame)
            cursor.execute(sql, values)
            db.commit()
            return redirect('/')
        except Exception as e:
            return f'Error occurred while saving the face image: {str(e)}'
    else:
        return 'No face image provided'


@app.route('/analyse_shot')
def analyse_shot():
    global saved_frame
    global current_frame
    global embeddings_unknown
    if current_frame is not None:
        label = test(
            image=current_frame,
            model_dir='/app/resources/anti_spoof_models',
            device_id=0
        )
        if label == 1:
            embeddings_unknown = face_recognition.face_encodings(current_frame)
            if len(embeddings_unknown) == 0:
                return 'no person found'
            else:
                saved_frame = frame
            return 'picture saved successfully'
        else:
            return 'fake picture'
    else:
        return 'Camera is off.'


@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    cursor = db.cursor()
    sql = "SELECT * FROM users WHERE username = %s"
    values = (username,)
    cursor.execute(sql, values)
    user = cursor.fetchone()

    if user and user[2] == password:
        session['username'] = user[1]
        return redirect(url_for('dashboard'))
    else:
        return 'Invalid username or password'


# ...

@app.route('/auth')
def auth():
    global embeddings_unknown
    submitted_encoding = embeddings_unknown[0]
    cursor = db.cursor()
    sql = "SELECT face_image FROM users"
    cursor.execute(sql)
    user_images = cursor.fetchall()
    match = False
    for user_image in user_images:
        face_image_binary = user_image[0]  # Assuming the face image is stored as a binary in the database
        # Attempt to load the face image from the binary data
        try:
            face_image = face_recognition.load_image_file(io.BytesIO(face_image_binary))
        except OSError as e:
            # Print the error message and continue to the next image
            print(f"Error loading image: {e}")
            continue

        # Encode the face from the database image
        face_encoding = face_recognition.face_encodings(face_image)
        if len(face_encoding) > 0:
            face_encoding = face_encoding[0]
            # Compare the face encodings
            match = face_recognition.compare_faces([face_encoding], submitted_encoding)[0]
            if match:
                    sql = "SELECT username FROM users WHERE face_image = %s"
                    values = (user_image,)
                    cursor.execute(sql, values)
                    user = cursor.fetchone()
                    session['username'] = user[0]
                    break

    if match:
        return redirect(url_for('dashboard'))
    else:
        return 'unknown_person'



@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
       return redirect(url_for('index'))
    username = session.get('username')
    cursor = db.cursor()
    sql = "SELECT face_image FROM users WHERE username = %s"
    values = (username,)
    cursor.execute(sql, values)
    user = cursor.fetchone()
    if user:
        face_image_binary = user[0]
        face_image = base64.b64encode(face_image_binary).decode('utf-8')
        return render_template('dashboard.html', face_image=face_image, username=username)
    else:
        return 'User not found'


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route('/is_face_detected')
def isFaceDetected():
    global current_frame
    if current_frame is None:
        return jsonify(False)
    
    embeddings_unknown = face_recognition.face_encodings(current_frame)
    return jsonify(len(embeddings_unknown) > 0)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))


if __name__ == '__main__':
    cap = cv2.VideoCapture(0)
    capture_thread = threading.Thread(target=capture_frame)
    capture_thread.start()
    app.run(host='0.0.0.0', port=8000)
