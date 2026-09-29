
#Get details of loan
money_owed = float(input('How much money do you owe, in dollars?\n')) # $50,00
apr = float(input('What is the annual percentage rate of the loan?\n')) # 3%
payment = float(input('How much will you pay off each month in dollars?\n')) # $1,000
months = int(input('How many months do you want to see the results for?\n')) #24

monthly_rate = apr/100/12

for i in range(months):
# Calculate interest to pay
interest_paid = money_owed*monthly_rate


# Add in interest
money_owed = money_owed + interest_paid

# make payment
money_owed = money_owed - payment

print('paid', payment, 'of which', interest_paid, 'was interest')
print('Now I owe', money_owed)