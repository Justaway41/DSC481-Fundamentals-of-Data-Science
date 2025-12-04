---
marp: true
theme: default
paginate: true
title: DSC 481 Lab Questions - Units I-IV
description: Comprehensive lab questions for 5th Semester BCSIT students covering Python basics, control structures, and functions
---

# DSC 481 Lab Session

## Units I-IV(Recursive Functions) Comprehensive Practice

- Section A (Basics): 20 min
- Section B (Control Structures): 25 min
- Section C (Functions & Modules): 30 min

<!--
Speaker Notes (Instructor Guide):
Total Time: 90 minutes
- Introduction & Setup: 5 min
- Section A (Basics): 20 min
- Section B (Control Structures): 25 min
- Section C (Functions & Modules): 30 min
- Review & Q&A: 10 min

Materials needed:
- Students should have Jupyter Notebook or Google Colab ready
- Create a notebook named: Lab_Units_I_IV_YourName.ipynb
-->

---

# Lab Instructions

1. Create a new Jupyter notebook: `Lab_Units_I_IV_YourName.ipynb`
2. Complete all questions in order
3. Include comments in your code explaining your logic
4. Test your code with multiple inputs where applicable
5. Submit your completed notebook by end of class

<!--
Speaker Notes:
Remind students to:
- Save frequently (Ctrl+S)
- Run cells to verify output
- Ask questions if stuck for more than 5 minutes
- Work systematically through sections
-->

---

# Section A: Python Basics & Environment

## Questions 1-5 (20 minutes)

<!--
Speaker Notes:
This section covers:
- Environment verification
- Variables and types
- Basic operators
- String manipulation
- Type conversion

Circulate and check that all students can run code successfully.
-->

---

# Question 1: Environment & Library Check (3 min)

Write code to:

1. Display your Python version
2. Import and display versions of NumPy and Pandas
3. Print your name, program (BCSIT), and semester (5)
4. Use an f-string for the personal information

<!--
Speaker Notes:
ANSWER:
```python
import sys
print("Python version:", sys.version)

import numpy as np
import pandas as pd
print("NumPy version:", np.__version__)
print("Pandas version:", pd.__version__)

name = "Your Name"
program = "BCSIT"
semester = 5
print(f"{name} is studying {program}, Semester {semester}")
```

Common issues:
- If libraries missing: !pip install numpy pandas (in Colab)
- Make sure f-string uses correct syntax with curly braces
-->

---

# Question 2: Variable Types & Operations (4 min)

Given the following variables:

```python
student_name = "Rajesh Kumar"
age = 22
height_m = 1.75
is_regular = True
```

Tasks:

1. Print each variable with its type
2. Calculate the student's age in months
3. Create a formatted string: "Rajesh Kumar (22 years) - Regular Student: True"
4. Change age to a string "22" and try to add 5 to it. What happens?

<!--
Speaker Notes:
ANSWER:
```python
student_name = "Rajesh Kumar"
age = 22
height_m = 1.75
is_regular = True

# Task 1
print(student_name, type(student_name))  # str
print(age, type(age))  # int
print(height_m, type(height_m))  # float
print(is_regular, type(is_regular))  # bool

# Task 2
age_months = age * 12
print("Age in months:", age_months)  # 264

# Task 3
info = f"{student_name} ({age} years) - Regular Student: {is_regular}"
print(info)

# Task 4
age = "22"
# print(age + 5)  # TypeError: can only concatenate str (not "int") to str
# Fix: print(int(age) + 5)  # 27
```

Teaching point: Emphasize type errors and the need for explicit conversion.
-->

---

# Question 3: Arithmetic & Comparison (4 min)

Given: `a = 47` and `b = 8`

Calculate and print:

1. Sum, difference, product
2. Float division and floor division results
3. Remainder (modulus)
4. a raised to power b (be careful - large number!)
5. Boolean result: Is a divisible by 8?
6. Boolean result: Is a greater than 50 OR b less than 10?

