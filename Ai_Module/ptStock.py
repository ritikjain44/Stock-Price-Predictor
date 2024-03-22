import mysql.connector
from datetime import datetime
from datetime import timezone

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Ruvin@123",
  database="tempdatabase"
)

print(mydb)

mycursor = mydb.cursor()

mycursor.execute("SHOW TABLES")

for x in mycursor:
  print(x)
'''  
import json

# Open the JSON file
with open("stock-data.json", "r") as file:
    # Load the data from the file into a variable
    stock_prices = json.load(file)


# Insert the data into the database table
for data in stock_prices:
  query = "INSERT INTO stock_prices (date, open, high, low, close, volume) VALUES (%s, %s, %s, %s, %s, %s)"
  mycursor.execute(query, (datetime.fromisoformat(data['x'][:-1]).astimezone(timezone.utc).strftime('%Y-%m-%d'), data["open"], data["high"], data["low"], data["close"], data["volume"]))

# Commit the changes to the database
mydb.commit()
'''

mycursor.execute("SELECT * FROM stock_prices")

myresult = mycursor.fetchall()

for date, open, high, low, close, volume in myresult:
  print(date, open, high, low, close, volume)



# Close the cursor and the connection
mycursor.close()
mydb.close()

#mysql -u root -p