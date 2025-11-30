---
marp: true
theme: default
paginate: true
title: "Unit II & III — Python Basics (Reminder) & Control Structures"
description: "DSC 481 — Unit II: Python Programming Basics & Operators recap, and Unit III: Control Structures"
---

# Unit II & III — Python Basics (Reminder) & Control Structures

DSC 481 — Fundamentals of Data Science  
Unit II (Recap) + Unit III (New Content)

<!--
Speaker Notes:
Efficient summary of Unit II, then focused coverage of Unit III (new content). For lecture and lab in Colab/Jupyter.
-->

---

# Unit II — Python Programming Basics & Operators (Recap)

- Python history & main features: simple, readable, widely used in Data Science
- IDEs: Google Colab (recommended!), Jupyter, VS Code, PyCharm
- Basics: variables, types (int, float, str, bool)
- Operators: arithmetic (+, -, *, /, %, //, **), comparison (==, <, >=, ...), logical (and, or, not)
- Type conversion: int(), float(), str()

<!--
Speaker Notes:
Quick review — these should now be familiar! Ask warm-up questions (variable, print, assignment vs comparison).
-->

---

# Python: Brief History

- Created by Guido van Rossum, first released in 1991  
- Designed for readability and developer productivity  
- Evolved to a rich ecosystem used across web, automation, scientific computing, and data science

<!--
Speaker Notes:
Discuss the importance of clear syntax and Python's widespread use. Mention Zen of Python (import this) — fun for students to see.
-->

---

# Variable Naming Rules & Best Practices

- Start with letter or underscore: `_count`, `age`
- Use letters, digits, underscores only
- Case-sensitive: `Age` ≠ `age`
- Avoid Python keywords (`for`, `class`, etc.)
- Prefer descriptive names: `student_name` over `sn`

<!--
Speaker Notes:
Live demo: try naming a variable `class` or `2nd`, show SyntaxError.
Encourage descriptive, readable names — makes code and teamwork easier.
-->

---

# What Was NOT Covered — Now Building Skills

- Decision-making with if, elif, else (conditional branching)
- Repeating actions with for and while loops (iteration)
- Breaking out or skipping within loops: break, continue
- Combining loops and conditionals to solve practical tasks

<!--
Speaker Notes:
Unit III begins: Control Structures. Time to learn how programs "think" and "repeat"!
-->

---

# Unit III — Control Structures in Python

**Objective:**  
Implement decision-making and iterative programming in Python

**Topics:**  
- Conditional statements: if, else, elif  
- Loops: for, while  
- Loop control: break, continue

<!--
Speaker Notes:
Announce new unit. Control structures allow Python to make decisions and repeat (core to programming!).
-->

---

# Conditional Statements: if, elif, else

Branch code based on conditions.

Syntax:
```python
if condition:
    # code if True
elif another_condition:
    # code if previous False, this True
else:
    # fallback code
```
Example:
```python
score = 75
if score >= 90:
    print("Excellent")
elif score >= 50:
    print("Pass")
else:
    print("Fail")
```

<!--
Speaker Notes:
Change score in the demo. Indentation is essential — show a block error if spaces are missing!
-->

---

# Practical Tips for Conditionals

- Use readable conditions: `is_pass = score >= 45`
- Avoid deep nesting
- Combine conditions with and, or, not

Example:
```python
age = 20
if age >= 18 and age < 60:
    print("Eligible for voting.")
```

<!--
Speaker Notes:
Demo: several age values. Encourage students to predict output before running.
-->

---

# Looping — for & while

**for loop — Repeat for items in sequence/range**
```python
for i in range(1, 6):
    print("Counting:", i)
```

**while loop — Repeat as long as condition True**
```python
attempts = 0
while attempts < 3:
    print("Try number", attempts+1)
    attempts += 1
```

<!--
Speaker Notes:
Demo: for-loop for simple counting, while-loop for repeated prompts.
-->

---

# Loop Controls — break & continue

- `break` — exit loop immediately
- `continue` — skip current iteration

Examples:
```python
for num in range(1, 10):
    if num == 5:
        break    # stops loop at 5
    print(num)

for num in range(1, 6):
    if num % 2 == 0:
        continue # skips even numbers
    print(num)   # prints only odd numbers
```

<!--
Speaker Notes:
Useful for filtering, early exit, skipping! Demo live, ask students what the printout will be.
-->

---

# Combining Loops & Conditionals — Real Task

**Example:** Print positive numbers in a list, stop for None.
```python
values = [3, -1, 5, None, 7]
for v in values:
    if v is None:
        break
    if v <= 0:
        continue
    print(v)  # prints 3, then 5
```

<!--
Speaker Notes:
Trace through the example step-by-step, asking students to follow logic.
-->

---

# Practice & Lab Suggestions — Unit III

1. Write an if-elif-else program to classify BMI (underweight, normal, overweight, obese)
2. Use a for loop to print first 10 squares (i ** 2)
3. Use a while loop to repeatedly prompt for password until correct (or limit tries)
4. Use break to stop scanning a list when you find "Pokhara"
5. Use continue in a for-loop to print only even numbers from a list

<!--
Speaker Notes:
Assign these for hands-on work. Encourage students to tinker, try new conditions and loops!
-->

---

# Common Pitfalls & Debugging

- Off-by-one errors: range(0, 10) vs range(1, 10)
- Infinite loops: forgetting to update loop variable in while
- Indentation problems in branching/looping
- Logic errors: wrong condition (== vs =), misplaced break

Tips:
- Read error traceback and line number
- Print values inside loop to debug logic step-by-step

<!--
Speaker Notes:
Demo a bug and fix it live. Encourage students to ask about confusing error messages.
-->

---

# Homework / Self-practice (Units II & III)

- Review code snippets, write similar ones yourself
- Solve any 2–3 Unit III practice/lab tasks in Colab/Jupyter
- Read Ch. 1–3 from "Python Crash Course" or equivalent (syntax, types, control flow)
- Prepare one question about loops, if/else, or errors for next class

<!--
Speaker Notes:
Emphasize regular practice and coming with questions!
-->

---

# Useful Resources

- [Python docs](https://docs.python.org/3/)
- [Google Colab](https://colab.research.google.com/)
- [Python Crash Course](https://nostarch.com/pythoncrashcourse2e)
- [Real Python Tutorials](https://realpython.com/)
- "Learning Python" — Mark Lutz

<!--
Speaker Notes:
All links also posted to LMS or class Drive. Invite students to explore and test code samples.
-->

---

# Summary & Next Steps

- Unit II: Python basics (quick reminder) — variables, types, naming, key syntax
- Unit III: Control structures — if/elif/else, for/while loops, break & continue, real program patterns
- Next: Functions & Modules — write reusable Python functions, define parameters and return values, use recursion; import modules and libraries

<!--
Speaker Notes:
Wrap up, take any final questions, and preview next session (functions & modules).
-->
