
def main():  
    print("Welcome to the advanced calculator!")  
    while True:  
        print("\nPlease select an operation:")  
        print("1. Add")  
        print("2. Subtract")  
        print("3. Multiply")  
        print("4. Divide")  
        print("5. Logarithm (base 10)")  
        print("6. Power")  
        print("7. Square Root")  
        print("8. Exit")  
        
        choice = input("Enter your choice (1-8): ")  
        
        if choice == '8':  
            print("Exiting the calculator. Goodbye!")  
            break  
        
        # Validation includes choices 1-8  
        if choice not in [str(i) for i in range(1, 9)]:  
            print("Invalid choice, please try again.")  
            continue  
        
        # Handle appropriate inputs  
        if choice in ['1', '2', '3', '4', '6']:  # Need two numbers  
            try:  
                num1 = float(input("Enter the first number: "))  
                num2 = float(input("Enter the second number: "))  
            except ValueError:  
                print("Invalid input! Please enter numeric values.")  
                continue  
        elif choice == '5':  # Logarithm  
            try:  
                num1 = float(input("Enter the number for logarithm (base 10): "))  
            except ValueError:  
                print("Invalid input! Please enter a numeric value.")  
                continue  
        elif choice == '7':  # Square root  
            try:  
                num1 = float(input("Enter the number to find the square root of: "))  
            except ValueError:  
                print("Invalid input! Please enter a numeric value.")  
                continue  

        # Perform the calculation  
        if choice == '1':  
            print(f"{num1} + {num2} = {add(num1, num2)}")  
        elif choice == '2':  
            print(f"{num1} - {num2} = {subtract(num1, num2)}")  
        elif choice == '3':  
            print(f"{num1} * {num2} = {multiply(num1, num2)}")  
        elif choice == '4':  
            result = divide(num1, num2)  
            print(f"{num1} / {num2} = {result}")  
        elif choice == '5':  
            result = logarithm(num1)  
            print(f"log10({num1}) =