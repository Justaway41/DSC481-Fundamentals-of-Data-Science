"""
Lab Exercise 3: Line Plot with Matplotlib

- Create a line plot for the average marks of students over 5 terms
- Label the axes and give the chart a title
- Plot another line on the same chart (e.g., attendance per term)
"""

import matplotlib.pyplot as plt

terms = ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5']
avg_marks = [75, 78, 80, 77, 82]
avg_attendance = [85, 88, 90, 87, 91]

plt.plot(terms, avg_marks, label='Average Marks')
plt.plot(terms, avg_attendance, label='Average Attendance')
plt.xlabel('Term')
plt.ylabel('Value')
plt.title('Average Marks and Attendance Over Terms')
plt.legend()
plt.show()
