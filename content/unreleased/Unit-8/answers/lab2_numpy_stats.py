"""
Lab Exercise 2: Descriptive Statistics with NumPy

- Convert a Pandas “marks” column to a NumPy array
- Calculate the mean and standard deviation using NumPy
- Find the minimum and maximum scores using NumPy
"""

import pandas as pd
import numpy as np

df = pd.read_csv('students.csv')
marks = df['marks'].to_numpy()

mean = np.mean(marks)
std = np.std(marks)
min_score = np.min(marks)
max_score = np.max(marks)

print(f"Mean: {mean}")
print(f"Standard Deviation: {std}")
print(f"Min: {min_score}")
print(f"Max: {max_score}")
