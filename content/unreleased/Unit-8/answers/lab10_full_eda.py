"""
Lab Exercise 10: Real-World EDA Scenario

- Given a sample DataFrame of students (marks, study hours, attendance)
- Step-by-step:
  - Compute mean, median, min, max
  - Plot a histogram for marks
  - Scatter plot marks vs study hours
  - Compute and interpret correlation matrix
"""

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('students.csv')

# Descriptive stats
print('Mean:', df['marks'].mean())
print('Median:', df['marks'].median())
print('Min:', df['marks'].min())
print('Max:', df['marks'].max())

# Histogram
plt.hist(df['marks'], bins=5)
plt.xlabel('Marks')
plt.ylabel('Count')
plt.title('Distribution of Marks')
plt.show()

# Scatter plot
plt.scatter(df['study_hours'], df['marks'])
plt.xlabel('Study Hours')
plt.ylabel('Marks')
plt.title('Study Hours vs Marks')
plt.show()

# Correlation matrix
print(df[['marks', 'study_hours', 'attendance']].corr())
