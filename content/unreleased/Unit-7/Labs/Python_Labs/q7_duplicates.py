# Practice / Lab Exercise
# - Create a DataFrame with at least two duplicate rows.
# - Identify and count the duplicate rows.
# - Remove duplicates and show the cleaned DataFrame.

import pandas as pd

data = {"A": [1, 2, 2, 3], "B": [4, 5, 5, 6]}
df = pd.DataFrame(data)
print("Original DF:")
print(df)
print("Duplicates:")
print(df.duplicated())
print("Count:", df.duplicated().sum())
df_clean = df.drop_duplicates()
print("Cleaned DF:")
print(df_clean)