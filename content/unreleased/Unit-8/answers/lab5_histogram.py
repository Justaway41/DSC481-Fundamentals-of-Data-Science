"""
Lab Exercise 5: Histogram with Matplotlib

- Use a student marks dataset
- Create a histogram of the marks
- Experiment with different bin sizes
- Interpret the most frequent score range
"""

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('students.csv')
marks = df['marks']

plt.hist(marks, bins=5)
plt.xlabel('Marks')
plt.ylabel('Count')
plt.title('Distribution of Marks')
plt.show()
