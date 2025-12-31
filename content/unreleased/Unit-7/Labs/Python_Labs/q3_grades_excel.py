# Practice / Lab Exercise
# - Save the provided grades table as an Excel file "grades.xlsx":
#   StudentID,Name,Subject,Grade,Date
#   1001,Asha,Math,86,2025-05-15
#   1002,Raj,English,91,2025-05-17
#   1003,Lina,Science,,2025-05-19
#   1004,Tara,Math,72,2025-05-18
# - Load "grades.xlsx" and display the first 2 rows.
# - Print data types for all columns using df.dtypes.

import pandas as pd

df = pd.read_excel("grades.xlsx", sheet_name="Sheet1")
print(df.head())
print(df.dtypes)