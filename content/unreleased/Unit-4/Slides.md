---
marp: true
theme: default
paginate: true
title: "Unit IV — Functions & Modules"
description: "DSC 481 — Unit IV: Write reusable Python functions and use modules (Defining functions, parameters, return values, recursion; importing modules and libraries)"
---

# Unit IV — Functions & Modules (4 Hours)

DSC 481 — Fundamentals of Data Science  
Unit IV: Write reusable Python functions and use modules

<!--
Expanded Speaker Notes (≈30s)

Intro (what to say first)
- Welcome students and state the learning goal for this unit: write reusable Python functions and organize them into modules so code can be reused across scripts and sessions.
- Motivation: emphasize maintenance, readability, testability and collaboration benefits. Real-world example: one correctly written BMI function can be reused for thousands of records without duplicating logic.

Planned flow & timing
- Quick lecture (30–40s overview) then hands-on examples and exercises throughout the class. Tell students you expect them to experiment with small code snippets and to use the provided exercises to practice.

Interaction prompts
- Ask: "Who has reused code before? How did you share it?" Use answers to highlight benefits of modular code.

Transition
- Move to the learning objectives slide next.
-->

---

# Learning Objectives

By the end of this unit students should be able to:

- Define and call Python functions
- Use positional, keyword, and default parameters
- Return single and multiple values; understand scope
- Write simple recursive functions with proper base cases
- Create, import, reload, and run modules (.py files) from the working folder

<!--
Expanded Speaker Notes (≈30s)

What to emphasize
- Read each objective aloud and briefly explain why it matters.
  - Example: positional vs keyword args matter for readability and avoiding bugs.
  - Returning multiple values matters when a function computes several related quantities.

Teaching plan link
- Explain the link between objectives and exercises: each objective maps to a short hands-on task students will perform during the lab portion.

Assessment note
- Tell students how they will demonstrate competency: small scripts, a module file, and a short README describing how to run the demo.
-->

---

# Why Functions & Modules?

- Functions encapsulate behavior: avoid repetition (DRY)
- Modules (.py files) package related code for reuse across projects
- Benefits: easier testing, clearer code, better maintainability

<!--
Expanded Speaker Notes (≈45s)

Concrete illustration
- Demonstrate a simple before/after:
  - Before: copy/paste BMI logic in three places — highlight problems (duplication, inconsistency).
  - After: one function bmi_info(weight, height) used everywhere — easier to fix and test.

Testing angle
- Explain unit testing: small functions are easy to test with simple assertions.

Maintainability & team work
- When working in teams, modules provide agreed APIs. Show how import boundaries clarify responsibilities.

Class activity suggestion
- Ask students quick question: name one function they can imagine pulling out of their current code into a module.
-->

---

# Function Basics — Syntax

```python
def function_name(param1, param2=default):
    """Optional docstring describing behavior."""
    # body
    return result  # optional
```

Example:

```python
def greet(name):
    """Return a greeting string."""
    return f"Hello, {name}!"
```

<!--
Expanded Speaker Notes (≈1 min)

Explain each part
- def: defines a function
- function_name: naming convention (snake_case), should be descriptive
- params: required and optional, defaults after required ones
- docstring: briefly show where to write purpose, parameter descriptions, and return info
- body: indentation is critical in Python — remind students about consistent indentation (4 spaces)
- return: optional; if omitted, function returns None

Style tips
- Encourage short functions, descriptive names, and docstrings (one-line summary + optional longer explanation).
- Show example docstring format:
  """Return a greeting string.

  Args:
      name (str): Name to greet.

  Returns:
      str: Greeting message.
  """

Quick live demo suggestion
- Ask a volunteer to suggest a function name and parameter and type a one-line function in a shared environment (or instructor types it).
-->

---

# Calling Functions — Simple Example

```python
print(greet("Sita"))      # Hello, Sita!
```

Step-through:

- Python evaluates arguments, calls the function, executes body and returns result.

<!--
Expanded Speaker Notes (≈30s)

Walkthrough
- Show the call -> execution -> return sequence step by step:
  1. Evaluate arguments ("Sita")
  2. Bind parameters inside function (name = "Sita")
  3. Execute function body
  4. Return value to caller and print it

Common mistakes to highlight
- Forgetting parentheses when calling a function (e.g., print(greet) vs print(greet()))
- Passing wrong number/type of arguments — demonstrate TypeError by calling greet() with no argument

