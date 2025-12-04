---
marp: true
theme: default
paginate: true
title: "Units I–III — Lab Exercises & Solutions"
description: "Practical lab exercises for Units I–III (Intro, Basics & Operators, Control Structures). Answers and sample solutions are provided in the speaker notes."
---

# Units I–III — Lab Exercises

Practical exercises covering:

- Unit I: Introduction & Python basics
- Unit II: Programming basics & operators
- Unit III: Control structures

Answers and brief explanations are provided in the speaker notes for each exercise.

<!--
Speaker Notes:
Overview: These slides present short lab tasks intended for 15–45 minute sessions. Each slide contains the task; speaker notes include sample solutions and expected outputs. Students should type/run the code in their environment.
-->

---

# Unit I — Lab 1: Hello & Environment Check

Tasks:

1. Print "Hello, Data Science".
2. Print the Python version using the sys module.
3. Compute and print the value of 3\**4 + 2*5.

<!--
Speaker Notes:
Solution (sample code):
```python
import sys
print("Hello, Data Science")
print("Python version:", sys.version.split()[0])  # show version number
print("Expression result:", 3**4 + 2*5)
```
Expected output (example):
Hello, Data Science
Python version: 3.10.12
Expression result: 86

Notes:
- sys.version returns a full string; splitting gives the numeric version.
- This checks that Python runs and students can import standard modules. Keep output concise in submissions.
-->

---

# Unit I — Lab 2: Data Types & Transformations

Tasks:

1. Create variables: name = "Asha", age = 21, gpa = 3.6
2. Print: "Asha is 21 years old with GPA 3.60" (format GPA to two decimals).
3. Create list 1..10 and produce a list of squares.
4. Convert squared list to a comma-separated string and print it.

<!--
Speaker Notes:
Solution (sample code):
```python
name = "Asha"
age = 21
gpa = 3.6
print(f"{name} is {age} years old with GPA {gpa:.2f}")

nums = list(range(1, 11))
squares = [x*x for x in nums]
squares_str = ",".join(str(x) for x in squares)
print("Squares:", squares)            # [1,4,9,...,100]
print("Squares CSV:", squares_str)    # "1,4,9,...,100"
```
Expected output:
Asha is 21 years old with GPA 3.60
Squares: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
Squares CSV: 1,4,9,16,25,36,49,64,81,100

Grading tips:
- Check formatting of GPA and correctness of squares. Using f-strings is preferred for readability.
-->

---

# Unit I — Lab 3: Mini CSV Reader & Column Summary

Task:
Given students.csv with columns name,age,score compute:

- Number of rows (excluding header)
- Average score (2 decimals)
- Min and max score

Example CSV (students.csv):
name,age,score
Asha,21,88
Ram,22,74
Sita,20,91

<!--
Speaker Notes:
Solution (sample code using csv module):
```python
import csv
scores = []
with open("students.csv", newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        scores.append(float(row["score"]))

rows = len(scores)
avg = sum(scores)/rows if rows else 0
print("Rows:", rows)
print("Average score:", f"{avg:.2f}")
print("Min:", min(scores), "Max:", max(scores))
```
Expected output:
Rows: 3
Average score: 84.33
Min: 74.0 Max: 91.0

Notes:
- Accept solutions that use simple split() parsing if csv module isn't used.
- Validate header handling and numeric conversion.
-->

---

# Unit II — Lab 1: Simple Calculator Functions

Tasks:

1. Implement add(a,b), sub(a,b), mul(a,b), div(a,b).
2. Implement operate(op, a, b) where op is one of "+", "-", "\*", "/".
3. Handle division by zero gracefully (return None or a message).

<!--
Speaker Notes:
Solution (sample code):
```python
def add(a,b): return a+b
def sub(a,b): return a-b
def mul(a,b): return a*b
def div(a,b):
    try:
        return a/b
    except ZeroDivisionError:
        return None  # or return "Error: division by zero"

def operate(op, a, b):
    if op == "+": return add(a,b)
    if op == "-": return sub(a,b)
    if op == "*": return mul(a,b)
    if op == "/": return div(a,b)
    raise ValueError("Unsupported operator")

# Examples
print(operate("/", 4, 2))  # 2.0
print(operate("/", 4, 0))  # None
```
Grading:
- Correct arithmetic results
- Division by zero handled without crashing
- operate dispatches correctly; optional: handle invalid op with exception or message
-->

---

# Unit II — Lab 2: String Parsing & Formatting

Task:

- Given input "John:Doe:1998", parse into first, last, year and print:
  "Doe, John (1998)"
- Given current_year variable, compute and print age: "Doe, John is X years old"

<!--
Speaker Notes:
Solution (sample code):
```python
record = "John:Doe:1998"
first, last, year = record.split(":")
print(f"{last}, {first} ({year})")

current_year = 2025
age = current_year - int(year)
print(f"{last}, {first} is {age} years old")
```
Expected output (for current_year=2025):
Doe, John (1998)
Doe, John is 27 years old

