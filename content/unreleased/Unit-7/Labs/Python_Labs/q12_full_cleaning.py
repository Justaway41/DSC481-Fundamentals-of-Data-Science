# Practice / Lab Exercise
# - Obtain a sample student grades Excel or CSV file.
# - Clean the data using steps:
#   1. Fill missing grades with the mean value.
#   2. Remove any duplicate records.
#   3. Identify and remove outlier grades.
#   4. Normalize the Grade column.
#   5. Convert columns to correct data types.
# - Save the cleaned data to a new file.

import pandas as pd

df = pd.read_csv("../grades.csv")

# Fill missing grades with mean
mean_grade = df['Grade'].mean()
df['Grade'] = df['Grade'].fillna(mean_grade)

# Remove duplicates
df = df.drop_duplicates()

# Remove outliers
Q1 = df["Grade"].quantile(0.25)
Q3 = df["Grade"].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
df = df[(df["Grade"] >= lower) & (df["Grade"] <= upper)]

# Normalize
df["Grade_norm"] = (df["Grade"] - df["Grade"].min()) / (df["Grade"].max() - df["Grade"].min())

# Convert types
df["Grade"] = df["Grade"].astype(float)
df["Date"] = pd.to_datetime(df["Date"])

# Save
df.to_csv("../cleaned_grades.csv", index=False)
print("Cleaned data saved.")