Quick interactive check
- Ask students: "What happens if you call greet(123)?" — discuss that Python will accept it at runtime unless you validate types; recommend docstrings or type hints for clarity.
-->

---

# Parameters & Argument Types

- Positional arguments: order matters
- Keyword arguments: name=value (order independent)
- Default values: make arguments optional
- Variable-length: \*args (positional), \*\*kwargs (keyword)

Example:

```python
def power(x, p=2):
    return x ** p

power(3)        # 9
power(3, p=3)   # 27
```

<!--
Expanded Speaker Notes (≈1 min)

Explain each form with pros/cons
- Positional: concise but less explicit
- Keyword: self-documenting and safer when calling functions with many parameters
- Default values: good for common cases; warn about mutable defaults

Show *args and **kwargs
- Example:
  def concat(*parts): ...
  def configure(**options): ...
- Explain patterns: *args for flexible positional lists; **kwargs when you want named options

Mutable default caveat
- Show bad example:
  def f(lst=[]): lst.append(1); return lst
- Explain the shared list across calls and how that causes bugs
- Show fix: use None and initialize inside the function

Small hands-on idea
- Ask students to rewrite a function with many optional params to use keywords and defaults for clarity.
-->

---

# Returning Values

- Use return to send values back to the caller
- Multiple values returned as a tuple (can be unpacked)

Example:

```python
def min_max(values):
    return min(values), max(values)

lo, hi = min_max([4, 1, 9])
print(lo, hi)  # 1 9
```

<!--
Expanded Speaker Notes (≈45s)

Explain tuple return semantics
- Returning a, b is returning a tuple (a, b). Show that the caller can unpack or treat it as a tuple.

Design guidance
- When to return multiple values: when they are logically linked (min & max) — otherwise consider returning a namedtuple/dataclass or dict to improve readability.

Introduce small namedtuple/dataclass idea
- For clarity use:
  from collections import namedtuple
  Stats = namedtuple("Stats", ["min", "max"])
  return Stats(min_val, max_val)

Testing idea
- Suggest adding small asserts inside development or write unit tests that unpack the tuple and check fields.
-->

---

# Variable Scope — Local vs Global

- Local: variables defined inside a function (not visible outside)
- Global: variables at module level (visible across the module)
- Prefer returning values instead of mutating globals

Example:

```python
x = 10
def foo():
    x = 5
    return x

print(foo(), x)  # 5 10
```

<!--
Expanded Speaker Notes (≈45s)

Explain exact behavior
- Show that assigning to a name inside a function creates or rebinds a local name by default.
- To modify a module-level name, you can use `global name` — demonstrate the syntax but stress it is discouraged.

Why avoid `global` (talking points)
- Hidden side effects (function signature does not show dependency)
- Harder to test (tests must set/reset global state)
- Coupling across modules leads to brittle code and bugs
- Concurrency hazards if code runs concurrently

Alternatives to `global`
- Pass the value in and return the new value
- Use an object (class) to hold mutable state and methods to manipulate it
- Use a module-level read-only constant for config (OK), but avoid runtime reassignments

Small demo/refactor
- Show bad example with a global counter, then refactor to:
  def increment(counter): return counter+1
  or use a Counter class.

Class exercise prompt
- Ask students to identify any global variables in their current code and suggest a refactor.
-->

---

# Recursion — Concept & Example

- Recursion: a function calls itself to solve a smaller subproblem
- Always include a base case to stop recursion

Example (factorial):

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

<!--
Expanded Speaker Notes (≈1 min)

Trace example step-by-step
- Draw or verbally show the call stack for factorial(4)
- Emphasize the base case and how it prevents infinite recursion

Performance considerations
- Recursion can be elegant but sometimes slower and memory-intensive — discuss stack depth limits and RecursionError
- For large n, prefer iterative solutions or memoization (show a simple memoized fib example with a cache dict)

When recursion is appropriate
- Recursive solutions are natural for tree traversal, divide-and-conquer algorithms (merge sort), and some mathematical definitions.
- For simple sequences, iterative may be simpler and safer.

Quick classroom task
- Ask students to implement both recursive and iterative factorial and compare readability and performance for small n.
-->

---

# Modules — What & Why

- A module is a .py file containing functions, classes, and variables
- Import modules into other scripts or interactive sessions to reuse functionality
- Import styles:
  - import module → use module.name
  - from module import name → use name directly

<!--
Expanded Speaker Notes (≈30s)

Clarify terminology
- Module: a single .py file
- Package: a directory with __init__.py (optional in newer Python) that groups modules

