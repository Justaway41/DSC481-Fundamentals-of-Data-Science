---
marp: true
theme: default
paginate: true
Lab: Clean and Analyze Student Attendance Data
---

<style scoped>
section {
font-size: 1.55rem;
}
</style>

# Your task

Given a dataset **"attendance.csv"** with student attendance records, your tasks are:

- Handle missing values in DaysPresent and DaysAbsent
- Remove any duplicate records
- Convert DaysPresent, DaysAbsent, and TotalDays to integers
- Convert DateJoined to datetime format

- Calculate each student's attendance rate (DaysPresent divided by TotalDays)
- Normalize attendance rates to a 0–1 scale
- Identify students with unusually low or high attendance rates (outliers) using the IQR method
- Print lists of students with perfect attendance, poor attendance (lowest rates), and average attendance
- Save the cleaned and analyzed data to a new file for

---

# Create attendance.csv

Copy and paste the following data into a new file named "attendance.csv":

```
StudentID,Name,DaysPresent,DaysAbsent,TotalDays,DateJoined
2001,Asha,45,5,50,2025-08-15
2002,Raj,48,,50,2025-08-17
2003,Lina,40,10,50,2025-08-19
2004,Tara,50,0,50,2025-08-18
2005,Ram,,8,50,2025-08-19
2006,Sita,47,3,50,2025-08-20
2007,John,38,12,50,2025-08-17
2008,Ashok,49,1,50,2025-08-18
2009,Manu,44,6,50,2025-08-16
2010,Bina,35,15,50,2025-08-19
```

---

# Step 1: Load the Data

**Hint:**

- Use Pandas to read "attendance.csv" into a DataFrame.
- Preview the first few rows to understand the structure.

---

# Step 2: Handle Missing Values

**Hint:**

- Check for missing values in all columns.
- Fill missing "DaysAbsent" with 0, and missing "DaysPresent" with the mean value.

---

# Step 3: Remove Duplicates

**Hint:**

- Identify any duplicate records.
- Remove all duplicate rows to ensure each student appears only once.

---

# Step 4: Convert Data Types

**Hint:**

- Ensure "DaysPresent", "DaysAbsent", and "TotalDays" are integers.
- Convert "DateJoined" to datetime format.

---

# Step 5: Calculate Attendance Rate

**Hint:**

- Create a new column "AttendanceRate" as DaysPresent / TotalDays.
- Normalize "AttendanceRate" to a 0–1 scale.

---

# Step 6: Identify Outliers

**Hint:**

- Use the IQR method to find students with unusually low or high attendance rates.
- Print out the rows considered outliers.

---

# Step 7: Save Cleaned Data

**Hint:**

- Save the cleaned DataFrame to "attendance_cleaned.csv" for future analysis.