<!--
Speaker Notes:
ANSWER:
```python
a, b = 47, 8

# Task 1
print("Sum:", a + b)  # 55
print("Difference:", a - b)  # 39
print("Product:", a * b)  # 376

# Task 2
print("Division:", a / b)  # 5.875
print("Floor division:", a // b)  # 5

# Task 3
print("Remainder:", a % b)  # 7

# Task 4
print("Power:", a ** b)  # 47^8 = large number (23811286661761)

# Task 5
print("Is a divisible by 8?", a % 8 == 0)  # False

# Task 6
print("Is a > 50 OR b < 10?", (a > 50) or (b < 10))  # True
```

Note: 47**8 is very large - good opportunity to discuss computational limits
-->

---

# Question 4: String Manipulation (4 min)

Given: `course = "Fundamentals of Data Science"`

Tasks:

1. Print the length of the string
2. Extract and print the first word using string slicing
3. Extract and print the last word
4. Check if "Data" is in the course name (boolean result)
5. Convert the entire string to uppercase
6. Create a new string with your name: "I am [Your Name] studying [course]"

<!--
Speaker Notes:
ANSWER:
```python
course = "Fundamentals of Data Science"

# Task 1
print("Length:", len(course))  # 29

# Task 2
first_word = course.split()[0]
# Or: first_word = course[:12]
print("First word:", first_word)  # Fundamentals

# Task 3
last_word = course.split()[-1]
print("Last word:", last_word)  # Science

# Task 4
print("Contains 'Data'?", "Data" in course)  # True

# Task 5
print("Uppercase:", course.upper())  # FUNDAMENTALS OF DATA SCIENCE

# Task 6
my_name = "Rajesh"
message = f"I am {my_name} studying {course}"
print(message)
```

Alternative for Task 2 & 3: Use string methods like find(), index(), or split()
-->

---

# Question 5: Rounding Behavior (5 min)

Tasks:

1. Use `round()` on these values and print results:
   - 2.5, 3.5, 4.5, -2.5
2. Explain the pattern you observe (write in a comment)
3. Calculate: `round(2.675, 2)` - is the result what you expected?
4. Implement a function `half_up_round(n)` that always rounds 0.5 up

**Bonus:** Use the Decimal module to correctly round 2.675 to 2 decimals.

<!--
Speaker Notes:
ANSWER:
```python
# Task 1
values = [2.5, 3.5, 4.5, -2.5]
for v in values:
    print(f"round({v}) = {round(v)}")

# Output:
# round(2.5) = 2
# round(3.5) = 4
# round(4.5) = 4
# round(-2.5) = -2

# Task 2
# Pattern: Python 3 uses "round half to even" (banker's rounding)
# .5 rounds to the nearest even number to reduce cumulative bias

# Task 3
print(round(2.675, 2))  # Output: 2.67 (not 2.68!)
# Explanation: Due to floating-point representation, 2.675 is actually
# stored as something slightly less than 2.675

# Task 4
import math
def half_up_round(n):
    return math.floor(n + 0.5)

print(half_up_round(2.5))  # 3
print(half_up_round(3.5))  # 4

# Bonus
from decimal import Decimal, ROUND_HALF_UP
result = Decimal('2.675').quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
print(result)  # 2.68
```

Teaching points:
- Banker's rounding reduces bias in large datasets
- Floating-point representation issues
- When precision matters, use Decimal
-->

---

# Section B: Control Structures

## Questions 6-9 (25 minutes)

<!--
Speaker Notes:
This section covers:
- Conditional statements (if/elif/else)
- For loops and while loops
- Loop control (break/continue)
- Nested structures
- Practical applications

Monitor student progress and provide hints if needed.
-->

---

# Question 6: BMI Calculator with Categories (6 min)

Write a complete BMI calculator program that:

