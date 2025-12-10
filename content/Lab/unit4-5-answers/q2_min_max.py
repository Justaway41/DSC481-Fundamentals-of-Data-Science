# Question: Write a function that returns both the minimum and maximum of a list.
def min_max(lst):
    return min(lst), max(lst)

if __name__ == "__main__":
    print(min_max([3, 1, 7, 2]))