from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class School:
    def __init__(self):
        self.students = {}  # Format: {student_id: {student_data}}
        self.teachers = {}
        self.courses = {}
        self.student_courses = {}

    def add_student(self, student_data):
        student_id = student_data['studentID']
        
        if student_id in self.students:
            return {"error": "Student ID already exists"}, 400
        
        # Validate required fields
        required_fields = ['firstName', 'secondName', 'sex', 'age', 'level', 'parentPhone', 'studentID']
        for field in required_fields:
            if not student_data.get(field):
                return {"error": f"Missing required field: {field}"}, 400

        # Store the complete student data
        self.students[student_id] = {
            'first_name': student_data['firstName'],
            'second_name': student_data['secondName'],
            'other_name': student_data.get('otherName', ''),
            'sex': student_data['sex'],
            'age': student_data['age'],
            'level': student_data['level'],
            'parent_phone': student_data['parentPhone'],
            'student_id': student_id,
            'religion': student_data.get('religion', ''),
            'state': student_data.get('state', ''),
            'country': student_data.get('country', 'Nigeria')
        }
        
        # Initialize empty course list for the student
        self.student_courses[student_id] = []
        
        return {
            "message": "Student added successfully",
            "student_id": student_id,
            "name": f"{student_data['firstName']} {student_data['secondName']}"
        }, 201

    def add_teacher(self, teacher_id, name):
        if teacher_id in self.teachers:
            return {"error": "Teacher ID already exists"}, 400
        self.teachers[teacher_id] = name
        return {"message": f"Teacher {name} added successfully"}, 201

    def add_course(self, course_id, course_name, teacher_id):
        if course_id in self.courses:
            return {"error": "Course ID already exists"}, 400
        if teacher_id not in self.teachers:
            return {"error": "Teacher ID not found"}, 404
        self.courses[course_id] = {'name': course_name, 'teacher_id': teacher_id}
        return {"message": f"Course {course_name} added successfully"}, 201

    def enroll_student_in_course(self, student_id, course_id):
        if student_id not in self.students:
            return {"error": "Invalid student ID"}, 404
        if course_id not in self.courses:
            return {"error": "Invalid course ID"}, 404
        if course_id in self.student_courses[student_id]:
            return {"error": "Student already enrolled in this course"}, 400
            
        self.student_courses[student_id].append(course_id)
        return {
            "message": f"Student {self.students[student_id]['first_name']} enrolled in {self.courses[course_id]['name']}"
        }, 200

school = School()

@app.route("/add_student", methods=["POST"])
def add_student_route():
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        response, status_code = school.add_student(data)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_teacher", methods=["POST"])
def add_teacher_route():
    data = request.get_json()
    response, status_code = school.add_teacher(data['teacher_id'], data['name'])
    return jsonify(response), status_code

@app.route("/add_course", methods=["POST"])
def add_course_route():
    data = request.get_json()
    response, status_code = school.add_course(data['course_id'], data['course_name'], data['teacher_id'])
    return jsonify(response), status_code

@app.route("/enroll_student", methods=["POST"])
def enroll_student_route():
    data = request.get_json()
    response, status_code = school.enroll_student_in_course(data['student_id'], data['course_id'])
    return jsonify(response), status_code

@app.route("/form_add_student")
def form_add_student():
    return render_template("add_student.html")

@app.route("/students")
def list_students():
    return jsonify({
        "students": school.students,
        "count": len(school.students)
    })

@app.route("/")
def home():
    return '''
        <h1>School Management System</h1>
        <ul>
            <li><a href="/form_add_student">Add Student Form</a></li>
            <li><a href="/students">View All Students (JSON)</a></li>
        </ul>
    '''

if __name__ == "__main__":
    print("Flask is starting...")
    app.run(debug=True)