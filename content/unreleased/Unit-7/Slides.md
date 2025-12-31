---
marp: true
theme: default
paginate: true
---

# Unit VII: Data Collection and Cleaning with Python

### DSC 481 – Fundamentals of Data Science

### Hours: 4

<!--
Speaker Notes
- Introduce Unit VII of DSC 481 as focused on collection and cleaning of data using Pandas in Python.
- Students should know basic Python and have seen core syntax, but Pandas is likely new to them.
- Outline that this unit covers reading various file types, handling missing/duplicate data, recognizing outliers, data transformation, normalization, and type conversion.
- All topics closely follow the syllabus.
-->

---

# Concept: What is Pandas?

- Pandas is a Python library for working with tabular data (like spreadsheets).
- The main data structure is the **DataFrame** (rows and columns).
- Pandas helps import, clean, transform, and analyze data.
- You must always import Pandas before use.
- DataFrames are similar to tables in Excel.

<!--
Speaker Notes
- Introduce Pandas simply: a tool to load and work with table data.
- Describe the DataFrame as a kind of table.
- State that Pandas must always be imported in Python code.
- Let students know Pandas enables importing from various files like CSV or Excel.
- Learning goal: Become comfortable with Pandas basics for data handling.
-->

---

# Pandas: Importing the Library

- To use Pandas, first install it (if needed) and import it in your script.
- The standard way is:
  ```python
  import pandas as pd
  ```
- "pd" is a common shortcut for Pandas.

<!--
Speaker Notes
- Show the standard way to import Pandas using the alias "pd".
- Explain that "pd" makes code shorter and is used by most Python programmers.
- If using Jupyter/Colab, Pandas is usually pre-installed.
- Learning goal: Students can import Pandas in their own notebooks/programs.
-->

---

# Example: Importing Pandas

```python
import pandas as pd

# After import, you can use all Pandas features
```

<!--
Speaker Notes
- This code must be at the top of every file or notebook where Pandas is used.
- The line says: "import the pandas library and call it pd in this code".
- Once imported, use "pd." before Pandas functions.
- Goal: All students should run/import Pandas before starting further tasks.
-->

---

# Practice / Lab Exercise

- Open a new Jupyter notebook or Python file.
- Import the Pandas library as "pd".
- Print out the Pandas version by typing:
  ```python
  print(pd.__version__)
  ```
- Verify no errors are raised.

<!--
Speaker Notes
- Tasks ensure students can import and use Pandas in their environment.
- Printing version confirms correct installation.
- This step must succeed before continuing to file/data tasks.
-->

---

# Concept: Reading CSV Files

- CSV (Comma-Separated Values) files store data in rows and columns as plain text.
- CSV is a common format for datasets.
- Pandas can easily open and work with CSV files.
- Each row is a record; each column is a data field.

<!--
Speaker Notes
- Explain what a CSV file is.
- Emphasize CSV as the most common data import format for analysis.
- Pandas makes working with CSVs simple: no manual parsing needed.
- Learning goal: Understand purpose/structure of CSV files.
-->

---

# Pandas Function: Reading CSV with read_csv()

- Syntax to read a CSV file:
  ```python
  df = pd.read_csv("filename.csv")
  ```
- "df" stands for DataFrame, holding the table data.
- The file name must be correct and in the current folder.
- Examine the data with `.head()` and `.tail()` functions.

<!--
Speaker Notes
- Introduce read_csv() and what it returns (a DataFrame).
- The resulting "df" object stores the whole table.
- .head() shows the first rows; .tail() shows the last rows.
- Goal: Students know how to load a CSV file into pandas for analysis.
-->

---

# Example: Reading a CSV File

```python
import pandas as pd

df = pd.read_csv("iris.csv")
print(df.head())
```

<!--
Speaker Notes
- "iris.csv" is a sample CSV dataset.
- Code imports pandas, loads "iris.csv", and prints the first 5 rows.
- "df" now contains all data from the CSV as a DataFrame.
- Goal: Demonstrate minimum steps to read and preview any CSV data.
-->

