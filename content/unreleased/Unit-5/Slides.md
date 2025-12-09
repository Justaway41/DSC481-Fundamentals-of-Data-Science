---
marp: true
theme: default
paginate: true
title: "Unit V — Data Structures in Python"
description: "DSC 481 — Unit V: Use Python data structures for data storage and manipulation (Lists, Tuples, Sets, Dictionaries; comprehensions and common patterns)"
---

# Unit V — Data Structures in Python (5 Hours)

DSC 481 — Fundamentals of Data Science  
Unit V: Use Python data structures for data storage and manipulation

<!--
Speaker Notes (≈30s)
- Introduce Unit V and why data structures matter: efficient storage, expressive code, easier data transformation.
- Explain focus: lists, tuples, sets, dictionaries, comprehensions, and common patterns (enumerate, zip, Counter).
- Outline: brief lecture + hands-on examples and lab exercises.
-->

---

# Learning Objectives

By the end of this unit students should be able to:

- Choose appropriate Python data structures for problems
- Create, index, slice, and mutate lists and understand their complexity
- Use tuples for immutable records and packing/unpacking
- Use sets for uniqueness and set algebra (union/intersection/difference)
- Work with dictionaries for key→value mappings and common methods
- Write list/set/dict comprehensions and use built-in helpers (enumerate, zip, sorted)
- Be aware of performance trade-offs and common pitfalls

<!--
Speaker Notes (≈30s)
- Read objectives and connect each to a hands-on lab task: e.g., use dicts for counting frequencies, use sets to deduplicate, use comprehensions for transformation pipelines.
-->

---

# Why Data Structures Matter

- They determine how you store and access data (time & memory costs)
- Correct choice simplifies code and improves performance
- Many data processing tasks (grouping, counting, deduplication) map directly to a structure

Example scenarios:

- List: ordered collection of rows
- Tuple: fixed record (e.g., coordinate)
- Set: unique items (tags)
- Dict: lookup by key (id → record)

<!--
Speaker Notes (≈45s)
- Give short real-world examples: dedupe email addresses with a set; lookup user by id with a dict; preserve column order with list of tuples.
- Emphasize think-before-you-choose: structure affects API and complexity.
-->

---

# Lists — Overview & Creation

- Ordered, mutable sequence; indexed and sliceable
- Create: [], list(), comprehensions

Examples:

```python
a = [1, 2, 3]
b = list("abc")         # ['a','b','c']
squares = [i*i for i in range(1,6)]
```

Common ops:

- Index/slice: a[0], a[-1], a[1:4]
- Append/extend/insert/pop/remove
- Methods: append(), extend(), insert(), pop(), remove(), sort(), reverse()

<!--
Speaker Notes (≈1 min)
- Demonstrate indexing (zero-based), negative indices, and slicing semantics (start inclusive, stop exclusive).
- Show append vs extend and common gotchas (append adds list as element).
- Mention in-place methods vs returning new lists (sort() vs sorted()).
-->

---

<!-- Scoped style -->
<style scoped>
section{
  font-size: 1.58em;
}
</style>

# Lists — Examples & Pitfalls

Examples:

```python
lst = [1,2,3]
lst.append([4,5])   # [1,2,3,[4,5]]
lst.extend([4,5])   # [1,2,3,4,5]
lst.insert(1, 1.5)  # [1, 1.5, 2, 3, 4, 5]
```

Pitfalls:

- Mutable default args:

```python
def f(x, lst=[]):
    lst.append(x)
    return lst  # BAD: shared list across calls
```

- Use None and initialize inside:

```python
def f(x, lst=None):
    if lst is None:
        lst = []
    lst.append(x)
    return lst
```

<!--
Speaker Notes (≈45s)
- Show the mutable default bug with two quick calls to f() to illustrate shared state.
- The default list is reused, causing unexpected results.
- This happens because default arguments in Python are evaluated only once when the function is defined, not each time the function is called.
So, if you use a mutable object like a list as a default value, that same list is shared across all calls to the function that don’t provide their own list.
- Explain shallow copy vs deep copy when copying lists containing nested mutable elements (list.copy(), copy.deepcopy()).
-->

---

# Tuples — Immutable Sequences

- Immutable, ordered sequence; created with () or tuple()
- Good for fixed records, keys in dicts, or return multiple values

Examples:

```python
pt = (3, 4)
coords = tuple([1,2,3])
x, y = pt  # unpacking
```

Use cases:

- Use as dict keys (hashable)
- Function returns: return a, b
- Namedtuple/dataclass for readable records

