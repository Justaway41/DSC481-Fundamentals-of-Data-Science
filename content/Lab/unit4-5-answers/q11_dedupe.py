def dedupe(seq):
    seen = set()
    out = []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out

if __name__ == "__main__":
    print(dedupe([1,2,2,3,1,4]))