# School Management System  

class School:  
    def __init__(self):  
        self.students = {}  # key: student_id, value: student_name  
        self.teachers = {}  # key: teacher_id, value: teacher_name  
        self.courses = {}  # key: course_id, value: {'name': course_name, 'teacher_id': teacher_id}  
        self.student_courses = {}  # key: student_id, value: list of course_ids  

    # Student Methods  
    def add_student(self, student_id, name):  
        if student_id not in self.students:  
            self.students[student_id] = name  
            self.student_courses[student_id] = []  
            print(f"Student {name} added successfully.")  
        else:  
            print("Student ID already exists.")  

    def view_students(self):  
        print("Students List:")  
        for sid, name in self.students.items():  
            print(f"{sid}: {name}")  

    def remove_student(self, student_id):  
        if student_id in self.students:  
            del self.students[student_id]  
            del self.student_courses[student_id]  
            print("Student removed successfully.")  
        else:  
            print("Student ID not found.")  

    # Teacher Methods  
    def add_teacher(self, teacher_id, name):  
        if teacher_id not in self.teachers:  
            self.teachers[teacher_id] = name  
            print(f"Teacher {name} added successfully.")  
        else:  
            print("Teacher ID already exists.")  

    def view_teachers(self):  
        print("Teachers List:")  
        for tid, name in self.teachers.items():  
            print(f"{tid}: {name}")  

    def remove_teacher(self, teacher_id):  
        if teacher_id in self.teachers:  
            del self.teachers[teacher_id]  
            print("Teacher removed successfully.")  
            # Also remove courses taught by this teacher  
            to_remove = [cid for cid, course in self.courses.items() if course['teacher_id'] == teacher_id]  
            for cid in to_remove:  
                del self.courses[cid]  
        else:  
            print("Teacher ID not found.")  

    # Course Methods  
    def add_course(self, course_id, course_name, teacher_id):  
        if course_id not in self.courses:  
            if teacher_id in self.teachers:  
                self.courses[course_id] = {'name': course_name, 'teacher_id': teacher_id}  
                print(f"Course {course_name} added successfully.")  
            else:  
                print("Teacher ID not found.")  
        else:  
            print("Course ID already exists.")  

    def view_courses(self):  
        print("Courses List:")  
        for cid, data in self.courses.items():  
            teacher_name = self.teachers.get(data['teacher_id'], "Unknown")  
            print(f"{cid}: {data['name']} (Taught by: {teacher_name})")  

    def remove_course(self, course_id):  
        if course_id in self.courses:  
            del self.courses[course_id]  
            print("Course removed successfully.")  
            # Remove course from all students  
            for student_id in self.student_courses:  
                if course_id in self.student_courses[student_id]:  
                    self.student_courses[student_id].remove(course_id)  
        else:  
            print("Course ID not found.")  

    # Enrollment  
    def enroll_student_in_course(self, student_id, course_id):  
        if student_id in self.students and course_id in self.courses:  
            if course_id not in self.student_courses[student_id]:  
                self.student_courses[student_id].append(course_id)  
                print(f"Student {self.students[student_id]} enrolled in {self.courses[course_id]['name']}.")  
            else:  
                print("Student already enrolled in this course.")  
        else:  
            print("Invalid student ID or course ID.")  

    # View Student Courses  
    def view_student_courses(self, student_id):  
        if student_id in self.students:  
            print(f"Courses for {self.students[student_id]}:")  
            for cid in self.student_courses[student_id]:  
                course_name = self.courses[cid]['name']  
                print(f"{cid}: {course_name}")  
        else:  
            print("Student ID not found.")  

def main():  
    school = School()  

    while True:  
        print("\n--- School Management System ---")  
        print("1. Add Student")  
        print("2. View Students")  
        print("3. Remove Student")  
        print("4. Add Teacher")  
        print("5. View Teachers")  
        print("6. Remove Teacher")  
        print("7. Add Course")  
        print("8. View Courses")  
        print("9. Remove Course")  
        print("10. Enroll Student in Course")  
        print("11. View Student's Courses")  
        print("12. Exit")  
        choice = input("Enter your choice: ")  

        if choice == '1':  
            student_id = input("Enter student ID: ")  
            name = input("Enter student name: ")  
            school.add_student(student_id, name)  
        elif choice == '2':  
            school.view_students()  
        elif choice == '3':  
            student_id = input("Enter student ID to remove: ")  
            school.remove_student(student_id)  
        elif choice == '4':  
            teacher_id = input("Enter teacher ID: ")  
            name = input("Enter teacher name: ")  
            school.add_teacher(teacher_id, name)  
        elif choice == '5':  
            school.view_teachers()  
        elif choice == '6':  
            teacher_id = input("Enter teacher ID to remove: ")  
            school.remove_teacher(teacher_id)  
        elif choice == '7':  
            course_id = input("Enter course ID: ")  
            course_name = input("Enter course name: ")  
            teacher_id = input("Enter teacher ID for this course: ")  
            school.add_course(course_id, course_name, teacher_id)  
        elif choice == '8':  
            school.view_courses()  
        elif choice == '9':  
            course_id = input("Enter course ID to remove: ")  
            school.remove_course(course_id)  
        elif choice == '10':  
            student_id = input("Enter student ID: ")  
            course_id = input("Enter course ID: ")  
            school.enroll_student_in_course(student_id, course_id)  
        elif choice == '11':  
            student_id = input("Enter student ID: ")  
            school.view_student_courses(student_id)  
        elif choice == '12':  
            print("Exiting the system.")  
            break  
        else:  
            print("Invalid choice. Please try again.")  

if __name__ == "__main__":  
    main()  