from flask import Flask, render_template, request, redirect, url_for
import pyodbc

app = Flask(__name__)

# Database connection string
# Update the path to your Access database file
conn_str = (
    r'Driver={{Microsoft Access Driver (*.mdb, *.accdb)}};'
    r'DBQ=PATH_TO_YOUR_DATABASE.accdb;'
)

# Route for displaying registration form
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Collect form data
        first_name = request.form.get('first_name')
        second_name = request.form.get('second_name')
        other_name = request.form.get('other_name')
        sex = request.form.get('sex')
        age = request.form.get('age')
        class_level = request.form.get('class_level')
        parent_phone = request.form.get('parent_phone')
        student_id = request.form.get('student_id')
        religion = request.form.get('religion')
        state = request.form.get('state')
        country = request.form.get('country')
        date_of_birth = request.form.get('date_of_birth')
        city_location = request.form.get('city_location')

        # Connect to the database
        try:
            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()

            # Insert data into the Students table
            cursor.execute('''
                INSERT INTO Students (
                    first_name, second_name, other_name, sex, age, class_level,
                    parent_phone, student_id, religion, state, country, date_of_birth, city_location
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (
                    first_name, second_name, other_name, sex, age, class_level,
                    parent_phone, student_id, religion, state, country, date_of_birth, city_location
                )
            )

            conn.commit()
            conn.close()

            return redirect(url_for('success'))
        except Exception as e:
            print(f"Error: {e}")
            return "There was an error saving data."

    return render_template('register.html')  # Render your registration form template

# Success page
@app.route('/success')
def success():
    return "Registration successful!"

if __name__ == '__main__':
    app.run(debug=True)