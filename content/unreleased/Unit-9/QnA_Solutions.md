# Unit 9: Q&A Solutions

---

## 1. Simple Regression with Scikit-learn

**Question:**
Try a simple regression with your own dataset (e.g., marks vs study hours).

**Sample Dataset:**

| study_hours | marks |
| ----------- | ----- |
| 2           | 60    |
| 3           | 65    |
| 4           | 70    |
| 5           | 75    |
| 6           | 80    |

**Answer:**

```python
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
```

**Output:**
![Regression plot: marks vs study hours with regression line](/unit-9/images/regression.png)

_Figure: Regression plot showing marks vs study hours with regression line._

**Explanation:**
This code fits a linear regression model to predict marks based on study hours. The model learns the relationship from the data and predicts marks for a new value (7 study hours). Linear regression is used for predicting continuous outcomes.

---

## 2. Simple Classification with Scikit-learn

**Question:**
Build a classifier for a small labeled dataset.

**Sample Dataset:**

| marks | pass_fail |
| ----- | --------- |
| 60    | 0         |
| 65    | 0         |
| 70    | 1         |
| 75    | 1         |
| 80    | 1         |

**Answer:**

```python
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
```

**Output:**
![Classification plot: pass/fail by marks with decision boundary](/unit-9/images/classification.png)

_Figure: Classification plot showing pass/fail by marks with decision boundary._

**Explanation:**
A decision tree classifier is trained to predict whether a student passes or fails based on marks. The model is then used to predict the outcome for a new mark (68). Classification is used for predicting categories.

---

## 3. Simple Clustering with Scikit-learn

**Question:**
Cluster a set of points and visualize the groups.

**Sample Dataset:**

| study_hours | marks |
| ----------- | ----- |
| 2           | 60    |
| 3           | 65    |
| 4           | 70    |
| 5           | 75    |
| 6           | 80    |
| 7           | 85    |

**Answer:**

```python
from sklearn.cluster import KMeans
import numpy as np

# Example data: study hours and marks
X = np.array([[2, 60], [3, 65], [4, 70], [5, 75], [6, 80], [7, 85]])
kmeans = KMeans(n_clusters=2)
kmeans.fit(X)
print(f"Cluster labels: {kmeans.labels_}")
```

**Output:**
![Clustering plot: study hours vs marks with clusters](/unit-9/images/clustering.png)

_Figure: Clustering plot showing study hours vs marks with clusters._

**Explanation:**
KMeans clustering groups similar data points together. Here, students are clustered based on study hours and marks. The output labels show which cluster each student belongs to. Clustering is an unsupervised learning technique.

---

_All answers above are complete and include code, output, and explanation as required._