1. Defines variables: `weight_kg = 72`, `height_m = 1.78`
2. Calculates BMI (round to 2 decimals)
3. Determines category using if-elif-else:
   - Underweight: BMI < 18.5
   - Normal: 18.5 ≤ BMI < 25
   - Overweight: 25 ≤ BMI < 30
   - Obese: BMI ≥ 30
4. Prints: "BMI: [value] - Category: [category]"
5. Test with at least 3 different weight/height combinations

<!--
Speaker Notes:
ANSWER:
```python
# Task 1-4: Complete BMI calculator
weight_kg = 72
height_m = 1.78

bmi = weight_kg / (height_m ** 2)
bmi_rounded = round(bmi, 2)

if bmi < 18.5:
    category = "Underweight"
elif bmi < 25:
    category = "Normal"
elif bmi < 30:
    category = "Overweight"
else:
    category = "Obese"

print(f"BMI: {bmi_rounded} - Category: {category}")
# Output: BMI: 22.72 - Category: Normal

# Task 5: Test cases
test_cases = [
    (50, 1.65),   # BMI ≈ 18.37 - Underweight
    (85, 1.75),   # BMI ≈ 27.76 - Overweight
    (95, 1.70),   # BMI ≈ 32.87 - Obese
]

for weight, height in test_cases:
    bmi = round(weight / (height ** 2), 2)
    if bmi < 18.5:
        cat = "Underweight"
    elif bmi < 25:
        cat = "Normal"
    elif bmi < 30:
        cat = "Overweight"
    else:
        cat = "Obese"
    print(f"Weight: {weight}kg, Height: {height}m → BMI: {bmi} - {cat}")
```

Common mistakes:
- Forgetting parentheses in height**2
- Wrong inequality operators
- Not rounding BMI
-->

---

# Question 7: Loop Practice (6 min)

Write separate code for each task:

1. **For loop:** Print squares of numbers 1 to 10
2. **While loop:** Print countdown from 10 to 1, then print "Blast off!"
3. **For loop with condition:** Print only even numbers from 1 to 20
4. **List iteration:** Given `fruits = ["apple", "banana", "cherry", "date"]`, print each fruit with its position (1-indexed)

<!--
Speaker Notes:
ANSWER:
```python
# Task 1: Squares
for i in range(1, 11):
    print(f"{i}² = {i**2}")

# Output: 1² = 1, 2² = 4, ..., 10² = 100

# Task 2: Countdown
count = 10
while count > 0:
    print(count)
    count -= 1
print("Blast off!")

# Task 3: Even numbers
for num in range(1, 21):
    if num % 2 == 0:
        print(num, end=" ")
# Output: 2 4 6 8 10 12 14 16 18 20

# Alternative using range step:
for num in range(2, 21, 2):
    print(num, end=" ")

# Task 4: Fruits with position
fruits = ["apple", "banana", "cherry", "date"]
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# Alternative without enumerate:
for i in range(len(fruits)):
    print(f"{i+1}. {fruits[i]}")
```

Teaching points:
- range() parameters: start, stop, step
- enumerate() for index and value
- Difference between print() and print(end=" ")
-->

---

# Question 8: Break & Continue (6 min)

Tasks:

1. Write a loop that prints numbers 1-20 but **breaks** when it reaches 13
2. Write a loop that prints numbers 1-15 but **skips** (continues) multiples of 3
3. **Challenge:** Write a password checker that:
   - Keep the passwords in a list. Asks for password up to 3 times. (use while loop)
   - Correct password is "python123"
   - Breaks if correct, prints "Access granted"
   - After 3 failed attempts, prints "Access denied"

