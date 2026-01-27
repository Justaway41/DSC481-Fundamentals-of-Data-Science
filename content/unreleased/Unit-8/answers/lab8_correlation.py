"""
Lab Exercise 8: Correlation Analysis with Pandas

- Create a DataFrame with marks, study hours, and attendance
- Calculate the correlation between study hours and marks
- Find which variables are most related
"""

import pandas as pd

df = pd.read_csv('students.csv')
corr_matrix = df[['marks', 'study_hours', 'attendance']].corr()
print(corr_matrix)

# Correlation between study_hours and marks
print('Correlation (study_hours, marks):', df['study_hours'].corr(df['marks']))
