---
marp: true
theme: default
paginate: true
---

# DSC 481 – Fundamentals of Data Science

## Unit IX: Introduction to Machine Learning with Python

### Teaching Hours: 6 (Condensed for 2 hours)

- Supervised vs Unsupervised Learning
- Regression, Classification, Clustering
- Using Scikit-learn for Model Building

---

# What is Machine Learning?

- Field of study that gives computers the ability to learn from data
- Used for prediction, classification, pattern recognition
- Powers applications like spam filters, recommendations, image recognition

---

# Types of Machine Learning

- **Supervised Learning**: Learn from labeled data (input + correct output)
  - Examples: Regression, Classification
- **Unsupervised Learning**: Find patterns in unlabeled data
  - Examples: Clustering, Dimensionality Reduction

---

# Supervised Learning

- **Regression**: Predict continuous values (e.g., house price)
- **Classification**: Predict categories (e.g., spam or not spam)
- Requires labeled data (features + target)

---

# Unsupervised Learning

- No target/labels, only features
- **Clustering**: Group similar data points (e.g., customer segments)
- **Dimensionality Reduction**: Reduce number of features (e.g., PCA)

---

# Machine Learning Workflow

1. Define the problem
2. Collect and prepare data
3. Choose a model/algorithm
4. Train the model
5. Evaluate performance
6. Make predictions

---

# Introduction to Scikit-learn

- Popular Python library for ML
- Simple API for regression, classification, clustering
- Works well with Pandas and NumPy

---

# Regression Example: Predicting House Prices

```python
from sklearn.linear_model import LinearRegression
import pandas as pd
# Example data
data = {'area': [1000, 1500, 2000], 'price': [200, 300, 400]}
df = pd.DataFrame(data)
X = df[['area']]
y = df['price']
model = LinearRegression()
model.fit(X, y)
print(model.predict([[1200]]))
```

---

# Classification Example: Spam Detection

```python
from sklearn.tree import DecisionTreeClassifier
X = [[0, 1], [1, 0], [0, 0], [1, 1]]  # Features
y = [0, 1, 0, 1]  # Labels (0=not spam, 1=spam)
model = DecisionTreeClassifier()
model.fit(X, y)
print(model.predict([[0, 1]]))
```

---

# Clustering Example: K-Means

```python
from sklearn.cluster import KMeans
import numpy as np
X = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]])
kmeans = KMeans(n_clusters=2)
kmeans.fit(X)
print(kmeans.labels_)
```

---

# Practice / Lab Exercise

- Try a simple regression with your own dataset (e.g., marks vs study hours)
- Build a classifier for a small labeled dataset
- Cluster a set of points and visualize the groups

---

# Key Points to Remember

- ML learns from data, not rules
- Supervised: regression/classification; Unsupervised: clustering
- Scikit-learn makes ML easy in Python
- Always evaluate your model’s performance

---

# End of Unit IX (Condensed)

- Practice: Try the code examples
- Explore real datasets
- Ask questions about ML applications

---

# References

- [Scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html) – Official documentation and tutorials for Scikit-learn
- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) – Free, interactive ML course by Google
- [Kaggle Learn: Python & Machine Learning](https://www.kaggle.com/learn/overview) – Hands-on micro-courses for ML and data science
- [Towards Data Science: ML for Beginners](https://towardsdatascience.com/machine-learning-for-beginners-d247a9420dab) – Blog articles and guides
- [StatQuest: Machine Learning Playlist](https://www.youtube.com/playlist?list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1) – YouTube videos explaining ML concepts visually
- [Awesome Machine Learning with Python](https://github.com/josephmisiti/awesome-machine-learning#python) – Curated list of ML libraries and resources

