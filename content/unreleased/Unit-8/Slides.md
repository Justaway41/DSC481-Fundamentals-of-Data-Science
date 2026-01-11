---
marp: true
theme: default
paginate: true
---

# DSC 481 – Fundamentals of Data Science

## Unit VIII: Exploratory Data Analysis

### Teaching Hours: 5

- Descriptive statistics with Pandas & NumPy
- Visualization with Matplotlib & Seaborn
- Correlation & covariance analysis

<!--
Speaker Notes
- Introduce Unit VIII following the exact syllabus
- Preview the main concepts and libraries
- State the unit aims: summarizing, visualizing, and discovering data patterns
-->

---

# What is Exploratory Data Analysis (EDA)?

- EDA is the first step to understand new data
- Uses summary statistics and graphs
- Finds patterns, trends, and potential problems
- Guides further analysis and modeling

<!--
Speaker Notes
- EDA means looking at your data before applying models
- It helps spot outliers, errors, distributions, and relationships
- The goal: build intuition and ask better questions about the data
-->

---

# Why Is EDA Important?

- Detects errors and missing values early
- Reveals insights not visible in raw tables
- Helps choose the right plots and models later
- Prevents wasted effort on unclean or misunderstood data

<!--
Speaker Notes
- Students should understand EDA is not just formal statistics
- It is a practical step to make sense of data, essential for any real project
-->

---

# Descriptive Statistics: The Basics

- Summarize data using numbers
- Shows center, spread, and patterns
- Simple to calculate, widely used
- Examples: mean (average), median, mode, min, max, standard deviation

<!--
Speaker Notes
- Introduce the terms "central tendency" and "spread" in plain language
- Reinforce that these stats help to quickly summarize big datasets
-->

---

# When & Why Use Descriptive Statistics?

- First look at any dataset
- Check data quality: are values reasonable?
- Identify outliers or strange values
- Quick way to compare two or more groups

<!--
Speaker Notes
- Students should use descriptive stats every time they get new data
- Practical examples: student marks, sales per month, ages of customers
-->

---

# Descriptive Statistics with Pandas

- Use `.mean()`, `.median()`, `.mode()`
- `.min()`, `.max()`, `.count()`, `.std()`
- Works on columns of DataFrame

```python
import pandas as pd
df = pd.read_csv('students.csv')
print(df['marks'].mean())   # Average marks
print(df['marks'].median()) # Middle value
print(df['marks'].mode())   # Most common value
```

<!--
Speaker Notes
- Demonstrate how Pandas provides quick, chainable methods to summarize data
- Show loading a CSV and applying column-wise methods for statistics
-->

---

# Practice / Lab Exercise

- Load a CSV containing student marks
- Find the mean, median, and mode of the marks
- Find the minimum and maximum values
- Count the number of students scored above the average

<!--
Speaker Notes
- Students practice using Pandas to compute summary statistics
- Encourage interpreting these numbers: What does the mean say? Are there outliers?
-->

---

# Descriptive Statistics with NumPy

- NumPy arrays: fast numeric operations
- Functions: `np.mean()`, `np.median()`, `np.std()`, `np.min()`, `np.max()`, `np.count_nonzero()`

```python
import numpy as np
marks = np.array([80, 85, 90, 75, 60])
print(np.mean(marks))  # Mean
print(np.median(marks))# Median
print(np.std(marks))   # Standard deviation
```

<!--
Speaker Notes
- Introduce NumPy array for number crunching
- Show equivalent operations to Pandas, highlighting efficiency for numeric data
-->

---

# Practice / Lab Exercise

- Convert a Pandas “marks” column to a NumPy array
- Calculate the mean and standard deviation using NumPy
- Find the minimum and maximum scores using NumPy

<!--
Speaker Notes
- Reinforce converting between Pandas and NumPy
- Encourage noticing similar results and quicker computation on larger arrays
-->

---

# Data Visualization: Introduction

- Turn numbers into pictures
- Easier to see trends, patterns, and outliers
- Main types: line plot, bar chart, histogram, scatter plot

<!--
Speaker Notes
- Visualizations allow rapid understanding of data shape and relationships
- Set up for learning each basic plot type step by step
-->

---

# Why Use Visualization?

- Humans spot patterns faster visually
- Compare groups or changes over time
- Detect errors or unlikely values
- Support decisions and communicate findings

