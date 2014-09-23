import urllib
from bs4 import BeautifulSoup
import sys



html=open(sys.argv[1]).read()
soup = BeautifulSoup(html)

# kill all script and style elements
for script in soup(["script", "style","head"]):
    script.extract()    # rip it out

# get text
text = soup.get_text()

# break into lines and remove leading and trailing space on each
lines = (line.strip() for line in text.splitlines())
# break multi-headlines into a line each
chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
# drop blank lines
text = '\n'.join(chunk for chunk in chunks if chunk)

print(text.encode('utf-8'))
