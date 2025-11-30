---
marp: true
theme: default
paginate: true
title: Unit II — Python Programming Basics & Operators
description: DSC 481 — Python history, features, installation, IDEs, variables, data types, operators, expressions, type conversion, and first program.
---

# Unit II: Python Programming Basics & Operators

DSC 481 — Fundamentals of Data Science  
Unit II: Python Programming Basics & Operators (3 Hours)

<!--
Speaker Notes:
Purpose: give students a solid foundation for writing simple Python programs. This session covers history & rationale, installation options, IDE choices, then core Python concepts (variables, types, operators, expressions, type conversion) and a first program. Plan for demos + hands-on practice.
Suggested pacing: 15–25 min per major section, with demos and short exercises.
-->

---

# Learning Objectives

- Know Python's origin and why it’s used for data science
- Install or run Python (Anaconda, pip, Colab)
- Choose an IDE (Jupyter, Colab, VS Code, PyCharm)
- Write a first Python program and run code in cells
- Use variables, data types, and expressions
- Apply arithmetic, comparison, and logical operators
- Convert between types safely

<!--
Speaker Notes:
Explain what students will be able to do by the end of class. Reinforce that practice and experimentation are key.
-->

---

# Python: Brief History & Why Python?

- Created by Guido van Rossum (1990s)
- Design goals: readability, simplicity, explicitness
- Widely used in Data Science, ML, web dev, automation
- Strong ecosystem: NumPy, Pandas, Matplotlib, Scikit-learn

<!--
Speaker Notes:
Mention Zen of Python (import this) as a fun aside. Emphasize industry adoption (research, companies) and rich libraries for data work.
-->

---

# Key Python Features

- Readable, concise syntax
- Interpreted language — fast feedback loop
- Dynamic typing (variables don’t need explicit types)
- Large standard library and package ecosystem (PyPI)
- Cross-platform: Windows, macOS, Linux

<!--
Speaker Notes:
Explain "interpreted" vs compiled briefly — easier for beginners because no separate compile step. Mention trade-offs: performance vs productivity.
-->

---

# Installation Options (Overview)

- Google Colab — no install; runs in browser (recommended for beginners)
- Anaconda distribution — Python + package manager + Jupyter (recommended for labs)
- Python via python.org + pip — lightweight install for advanced users
- Windows Subsystem for Linux (WSL) — optional for advanced setups

<!--
Speaker Notes:
Recommend Colab for day-1 to avoid install issues. Explain Anaconda for local work and reproducible envs with conda. Provide links in resources slide.
-->

---

# Installing Anaconda (Quick Steps)

1. Download installer: https://www.anaconda.com/products/distribution
2. Choose OS (Windows/Mac/Linux)
3. Run installer (accept defaults)
4. Launch Anaconda Navigator → open Jupyter Notebook or VS Code
5. Use `conda` to create environments: `conda create -n ds python=3.11`

<!--
Speaker Notes:
Show screenshots or perform live install if class is advanced and time permits. Emphasize use of environments to avoid package conflicts.
-->

---

# Using Google Colab (Quick Start)

- Go to colab.research.google.com
- New notebook → Runtime → Change runtime type (if GPU needed)
- Save to Google Drive → Share with others
- Cells: run with Shift+Enter

<!--
Speaker Notes:
Demonstrate live: create a blank notebook, run a simple print cell, show how to save and share link.
-->

---

# IDE Choices: What & When

- Jupyter Notebook / JupyterLab — best for experiments, teaching, data analysis
- Google Colab — easiest for beginners and remote students
- VS Code (with Python extension) — flexible, supports Jupyter cells and development
- PyCharm (Community) — full-featured IDE for development

<!--
Speaker Notes:
Recommend starting with Colab then moving to Jupyter/VS Code as they progress. Mention trade-offs: simplicity vs power.
-->

---

# First Python Program

Type and run this in a code cell:

```python
# First program
print("Hello, Data Science!")
```

- Output: Hello, Data Science!

<!--
Speaker Notes:
Ask students to change the string and run again. Explain print() and that functions use parentheses.
-->

---

# Variables: Concept & Examples

- A variable stores a value and a name
- Syntax: `name = value`

Examples:

```python
student_name = "Sita"
age = 21
gpa = 3.75
is_enrolled = True
```

<!--
Speaker Notes:
Use the "box with label" analogy. Show variable reassignment and printing multiple variables: print(student_name, age).
-->

---

# Variable Naming Rules

- Starts with letter or underscore: `x`, `_count`
- Contains letters, digits, underscores
- Case-sensitive: `Age` ≠ `age`
- Avoid Python keywords (`for`, `class`, `if`, ...)

<!--
Speaker Notes:
Show example invalid names (e.g., `2nd = 5`) to trigger SyntaxError and correct it.
-->

---

# Data Types — Primitives

- int — integers (e.g., 5, -3)
- float — decimals (e.g., 3.14)
- str — strings (e.g., "Hello")
- bool — True / False

Check type:

