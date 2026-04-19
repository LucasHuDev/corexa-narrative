import re

with open('src/components/IndustryDemo.jsx', 'r') as f:
    content = f.read()

new_content = re.sub(
    r'(<ResetBtn(?:.(?!/>))*?)\s*/>',
    r'\1 d={d} />',
    content,
    flags=re.DOTALL
)

with open('src/components/IndustryDemo.jsx', 'w') as f:
    f.write(new_content)
print("Done!")