---

# Practice / Lab Exercise

- Download the Iris CSV: [iris.csv](https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv)
- Load "iris.csv" using Pandas.
- Print the shape of the DataFrame using `df.shape`.
- Show column names with `df.columns`.

<!--
Speaker Notes
- Students practice: download, load, and inspect a real-world CSV in Pandas.
- .shape gives row/column count; .columns lists field names.
- Use this to verify correct file loading and explore dataset structure.
-->

---

# Concept: Reading Excel Files

- Excel files (.xls or .xlsx) store data in sheets (tables).
- Each sheet is like a separate table in the file.
- Pandas can read data from a specified sheet.
- Excel files are popular for data entry and business reports.

<!--
Speaker Notes
- Explain what an Excel file is—tables in worksheets, usually .xlsx.
- Pandas can read directly from Excel without converting to CSV.
- Each worksheet is a separate table inside the file.
- Learning goal: Understand Excel files as multi-table sources.
-->

---

# Pandas Function: Reading Excel with read_excel()

- Syntax to read an Excel file:
  ```python
  df = pd.read_excel("grades.xlsx", sheet_name="Sheet1")
  ```
- `grades.xlsx` is the file; `Sheet1` is the worksheet name.
- Returns a DataFrame with the data from the specified sheet.

<!--
Speaker Notes
- Introduce read_excel(), its parameters, and what it returns.
- Always specify the correct sheet name for your table.
- If unsure, open the file in Excel to find sheet names.
- Goal: Students connect Pandas DataFrames with Excel tables.
-->

---

# Example: Reading an Excel File

```python
import pandas as pd

df = pd.read_excel("grades.xlsx", sheet_name="Sheet1")
print(df.head())
```

<!--
Speaker Notes
- Code imports pandas, reads Sheet1 from grades.xlsx, and previews the data.
- "df" holds the Excel table as a DataFrame.
- .head() displays first 5 records.
- Goal: Show minimum code to load, access, and check Excel data in Pandas.
-->

---

# Practice / Lab Exercise

- Save the provided grades table as an Excel file "grades.xlsx":
  ```
  StudentID,Name,Subject,Grade,Date
  1001,Asha,Math,86,2025-05-15
  1002,Raj,English,91,2025-05-17
  1003,Lina,Science,,2025-05-19
  1004,Tara,Math,72,2025-05-18
  1005,Ram,English,88,2025-05-19
  1006,Sita,Science,79,2025-05-20
  1007,John,Math,,2025-05-17
  1008,Ashok,English,95,2025-05-18
  1009,Manu,Science,83,2025-05-16
  1010,Bina,Math,57,2025-05-19
  ```
- Load "grades.xlsx" and display the first 2 rows.
- Print data types for all columns using `df.dtypes`.

<!--
Speaker Notes
- Exercise covers creating/saving an Excel file from sample data.
- Students practice Excel reading, viewing a subset, and inspecting column types.
- This builds comfort with importing real Excel datasets.
-->

---

# Concept: Reading JSON Files

- JSON (JavaScript Object Notation) stores data as key-value pairs.
- Common format for web APIs and configuration files.
- JSON can represent lists of records similar to tables.
- Pandas can read JSON into a DataFrame if the JSON is an array of objects.

<!--
Speaker Notes
- Introduce JSON as a popular simple way to store/transfer tabular data.
- Explain "key-value" structure and how it can represent lists of records.
- Many web data sources use JSON.
- Learning goal: Recognize tabular JSON as readable by Pandas.
-->

---

# Pandas Function: Reading JSON with read_json()

- Syntax to read from a JSON file:
  ```python
  df = pd.read_json("data.json")
  ```
- The file must contain a list of records (objects).
- Returns a DataFrame with one row per record.

<!--
Speaker Notes
- Introduce read_json() and its expectation: list of dictionaries for tabular reading.
- If the file structure matches, reading is direct.
- DataFrame result is same as with CSV/Excel.
- Goal: Show students how to input a typical JSON dataset.
-->

