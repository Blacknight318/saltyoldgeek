---
title: "AI-Powered News Summaries for Slack"
description: "Explore our Python script that leverages AI to deliver concise tech news summaries directly to Slack. Ideal for tech enthusiasts and professionals."
author: saltyoldgeek
date: 2023-12-19 09:40:00 -0500
categories: [Blogging]
tags: [AI News Summarization, Python Scripting, Slack Integration, Tech News Automation, OpenAI Implementation]
image:
  path: /assets/img/images/openai-rss.webp
  height: 630
  width: 1200
---

## Yet another AI script, is it useful?

If you're like me you probably have, or have had, an RSS feed reader to at least try and keep up with news and blogs on the latest in tech among others. This project started as a way for me to get a bit more comprehensive summary and have them sent to my Slack chat as they happened. After trying several on-device text-to-speech(TTS) engines I was frustrated, they all had either incomplete sentences or missing punctuation or both, not at all usable. Since OpenAI released CustomGPT and Assistant AI API I decided to try that. The prompt for this is simple "Please summarize the tech articles to give a complete, and brief, summary". That's it. Here's the script I put together and have been tweaking over the last couple of weeks, broken down into chunks.

## Main Script Chunks

### Imports

```python
import json
import openai
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import feedparser # type: ignore
from newspaper import Article # type: ignore
import sqlite3
from datetime import datetime
import time
from typing import Dict, Any, NamedTuple, cast
```

### Config load function

```python
def load_config() -> Dict[str, Any]:
    with open('config.json', 'r') as file:
        return json.load(file)
```

### Sqlite3 database creation

You could use any sql database, for simplicity sake we are using sqlite3 here.

```python
def create_database() -> None:
    conn = sqlite3.connect('articles.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS articles
                (link TEXT PRIMARY KEY, title TEXT, summary TEXT)''')
    conn.commit()
    conn.close()
```

### Checking to see if the article has already been summarized

This beehaves similar to caching, in thatt we don't want to pay to summarize the same article over and over, so we check the URL to see if it's already been summarized.

```python
def is_article_summarized(link: str) -> bool:
    conn = sqlite3.connect('articles.db')
    c = conn.cursor()
    c.execute("SELECT * FROM articles WHERE link = ?", (link,))
    result = c.fetchone()
    conn.close()
    return result
```

### Save summary, link, and title to db

```python
def is_article_summarized(link: str) -> bool:
    conn = sqlite3.connect('articles.db')
    c = conn.cursor()
    c.execute("SELECT * FROM articles WHERE link = ?", (link,))
    result = c.fetchone()
    conn.close()
    return result
```

### Create an OpenAI Thread for each summary

Following along with OpenAI's documentation, we are creating a new thread for each article.

```python
def create_thread(ass_id: str, prompt: str) -> tuple[str, str]:
    thread = openai.beta.threads.create()
    my_thread_id = thread.id

    openai.beta.threads.messages.create(
        thread_id=my_thread_id,
        role="user",
        content=prompt
    )

    run = openai.beta.threads.runs.create(
        thread_id=my_thread_id,
        assistant_id=ass_id,
    )

    return run.id, my_thread_id
```

### Check thread status

Here we are periodically checking in to see if the summary is finished, using a 2 second delay to avoid spamming our assistant.

```python
def check_status(run_id: str, thread_id: str) -> str:
    run = openai.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id,
    )
    return run.status
```

### Send to Slack

```python
def send_message_to_slack(title: str, link: str, summary: str) -> None:
    try:
        message = f"New Article: *<{link}|{title}>*\nSummary: {summary}"
        client.chat_postMessage(channel='#news', text=message)
    except SlackApiError as e:
    print(f"Error sending message: {e.response['error']}")
```

### Heavy lifting function to coordinate most of the rest

This is really where most of the processing takes place, rather then the main function, as most of the processing is dependent on previous steps. This may change in the future.

```python
def fetch_articles_from_rss(rss_url: str) -> None:
    feed = feedparser.parse(rss_url)
    for entry in feed.entries:
    if not is_article_summarized(entry.link):
        article = Article(entry.link)
        article.download()
        article.parse()

    # Truncate the article text if it exceeds the limit
        max_length = 32768 - len(entry.title) - len("Please summarize this article:\n\nTitle: \n\n")
        article_text = article.text[:max_length] if len(article.text) > max_length else article.text

    prompt = f"Please summarize this article:\n\nTitle: {entry.title}\n\n{article_text}"
    run_id, thread_id = create_thread(assistant_id, prompt)

    status = check_status(run_id, thread_id)
    while status != "completed":
        status = check_status(run_id, thread_id)
        time.sleep(2)
  
    response = openai.beta.threads.messages.list(thread_id=thread_id)
    if response.data:
        content = cast(Any, response.data[0].content[0])
        summary = content.text.value
        # summary = response.data[0].content[0].text.value
        # Send the article details to Slack
        send_message_to_slack(entry.title, entry.link, summary)
        save_summary(entry.link, entry.title, summary)

    time.sleep(20)
```

### Main Function

Realy all we wanted to happen here is setup/check for a database and setup the initial loop with some debugging print statements, which will be changed to logging in the future.

```python
def main() -> None:
    create_database()
    while True:
        now = datetime.now()
        print(f'Punch in at {now}')
        for rss_url in config['rss_urls']:
            fetch_articles_from_rss(rss_url)
        now = datetime.now()
        print(f'Punch out at {now}')
    time.sleep(900)
```

### Script body launcher

```python
if __name__ == "__main__":
    config = load_config()

    # Set the API keys from the configuration
    openai.api_key = config['openai_key']
    assistant_id = config['assistant_id']

    client = WebClient(token=config['slack_token'])

    main()
```

## config.json

You'll need 3 things for the config to make this work, the assistant ID (found on the assistant page), the OpenAI API Key, and a Slack bot/app Token.

```json
{
    "openai_key": "sk-open-ai-key-here",
    "slack_token": "xoxb-slack-app-token",
    "assistant_id": "asst_assistatn-id",
    "rss_urls": [
        "https://www.bleepingcomputer.com/feed/",
        "https://feeds.arstechnica.com/arstechnica/index",
        "https://www.wired.com/feed/tag/ai/latest/rss",
        "https://www.wired.com/feed/category/ideas/latest/rss",
        "https://www.wired.com/feed/category/science/latest/rss",
        "https://www.wired.com/feed/category/security/latest/rss",
        "https://www.wired.com/feed/category/backchannel/latest/rss",
        "https://www.wired.com/feed/tag/wired-guide/latest/rss",
        "https://www.cisa.gov/news.xml",
        "https://www.cisa.gov/cisa/blog.xml",
        "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        "https://googleonlinesecurity.blogspot.com/atom.xml"
    ]
}
```

## Trying it out

If you'd like to try this out follow the commands below(Linux and Mac), be sure to edit the config.json file.

```bash
git clone https://github.com/Blacknight318/openai_rss_summarizer
cd openai_rss_summarizer
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements
cp sample_config.json config.json
nano config.json # Edit and press ztrl+x to save
nohup python main.py&
```

## Todo

- Create link transformer for things link Cloudflares blog
- Create Streamlit webui for recall and search of old articles(separate file)
- Cdd functionality to search with @botname command
- Independent backend db scheme
- Python file to create Openai assistant from scratch

## Closing the loop

This is still an ongoing project, if you'd like to keep up with the latest check out the [Github repo](https://github.com/Blacknight318/openai_rss_summarizer). Till next time fair winds and following seas.

If you find the content useful consider hitting the Buymeacoffe button below.
