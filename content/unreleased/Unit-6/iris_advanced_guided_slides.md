---
marp: true
theme: default
paginate: true
---

# Advanced File Handling & Data Exploration

## with the Iris Dataset

---

## 1. Import Required Libraries

We'll use Python's built-in modules and pandas for data handling. If pandas is not installed, use `!pip install pandas`.

```python
import csv
import json
import pandas as pd
import os
```

---

## 2. Problem Statement

**Goal:** Learn to read, explore, and write data using the Iris dataset, while practicing file handling, CSV/JSON operations, and exception handling in Python. No visualization or machine learning is included.

---

## 3. What will we focus on?

- Understanding the Iris dataset structure
- Practicing file reading/writing (CSV/JSON)
- Exception handling in data processing
- All of the above

You can run all cells for a full experience, or skip to the sections you need most.

---

## 4. Step-by-Step Guidance

Here's the plan:

1. Download or load the Iris dataset (CSV)
2. Read the CSV using both csv and pandas
3. Explore the data (head, count, unique species)
4. Write subsets and summaries to new files
5. Convert data to JSON and back
6. Practice exception handling
7. Try the challenge exercises

---

### 4.1 Download or Load the Iris Dataset

We'll use the classic Iris dataset. If you don't have it, this cell will download it from the UCI Machine Learning Repository.

```python
import os
import urllib.request

iris_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"
iris_csv = "iris.csv"
header = "sepal_length,sepal_width,petal_length,petal_width,species\n"

if not os.path.exists(iris_csv):
    print("Downloading Iris dataset...")
    urllib.request.urlretrieve(iris_url, iris_csv)
    # Add header
    with open(iris_csv, "r+") as f:
        content = f.read()
        f.seek(0, 0)
        f.write(header + content)
    print("Downloaded and saved as iris.csv.")
else:
    print("iris.csv already exists.")
```

---

### 4.2 Read the CSV File (csv module)

Let's read the Iris CSV file using Python's built-in csv module and print the first 5 rows.

```python
with open("iris.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    print("Header:", header)
    for i, row in enumerate(reader):
        print(row)
        if i == 4:
            break
```

---

### 4.3 Read the CSV File (pandas)

Now let's read the same file using pandas, which is more powerful for data analysis.

```python
df = pd.read_csv("iris.csv")
df.head()
```

---

### 4.4 Explore the Data

Let's explore the dataset: count records, list unique species, and show summary statistics.

```python
print("Number of records:", len(df))
print("Unique species:", df['species'].unique())
df.describe()
```

---

### 4.5 Write Subsets and Summaries to Files

Let's save all Setosa records to a new CSV, and write summary statistics to a text file.

```python
# Save all Setosa records to a new CSV
setosa = df[df['species'] == 'Iris-setosa']
setosa.to_csv('iris_setosa.csv', index=False)
print("Saved setosa records to iris_setosa.csv.")

# Write summary statistics to a text file
summary = df.describe().to_string()
with open('iris_summary.txt', 'w') as f:
    f.write(summary)
print("Saved summary statistics to iris_summary.txt.")
```

---

### 4.6 JSON Conversion and File I/O

Convert the first 5 records to JSON, save to a file, and read it back.

```python
# Convert first 5 records to JSON and save
first5 = df.head().to_dict(orient='records')
with open('iris_first5.json', 'w') as f:
    json.dump(first5, f, indent=2)
print("Saved first 5 records to iris_first5.json.")

# Read the JSON file back
with open('iris_first5.json', 'r') as f:
    data = json.load(f)
print("Loaded from JSON:")
for record in data:
    print(record)
```

---

### 4.7 Exception Handling in Data Processing

Let's demonstrate robust error handling for missing files and data conversion errors.

```python
# Try reading a missing file
try:
    pd.read_csv('missing_file.csv')
except FileNotFoundError:
    print('Error: missing_file.csv does not exist.')

# Try converting a non-numeric value
try:
    bad_row = {'sepal_length': 'not_a_number', 'sepal_width': 3.5, 'petal_length': 1.4, 'petal_width': 0.2, 'species': 'Iris-setosa'}
    float(bad_row['sepal_length'])
except ValueError as e:
    print('ValueError:', e)
```

---

## 5. Practice / Challenge Exercises

Try these for extra practice:

1. Count the number of flowers per species and save as a JSON file.
2. Append a new record to the CSV and verify it was added.
3. Handle and report an error if a required column is missing from the CSV.

```python
# 1. Count flowers per species and save as JSON
species_counts = df['species'].value_counts().to_dict()
with open('iris_species_counts.json', 'w') as f:
    json.dump(species_counts, f, indent=2)
print("Saved species counts to iris_species_counts.json.")
species_counts
```

```python
# 2. Append a new record to the CSV and verify
new_row = {'sepal_length': 5.1, 'sepal_width': 3.5, 'petal_length': 1.4, 'petal_width': 0.2, 'species': 'Iris-setosa'}
df_new = pd.DataFrame([new_row])
df_new.to_csv('iris.csv', mode='a', header=False, index=False)
print("Appended new record to iris.csv.")
# Verify by reading the last row
last_row = pd.read_csv('iris.csv').tail(1)
last_row
```

```python
# 3. Handle and report error if a required column is missing
try:
    df_missing = pd.read_csv('iris.csv')
    print(df_missing['nonexistent_column'].head())
except KeyError as e:
    print('KeyError:', e)
```