---

# Example: Reading a JSON File

Suppose data.json contains:

```json
[
  { "name": "Asha", "score": 85 },
  { "name": "Raj", "score": 90 }
]
```

Then:

```python
import pandas as pd

df = pd.read_json("data.json")
print(df)
```

<!--
Speaker Notes
- Shows a sample JSON file with simple records.
- The code loads this into a DataFrame.
- Data will have 'name' and 'score' columns from the JSON file.
- Goal: Map JSON list-of-dict structure to DataFrame rows in Pandas.
-->

---

# Practice / Lab Exercise

- Create a file "students.json" with:
  ```
  [
    {"id":1, "name":"Sita", "marks":88},
    {"id":2, "name":"John", "marks":76}
  ]
  ```
- Load "students.json" using Pandas.
- Print the DataFrame's info using `df.info()`.
- Save the DataFrame to "students_out.csv".

<!--
Speaker Notes
- Students practice saving and loading a simple JSON.
- Use Pandas .info() to see structure and column info.
- Saving to CSV reinforces data export for later use.
-->

---

# Concept: Reading Data from Web APIs

- Many websites and databases provide data online through APIs.
- APIs often return data as JSON arrays/lists.
- Pandas can load data directly from a URL if the format matches.
- Common for live datasets and integration tasks.

<!--
Speaker Notes
- Introduce APIs as sources of up-to-data datasets in JSON format.
- Pandas can simplify integration by reading directly from URLs.
- API data is commonly in JSON array form.
- Goal: Students know they can read data not just from files, but also URLs.
-->

---

# Pandas Function: Reading JSON from URL

- Syntax to read JSON from a URL:
  ```python
  url = "https://jsonplaceholder.typicode.com/users"
  df = pd.read_json(url)
  ```
- The URL must return a JSON array (list of objects).
- Returns a DataFrame with all records.

<!--
Speaker Notes
- pd.read_json works also with URLs, loading JSON arrays directly.
- As long as endpoint returns expected format, code is identical to file loading.
- Goal: Familiarize students with web-based data collection via Pandas.
-->

---

# Example: Reading JSON From a Web API

```python
import pandas as pd

url = "https://jsonplaceholder.typicode.com/users"
df = pd.read_json(url)
print(df.head())
```

<!--
Speaker Notes
- Shows how to read fake user data from a public test API.
- df.head() previews the table created from web results.
- Students see minimal code difference from file-based loading.
- Goal: Show versatility of Pandas with local and web JSON sources.
-->

---

# Practice / Lab Exercise

- Use the URL: https://jsonplaceholder.typicode.com/users
- Load the JSON data into a DataFrame.
- Show the first 3 rows using `df.head(3)`.
- Print all usernames in the DataFrame.

<!--
Speaker Notes
- Task ensures students can retrieve and preview web data with Pandas.
- Creating, previewing, and slicing the table should be achievable in-class.
- Printing usernames demonstrates basic column access.
-->

---

# Concept: Handling Missing Values

- Missing values are empty entries in datasets.
- In Pandas, they are usually shown as NaN (Not a Number).
- Missing values can affect analysis and must be addressed.
- Cleaning means removing or filling missing entries.

<!--
Speaker Notes
- Define missing values (NaN) and why they must be cleaned.
- Missing data is expected in most real-world sources.
- Pandas functions exist to find, drop, or fill these values.
- Goal: Students recognize and look for NaN in DataFrames.
-->

---

# Pandas Functions for Missing Values

- To check for missing values:
  ```python
  df.isnull()
  ```
- To count missing values per column:
  ```python
  df.isnull().sum()
  ```
- To drop rows with missing values:
  ```python
  df.dropna()
  ```
- To fill missing values:
  ```python
  df.fillna(value)
  ```

