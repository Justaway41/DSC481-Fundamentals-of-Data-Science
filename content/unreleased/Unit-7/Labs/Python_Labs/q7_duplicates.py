# Practice / Lab Exercise
# - Create a DataFrame with at least two duplicate rows.
# - Identify and count the duplicate rows.
# - Remove duplicates and show the cleaned DataFrame.

import pandas as pd

# Why do we need to remove duplicates?
# In real-world data, duplicates can occur due to data entry errors, merging datasets, or system glitches.
# Removing duplicates is important to ensure accurate analysis, avoid double-counting, and maintain data quality.
# For example, in a student database, the same student might be entered twice with the same email but a slightly different name.


# Real-world style example: Student records with possible duplicates
data = {
	"Name": ["Alice", "Bob", "Bob", "Charlie"],
	"Email": ["alice@example.com", "bob@example.com", "bob@example.com", "charlie@example.com"]
}
df = pd.DataFrame(data)
print("Original student records:")
print(df)
print("Duplicate rows (all columns):")
print(df.duplicated())
print("Count of duplicates:", df.duplicated().sum())
df_clean = df.drop_duplicates()
print("\nCleaned student records (all columns):")
print(df_clean)


# Example 1: Remove only one duplicate row (not all duplicates)
# (e.g., you know only one entry is a mistake)
dup_idx = df[df.duplicated(keep=False)].index[0]
df_one_removed = df.drop(index=dup_idx)
print("\nStudent records after removing only one duplicate row:")
print(df_one_removed)

# Example 2: Check/remove duplicates based on specific columns only
# (e.g., keep only unique emails, even if names repeat)
print("\nDuplicate emails:")
print(df.duplicated(subset=["Email"]))
df_email_clean = df.drop_duplicates(subset=["Email"])
print("Student records with unique emails:")
print(df_email_clean)