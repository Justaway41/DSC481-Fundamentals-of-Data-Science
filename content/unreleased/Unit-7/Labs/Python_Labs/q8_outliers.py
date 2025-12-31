# Practice / Lab Exercise
# - Use "grades.xlsx" with student grades.
# - Calculate Q1, Q3, and IQR for the Grade column.
# - Identify all outlier grade values.
# - Print rows that contain outlier grades.

import pandas as pd

df = pd.read_csv("../grades.csv")
Q1 = df["Grade"].quantile(0.25)
Q3 = df["Grade"].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
outliers = df[(df["Grade"] < lower) | (df["Grade"] > upper)]
print(outliers)