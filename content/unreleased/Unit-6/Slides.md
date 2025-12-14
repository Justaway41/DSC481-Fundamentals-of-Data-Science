---
marp: true
theme: default
paginate: true
---

# DSC 481 – Fundamentals of Data Science

## Unit VI: File Handling & Exception

### 4 Hours

<!--
Speaker Notes
- Title slide for Unit VI.
- States topic, course code, and allotted teaching hours.
- Sets scope for file handling and exception topics in Python as per the syllabus.
-->

---

# Unit Scope

- Reading files in Python
- Writing files in Python
- Handling CSV files
- Handling JSON files
- Exception handling: try, except, else, finally

<!--
Speaker Notes
- Outlines the four required focus areas for this unit.
- Lists these as the only topics as per the syllabus for this block.
-->

---

# Files in Python

- A file is a collection of data stored on disk.
- File types: text, CSV, JSON.
- Files are accessed by their name or path.
- Three core operations: open, read/write, close.

<!--
Speaker Notes
- Introduces files as persistent data storage for Python.
- Explains the importance of proper file access and closure.
- Distinguishes between text, CSV, and JSON files.
-->

---

## Opening and Closing Files

```python
f = open("sample.txt", "r")
data = f.read()
f.close()
```

- `"r"`: read, `"w"`: write (overwrite), `"a"`: append
- Always close files after use

<!--
Speaker Notes
- Demonstrates basic file open and close using a text file.
- Highlights different open modes.
- Emphasizes closing files to free resources.
-->

---

# Using the with Statement

- `with` handles opening and closing automatically.
- Preferred pattern for file access.

