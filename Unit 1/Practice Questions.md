---
marp: true
theme: default
paginate: true
title: Unit I - Practice Slides
description: Practical exercises for DSC 481 Unit I (Introduction to Data Science and Python)
---

# Unit I Practice Session

- DSC 481 - Fundamentals of Data Science
- Unit I: Introduction to Data Science and Python
- Hands-on focus (~60–90 min)

<!--
Speaker Notes:
Overview: Reinforce Python basics and environment use.
Students create notebook: Unit_I_Practice.ipynb.
-->

---

# Practice Overview

- Environment setup & verification
- Variables and basic types
- Arithmetic & comparisons
- Strings & formatting
- Built-in functions & rounding behavior
- Mini applied tasks
- Common mistakes awareness

<!--
Speaker Notes:
Set expectations: attempt first, show solutions later verbally or from notes.
-->

---

# Practice 1: Environment Check

Task:

- Create notebook `Unit_I_Practice.ipynb`
- Verify Python and core libs

```python
import sys
print("Python:", sys.version)
try:
    import numpy as np, pandas as pd
    print("NumPy:", np.__version__)
    print("Pandas:", pd.__version__)
except Exception as e:
    print("Missing libs:", e)
```

<!--
Speaker Notes:
Answer: Shows Python & library versions or missing message.
If missing: Colab -> !pip install numpy pandas; Local -> pip install numpy pandas.
-->

---

# Practice 2: Hello, Data Science!

Task:

- Print a welcome line
- Use f-string to include name/program/year

```python
print("Hello, Data Science!")
name = "Your Name"
program = "BCSIT"
year = 1
print(f"{name} is enrolled in {program}, Year {year}.")
```

<!--
Speaker Notes:
Two lines output. Reinforce f-string syntax.
-->

---

# Practice 3: Variables & Types

Task:

- Define: student_name, age, gpa, is_enrolled
- Print value + type for each

```python
student_name = "Sita"
age = 21
gpa = 3.75
is_enrolled = True
print(student_name, type(student_name))
print(age, type(age))
print(gpa, type(gpa))
print(is_enrolled, type(is_enrolled))
```

<!--
Speaker Notes:
Types: str, int, float, bool. Changing age to "21" makes it str.
-->

---

# Practice 4: Arithmetic Operators

Given a = 15, b = 4 compute:

- Sum, difference, product
- Division vs floor division
- Modulus
- Exponentiation

```python
a, b = 15, 4
print(a + b, a - b, a * b, a / b, a // b, a % b, a ** b)
```

<!--
Speaker Notes:
Answers: 19,11,60,3.75,3,3,50625.
-->

---

# Practice 5: Comparison & Logical

Create expressions returning True:

```python
x, y = 10, 20
print((x < y) and (x > 0))
print((x != y) or (x == 10))
is_enrolled = False
print(not is_enrolled)
```

<!--
Speaker Notes:
All True. Discuss short-circuit evaluation.
-->

---

# Practice 6: Type Conversion

Convert numeric strings and build a message.

```python
age_str = "25"
age_int = int(age_str)
price_str = "19.99"
price_float = float(price_str)
score = 95
message = "Your score is " + str(score)
print(age_int, price_float, message)
```

Try: `int("hello")`

<!--
Speaker Notes:
ValueError for int("hello").
-->

---

# Practice 7: String Basics

Concatenate, length, indexing, f-string:

```python
first = "Data"
second = "Science"
combined = first + " " + second
print(combined, len(combined))
word = "Python"
print(word[0], word[-1])
name, gpa = "Sita", 3.75
print(f"{name} has GPA {gpa:.2f}")
```

<!--
Speaker Notes:
"Data Science" length 12; 'P', 'n'.
-->

---

# Practice 8: Mini About-Me

```python
name = "Ram"
age = 20
program = "BCSIT"
year = 2
hobby = "football"
print(f"My name is {name}. I'm {age}, in year {year} of {program}, and I enjoy {hobby}.")
```

Bonus: use `input()` locally.

<!--
Speaker Notes:
Simple personal profile; avoid input() in automated settings.
-->

---

# Practice 9: Built-in Functions

Use len, abs, round, max, min:

```python
print(len("Fundamentals of Data Science"))
print(abs(-42))
print(round(3.14159, 2))
print(max(5, 10, 3), min(5, 10, 3))
```

<!--
Speaker Notes:
28, 42, 3.14, 10 & 3.
Mention banker’s rounding will matter for .5 cases.
-->

