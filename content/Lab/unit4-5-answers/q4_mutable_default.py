def f(x, lst=[]):
    lst.append(x)
    return lst

if __name__ == "__main__":
    print(f(1))  # [1]
    print(f(2))  # [1, 2] (same list reused!)