**Bad practice (don't do this):**

```python
f = open("sample.txt", "r")
text = f.read()
# forgot to close the file!
```

**Good practice:**

```python
with open("sample.txt", "r") as f:
    text = f.read()
    print(text)
```

<!--
Speaker Notes
- Shows best practice for file operations using `with`.
- Illustrates safe resource management and automatic closure.
- Reduces risk of file not being closed on error.
-->

---

# Reading Text Files

- `f.read()` reads full file as a single string.

  - Use when you want the entire file content at once (e.g., loading a config, template, or small text file).

- `f.readline()` reads one line at a time.

  - Use when you want to process a file line by line, especially for large files or streaming data.

- `f.readlines()` reads all lines into a list.
  - Use when you want to work with all lines as a list (e.g., for batch processing, counting lines, or random access).

---

**Examples:**

```python
# Example: Read full file as a string
with open("data.txt", "r") as f:
    content = f.read()
    print(content)

# Example: Read one line at a time
with open("data.txt", "r") as f:
    line = f.readline()
    while line:
        print(line.strip())
        line = f.readline()

# Example: Read all lines into a list
with open("data.txt", "r") as f:
    lines = f.readlines()
    print(lines)
```

<!--
Speaker Notes
- Lists and demonstrates different methods for reading data.
- Choice depends on program needs (full file vs lines).
-->

---

# Practice / Lab Exercise

- Read a file `"story.txt"` and print all contents.
- Print only the first two lines of the file.
- Count and display the number of lines in the file.

<!--
Speaker Notes
- Practice with basic file reading methods.
- Encourages students to work with real files and line handling.
- Reinforces difference between full file, first N lines, and counting lines.
-->

---

# Writing Text Files

- `"w"` mode: creates/overwrites
- `"a"` mode: appends to file
- Use `f.write(string)` and `f.writelines(list_of_strings)`

```python
with open("output.txt", "w") as f:
    f.write("First line\n")
    f.write("Second line\n")
```

<!--
Speaker Notes
- Explains writing new content or appending to existing files.
- Shows using write() for adding text.
- Demonstrates overwriting vs appending.
-->

---

# Practice / Lab Exercise

- Write three lines to `notes.txt` using `"w"` mode.
- Append one more line to the file using `"a"` mode.
- Read and print back all the content from `notes.txt`.

<!--
Speaker Notes
- Tasks practice file writing and appending.
- Encourages verifying output by reading after writing.
-->

---

# Real-World Example: Logging Process Data

```python
with open("process.log", "a") as log:
    log.write("Step 1 completed\n")
```

- Append log events line by line during data processing
- Review logs to track workflow progress

<!--
Speaker Notes
- Demonstrates practical usage through process logging.
- Shows file append pattern for persistent data logs.
-->

---

# Handling CSV Files

- CSV = Comma-Separated Values, used for tables and datasets
- Each line = row, separated by commas
- Use Python's `csv` module for I/O

```python
import csv
with open("students.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
```

<!--
Speaker Notes
- Defines CSV as standard tabular data format.
- Shows basic reading of rows using csv.reader.
- Each row becomes a list of values.
-->

---

# Writing CSV Files

- Use `csv.writer()` to write rows
- rows are lists or tuples

```python
import csv
rows = [["Name", "Grade"],
        ["Asha", 90],
        ["Ram", 82]]
with open("grades.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
```

<!--
Speaker Notes
- Demonstrates CSV writing, useful for saving structured datasets.
- Each sublist is a row. Header is included.
- newline="" for correct row endings.
-->

---

# Practice / Lab Exercise

- Read a CSV file named `"marks.csv"` and print all rows.
- Write a new list of student marks to `"results.csv"`.
- Change the grade for one student and save as `"updated.csv"`.

<!--
Speaker Notes
- Exercises to reinforce reading, modifying, and writing CSV data.
- Students will use both reader and writer in practice.
-->

---

# Handling CSV Files with Headers

- Use `csv.DictReader` to access columns by name

```python
import csv
with open("students.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["Name"], row["Grade"])
```

<!--
Speaker Notes
- DictReader provides easier field access by column name.
- Example shows fetching `Name` and `Grade` fields from each row.
-->

---

# Handling JSON Files

- JSON: text-based, structured data format
- Stores objects (dict), arrays (list), strings, numbers

```json
{
  "student": "Asha",
  "grade": 85,
  "courses": ["Math", "Python", "Data Science"]
}
```

<!--
Speaker Notes
- Introduces JSON data, as used in many modern applications.
- Displays a sample JSON object as required for demonstration.
-->

---

# Reading JSON Files

- Use `json` module.
- `json.load(file)` returns Python dict or list.

```python
import json
with open("student.json", "r") as f:
    data = json.load(f)
    print(data["student"])
```

<!--
Speaker Notes
- Shows how to load JSON from file into native Python structures.
- Example demonstrates extracting the value for "student".
-->

---

# Writing JSON Files

- Use `json.dump(data, file)`
- Data can be dict, list, number, string

```python
import json
data = {
  "student": "Asha",
  "grade": 85,
  "courses": ["Math", "Python", "Data Science"]
}
with open("student.json", "w") as f:
    json.dump(data, f)
```

<!--
Speaker Notes
- Demonstrates writing Python objects to a JSON file.
- Reinforces syntax and structure for student and grade info.
-->

---

# Practice / Lab Exercise

- Read a JSON file `"student.json"` and print all keys and values.
- Add a new course to the `"courses"` list and save.
- Create a new JSON file with two student records.

<!--
Speaker Notes
- Practice focuses on JSON read and write operations.
- Tasks reinforce data extraction, modification, and storage.
-->

---

# Exception Handling: try, except

- Exceptions are errors raised during execution
- Use `try` to wrap code, `except` to catch errors

```python
try:
    f = open("missing.txt")
except FileNotFoundError:
    print("File not found.")
```

<!--
Speaker Notes
- Introduces basic exception handling using try and except.
- Shows handling a specific error (missing file) for robustness.
-->

---

# Exception Handling: else, finally

- `else`: executes if no exceptions occur
- `finally`: always executes

```python
try:
    f = open("file.txt", "r")
except IOError:
    print("File error.")
else:
    print("File opened successfully.")
    f.close()
finally:
    print("Program complete.")
```

<!--
Speaker Notes
- Outlines use of else and finally for additional workflow and cleanup.
- Shows guaranteed code execution (finally) in all cases.
-->

---

# Exception Handling in File Operations

- Common exceptions:
  - FileNotFoundError
  - IOError
  - ValueError (parsing)
- Always handle exceptions when reading or writing files

```python
try:
    with open("students.csv") as f:
        lines = f.readlines()
except FileNotFoundError:
    print("students.csv not found")
```

<!--
Speaker Notes
- Highlights the types of exceptions relevant for file operations.
- Shows a try-except block for handling missing input files.
-->

---

# Practice / Lab Exercise

- Add error handling to your file read/write code.
- Display a message if file does not exist or cannot be written.
- Always print "Task finished" regardless of error.

<!--
Speaker Notes
- Tasks require integrating exception handling with previous file code.
- Ensures students practice robust error detection and reporting.
-->

---

# Real-World Data Handling Context

- Parsing and transforming data with files and exceptions

```python
import json
try:
    with open("data.json") as f:
        record = json.load(f)
        print(record["student"], record["grade"])
except FileNotFoundError:
    print("data.json not found.")
except KeyError:
    print("Key missing in JSON data.")
finally:
    print("Process finished.")
```

<!--
Speaker Notes
- Real-world scenario combining JSON reading and exception handling.
- Demonstrates layered error handling and essential cleanup/finalization.
-->

---

# Summary

- Open, read, write, and append text files in Python.
- Handle CSV files with `csv` module.

---

<style scoped>
h1{
    text-align: center;
}    
</style>

# Thank You