---

# NEW: Rounding Question

Question:
What’s the difference between `round(2.5)` in Python 3 vs Python 2?

(Think about how tie (.5) values are handled.)

<!--
Speaker Notes:
Answer:
Python 2 (half-away-from-zero for positives): round(2.5) -> 3.0 (float)
Python 3 (half-to-even, banker’s): round(2.5) -> 2 (int)
Examples Python 3: round(3.5)=4, round(-2.5)=-2.
Purpose: Reduce cumulative bias. Demonstrate loop:
for n in [1.5,2.5,3.5,4.5]: print(round(n)) -> 2,2,4,4.
Half-up via decimal:
from decimal import Decimal, ROUND_HALF_UP
Decimal('2.5').quantize(Decimal('1'), rounding=ROUND_HALF_UP) -> Decimal('3')
-->

---

# Practice 10: BMI Calculator

Compute BMI = weight / (height \*\* 2)

```python
weight_kg = 68
height_m = 1.72
bmi = weight_kg / (height_m ** 2)
print("BMI:", round(bmi, 2))
```

Add category logic.

<!--
Speaker Notes:
BMI ≈ 22.99 Normal.
Categorization chain:
if bmi < 18.5: Underweight
elif bmi < 25: Normal
elif bmi < 30: Overweight
else: Obese
-->

---

# Classwork: BMI Question

Given: weight = 72 kg, height = 1.78 m  
Tasks:

1. Calculate BMI (round to 2 decimals)
2. Determine category (Underweight, Normal, Overweight, Obese)
3. Write a function `bmi_info(weight, height)` returning `(bmi_value, category)`.

<!--
Speaker Notes:
Answer:
BMI = 72 / (1.78**2)
1.78**2 = 3.1684
72 / 3.1684 ≈ 22.7247 → round(...,2) = 22.72
Category: Normal (18.5 ≤ BMI < 25)

Function example:
def bmi_info(weight, height):
    bmi = weight / (height ** 2)
    if bmi < 18.5:
        cat = "Underweight"
    elif bmi < 25:
        cat = "Normal"
    elif bmi < 30:
        cat = "Overweight"
    else:
        cat = "Obese"
    return round(bmi, 2), cat

print(bmi_info(72, 1.78))  # (22.72, 'Normal')

Teaching point: Show rounding difference if using Decimal for exact.
-->

---

# Practice 11: Jupyter Skills

Markdown cell: `# Unit I Practice - Your Name`  
Code cell:

```python
from datetime import datetime
print("Now:", datetime.now())
```

Shortcuts: Shift+Enter, A/B, M/Y, DD.

<!--
Speaker Notes:
Stress reproducibility & documentation.
-->

---

# Practice 12 (Optional): Mini DataFrame

```python
import pandas as pd
data = {"student": ["A","B","C","D"],
        "age": [20,22,21,19],
        "gpa": [3.5,3.8,3.2,3.9]}
df = pd.DataFrame(data)
print(df)
print("Mean GPA:", df["gpa"].mean())
print("Max Age:", df["age"].max())
df.sort_values("gpa", ascending=False)
```

<!--
Speaker Notes:
Mean GPA 3.6; Max age 22; Sort order D,B,A,C.
-->

---

# Practice 13: Spot & Fix Errors

Identify issues:

```python
print("Age: " + 21)
class = "Data Science"
name = "Sita"
print(Name)
```

<!--
Speaker Notes:
Fixes:
print("Age:", 21)
course = "Data Science"
name = "Sita"
print(name)
Errors: TypeError, keyword, indentation, NameError (case).
-->

---

# Practice 14: Quick Quiz

1. Operator for remainder?
2. Convert `"100"` to integer?
3. Data type of `3.14`?
4. Difference between `/` and `//`?
5. Function to inspect a variable’s type?
6. (Recall) What does `round(2.5)` produce in Python 3?

<!--
Speaker Notes:
Answers: %, int("100"), float, / float division vs // floor division, type(), 2.
-->

---

# Practice 15: Wrap-Up

- Save notebook
- Optional export (HTML/PDF)
- Submit if required
- Next: Python Programming Basics & Operators

<!--
Speaker Notes:
Encourage reflection & consistency in practice.
-->

---

# End

Thank you!  
Next: Strengthen Python syntax & operators.

<!--
Speaker Notes:
Close with motivational note about daily coding.
-->