<!--
Speaker Notes
- Introduce isnull() (returns bool mask), .sum() (counts nulls), dropna() (removes), and fillna().
- value parameter in fillna() can be set as needed (e.g., fixed value, mean).
- Goal: Students know the available tools for missing data cleaning.
-->

---

# Example: Handling Missing Values

```python
import pandas as pd

df = pd.read_excel("grades.xlsx")
print(df.isnull().sum())

df_filled = df.fillna(0)
print(df_filled)
```

<!--
Speaker Notes
- Reads "grades.xlsx" (may have missing values in Grade).
- Prints count of missing values per column.
- Replaces missing values with 0 using fillna().
- Goal: Students see a real missing value cleaning step.
-->

---

# Practice / Lab Exercise

- Load "grades.xlsx" as before.
- Print missing value counts for each column.
- Fill missing "Grade" values with the average of that column.
- Print all rows with missing "Name" entries (if any).

<!--
Speaker Notes
- Exercise: Find, fill, and filter missing values.
- Uses fillna() with DataFrame or Series mean.
- Filtering rows prepares student for later selection and cleaning tasks.
-->

---

# Concept: Handling Duplicate Records

- Duplicates are rows with exact same values as others.
- They can distort analysis (e.g. counting, averaging).
- Pandas can detect and remove duplicate rows easily.

<!--
Speaker Notes
- Definition: Exact row duplication may happen by accident in data entry/merging.
- Removing them avoids bias and counting errors.
- Goal: Students learn to check and clean duplicates from DataFrames.
-->

---

# Pandas Functions for Duplicates

- To check for duplicate rows:
  ```python
  df.duplicated()
  ```
- To count duplicates:
  ```python
  df.duplicated().sum()
  ```
- To remove duplicate rows:
  ```python
  df.drop_duplicates()
  ```

<!--
Speaker Notes
- .duplicated() returns bool mask (True for duplicate rows after first).
- .sum() gives total number of duplicates.
- .drop_duplicates() removes all but the first of each duplicate set.
- Goal: Know how to spot and remove duplicates.
-->

---

# Example: Removing Duplicate Records

```python
import pandas as pd

data = {"A": [1, 2, 2, 3], "B": [4, 5, 5, 6]}
df = pd.DataFrame(data)
print(df)
print(df.duplicated())
df_clean = df.drop_duplicates()
print(df_clean)
```

<!--
Speaker Notes
- Builds sample DataFrame with manual duplicates.
- .duplicated() shows which rows are repeats.
- .drop_duplicates() returns DataFrame with duplicates removed.
- Allows students to see effect step by step.
-->

---

# Practice / Lab Exercise

- Create a DataFrame with at least two duplicate rows.
- Identify and count the duplicate rows.
- Remove duplicates and show the cleaned DataFrame.

<!--
Speaker Notes
- Students create, detect, and remove duplicates with hands-on DataFrame.
- Reveals practical impact of this cleaning step.
-->

---

# Concept: Identifying Outliers

- Outliers are values far from the rest of the data.
- Outliers can affect analysis, averages, and plots.
- Boxplots help visualize outliers.
- We can identify outliers using data statistics in Pandas.

<!--
Speaker Notes
- Define outliers simply: unusually large or small data points.
- Explain that removing or flagging them can improve data quality.
- Visual tools (boxplot) or statistics (IQR) used for this purpose.
- Goal: Recognize outlier impact and methods for detection.
-->

---

# Pandas: Outlier Detection with IQR

- Calculate Interquartile Range (IQR):
  ```python
  Q1 = df["Grade"].quantile(0.25)
  Q3 = df["Grade"].quantile(0.75)
  IQR = Q3 - Q1
  ```
- Outliers are values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR.

<!--
Speaker Notes
- Q1 = 25th percentile, Q3 = 75th percentile.
- IQR = Q3 - Q1, used to identify normal data spread.
- Outlier boundaries are set at 1.5*IQR below/above these values.
- Students should learn both visual (boxplot) and numeric approach.
-->

---

# Example: Detecting Outliers

