"""
Lab Exercise 7: Seaborn Plots

- Create a Seaborn histogram of student marks
- Use sns.scatterplot for study hours vs marks in a DataFrame
- Try coloring (hue) points by grade or gender
"""

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('students.csv')
sns.histplot(df['marks'], bins=5)
plt.title('Distribution of Marks')
plt.show()

# Scatterplot with hue (assuming 'grade' column exists)
sns.scatterplot(x='study_hours', y='marks', hue='grade', data=df)
plt.title('Study Hours vs Marks by Grade')
plt.show()
