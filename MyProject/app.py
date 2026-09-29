from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pyodbc
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Microsoft Access DB Connection ---
conn_str = (
    r'Driver={Microsoft Access Driver (*.mdb, *.accdb)};'
    r'DBQ=C:\Users\KolawoleAbel\OneDrive - RELIANCE INFOSYSTEMS LIMITED\Documents\Pluralsight Folder\MyProject\StudentData.accdb;'
)

def create_connection():
    return pyodbc.connect(conn_str)

# --- Routes ---
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/form_add_student")
def form_add_student():
    return render_template("add_student.html")

@app.route("/add_student", methods=["POST"])
def add_student():
    try:
        # Get data from form (either JSON or form-data)
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()

        # Required fields validation
        required_fields = ["firstName", "secondName", "sex", "age", "level", 
                           "parentPhone", "studentID"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"'{field}' is required"}), 400

        conn = create_connection()
        cursor = conn.cursor()

        # Check if student ID already exists
        cursor.execute("SELECT 1 FROM Students WHERE student_id = ?", (data["studentID"],))
        if cursor.fetchone():
            return jsonify({"error": "Student ID already exists"}), 400

        # Insert new student
        cursor.execute('''
            INSERT INTO Students (
                first_name, second_name, other_name, sex, age,
                class_level, parent_phone, student_id, religion,
                state, country, date_of_birth, city_location
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data["firstName"],
            data["secondName"],
            data.get("otherName", ""),
            data["sex"],
            int(data["age"]),
            data["level"],
            data["parentPhone"],
            data["studentID"],
            data.get("religion", ""),
            data.get("state", ""),
            data.get("country", "Nigeria"),
            data.get("dateOfBirth", ""),          # optional date field
            data.get("cityLocation", "")          # optional city field
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Student added successfully!",
            "student_id": data["studentID"],
            "name": f"{data['firstName']} {data['secondName']}"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/students")
def list_students():
    try:
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")
        columns = [column[0] for column in cursor.description]
        students = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return render_template("students.html", students=students)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Start Flask App ---
if __name__ == "__main__":
    app.run(debug=True)
