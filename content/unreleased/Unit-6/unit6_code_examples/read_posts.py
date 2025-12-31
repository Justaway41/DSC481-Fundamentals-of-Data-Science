import json

try:
    with open("content/unreleased/Unit-6/unit6_code_examples/posts.json", "r", encoding="utf-8") as f:
        posts = json.load(f)
    for post in posts:
        print(f"Title: {post['title']}")
        print(f"Body: {post['body']}")
        print()
except FileNotFoundError:
    print("posts.json file not found.")
except json.JSONDecodeError:
    print("Error decoding JSON from posts.json.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    print("Task finished.")