```python
import pandas as pd

df = pd.read_excel("grades.xlsx")
Q1 = df["Grade"].quantile(0.25)
Q3 = df["Grade"].quantile(0.75)
IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers = df[(df["Grade"] < lower) | (df["Grade"] > upper)]
print(outliers)
```

<!--
Speaker Notes
- Code finds outliers for the "Grade" column in grades.xlsx.
- Step by step: calculate Q1, Q3, IQR, then boundaries, then filter.
- Print shows all rows considered outliers.
- Goal: Understand how to use quantile and boolean indexing for outlier detection.
-->

---

# Practice / Lab Exercise

- Use "grades.xlsx" with student grades.
- Calculate Q1, Q3, and IQR for the Grade column.
- Identify all outlier grade values.
- Print rows that contain outlier grades.

<!--
Speaker Notes
- Students practice the outlier formula and apply to real data.
- Reinforces selection of problematic rows for cleaning or further analysis.
-->

---

# Concept: Data Transformation with Pandas

- Data transformation is changing columns or creating new columns.
- Examples: converting scores to percentages, setting pass/fail, renaming columns.
- Transformations prepare data for analysis or visualization.

<!--
Speaker Notes
- Briefly introduce types of useful column manipulations.
- Emphasize transformations make data easier to use and understand.
- Pandas allows simple expressions to compute new columns or change names.
- Learning goal: Know basic methods to transform DataFrames.
-->

---

# Pandas: Column Transformations

- Add a calculated column:
  ```python
  df["Grade_percent"] = df["Grade"] / 100 * 100
  ```
- Boolean (pass/fail) column:
  ```python
  df["Passed"] = df["Grade"] >= 40
  ```
- Rename column:
  ```python
  df = df.rename(columns={"Grade": "Marks"})
  ```

<!--
Speaker Notes
- .loc or bracket assignment creates new columns with any logic.
- Comparison creates boolean columns (True/False).
- .rename() safely changes column names.
- Goal: Write simple transformations to shape DataFrames.
-->

---

# Example: Transformation and Renaming

```python
import pandas as pd

df = pd.read_excel("grades.xlsx")
df["Passed"] = df["Grade"] >= 40
df = df.rename(columns={"Grade": "FinalMarks"})
print(df.head())
```

<!--
Speaker Notes
- Adds "Passed" as a boolean grade (>=40).
- Renames "Grade" to "FinalMarks".
- .head() shows result for quick inspection.
- Goal: See effect of creating and renaming columns.
-->

---

# Practice / Lab Exercise

- Load your grades data as before.
- Add a "Result" column: "Pass" if Grade >= 40, else "Fail".
- Rename "Subject" to "Course".
- Print rows where Result is "Fail".

<!--
Speaker Notes
- Practice with string and boolean transformations.
- Selecting rows by value demonstrates DataFrame filtering.
- Practical for student performance analysis examples.
-->

---

# Concept: Data Normalization

- Normalization changes numeric columns to the same scale, usually 0–1.
- Useful when combining different types of data or for machine learning.
- Common method: min-max normalization.

<!--
Speaker Notes
- Define normalization as making numbers comparable across columns.
- Min-max scales values from 0 (min) to 1 (max).
- Students will see why normalizing is useful in later analysis.
- Goal: Introduce min-max as the standard numeric normalization.
-->

---

# Pandas: Min-Max Normalization

- Formula for min-max normalization:
  ```python
  df["Grade_norm"] = (df["Grade"] - df["Grade"].min()) / (df["Grade"].max() - df["Grade"].min())
  ```
- New column will have all values between 0 and 1.

<!--
Speaker Notes
- Explains code for min-max normalization.
- .min() and .max() describe the original value range.
- Subtract, divide, assign result to a new normalized column.
- Goal: Code normalization formula in Pandas.
-->

---

# Example: Apply Normalization

