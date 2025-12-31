# Practice / Lab Exercise
# - Load the grades dataset.
# - Convert the Grade column to float (if not already).
# - Convert the Date column to datetime.
# - Print the DataFrame data types.

import pandas as pd

df = pd.read_csv("../grades.csv")
df["Grade"] = df["Grade"].astype(float)
df["Date"] = pd.to_datetime(df["Date"])
print(df.dtypes)