Notes:
- Validate split length; handle malformed records with a short if-check if desired.
-->

---

# Unit II — Lab 3: Expressions & Precedence

Tasks:

- Evaluate and print results of:
  1. 3 + 4 \* 2
  2. (3 + 4) \* 2
  3. True and False or True
  4. not (1 < 2 and 3 > 5)
- Provide brief explanation for each result.

<!--
Speaker Notes:
Solution & explanations:
```python
print(3 + 4 * 2)        # 11      -> multiplication before addition: 4*2=8 -> 3+8=11
print((3 + 4) * 2)      # 14      -> parentheses change order: 7*2=14
print(True and False or True)  # True -> (True and False)=False, False or True = True
print(not (1 < 2 and 3 > 5))   # True -> (1<2) is True, (3>5) is False -> True and False = False -> not False = True
```
Grading:
- Correct numeric and boolean results
- Concise explanation of operator precedence and short-circuit evaluation for booleans
-->

---

# Unit III — Lab 1: Conditional Grading

Task:
Write function grade(score) that returns:

- 'A' for score >= 90
- 'B' for score >= 80
- 'C' for score >= 70
- 'D' for score >= 60
- 'F' otherwise

Test with [95, 82, 67, 54]

<!--
Speaker Notes:
Solution (sample code):
```python
def grade(score):
    if score >= 90: return "A"
    elif score >= 80: return "B"
    elif score >= 70: return "C"
    elif score >= 60: return "D"
    else: return "F"

scores = [95, 82, 67, 54]
print([grade(s) for s in scores])  # ['A', 'B', 'D', 'F']
```
Notes:
- Confirm boundary behavior (e.g., 90 -> A, 89 -> B).
- Grading: correct mapping and clear use of elif chain.
-->

---

# Unit III — Lab 2: Sum & Filtering with Loops

Tasks:

1. Compute sum of even numbers from 1..100 using a for loop.
2. Loop through 1..50, print numbers divisible by 7; stop when you hit the first number > 40 divisible by 7 (use break).

<!--
Speaker Notes:
Solution (sample code):
```python
# Sum evens 1..100
total = 0
for n in range(1, 101):
    if n % 2 != 0:
        continue
    total += n
print("Sum of evens:", total)  # 2550

# Divisible by 7 and break after first >40
for n in range(1, 51):
    if n % 7 == 0:
        print(n)
    if n > 40 and n % 7 == 0:
        break
# Output will include 7,14,21,28,35,42 and stop at 42
```
Explanation:
- Sum of evens formula: 2+4+...+100 = 2*(1+...+50)=2*(50*51/2)=2550
- The loop prints multiples of 7 and breaks after printing 42.
-->

---

# Unit III — Lab 3: Prime Finder

Tasks:

1. Implement is_prime(n) using trial division up to sqrt(n).
2. Implement list_primes(n) returning all primes <= n.
3. Test list_primes(50).

<!--
Speaker Notes:
Solution (sample code):
```python
import math

def is_prime(n):
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    limit = int(math.sqrt(n)) + 1
    i = 3
    while i <= limit:
        if n % i == 0:
            return False
        i += 2
    return True

def list_primes(n):
    return [i for i in range(2, n+1) if is_prime(i)]

print(list_primes(50))
# Expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
```
Notes:
- Use sqrt bound and skip even divisors for efficiency.
- Grading: correctness for n up to 100; optional extra credit for faster sieve implementation.
-->

---

# Unit III — Lab 4: FizzBuzz Variant

Task:
For numbers 1..30:

- Print "Fizz" for multiples of 3
- Print "Buzz" for multiples of 5
- Print "FizzBuzz" for multiples of both
- Otherwise print the number

<!--
Speaker Notes:
Solution (sample code):
```python
for n in range(1, 31):
    out = ""
    if n % 3 == 0: out += "Fizz"
    if n % 5 == 0: out += "Buzz"
    print(out or n)
```
Expected first lines:
1
2
Fizz
4
Buzz
Fizz
7
...
15 -> FizzBuzz
Notes:
- This demonstrates combined condition checks and string assembly.
- Grading: correct outputs for all 1..30 values.
-->

---

# Submission & Grading Notes

- For each lab, submit the code file(s) and a short README describing how you ran the tests.
- Tests to include: a few example inputs and the printed outputs or simple assertions.
- Suggested grading rubric for each lab:
  - Correctness: 70%
  - Code clarity & comments: 15%
  - Basic tests included: 15%

<!--
Speaker Notes:
Advise students to keep files organized (one folder per lab), use clear filenames (lab1_hello.py, lab3_primes.py), and include a README with commands and expected output. Encourage small asserts for automated checking. Offer to provide unit tests (pytest) if instructors want to grade automatically.
-->