<!--
Speaker Notes (≈45s)
- Explain immutability vs lists: can't append or change elements, but you can rebind the variable.
- Show unpacking and use namedtuple or dataclass for clearer field access in real projects.
-->

---

# Sets — Unordered Unique Collections

- Unordered, mutable collection of unique items
- Fast membership testing and set algebra

Create:

```python
s = {1,2,3}
s2 = set([2,3,4])
```

Common operations:

- add(), remove(), discard(), pop()
- union (|), intersection (&), difference (-), symmetric_difference (^)
- Useful for deduplication and membership tests

<!--
Speaker Notes (≈45s)
- Emphasize that sets are unordered — iteration order is not guaranteed.
- Demonstrate deduplication: unique = list(set(items)).
- Show set operations with small examples (students can predict results).
-->

---

<!-- Scoped style -->
<style scoped>
  section{
    font-size: 2em;
  }
</style>

# Dictionaries — Key → Value Mapping

- Mutable mapping type: dict()
- Keys must be hashable (immutable types like str, tuple)
- Common methods: get(), keys(), values(), items(), pop(), setdefault(), update()

Examples:

```python
d = {"name": "Asha", "age": 21}
d["score"] = 88
age = d.get("age", 0)
for k,v in d.items():
    print(k, v)
```

Patterns:

- Counting with dicts: freq = {}; freq[x] = freq.get(x,0) + 1
- Use collections.Counter for convenience

<!--
Speaker Notes (≈1 min)
- Show counting example and then present Counter as cleaner:
  from collections import Counter; Counter(items)
- Discuss keys() returns view; lists(d) gives keys; iterating dict gives keys by default.
- Mention dict comprehension: {k: v for ...}
-->

---

# Comprehensions — Concise Transformations

- List comprehension:

```python
squares = [i*i for i in range(1,11)]
```

- Set comprehension:

```python
unique_first = {name[0] for name in names}
```

- Dict comprehension:

```python
square_map = {i: i*i for i in range(1,6)}
```

Include conditionals:

```python
evens = [x for x in range(20) if x % 2 == 0]
```

<!--
Expanded Speaker Notes (≈90s)

Core idea (10s)
- A comprehension is a compact way to build a new collection from an existing iterable by specifying: expression, iteration, and optional filter(s).
- Pattern: <result_expr> for <item> in <iterable> [if <predicate>]

Explain parts with the list example (15s)
- squares = [i*i for i in range(1,11)]
  - iteration: for i in range(1,11)
  - expression: i*i (what each output element will be)
  - result: a list of the squared values in order
- Emphasize order is preserved for lists (comprehensions produce ordered lists).

Conditional filters vs conditional expressions (20s)
- A filter (if at the end) excludes items: [x for x in seq if cond]
  - Example: evens = [x for x in range(20) if x % 2 == 0]
- A conditional expression (ternary) is used inside the expression to choose a value:
  - Example: labels = ["even" if x%2==0 else "odd" for x in range(6)]
  - Note: when you use an inline if/else, you must include both branches.

Nested comprehensions (10s)
- Comprehensions can nest loops, equivalent to nested for-loops:
  - pairs = [(i,j) for i in range(3) for j in range(2)]
  - Equivalent to:
    for i in range(3):
        for j in range(2):
            pairs.append((i,j))
- Warn about readability when nesting more than 2 levels.

When to use set/dict comprehensions (10s)
- Set comprehension removes duplicates and gives O(1) membership.
- Dict comprehension builds mappings succinctly, but for complex grouping use defaultdict.

Generator expressions & memory (10s)
- Use parentheses to create a generator expression when you want lazy evaluation:
  - gen = (i*i for i in range(10_000_000))
  - list(gen) would materialize; iterate the generator to produce values one-by-one.
- Use generators for large datasets to save memory.

Readability & style (10s)
- Prefer comprehensions for simple, readable transforms.
- If the comprehension is long or contains complex logic, prefer a for-loop with clear intermediate variables or extract logic into a helper function.
- Keep lines short; follow PEP 8. Add a comment or a small helper named function when intent isn't obvious.

Common pitfalls & performance tips (15s)
- Avoid side effects inside comprehensions (e.g., mutating external lists or dicts) — comprehensions should be used for pure transformations.
- For heavy computations, consider using built-in map/filter with functions, or numpy/pandas vectorized ops for arrays/dataframes.
- For counting/grouping use collections.Counter or defaultdict rather than building complex dict comprehensions.

Quick demo suggestions (in-class)
- Show step-by-step conversion of a simple for-loop into a comprehension.
- Convert a small real example (list of name-score pairs → top students) using a comprehension + sorted().
- Show generator expression memory advantage with a large range.