<!--
Speaker Notes:
ANSWER:
```python
# Task 1: Break at 13
for num in range(1, 21):
    if num == 13:
        break
    print(num, end=" ")
# Output: 1 2 3 4 5 6 7 8 9 10 11 12

print("\n")

# Task 2: Skip multiples of 3
for num in range(1, 16):
    if num % 3 == 0:
        continue
    print(num, end=" ")
# Output: 1 2 4 5 7 8 10 11 13 14

print("\n")

# Task 3: Password checker (Challenge)
correct_password = "python123"
attempts = 0
max_attempts = 3

while attempts < max_attempts:
    password = input("Enter password: ")
    attempts += 1

    if password == correct_password:
        print("Access granted")
        break
    else:
        remaining = max_attempts - attempts
        if remaining > 0:
            print(f"Incorrect. {remaining} attempts remaining.")
        else:
            print("Access denied")

# For non-interactive testing (Colab without input):
# Simulate with a list of attempts
test_passwords = ["wrong1", "wrong2", "python123"]
for i, pwd in enumerate(test_passwords):
    if i >= 3:
        break
    if pwd == "python123":
        print("Access granted")
        break
    else:
        print(f"Attempt {i+1} failed")
```

Note: In automated environments, replace input() with test values
-->

---

# Question 9: Nested Loops & Patterns (7 min)

Tasks:

1. Print a multiplication table (1-5) formatted nicely:

   ```
   1  2  3  4  5
   2  4  6  8  10
   3  6  9  12 15
   ...
   ```

2. **Pattern challenge:** Print this pattern using nested loops:

   ```
   *
   **
   ***
   ****
   *****
   ```

<!--
Speaker Notes:
ANSWER:
```python
# Task 1: Multiplication table
print("Multiplication Table (1-5):")
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:3}", end=" ")  # :3 for alignment
    print()  # New line after each row

# Output:
#   1   2   3   4   5
#   2   4   6   8  10
# ...

# Task 2: Star pattern
print("\nStar Pattern:")
for i in range(1, 6):
    print("*" * i)

# Alternative with nested loop:
for i in range(1, 6):
    for j in range(i):
        print("*", end="")
    print()

print("*", end="") prints stars side by side on the same line.
The second print() (with no arguments) moves to the next line.
--->

---

3. **Advanced:** Print prime numbers between 1 and 50

<!--
Speaker Notes:
ANSWER:
```python
# Task 3: Prime numbers (Advanced)
def is_prime(n):
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True

print("\nPrime numbers 1-50:")
primes = [n for n in range(1, 51) if is_prime(n)]
print(primes)
# Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

# Alternative without list comprehension:
primes = []
for n in range(1, 51):
    if is_prime(n):
        primes.append(n)
print(primes)
```

Teaching points:
- String formatting with :3 for alignment
- String multiplication: "*" * 5
- Prime checking algorithm optimization
-->

---

# Section C: Functions & Recursion

## Questions 10-13 (30 minutes)

<!--
Speaker Notes:
This section covers:
- Function definition and calls
- Parameters (positional, keyword, default)
- Return values and multiple returns
- Scope
- Recursion with fun examples

This is the most challenging section - be ready to provide additional support.
-->

---

# Question 10: Function Basics (7 min)

Write the following functions and test each:

1. `greet(name, greeting="Hello")` - returns greeting string

   - Example: `greet("Sita")` → "Hello, Sita!"
   - Example: `greet("Ram", "Namaste")` → "Namaste, Ram!"

2. `calculate_average(numbers)` - returns average of a list

   - Include error handling for empty list

3. `min_max_avg(numbers)` - returns tuple: (min, max, average)
   - Test with: `[23, 45, 12, 67, 34, 89, 15]`

<!--
Speaker Notes:
ANSWER:
```python
# Task 1: Greet function
def greet(name, greeting="Hello"):
    """Return a greeting string.

    Args:
        name (str): Name to greet
        greeting (str): Greeting word (default: "Hello")

    Returns:
        str: Formatted greeting
    """
    return f"{greeting}, {name}!"

# Test
print(greet("Sita"))  # Hello, Sita!
print(greet("Ram", "Namaste"))  # Namaste, Ram!
print(greet("Maya", greeting="Hi"))  # Hi, Maya!

