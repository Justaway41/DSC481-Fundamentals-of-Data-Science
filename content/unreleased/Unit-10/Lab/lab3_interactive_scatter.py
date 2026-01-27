# Lab 3: Interactive Scatter Plot with Plotly

import plotly.express as px

data = px.data.iris()
fig = px.scatter(data, x='sepal_width', y='sepal_length', color='species')
fig.show()
