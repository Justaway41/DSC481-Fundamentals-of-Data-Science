# Practice / Lab Exercise
# - Download the Iris CSV: https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv
# - Load "iris.csv" using Pandas.
# - Print the shape of the DataFrame using df.shape.
# - Show column names with df.columns.

import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv")
print(df.shape)
print(df.columns)