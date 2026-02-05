# Lab 1: Simple Regression with Scikit-learn

from sklearn.linear_model import LinearRegression
import pandas as pd

# Example data: marks vs study hours
marks = [60, 65, 70, 75, 80]
study_hours = [2, 3, 4, 5, 6]
df = pd.DataFrame({'study_hours': study_hours, 'marks': marks})
X = df[['study_hours']]
y = df['marks']
model = LinearRegression()
model.fit(X, y)
X_new = pd.DataFrame({'study_hours': [7]})
predicted = model.predict(X_new)
print(f"Predicted marks for 7 study hours: {predicted[0]:.2f}")
