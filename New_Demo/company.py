from employee import Employee, SalaryEmployee, HourlyEmployee, CommissionEmployee

class Company:
    def __init__(self):
        self.employees = []

    def add_employee(self, new_employee):
        self.employees.append(new_employee)

    def display_employees(self):
        print('Current Employees:')
        for emp in self.employees:
            emp_type = type(emp).__name__
            print(f'{emp.fname} {emp.lname} ({emp_type})')
        print('--------------------')

    def pay_employees(self):
        print('Paying Employees:')
        for emp in self.employees:
            print('Paycheck for:', emp.fname, emp.lname)
            try:
                amount = emp.calculate_paycheck()
                print(f'Amount: ${amount:,.2f}')
            except AttributeError:
                print('Error: Could not calculate paycheck.')
            print('----------------------')

    def remove_employee(self, fname, lname):
        original_count = len(self.employees)
        self.employees = [emp for emp in self.employees if not (emp.fname == fname and emp.lname == lname)]
        if len(self.employees) < original_count:
            print(f'Employee {fname} {lname} removed.')
        else:
            print(f'Employee {fname} {lname} not found.')

    def find_employee(self, fname, lname):
        for emp in self.employees:
            if emp.fname == fname and emp.lname == lname:
                return emp
        return None

    def update_employee_salary(self, fname, lname, new_salary):
        emp = self.find_employee(fname, lname)
        if emp and isinstance(emp, SalaryEmployee):
            emp.salary = new_salary
            print(f'{fname} {lname}\'s salary updated to ${new_salary}.')
        else:
            print(f'Employee {fname} {lname} not found or not a SalaryEmployee.')

def main():
    my_company = Company()

    employee1 = SalaryEmployee('Sarah', 'Hess', 50000)
    my_company.add_employee(employee1)

    employee2 = HourlyEmployee('Lee', 'Smith', 25, 50)
    my_company.add_employee(employee2)

    employee3 = CommissionEmployee('Bob', 'Brown', 30000, 5, 200)
    my_company.add_employee(employee3)

    my_company.display_employees()
    my_company.pay_employees()

    # Example of removing an employee
    # my_company.remove_employee('Lee', 'Smith')
    # my_company.display_employees()

    # Example of updating a salary
    my_company.update_employee_salary('Sarah', 'Hess', 55000)

if __name__ == "__main__":
    main()