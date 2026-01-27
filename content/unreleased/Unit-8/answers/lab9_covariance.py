"""
Lab Exercise 9: Covariance Analysis with Pandas

- Use a DataFrame with marks, study hours, and attendance
- Calculate covariance between all columns
- Discuss whether positive results match expected relationships
"""

import pandas as pd

df = pd.read_csv('students.csv')
cov_matrix = df[['marks', 'study_hours', 'attendance']].cov()
print(cov_matrix)
