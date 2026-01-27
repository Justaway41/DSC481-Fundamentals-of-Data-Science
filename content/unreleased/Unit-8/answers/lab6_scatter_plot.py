"""
Lab Exercise 6: Scatter Plot with Matplotlib

- Given lists of study time and student marks
- Plot study time vs marks as a scatter plot
- Comment on any pattern or relationship you observe
"""

import matplotlib.pyplot as plt

study_hours = [2, 3, 4, 5, 6, 7]
marks = [60, 65, 70, 75, 80, 85]

plt.scatter(study_hours, marks)
plt.xlabel('Hours Studied')
plt.ylabel('Marks Obtained')
plt.title('Study Hours vs Marks')
plt.show()
