# Practice / Lab Exercise
# - Load grades as before.
# - Normalize the Grade column using min-max, store as "Norm".
# - Print all students with Norm above 0.8.

import pandas as pd

df = pd.read_csv("../grades.csv")
df["Norm"] = (df["Grade"] - df["Grade"].min()) / (df["Grade"].max() - df["Grade"].min())
high_norm = df[df["Norm"] > 0.8]
print(high_norm)