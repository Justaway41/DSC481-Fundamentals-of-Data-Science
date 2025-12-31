# Practice / Lab Exercise
# - Use the URL: https://jsonplaceholder.typicode.com/users
# - Load the JSON data into a DataFrame.
# - Show the first 3 rows using df.head(3).
# - Print all usernames in the DataFrame.

import pandas as pd

url = "https://jsonplaceholder.typicode.com/users"
df = pd.read_json(url)
print(df.head(3))
print(df['username'])