<!--
Speaker Notes
- Visualization is about telling a visual story with data
- Illustrate using real examples (e.g. grade trends, sales comparisons)
-->

---

# Common Dos and Don'ts in Data Visualization

**Do:**

- Use clear, readable labels and titles
- Choose color palettes that are colorblind-friendly (e.g., avoid red-green combinations)
- Keep charts simple and uncluttered
- Use appropriate chart types for your data (e.g., bar for categories, line for trends)
- Make sure axes start at zero (when appropriate)
- Add legends and units where needed

---

# Common Dos and Don'ts in Data Visualization

**Don't:**

- Use too many colors or distracting backgrounds
- Distort axes to exaggerate trends
- Overload charts with too much information
- Use 3D effects that make data hard to read
- Forget about accessibility (e.g., colorblind users)

<!--
Speaker Notes
- Emphasize that good visualization is about clarity and honesty
- Mention that colorblindness affects ~8% of men, so always check color palettes
- Simplicity and accuracy are more important than fancy effects
-->

---

# Types of Legends

- **Color Legend**: Maps colors to categories or ranges (e.g., different product types)
  - _Example_: Bar chart with bars colored by region (blue = North, red = South, green = East, yellow = West)
- **Size Legend**: Maps marker/shape size to numeric values (e.g., population size)
  - _Example_: Bubble chart where bubble size shows population (small = 1M, large = 10M)

<!--
Speaker Notes
- Legends help viewers decode what colors, sizes, and patterns represent
- Always include a legend when using color or style encoding
- Place legends where they don't obscure data; consider outside the plot area
- Use descriptive labels in legends, not just codes or abbreviations
---

# Types of Legends

- **Pattern Legend**: Uses different patterns or textures for distinction
- _Example_: Bar chart with striped bars for projected values and solid bars for actual values
- **Line Style Legend**: Distinguishes lines by style (solid, dashed, dotted)
  - _Example_: Line plot with solid line for 2024 data, dashed for 2025, dotted for 2026
- **Shape/Marker Legend**: Uses different markers for different groups (circles, squares, triangles)
  - _Example_: Scatter plot with circles for male, squares for female, triangles for other

<!--
Speaker Notes
- Legends help viewers decode what colors, sizes, and patterns represent
- Always include a legend when using color or style encoding
- Place legends where they don't obscure data; consider outside the plot area
- Use descriptive labels in legends, not just codes or abbreviations
-->

---

# Introduction to Matplotlib

- Widely used Python plotting library
- Use `pyplot` for basic charting
- Plots appear inline in notebooks
- Main function: `plt.plot()`, `plt.bar()`, `plt.hist()`, `plt.scatter()`

```python
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [10, 20, 15])
plt.show()
```

<!--
Speaker Notes
- Introduce Matplotlib as the standard for simple Python plots
- “Show” command renders the plot; variables before it are the x and y data
-->

---

# Line Plot: Concept

- Connects data points with lines
- Shows change over time or sequence
- Useful for trends (e.g. marks over semesters, sales by month)

<!--
Speaker Notes
- Line plots emphasize changes; time is usually on x-axis
- Common for showing continuous or ordered data
-->

---

# When and Why Use Line Plots?

- Visualize progress or decline over time
- Identify patterns, cycles, or trends
- Compare multiple series on the same axes

<!--
Speaker Notes
- Real datasets: student grade progression, company sales, daily temperatures
-->

---

# Line Plot with Matplotlib

```python
import matplotlib.pyplot as plt
months = ['Jan', 'Feb', 'Mar', 'Apr']
sales = [200, 220, 250, 210]
plt.plot(months, sales)
plt.xlabel('Month')
plt.ylabel('Sales')
plt.title('Monthly Sales Trend')
plt.show()
```

<!--
Speaker Notes
- Each plot command builds up the chart labeling axes and title
- plt.plot(x, y) pairs; use plt.show() to display
-->

---

# Practice / Lab Exercise

- Create a line plot for the average marks of students over 5 terms
- Label the axes and give the chart a title
- Plot another line on the same chart (e.g., attendance per term)

<!--
Speaker Notes
- Students should practice multi-series plots and labeling
- Encourage interpretation: which term saw the biggest change?
-->

---

# Bar Chart: Concept

- Uses bars to show comparisons between categories
- Bar height/length represents magnitude
- Useful for comparing groups (e.g. marks by subject, sales by product)

