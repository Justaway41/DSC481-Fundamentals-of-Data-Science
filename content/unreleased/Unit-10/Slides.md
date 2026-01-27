---
marp: true
theme: default
paginate: true
---

# DSC 481 – Fundamentals of Data Science

## Unit X: Data Visualization and Reporting

### Teaching Hours: 4 (Condensed for 2 hours)

- Advanced visualization: heatmaps, pair plots, interactive plots
- Creating dashboards with Plotly Dash

---

# Why Data Visualization?

- Makes complex data easy to understand
- Reveals patterns, trends, and outliers
- Essential for communicating insights
- Supports better decision making

---

# Advanced Visualization Techniques

- **Heatmaps**: Show values as colors in a matrix
- **Pair Plots**: Visualize relationships between all pairs of variables
- **Interactive Plots**: Allow users to explore data dynamically

---

# Heatmaps with Seaborn

```python
import seaborn as sns
import matplotlib.pyplot as plt
data = sns.load_dataset('iris')
corr = data.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()
```

- Useful for visualizing correlation matrices and large tables

---

# Pair Plots with Seaborn

```python
import seaborn as sns
data = sns.load_dataset('iris')
sns.pairplot(data, hue='species')
```

- Shows scatter plots for all variable pairs
- Diagonal shows distributions
- Color by category for deeper insights

---

# Interactive Plots with Plotly

```python
import plotly.express as px
data = px.data.iris()
fig = px.scatter(data, x='sepal_width', y='sepal_length', color='species')
fig.show()
```

- Interactive: zoom, hover, filter, select
- Great for presentations and dashboards

---

# Creating Dashboards with Plotly Dash

- Dash is a Python framework for building web dashboards
- Combine multiple interactive plots and controls
- Share insights with others easily

---

# Simple Dash App Example

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
    app.run_server(debug=True)
```

---

# Practice / Lab Exercise

- Create a heatmap for a correlation matrix
- Build a pair plot for a dataset with multiple features
- Make an interactive scatter plot with Plotly
- (Optional) Try running a simple Dash app

---

# Key Points to Remember

- Advanced visualizations reveal deeper insights
- Interactivity helps users explore data
- Dashboards combine multiple views for effective reporting
- Practice with real datasets for best learning

---

# References

- [Seaborn Documentation](https://seaborn.pydata.org/examples/index.html) – Gallery of advanced plots
- [Plotly Express Documentation](https://plotly.com/python/plotly-express/) – Interactive plotting in Python
- [Dash by Plotly](https://dash.plotly.com/introduction) – Build dashboards in Python
- [Practical Data Visualization with Python](https://realpython.com/python-data-visualization/) – Real Python guide
- [Awesome Dash Resources](https://github.com/ucg8j/awesome-dash) – Curated list of Dash apps and tutorials

---