Closing one-liner
- "Use comprehensions to make transformation code concise and expressive — but prefer clarity over cleverness."
-->

---

# Built-in Helpers & Patterns

- enumerate(iterable, start=0) → index + value
- zip(\*iterables) → parallel iteration
- sorted(iterable, key=..., reverse=...)
- any(), all(), sum(), min(), max()
- collections: Counter, defaultdict, namedtuple, deque

Examples:

```python
for i, val in enumerate(items, 1):
    print(i, val)

for a, b in zip(list1, list2):
    print(a, b)
```

<!--
Speaker Notes (≈45s)
- Show examples: counting with Counter, grouping with defaultdict(list).
- Demonstrate zip and enumerate together for practical tasks (e.g., align columns).
-->

---

# Performance & Complexity Notes

Typical complexities (average):

- List indexing: O(1)
- List insert/pop at end: O(1); insert/pop at start/middle: O(n)
- Dict lookup/set membership: average O(1)
- Iterating through list/dict/set: O(n)

Advice:

- For frequent insertions/removals at ends: use collections.deque
- For large membership checks: use set/dict not list

<!--
Speaker Notes (≈45s)
- Give rules of thumb: choose dict/set for lookups, list for ordered sequences, deque for queue-like ops.
- Mention Python optimizations: small list operations are fast; algorithmic choice matters more than micro-optimizations.
-->

---

# Common Pitfalls & Best Practices

- Mutable default arguments — avoid them
- Shallow vs deep copy — use copy.deepcopy when needed
- Using list for membership tests (use set for many checks)
- Naming collisions: don't name variables `list`, `dict`, `set`
- Document expected types and behavior in docstrings

Example copy:

```python
import copy
a2 = a.copy()          # shallow copy
b = copy.deepcopy(a)   # deep copy
```

<!--
Speaker Notes (≈45s)
- Demonstrate a shallow copy mistake: modifying nested lists affects both copies; run small demo if time allows.
- Encourage consistent variable naming and small helper functions for clarity.
-->

---

# Hands-on Exercises (Lab / In-class)

1. List exercises (10–15 min)
   - Given list of numbers, produce squares, filter evens, remove duplicates preserving order
2. Dict exercises (10–15 min)
   - Count word frequencies from a small text; show top-3 words
3. Set exercises (5–10 min)
   - Given two lists of tags, compute union/intersection/difference
4. Comprehension & patterns (10–15 min)
   - Convert a list of (name,score) pairs to a dict and to a sorted list by score

Suggested deliverable: save functions in data_structures.py and show quick demo in `if __name__ == "__main__":`

<!--
Speaker Notes (≈1 min)
- Give students step-by-step hints and expected outputs. Encourage using Counter and defaultdict to simplify tasks.
- For dedup preserving order: show technique using seen=set() and iterate.
-->

---

# Example Solutions (brief)

- Deduplicate preserving order:

```python
def dedupe_preserve_order(seq):
    seen = set()
    out = []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out
```

- Word frequency:

```python
from collections import Counter
words = text.lower().split()
freq = Counter(words)
print(freq.most_common(3))
```

<!--
Speaker Notes (≈45s)
- Provide quick walkthrough of code. Show how Counter.most_common works and compare to manual dict counting.
-->

---

# Assessment / Homework

Deliverables:

- data_structures.py with implemented functions and docstrings
- A short Jupyter notebook demonstrating the functions and showing outputs
- README.md with run instructions and sample outputs

Evaluation:

- Correctness & edge cases: 60%
- Code clarity & docstrings: 25%
- Tests / demo notebook: 15%

<!--
Speaker Notes (≈30s)
- Clarify submission format and grading rubric. Encourage students to include simple assertions for key behaviors and to document any design choices.
-->

---

# Resources & Further Reading

- Python docs — Data structures: https://docs.python.org/3/tutorial/datastructures.html
- collections module docs: https://docs.python.org/3/library/collections.html
- "Fluent Python" — Luciano Ramalho (selected chapters on data structures)

<!--
Speaker Notes (≈15s)
- Point students to specific pages for reference and examples. Recommend exercises from the book or online practice sites.
-->

---

# Summary & Next Steps

- You learned when and how to use lists, tuples, sets, and dictionaries, plus comprehensions and common helpers.
- Next unit: Unit VI — File Handling & Exception (reading/writing data).
- Reminder: complete lab exercises and submit notebook + module file.

<!--
Speaker Notes (≈45s)
- Quick Q&A prompt: ask students to name one structure they'd use for a given problem. Remind them to test edge cases and use docstrings.
-->
