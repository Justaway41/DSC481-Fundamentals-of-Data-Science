"""
Lab Exercise 4: Bar Chart with Matplotlib

- Read a dataset with 4 subjects’ marks per student
- Compute average marks per subject
- Create a bar chart for the averages
- Add a suitable title and y-axis label
"""

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('students.csv')
subjects = ['Math', 'Science', 'English', 'Nepali']
avg_marks = [df[subj].mean() for subj in subjects]

plt.bar(subjects, avg_marks)
plt.ylabel('Average Marks')
plt.title('Marks by Subject')
plt.show()