# Task 2: Average function
def calculate_average(numbers):
    """Calculate average of numbers in a list.

    Args:
        numbers (list): List of numbers

    Returns:
        float: Average value

    Raises:
        ValueError: If list is empty
    """
    if not numbers:
        raise ValueError("Cannot calculate average of empty list")
    return sum(numbers) / len(numbers)

# Test
print(calculate_average([10, 20, 30, 40]))  # 25.0
# print(calculate_average([]))  # ValueError

# Task 3: Min, max, average
def min_max_avg(numbers):
    """Return minimum, maximum, and average of numbers.

    Args:
        numbers (list): List of numbers

    Returns:
        tuple: (min, max, average)
    """
    if not numbers:
        return None, None, None
    return min(numbers), max(numbers), calculate_average(numbers)

# Test
test_list = [23, 45, 12, 67, 34, 89, 15]
minimum, maximum, average = min_max_avg(test_list)
print(f"Min: {minimum}, Max: {maximum}, Avg: {average:.2f}")
# Output: Min: 12, Max: 89, Avg: 40.71
```

Teaching points:
- Docstrings are important
- Default parameters must come after required ones
- Tuple unpacking
- Error handling with raise
-->

---

# Question 11: Scope & Global Variables (6 min)

Study this code and answer:

```python
counter = 0

def increment():
    counter = counter + 1
    return counter

print(increment())
```

1. What error occurs? Why?
2. Fix it using proper parameter passing (don't use `global`)
3. Write a corrected version that maintains a counter

**Bonus:** Explain why using `global` is generally discouraged.

<!--
Speaker Notes:
ANSWER:
```python
# Question 1: What error?
# UnboundLocalError: local variable 'counter' referenced before assignment
#
# Why? Python sees "counter = counter + 1" and treats counter as local.
# It tries to read local counter before it's assigned, causing error.

# Question 2 & 3: Fix without global
counter = 0

def increment(count):
    """Increment and return the counter."""
    return count + 1

# Usage
counter = increment(counter)
print(counter)  # 1
counter = increment(counter)
print(counter)  # 2

# Better approach: Use a class
class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1
        return self.value

# Usage
my_counter = Counter()
print(my_counter.increment())  # 1
print(my_counter.increment())  # 2