```python
print(type(42), type(3.14), type("hi"), type(True))
```

<!--
Speaker Notes:
Run the code to show output. Stress that Python is dynamically typed — variable's type is inferred from value.
-->

---

# Strings: Basics & f-strings

- Single or double quotes: `'text'` or `"text"`
- Concatenate: `"A" + " " + "B"`
- f-strings (recommended):

```python
name = "Sita"
age = 21
print(f"{name} is {age} years old.")
```

<!--
Speaker Notes:
Explain f-strings are readable and efficient. Show formatting like `{gpa:.2f}` for floats.
-->

---

# Numeric Operators (Arithmetic)

- `+`, `-`, `*`, `/` (float division)
- `//` (floor division), `%` (modulus), `**` (power)

Example:

```python
a, b = 7, 3
print(a + b, a - b, a * b, a / b, a // b, a % b, a ** b)
```

<!--
Speaker Notes:
Show results and explain typical use-cases: `%` for remainder, `//` when integer division needed.
-->

---

# Expressions & Operator Precedence

- Expressions combine values and operators
- Precedence: `**` → `*` `/` `//` `%` → `+` `-` → comparisons → logicals
- Use parentheses to be explicit:

```python
print((2 + 3) * 4)  # parentheses first
```

<!--
Speaker Notes:
Demonstrate ambiguous example vs parenthesized version. Encourage always using parentheses for clarity when learning.
-->

---

# Comparison Operators

- `==`, `!=`, `<`, `<=`, `>`, `>=`
- Return boolean values:

```python
print(5 == 5, 3 != 4, 2 < 5)
```

<!--
Speaker Notes:
Emphasize difference between assignment `=` and comparison `==`. Show common mistakes.
-->

---

# Logical Operators & Short-circuiting

- `and`, `or`, `not`
- Short-circuit behavior:
  - `and`: stops at first falsy value
  - `or`: stops at first truthy value

Demo:

```python
def side_effect():
    print("Ran side_effect")
    return True

print(True or side_effect())   # side_effect not called
print(False and side_effect()) # side_effect not called
```

<!--
Speaker Notes:
Use the demo to show how short-circuit helps avoid errors (e.g., `denom != 0 and num/denom > 1`).
-->

---

# Type Conversion (Casting)

- `int()`, `float()`, `str()`, `bool()`
- Examples:

```python
print(int("25") + 5)      # 30
print(str(100) + " people")
```

- Beware: `int("abc")` raises ValueError

<!--
Speaker Notes:
Point out conversions are explicit — Python won't auto-convert strings to numbers in arithmetic. Use try/except if parsing user input.
-->

---

# Working Example: Small Program

```python
name = input("Your name: ")        # interactive; in Colab prompts appear
age = int(input("Your age: "))
print(f"Hello {name}. In 5 years you'll be {age + 5}.")
```

<!--
Speaker Notes:
If using Colab, demonstrate input prompts. If running in classroom where inputs are inconvenient, replace with static assignments for demo.
-->

---

# Common Beginner Errors

- SyntaxError: typos, missing colons/parentheses
- IndentationError: wrong spacing in blocks
- NameError: variable not defined (typo/order)
- TypeError: operations on incompatible types (e.g., "5" + 3)

Tips:

- Read error messages, check line numbers
- Print intermediate values to debug

<!--
Speaker Notes:
Show a simple error example and how to fix it live. Reassure students errors are normal and helpful.
-->

---

# Hands-on Exercises (suggested timings)

1. Run "Hello" program and change message (5 min)
2. Create 3 variables: name, age, favorite_food and print them (8 min)
3. Compute with numbers: sum, division (rounded), remainder (10 min)
4. Short-circuit demo & experiment (7 min)
5. Type conversion mini-task: parse "45" and add 5 (5 min)

<!--
Speaker Notes:
Encourage pair programming; circulate and help. Keep tasks short and confirm success before moving on.
-->

---

# Homework (to consolidate)

- Complete a Colab notebook with:
  - Hello program, variable exercises
  - At least 5 different arithmetic expressions and their outputs
  - A short program using input() (or static values) demonstrating type conversion
- Read: Python Crash Course — Chapters 1–2

<!--
Speaker Notes:
Ask students to submit Colab link or .ipynb on LMS. Offer office hours/ask for help via email.
-->

---

# Resources & Links

- Python docs: https://docs.python.org/3/
- Google Colab: https://colab.research.google.com/
- Anaconda: https://www.anaconda.com/
- VS Code: https://code.visualstudio.com/
- Python Crash Course (Eric Matthes)

<!--
Speaker Notes:
Share these links in the LMS message for students to follow after class.
-->

---

# Summary & Next Steps

- You can now run Python, declare variables, use basic operators, and convert types.
- Next unit: Control structures — if/else and loops (practice with real examples).

<!--
Speaker Notes:
Wrap up with quick Q&A. Ask for 1–2 volunteers to show their notebook work. Remind students of homework and next class objectives.
-->
