# Unit 10: Q&A Solutions

---

## 1. Correlation Heatmap with Seaborn

**Question:**
Create a heatmap for a correlation matrix.

**Definition: Correlation**
Correlation is a statistical measure that describes the strength and direction of a relationship between two variables. It ranges from -1 (perfect negative) to +1 (perfect positive), with 0 meaning no relationship.

**Sample Dataset:**

| sepal_length | sepal_width | petal_length | petal_width | species    |
| ------------ | ----------- | ------------ | ----------- | ---------- |
| 5.1          | 3.5         | 1.4          | 0.2         | setosa     |
| 4.9          | 3.0         | 1.4          | 0.2         | setosa     |
| 7.0          | 3.2         | 4.7          | 1.4         | versicolor |
| 6.4          | 3.2         | 4.5          | 1.5         | versicolor |
| 6.3          | 3.3         | 6.0          | 2.5         | virginica  |
| ...          | ...         | ...          | ...         | ...        |

**Answer:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

data = sns.load_dataset('iris')
numeric_data = data.select_dtypes(include='number')
corr = numeric_data.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()
```

**Output:**
![Correlation heatmap of iris dataset](/unit-10/images/heatmap.png)

_Figure: Correlation heatmap showing the correlation coefficients between all numeric columns in the iris dataset._

**Explanation:**
A correlation heatmap visually displays the strength and direction of relationships between variables.

**How to read this heatmap:**

- Each square shows the correlation between two variables (e.g., sepal length and petal width).
- Colors closer to red or blue mean a stronger positive or negative relationship.
- Values near +1 mean the variables increase together; values near -1 mean one increases as the other decreases.
- Values near 0 mean little or no relationship.

This helps you quickly spot which features are related in the dataset.

---

## 2. Pair Plot with Seaborn

**Question:**
Build a pair plot for a dataset with multiple features.

**Sample Dataset:**

| sepal_length | sepal_width | petal_length | petal_width | species    |
| ------------ | ----------- | ------------ | ----------- | ---------- |
| 5.1          | 3.5         | 1.4          | 0.2         | setosa     |
| 4.9          | 3.0         | 1.4          | 0.2         | setosa     |
| 7.0          | 3.2         | 4.7          | 1.4         | versicolor |
| 6.4          | 3.2         | 4.5          | 1.5         | versicolor |
| 6.3          | 3.3         | 6.0          | 2.5         | virginica  |
| ...          | ...         | ...          | ...         | ...        |

**Answer:**

```python
import seaborn as sns
import matplotlib.pyplot as plt

data = sns.load_dataset('iris')
sns.pairplot(data, hue='species')
plt.show()
```

**Output:**
![Pair plot of iris dataset colored by species](/unit-10/images/pairplot.png)

_Figure: Pair plot of iris dataset colored by species._

**Explanation:**
Pair plots show relationships between all pairs of variables in a dataset.

**How to read this pair plot:**

- Each small plot compares two features (e.g., sepal length vs petal width).
- Points are colored by species, so you can see how groups differ.
- Diagonal plots show the distribution of each feature.
- Look for clusters or separations between colors to spot patterns.

Coloring by species helps reveal patterns and separations between groups.

---

## 3. Interactive Scatter Plot with Plotly

**Question:**
Make an interactive scatter plot with Plotly.

**Sample Dataset:**

| sepal_length | sepal_width | petal_length | petal_width | species    |
| ------------ | ----------- | ------------ | ----------- | ---------- |
| 5.1          | 3.5         | 1.4          | 0.2         | setosa     |
| 4.9          | 3.0         | 1.4          | 0.2         | setosa     |
| 7.0          | 3.2         | 4.7          | 1.4         | versicolor |
| 6.4          | 3.2         | 4.5          | 1.5         | versicolor |
| 6.3          | 3.3         | 6.0          | 2.5         | virginica  |
| ...          | ...         | ...          | ...         | ...        |

**Answer:**

```python
import plotly.express as px

data = px.data.iris()
fig = px.scatter(data, x='sepal_width', y='sepal_length', color='species')
fig.show()
```

**Output:**
![Plotly scatter plot of sepal width vs sepal length colored by species](/unit-10/images/plotly_scatter.png)

_Figure: Plotly scatter plot of sepal width vs sepal length colored by species._

**Explanation:**
Plotly creates interactive plots that allow users to explore data dynamically.

**How to read this scatter plot:**

- Each point shows a flower's sepal width and sepal length.
- Points are colored by species, so you can compare groups.
- You can hover over points to see details or zoom in for a closer look.
- Patterns or clusters in the plot can show how species differ.

This is useful for presentations and dashboards.

---

## 4. Simple Dashboard with Plotly Dash

**Question:**
(Optional) Try running a simple Dash app.

**Answer:**

```python
import dash
from dash import dcc, html
import plotly.express as px

app = dash.Dash(__name__)
data = px.data.iris()
fig = px.scatter(data, x='sepal_width', y='sepal_length', color='species')

app.layout = html.Div([
    html.H1('Iris Dashboard'),
    dcc.Graph(figure=fig)
])

if __name__ == '__main__':
    app.run(debug=True)
```

**Output:**
A web dashboard displaying an interactive scatter plot of the iris dataset.

**Explanation:**
Dash lets you build interactive web dashboards in Python. This example creates a simple dashboard with a single plot, but Dash can combine many plots and controls for more complex reporting.

---

_All answers above are complete and include code, output, and explanation as required._
