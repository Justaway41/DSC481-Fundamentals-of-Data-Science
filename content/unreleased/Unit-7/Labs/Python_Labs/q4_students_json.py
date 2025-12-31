# Practice / Lab Exercise
# - Create a file "students.json" with:
#   [
#     {"id":1, "name":"Sita", "marks":88},
#     {"id":2, "name":"John", "marks":76}
#   ]
# - Load "students.json" using Pandas.
# - Print the DataFrame's info using df.info().
# - Save the DataFrame to "students_out.csv".

import pandas as pd

df = pd.read_json("../students.json")
print(df.info())
df.to_csv("../students_out.csv", index=False)