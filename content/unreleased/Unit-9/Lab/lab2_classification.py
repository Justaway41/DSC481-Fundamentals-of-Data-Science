# Lab 2: Simple Classification with Scikit-learn

from sklearn.tree import DecisionTreeClassifier
import pandas as pd

# Example data: pass/fail based on marks
marks = [60, 65, 70, 75, 80]
pass_fail = [0, 0, 1, 1, 1]  # 0=fail, 1=pass
df = pd.DataFrame({'marks': marks, 'pass_fail': pass_fail})
X = df[['marks']]
y = df['pass_fail']
model = DecisionTreeClassifier()
model.fit(X, y)
predicted = model.predict([[68]])
print(f"Predicted pass/fail for 68 marks: {'Pass' if predicted[0] else 'Fail'}")