# Bonus answer: Why avoid global?
"""
Reasons to avoid 'global':
1. Hidden dependencies - function signature doesn't show it uses globals
2. Hard to test - tests must set up global state
3. Hard to debug - globals can be modified anywhere
4. Not thread-safe - concurrent access causes bugs
5. Reduces reusability - function tied to specific global names

Better alternatives:
- Pass values as parameters and return new values
- Use classes to encapsulate state
- Use closures for private state
"""
```

Teaching points:
- Scope rules: local vs global
- Best practice: explicit is better than implicit
- When you need state, use objects
-->

---

# Question 12: Recursion (8 min)

Implement these recursive functions:

1. `factorial(n)` - calculate n!

   - Test: `factorial(5)` should return 120

2. `fibonacci(n)` - return nth Fibonacci number

   - Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21...
   - Test: `fibonacci(7)` should return 13

3. **Challenge:** `sum_digits(n)` - return sum of digits
   - Example: `sum_digits(1234)` → 10

For each, also write an iterative version and compare.

<!--
Speaker Notes:
ANSWER:
```python
# Task 1: Factorial (recursive)
def factorial(n):
    """Calculate n! recursively.

    Args:
        n (int): Non-negative integer

    Returns:
        int: n!
    """
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Iterative version
def factorial_iterative(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Test
print(factorial(5))  # 120
print(factorial_iterative(5))  # 120

# Task 2: Fibonacci (recursive)
def fibonacci(n):
    """Return nth Fibonacci number (0-indexed).

    Args:
        n (int): Position in sequence

    Returns:
        int: nth Fibonacci number
    """
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Iterative version (much more efficient!)
def fibonacci_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Test
print(fibonacci(7))  # 13
print(fibonacci_iterative(7))  # 13

# Memoized version (fast recursive)
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

print(fibonacci_memo(7))  # 13

# Task 3: Sum of digits (Challenge)
def sum_digits(n):
    """Return sum of digits of n.

    Args:
        n (int): Positive integer

    Returns:
        int: Sum of digits
    """
    if n < 10:
        return n
    return (n % 10) + sum_digits(n // 10)

# Iterative version
def sum_digits_iterative(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

# Test
print(sum_digits(1234))  # 10
print(sum_digits_iterative(1234))  # 10

# Performance comparison
import time

# For factorial(100)
start = time.time()
factorial_iterative(100)
print(f"Iterative: {time.time() - start:.6f}s")

# For fibonacci(30) - recursive is MUCH slower
start = time.time()
fibonacci_iterative(30)
print(f"Fib iterative: {time.time() - start:.6f}s")

start = time.time()
fibonacci_memo(30)
print(f"Fib memoized: {time.time() - start:.6f}s")
```

Teaching points:
- Base case is critical (prevents infinite recursion)
- Recursive Fibonacci is inefficient (exponential time)
- Memoization improves recursive performance dramatically
- Iterative often better for simple sequences
- RecursionError if too deep (usually ~1000 calls)
-->

---

# Question 13: Fun with Recursion! 🎮 (9 min)

Let's make recursion fun with these creative challenges:

**Part A: The Tower of Hanoi Puzzle** 🗼  
Write a recursive function `hanoi(n, source, destination, auxiliary)` that prints the steps to move n disks from source to destination using auxiliary peg.

Rules: Move one disk at a time, never place larger disk on smaller.

Test with 3 disks: `hanoi(3, 'A', 'C', 'B')`

---

**Part B: Draw a Recursive Tree** 🌲  
Write `draw_tree(levels)` that draws an ASCII tree:

```
Level 3:
      *
     ***
    *****
      |
```

**Part C: The Collatz Conjecture** 🔢  
Write `collatz(n)` that follows these rules until reaching 1:

- If n is even: n = n/2
- If n is odd: n = 3n + 1
  Print each step. Try `collatz(6)` → should give: 6, 3, 10, 5, 16, 8, 4, 2, 1

<!--
Speaker Notes:
ANSWER:

Part A: Tower of Hanoi
```python
def hanoi(n, source, destination, auxiliary):
    """Solve Tower of Hanoi puzzle recursively.

    Args:
        n (int): Number of disks
        source (str): Source peg name
        destination (str): Destination peg name
        auxiliary (str): Auxiliary peg name
    """
    if n == 1:
        print(f"Move disk 1 from {source} to {destination}")
        return

    # Move n-1 disks from source to auxiliary using destination
    hanoi(n - 1, source, auxiliary, destination)

    # Move the largest disk from source to destination
    print(f"Move disk {n} from {source} to {destination}")

    # Move n-1 disks from auxiliary to destination using source
    hanoi(n - 1, auxiliary, destination, source)

# Test
print("=== Tower of Hanoi with 3 disks ===")
hanoi(3, 'A', 'C', 'B')

# Output:
# Move disk 1 from A to C
# Move disk 2 from A to B
# Move disk 1 from C to B
# Move disk 3 from A to C
# Move disk 1 from B to A
# Move disk 2 from B to C
# Move disk 1 from A to C

# Fun fact: Formula for minimum moves = 2^n - 1
# For 3 disks: 2^3 - 1 = 7 moves
```

Part B: Recursive ASCII Tree
```python
def draw_tree(levels, width=1, indent=0):
    """Draw an ASCII tree recursively.

    Args:
        levels (int): Number of levels to draw
        width (int): Current width of tree part
        indent (int): Current indentation
    """
    if levels == 0:
        return

    # Print current level
    spaces = " " * indent
    stars = "*" * width
    print(f"{spaces}{stars}")

    # Recursive call for next level (wider and more indented)
    draw_tree(levels - 1, width + 2, indent - 1)

# Simple version with trunk
def draw_full_tree(levels):
    """Draw complete tree with trunk."""
    max_width = 2 * levels - 1
    indent = levels - 1

    # Draw the leaves
    for i in range(1, levels + 1):
        width = 2 * i - 1
        spaces = " " * (indent - i + 1)
        stars = "*" * width
        print(f"{spaces}{stars}")

    # Draw trunk
    trunk_indent = " " * indent
    print(f"{trunk_indent}|")

# Test
print("\n=== Recursive Tree (4 levels) ===")
draw_full_tree(4)

# Alternative recursive version
def recursive_tree(n, current=1):
    """Pure recursive tree drawing."""
    if current > n:
        # Base case: draw trunk
        print(" " * (n - 1) + "|")
        return

    # Print current level
    spaces = " " * (n - current)
    stars = "*" * (2 * current - 1)
    print(spaces + stars)

    # Recurse to next level
    recursive_tree(n, current + 1)

print("\n=== Pure Recursive Tree ===")
recursive_tree(4)
```

Part C: Collatz Conjecture
```python
def collatz(n, steps=None):
    """Follow the Collatz conjecture sequence.

    Args:
        n (int): Starting positive integer
        steps (list): Accumulator for steps (used internally)

    Returns:
        list: Sequence of numbers until reaching 1
    """
    if steps is None:
        steps = []

    steps.append(n)

    # Base case
    if n == 1:
        return steps

    # Recursive cases
    if n % 2 == 0:
        return collatz(n // 2, steps)
    else:
        return collatz(3 * n + 1, steps)

# Test cases
print("\n=== Collatz Conjecture ===")
test_numbers = [6, 7, 10, 27]

for num in test_numbers:
    sequence = collatz(num)
    print(f"\nStarting with {num}:")
    print(" → ".join(map(str, sequence)))
    print(f"Steps to reach 1: {len(sequence) - 1}")

# Output for 6:
# 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
# Steps to reach 1: 8

# Fun challenge: Find which number < 100 takes most steps
def find_longest_collatz(limit):
    """Find number with longest Collatz sequence below limit."""
    max_steps = 0
    max_num = 0

    for n in range(1, limit):
        steps = len(collatz(n)) - 1
        if steps > max_steps:
            max_steps = steps
            max_num = n

    return max_num, max_steps

print("\n=== Longest Collatz Sequence (1-100) ===")
num, steps = find_longest_collatz(100)
print(f"Number {num} takes {steps} steps:")
print(" → ".join(map(str, collatz(num))))

# Iterative version for comparison
def collatz_iterative(n):
    """Iterative version of Collatz conjecture."""
    sequence = [n]
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        sequence.append(n)
    return sequence

# Verify both give same result
print("\n=== Recursive vs Iterative (n=27) ===")
rec = collatz(27)
iter = collatz_iterative(27)
print(f"Recursive steps: {len(rec)}")
print(f"Iterative steps: {len(iter)}")
print(f"Results match: {rec == iter}")
```

Teaching Points:
1. **Tower of Hanoi**: Classic recursion example showing divide-and-conquer
   - Time complexity: O(2^n)
   - Shows how recursion naturally handles subproblems

2. **Recursive Tree**: Visual recursion - helps students "see" the concept
   - Demonstrates parameter passing for state
   - Shows accumulation pattern

3. **Collatz Conjecture**:
   - Unsolved math problem! (conjecture: all numbers reach 1)
   - Shows recursion with two different paths
   - Great for comparing recursive vs iterative
   - Number 27 takes 111 steps!

Encourage students to:
- Trace execution on paper for small inputs
- Add print statements to see recursion "unwinding"
- Time recursive vs iterative versions
- Try to break the functions (what if n is negative? 0?)
-->