Import rules & namespace
- Explain how imports create a namespace and why module.name is explicit and easy to read
- Show that from module import name brings the name into the current namespace and can shadow local names (possible source of bugs)

Practical example
- Mention that modules are the unit of code sharing and organization: e.g., math, random, pandas are modules you import.
-->

---

# Create a module file — simple approaches

A. Create using a text editor and save as mymath.py in the project folder (recommended).  
B. Programmatic write from Python (useful for quick examples):

```python
code = """def greet(name):
    return f'Hello, {name}!'
"""
open("mymath.py", "w").write(code)
```

After saving the file in the same folder as your code, it can be imported as a module.

<!--
Expanded Speaker Notes (≈45s)

Practical tips for students
- Save modules in the same folder as the script that will import them or place them somewhere on sys.path.
- Use meaningful file/module names (no hyphens or spaces).
- Recommend editors that show project folders (VS Code) for clarity.

Demonstrate step-by-step
- Create mymath.py with functions, save it, then open a new REPL or script and import it.
- If editing a module while the REPL is open, show how to reload it using importlib.reload(module).

Mention simple debugging hints
- If ImportError occurs, check current working directory and sys.path.
- Avoid naming modules the same as standard library modules (e.g., random.py) to prevent shadowing.
-->

---

# Example module — mymath.py

```python
def first_n_squares(n):
    return [i*i for i in range(1, n+1)]

def is_prime(n):
    if n <= 1:
        return False
    if n % 2 == 0 and n != 2:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True
```

---

```python
def bmi_info(weight_kg, height_m):
    bmi = weight_kg / (height_m ** 2)
    if bmi < 18.5:
        cat = "Underweight"
    elif bmi < 25:
        cat = "Normal"
    elif bmi < 30:
        cat = "Overweight"
    else:
        cat = "Obese"
    return bmi, cat

if __name__ == "__main__":
    # quick checks when the file is executed directly
    print("First 5 squares:", first_n_squares(5))
    print("Primes 1..20:", [n for n in range(1,21) if is_prime(n)])
    print("BMI example (70kg,1.75m):", bmi_info(70, 1.75))
```

<!--
Expanded Speaker Notes (≈1 min)

Walkthrough function-by-function
- first_n_squares: show list comprehension and ask about its complexity O(n)
- is_prime: explain improved checks (even numbers and odd divisors only) and mention limitations for very large numbers — fine for class exercises
- bmi_info: discuss units (kg/m) and why docstrings should specify units

Explain __main__ block
- Purpose: run quick demos or simple tests when the file is executed directly; these do not execute when module is imported
- Encourage adding a few asserts or small tests inside the block for quick manual verification

Class activity
- Ask students to extend mymath.py with a function that returns top-n primes and test it in the demo block.
-->

---

# Import and Use the Module

In another Python file or session within the same folder:

```python
import mymath

print(mymath.first_n_squares(5))
print([n for n in range(1,21) if mymath.is_prime(n)])
print(mymath.bmi_info(70, 1.75))
```

Or import specific names:

```python
from mymath import is_prime, bmi_info
print(is_prime(17))
print(bmi_info(60, 1.6))
```

<!--
Expanded Speaker Notes (≈45s)

Explain behavior differences
- import mymath: module is loaded and you use qualified names (mymath.function). This makes it clear where functions come from.
- from mymath import name: imports name into current namespace directly — useful for convenience but can hide origins and cause name clashes.

Best practice recommendation
- For classroom code and small scripts, explicit import (import module) is safer and clearer. In short throwaway scripts, selective imports are fine.

Troubleshooting tips
- If import fails, check file is saved and working directory is correct.
- If you change the module and the running session does not reflect changes, show importlib.reload(mymath).
-->

---

# Updating a Module During Development

- When you edit a module during the same interpreter/session, reload it:

```python
import importlib
importlib.reload(mymath)
```

- Alternatively, start a fresh interpreter/session to get a clean import.

<!--
Expanded Speaker Notes (≈30s)

Why reload is needed
- Python caches modules in sys.modules — subsequent imports return the cached module. importlib.reload forces Python to re-execute the module code and update the module object.

Limitations & caveats
- reload will update the module object but any names previously imported via `from module import name` will still refer to the old object. Recommend using `import module` when iterating and reloading, or re-import names explicitly after reload.

Practical workflow for students
- Edit module file, run importlib.reload(mymath) in the running session, then re-run the test calls. If things get confused, restart the interpreter for a clean state.
-->

