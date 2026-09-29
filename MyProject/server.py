from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

# Replace with your Access database path
ACCESS_DB_PATH = r'C:\path\to\your\database.accdb'

def insert_student_to_db(data):
    try:
        # Connection string
        conn_str = (
            r'Driver={{Microsoft Access Driver (*.mdb, *.accdb)}};'
            f'DBQ={ACCESS_DB_PATH};'
        )
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        # Adjust the insert statement according to your table columns
        cursor.execute("""
            INSERT INTO Students (FirstName, SecondName, OtherName, Sex, Age, ClassLevel, ParentPhone, StudentID, Religion, State, Country, DateOfBirth, City)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get('First Name'),
            data.get('Second Name'),
            data.get('Other Name'),
            data.get('Sex'),
            data.get('Age'),
            data.get('Class Level'),
            data.get('Parent Phone'),
            data.get('Student ID'),
            data.get('Religion'),
            data.get('State'),
            data.get('Country'),
            data.get('Date of Birth'),
            data.get('City')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print("Error inserting into DB:", e)
        return False

@app.route('/register', methods=['POST'])
def register():
    data = request.form
    success = insert_student_to_db(data)
    if success:
        return jsonify({'status': 'success', 'message': 'Student registered successfully!'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to register student'}), 500

if __name__ == '__main__':
    app.run(debug=True)