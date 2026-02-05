from sklearn.linear_model import LinearRegression
import pandas as pd
# Example data
data = {'area': [1000, 1500, 2000], 'price': [200, 300, 400]}
df = pd.DataFrame(data)
X = df[['area']]
y = df['price']
model = LinearRegression()
model.fit(X, y)
X_new = pd.DataFrame({'area': [1200]})
print(model.predict(X_new))