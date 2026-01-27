"""
Lab Exercise 1: Descriptive Statistics with Pandas

- Load a CSV containing student marks
- Find the mean, median, and mode of the marks
- Find the minimum and maximum values
- Count the number of students scored above the average
"""

import pandas as pd

df = pd.read_csv('students.csv')

mean_marks = df['marks'].mean()
median_marks = df['marks'].median()
mode_marks = df['marks'].mode()[0]
min_marks = df['marks'].min()
max_marks = df['marks'].max()
count_above_avg = (df['marks'] > mean_marks).sum()

print(f"Mean: {mean_marks}")
print(f"Median: {median_marks}")
print(f"Mode: {mode_marks}")
print(f"Min: {min_marks}")
print(f"Max: {max_marks}")
print(f"Number of students above average: {count_above_avg}")
