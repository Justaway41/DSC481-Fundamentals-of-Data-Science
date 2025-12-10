# Question: Create a dictionary mapping names to scores. Print all names with scores above 80.
scores = {"Asha": 88, "Ram": 75, "Sita": 92}
for name, score in scores.items():
    if score > 80:
        print(name, score)
    