<!--
Speaker Notes
- Distinct from line plots: bar charts do not imply ordered/sequential data
- Categorical comparison is the key use
-->

---

# When and Why Use Bar Charts?

- Compare quantities across groups or categories
- Visualize frequency counts
- Show distribution among a few groups

<!--
Speaker Notes
- Real data: subjects, classes, departments, product types
- Quick comparison between discrete entities
-->

---

# Bar Chart with Matplotlib

```python
import matplotlib.pyplot as plt
subjects = ['Math', 'Science', 'English', 'Nepali']
marks = [85, 78, 90, 80]
plt.bar(subjects, marks)
plt.ylabel('Average Marks')
plt.title('Marks by Subject')
plt.show()
```

<!--
Speaker Notes
- plt.bar(x, y) draws bars for each category
- Labeling improves readability
-->

---

# Practice / Lab Exercise

- Read a dataset with 4 subjects’ marks per student
- Compute average marks per subject
- Create a bar chart for the averages
- Add a suitable title and y-axis label

<!--
Speaker Notes
- Focus on aggregation and visualization of results, not just plotting
- Encourage interpretation: which subject is highest? Lowest?
-->

---

# Histogram: Concept

- Shows how often values appear in intervals (bins)
- Visualizes distribution (shape) of numeric data
- Useful for examining spread, outliers, skewness

<!--
Speaker Notes
- Different from bar chart: histograms group numeric data into bins
- Use for continuous/numeric, not categorical data
-->

---

# When and Why Use Histograms?

- Understand common values and spread
- Detect outliers or unusual shapes
- Summarize large sets of numbers quickly

<!--
Speaker Notes
- Practical: distribution of student ages, salaries, marks
-->

---

# Histogram with Matplotlib

```python
import matplotlib.pyplot as plt
marks = [75, 80, 89, 65, 80, 72, 90, 88, 76, 85]
plt.hist(marks, bins=5)
plt.xlabel('Marks')
plt.ylabel('Count')
plt.title('Distribution of Marks')
plt.show()
```

<!--
Speaker Notes
- bins=5 means marks are grouped into 5 ranges
- Interpreting the shape: most students scored in the X range
-->

---

# Practice / Lab Exercise

- Use a student marks dataset
- Create a histogram of the marks
- Experiment with different bin sizes
- Interpret the most frequent score range

<!--
Speaker Notes
- Students visualize the distribution, notice spread and potential clustering
- Focus on adjusting bins and discussing resulting shape
-->

---

# Scatter Plot: Concept

- Plots two numeric variables as points
- Shows relationships, patterns, or clusters
- Useful for exploring correlations

<!--
Speaker Notes
- Scatter plots reveal if two variables move together
- Example: study hours vs. marks, height vs. weight
-->

---

# When and Why Use Scatter Plots?

- Check if two variables may be related
- Spot clusters, trends, or outliers easily
- Main tool for visual correlation analysis

<!--
Speaker Notes
- Typical use: does more study time mean higher grades?
- x and y values must both be numeric arrays of same length
-->

---

# Scatter Plot with Matplotlib

```python
import matplotlib.pyplot as plt
study_hours = [2, 3, 4, 5, 6, 7]
marks = [60, 65, 70, 75, 80, 85]
plt.scatter(study_hours, marks)
plt.xlabel('Hours Studied')
plt.ylabel('Marks Obtained')
plt.title('Study Hours vs Marks')
plt.show()
```

<!--
Speaker Notes
- Each point (x, y) is one student
- Patterns: are higher marks associated with more study hours?
-->

---

# Practice / Lab Exercise

- Given lists of study time and student marks
- Plot study time vs marks as a scatter plot
- Comment on any pattern or relationship you observe

<!--
Speaker Notes
- Students draw physical connection between two variables using a scatter plot
- Encourage noticing upward/downward/no trend
-->

---

# Introduction to Seaborn

- High-level statistical plotting library
- Simplifies creation of attractive, informative plots
- Integrates with Pandas DataFrames
- Functions: `sns.histplot`, `sns.barplot`, `sns.scatterplot`, `sns.lineplot`

```python
import seaborn as sns
sns.barplot(x='subject', y='marks', data=df)
plt.show()
```

<!--
Speaker Notes
- Seaborn wraps Matplotlib with smarter defaults and clearer syntax
- Especially good for working with DataFrames directly
-->

