# Lab 4: Simple Dashboard with Plotly Dash

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
