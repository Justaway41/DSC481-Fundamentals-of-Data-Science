# Practice / Lab Exercise
# - Load "grades.xlsx" as before.
# - Print missing value counts for each column.
# - Fill missing "Grade" values with the average of that column.
# - Print all rows with missing "Name" entries (if any).

import pandas as pd

df = pd.read_csv("./content/unreleased/Unit-7/Labs/grades.csv")

# 1. Check for missing values (returns True/False for each cell)
print("=" * 50)
print("1. df.isnull() - Check for missing values:")
print("=" * 50)
print(df.isnull())

# 2. Count missing values per column
print("\n" + "=" * 50)
print("2. df.isnull().sum() - Count missing values per column:")
print("=" * 50)
print(df.isnull().sum())


# Print df before dropping them. 

print("\n" + "=" * 50)
print("DataFrame before dropping missing values:")
print("=" * 50)
print(df)

# 3. Drop rows with missing values
print("\n" + "=" * 50)
print("3. df.dropna() - Drop rows with missing values:")
print("=" * 50)
df_dropped = df.dropna()
print(df_dropped)
print(f"\nOriginal rows: {len(df)}, After dropna: {len(df_dropped)}")
print(f"Rows removed: {len(df) - len(df_dropped)}")

# 4. Fill missing values
print("\n" + "=" * 50)
print("4. df.fillna(value) - Fill missing values:")
print("=" * 50)
mean_grade = df['Grade'].mean()
print(f"Mean Grade: {mean_grade}")
df_filled = df.copy()
df_filled['Grade'] = df_filled['Grade'].fillna(mean_grade)
print("\nDataFrame after filling missing Grade with mean:")
print(df_filled)
print(f"\nChanges made: Filled {df['Grade'].isnull().sum()} missing Grade values with {mean_grade:.2f}")

# 5. Forward fill example (fill with previous value)
print("\n" + "=" * 50)
print("5. df.ffill() - Forward fill (use previous value):")
print("=" * 50)
df_ffill = df.copy()
df_ffill = df_ffill.ffill()  # Updated: use ffill() instead of fillna(method='ffill')
print("DataFrame after forward fill:")
print(df_ffill)
missing_before_ffill = df.isnull().sum().sum()
missing_after_ffill = df_ffill.isnull().sum().sum()
print(f"\nChanges made: Filled {missing_before_ffill - missing_after_ffill} missing values using forward fill")

# 6. Fill different values for different columns
print("\n" + "=" * 50)
print("6. df.fillna(dict) - Fill different values for different columns:")
print("=" * 50)
fill_values = {
    'Grade': df['Grade'].median(),  # Use median instead of mean
    'Name': 'Unknown'  # Fill missing names with 'Unknown'
}
print(f"Fill values: Grade -> {fill_values['Grade']:.2f} (median), Name -> '{fill_values['Name']}'")
df_mixed_fill = df.copy()
df_mixed_fill = df_mixed_fill.fillna(fill_values)
print("\nDataFrame after filling Grade with median and Name with 'Unknown':")
print(df_mixed_fill)
grade_filled = df['Grade'].isnull().sum()
name_filled = df['Name'].isnull().sum()
print(f"\nChanges made: Filled {grade_filled} Grade values with median, {name_filled} Name values with 'Unknown'")