---

# Practice / Lab Exercise

- Create a Seaborn histogram of student marks
- Use `sns.scatterplot` for study hours vs marks in a DataFrame
- Try coloring (hue) points by grade or gender

<!--
Speaker Notes
- Students move from pure Matplotlib to Seaborn’s DataFrame-centered workflow
- Reinforce visual interpretation of grouped/color-encoded data
-->

---

# Correlation Analysis: Concept

- Measures how two variables move together
- Value ranges from -1 (perfect negative) to +1 (perfect positive)
- 0 = no linear relationship
- Example: You expect marks to go up with study hours (positive correlation)

<!--
Speaker Notes
- "Correlation" is a simple index of how two sets of numbers relate
- Stress this is just a number, not proof of cause and effect
-->

---

# When and Why Use Correlation?

- Check if changing one variable predicts changes in another
- Select useful features for modeling
- Spot redundancy in data (highly correlated columns)

<!--
Speaker Notes
- Practical: decide which variables to include in a model
- Avoiding duplicate information (“age” and “years in school” could be highly correlated)
-->

---

# Calculating Correlation with Pandas

- Use `.corr()` on two columns or a DataFrame
- Default is Pearson coefficient (linear correlation)

```python
print(df['study_hours'].corr(df['marks']))
print(df[['study_hours', 'marks', 'attendance']].corr())
```

<!--
Speaker Notes
- Show computing pairwise and matrix correlations
- Interpreting numbers: closer to +1/-1 indicates stronger relationships
-->

---

# Practice / Lab Exercise

- Create a DataFrame with marks, study hours, and attendance
- Calculate the correlation between study hours and marks
- Find which variables are most related

<!--
Speaker Notes
- Students practice running and interpreting correlations
- Relate numbers to observed scatter plot patterns
-->

---

# Covariance Analysis: Concept

- Shows whether variables move together (positive/negative direction)
- Similar to correlation, but the value depends on scale
- Useful for preliminary data review

<!--
Speaker Notes
- Emphasize difference: covariance tells only about direction, not strength or scale-independent comparison
-->

---

# When and Why Use Covariance?

- Identify if two variables increase/decrease together
- Used before or alongside correlation
- Helps spot basic trends in data direction

<!--
Speaker Notes
- Covariance provides early insight before normalizing scales for correlation
- More useful at EDA stage than for model interpretation
-->

---

# Calculating Covariance with Pandas

- Use `.cov()` on two columns or DataFrame

```python
print(df['study_hours'].cov(df['marks']))
print(df[['marks', 'study_hours', 'attendance']].cov())
```

<!--
Speaker Notes
- .cov() computes the sample covariance
- Nonzero positive/negative values indicate trending together or opposite
-->

---

# Practice / Lab Exercise

- Use a DataFrame with marks, study hours, and attendance
- Calculate covariance between all columns
- Discuss whether positive results match expected relationships

<!--
Speaker Notes
- Students apply covariance calculation and interpret general directionality
- Connect to prior intuition about positive/negative relationship
-->

---

# Real-World EDA Scenario

- Analyze a simple student performance dataset:
  - Columns: marks, study hours, attendance, subject
- Steps:
  - Compute descriptive stats for each column
  - Visualize distributions and relationships (histogram, scatter, bar)
  - Calculate correlations and covariances
  - Interpret what the findings suggest about study habits and performance

<!--
Speaker Notes
- Synthesize full workflow from this unit on a realistic dataset
- Practice both code and reasoning: What patterns actually emerge in the class’s own data?
-->

---

# Practice / Lab Exercise

- Given a sample DataFrame of students (marks, study hours, attendance)
- Step-by-step:
  - Compute mean, median, min, max
  - Plot a histogram for marks
  - Scatter plot marks vs study hours
  - Compute and interpret correlation matrix

<!--
Speaker Notes
- Comprehensive lab to unify statistics, visualization, and simple data interpretation
- Prepare students for assignments and exam questions based on EDA
-->

---

# End of Unit VIII

- EDA finds stories and issues in the data
- Key tools: Pandas, NumPy, Matplotlib, Seaborn
- Practice interpreting numbers and charts, not just running code

<!--
Speaker Notes
- Reiterate EDA is a practical, foundational skill for all data analysis
- Set up for next steps: deeper analysis or modeling
-->