---

# Organizing code — simple project layout

- project/
  - mymath.py
  - scripts/
    - run_demo.py
  - README.txt

Keep reusable modules at top-level of the project so other files can import them directly.

<!--
Expanded Speaker Notes (≈30s)

Explain reasoning behind layout
- Top-level modules are easy to import without messing with sys.path.
- scripts/ holds runnable scripts that orchestrate modules — keeps responsibilities separate.
- README should include exact run steps and any environment notes.

Class suggestion
- Encourage students to create their project folder and save mymath.py and a small runner script there for the assignment.
-->

---

# Best Practices & Common Pitfalls

- Keep functions focused and small
- Add docstrings and short comments for public functions
- Avoid heavy computation at import time (use demo/test blocks)
- Prefer explicit imports (`from module import name`) sparingly
- For mutable default arguments use None and initialize inside the function

Example (safe default pattern):

```python
def append_item(x, lst=None):
    if lst is None:
        lst = []
    lst.append(x)
    return lst
```

<!--
Expanded Speaker Notes (≈1 min)

Explain each practice with concrete examples
- Small focused functions: easier to read, test, and reuse
- Docstrings: show how to quickly document args/returns and include short examples in the docstring for future readers
- Heavy work at import: explain that modules imported by many other modules should avoid expensive setup (e.g., large data loads) at import time — perform those inside functions or in the __main__ block
- Mutable default pitfalls: repeat the bad example and fix; show how surprising behavior can persist across calls

Testing & verification
- Encourage students to include simple assertion tests or a small tests/ folder with scripts that import modules and assert expected outputs.
-->

---

# Hands-on Exercises (in-class / lab)

1. Create `mymath.py` with the example functions. Run the file's quick checks to verify outputs.
2. In a separate file, import `mymath` and call each function for sample inputs.
3. Improve `is_prime` for small optimizations (handle even numbers, skip even divisors).
4. Add simple assertion tests in a small test file to validate behavior.

<!--
Expanded Speaker Notes (≈5–12 min)

Lab facilitation guidance
- Walk students through the tasks step-by-step if time permits.
- Suggested pacing:
  - 0–2 min: create mymath.py with first_n_squares and bmi_info
  - 2–6 min: test in a separate file or REPL and debug simple mistakes
  - 6–10 min: implement/improve is_prime and test it for 1..50
  - 10–15 min: add a small test file with a few assertions (e.g., assert is_prime(17) is True)

Debugging tips to offer
- If an import fails, print os.getcwd() to check the current folder and ensure mymath.py is present.
- If changes don't appear, explain importlib.reload and re-import patterns.

Encourage collaboration
- Let students compare implementations and discuss edge cases (e.g., is_prime for negative numbers).
-->

---

# Assessment / Homework

- Deliverables:
  - `mymath.py` with required functions and docstrings
  - a short script or small file showing how you import and use the module (e.g., `scripts/run_demo.py`)
  - `README.txt` listing exact steps you used to run the demo in your environment

Evaluation will check correctness, code clarity, and presence of basic tests.

<!--
Expanded Speaker Notes (≈30s)

Grading rubric guidance (tell students)
- Correctness: functions produce expected outputs for normal inputs (60%)
- Code clarity & documentation: readable names and docstrings (20%)
- Tests & reproducibility: included simple tests and clear README with run steps (20%)

Submission advice
- Encourage students to include exact commands and file locations in README and to attach a short note about any special environment or Python version used.
-->

---

# Resources & Further Reading

- Python docs — Defining functions: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
- Python docs — Modules: https://docs.python.org/3/tutorial/modules.html
- "Python Crash Course" — Eric Matthes

<!--
Expanded Speaker Notes (≈15s)

Encourage further reading
- Mention recommended chapters for deeper reading and quick lookup.
- Recommend practice: re-implement a small utility and turn it into a module for the next class.
-->

---

# Summary & Next Steps

- You learned how to define functions, use parameters and returns, write recursion, and package code into modules.
- Next unit: Unit V — Data Structures (Lists, Tuples, Sets, Dictionaries).

<!--
Expanded Speaker Notes (≈1 min)

Wrap-up
- Reiterate key takeaways: explicit inputs/outputs; prefer returning values over mutating global state; keep functions small and documented.
- Remind students of homework deliverable and where to submit it.

Q&A
- Leave 2–3 minutes for questions. Ask students to state one concept they found confusing or would like to revisit in the next class.
-->
