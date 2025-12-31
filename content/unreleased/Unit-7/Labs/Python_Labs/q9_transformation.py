# Practice / Lab Exercise
# - Load your grades data as before.
# - Add a "Result" column: "Pass" if Grade >= 40, else "Fail".
# - Rename "Subject" to "Course".
# - Print rows where Result is "Fail".

import pandas as pd

df = pd.read_csv("../grades.csv")
df["Result"] = df["Grade"].apply(lambda x: "Pass" if x >= 40 else "Fail")
df = df.rename(columns={"Subject": "Course"})
fail_rows = df[df["Result"] == "Fail"]
print(fail_rows)