# Practice / Lab Exercise
# - Load "grades.xlsx" as before.
# - Print missing value counts for each column.
# - Fill missing "Grade" values with the average of that column.
# - Print all rows with missing "Name" entries (if any).

import pandas as pd

df = pd.read_csv("../grades.csv")
print(df.isnull().sum())
mean_grade = df['Grade'].mean()
df['Grade'] = df['Grade'].fillna(mean_grade)
missing_names = df[df['Name'].isnull()]
print(missing_names)