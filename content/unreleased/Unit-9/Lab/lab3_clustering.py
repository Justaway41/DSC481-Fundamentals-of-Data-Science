# Lab 3: Simple Clustering with Scikit-learn

from sklearn.cluster import KMeans
import numpy as np

# Example data: study hours and marks
X = np.array([[2, 60], [3, 65], [4, 70], [5, 75], [6, 80], [7, 85]])
kmeans = KMeans(n_clusters=2)
kmeans.fit(X)
print(f"Cluster labels: {kmeans.labels_}")