```python
import pandas as pd

df = pd.read_excel("grades.xlsx")
df["Grade_norm"] = (df["Grade"] - df["Grade"].min()) / (df["Grade"].max() - df["Grade"].min())
print(df[["Grade", "Grade_norm"]])
```

<!--
Speaker Notes
- Reads the grades, creates "Grade_norm" column.
- Prints original grades and normalized values side by side.
- All normalized values should now be between 0 and 1.
- Goal: See normalization applied to real data.
-->

---

# Practice / Lab Exercise

- Load grades as before.
- Normalize the Grade column using min-max, store as "Norm".
- Print all students with Norm above 0.8.

<!--
Speaker Notes
- Practice for normalization, filtering based on new column.
- Shows practical use: highlight high-performing students on a normalized scale.
-->

---

# Concept: Data Type Conversion with Pandas

- Data columns may have wrong types (e.g., strings instead of numbers).
- Pandas allows converting (casting) columns to the correct type.
- Conversion is important for calculations and consistency.

<!--
Speaker Notes
- Explain why column types matter: ensure numeric columns are numeric.
- Sometimes, data is read as text/object if the source is inconsistent.
- Converting to correct type enables more analysis functions.
- Goal: Know how to check and set column types.
-->

---

# Pandas: Changing Data Types

- Convert a column to integer:
  ```python
  df["Grade"] = df["Grade"].astype(int)
  ```
- Convert to float:
  ```python
  df["Grade"] = df["Grade"].astype(float)
  ```
- Convert date-formatted strings to datetime:
  ```python
  df["Date"] = pd.to_datetime(df["Date"])
  ```

<!--
Speaker Notes
- .astype(int) or .astype(float) forces numeric columns.
- .to_datetime() parses date strings.
- Always review .dtypes to see current column types.
- Goal: Confident conversion of columns as needed.
-->

---

# Example: Data Type Conversion in Practice

```python
import pandas as pd

df = pd.read_excel("grades.xlsx")
df["Grade"] = df["Grade"].fillna(0).astype(int)
df["Date"] = pd.to_datetime(df["Date"])
print(df.dtypes)
```

<!--
Speaker Notes
- Handles missing grades before integer conversion.
- Converts the Date column to datetime for further analysis.
- .dtypes shows all resulting types for checking.
- Goal: Combine filling and conversions in clean-up workflow.
-->

---

# Practice / Lab Exercise

- Load the grades dataset.
- Convert the Grade column to float (if not already).
- Convert the Date column to datetime.
- Print the DataFrame data types.

<!--
Speaker Notes
- Practice step to ensure all columns are the right type after import and filling.
- Checking .dtypes confirms success.
-->

---

# Real-World Data Cleaning Scenario

- Student gradebook contains student IDs, names, subjects, grades, and dates.
- Issues: missing grades, duplicate records, outlier grades, inconsistent types.
- Cleaning steps:
  - Read Excel/CSV file.
  - Fill missing grades with mean.
  - Remove duplicate rows.
  - Identify and remove outlier grades.
  - Normalize grades.
  - Convert data types as needed.

<!--
Speaker Notes
- Summarize all steps as a real-world lab.
- Each student must load, clean (fill/remove), filter, normalize, and finally tidy their dataset.
- This scenario combines all concepts from this unit.
-->

---

# Practice / Lab Exercise

- Obtain a sample student grades Excel or CSV file.
- Clean the data using steps:
  1. Fill missing grades with the mean value.
  2. Remove any duplicate records.
  3. Identify and remove outlier grades.
  4. Normalize the Grade column.
  5. Convert columns to correct data types.
- Save the cleaned data to a new file.

<!--
Speaker Notes
- Students demonstrate a full cleaning pipeline from real data.
- Final result is a cleaned DataFrame saved for later use or analysis.
- This is a good template for future data science projects.
-->

---

# End of Unit VII

<!--
Speaker Notes
- Unit VII covered all syllabus topics on Data Collection and Cleaning with Pandas.
- Ensure all students have completed at least one data cleaning lab cycle.
-->
