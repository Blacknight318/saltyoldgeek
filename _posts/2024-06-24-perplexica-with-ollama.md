---
title: "Self-Hosting Perplexica and Ollama"
description: "Set up Perplexica and Ollama for a secure, self-hosted AI search. Follow our guide to install and configure both tools for seamless integration."
author: saltyoldgeek
date: 2024-06-24 18:00:00 -0500
categories: [Blogging]
tags: [ollama, perplexity, perplexica, search]
image:
  path: /assets/img/images/perplexica-setup.webp
  height: 630
  width: 1200
---

## Perplexica and Ollama Setup

Are you in the self-hosted camp, enjoying Ollama, and wondering when we'd have something like Perplexity AI but local, and maybe a bit more secure? I had been keeping an eye out when I came across an article on [MARKTECHPOST](https://www.marktechpost.com/2024/06/09/perplexica-the-open-source-solution-replicating-billion-dollar-perplexity-for-ai-search-tools/) about [Perplexica](https://github.com/ItzCrazyKns/Perplexica). So I decided to take a crack at it. There were a few issues I encountered which we'll work around in the Perplexica setup, aside from config there was a call property that we need to address. Let's dive in.

## Ollama Install and Setup

To begin with Ollama, follow these steps:

1. Run the installation script using

    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

2. Pull the latest version of Llama3 using

    ```bash
    ollama pull llama3:latest
    ```

3. Pull the latest version of Nomic-Embed-Text using

    ```bash
    ollama pull nomic-embed-text:latest
    ```

4. Edit the Ollama service file by running sudo systemctl edit ollama.service and adding the following lines

    ```text
    Copy Code
    [Service]
    Environment="OLLAMA_HOST=0.0.0.0"
    ```

5. Reload the systemd daemon using

    ```bash
    sudo systemctl daemon-reload
    ```

6. Restart the Ollama service using

    ```bash
    sudo systemctl restart ollama
    ```

## Perplexica Setup

To set up Perplexica, follow these steps:

1. Clone the Perplexica repository using

    ```bash
    git clone https://github.com/ItzCrazyKns/Perplexica.git
    ```

2. Copy the sample configuration file to a new file named config.toml

    ```bash
    using cp sample.config.toml config.toml
    ```
3. Open config.toml in a text editor (such as nano) and make the following changes:

    ```toml
    Change OLLAMA = http://server-ip:11434
    ```
    Comment out the server for SEARXNG and press CTRL+X to exit and Y to save
4. Open ```ui/components/theme/Switcher.tsx``` in a text editor (such as nano) and make the following changes
   1. According to this issue, change to line 10

    ```text
    const ThemeSwitcher = ({ className, size }: { className?: string; size?: number }) => {
    ```

    Then press ctrl+x, then y to save the file
5. Open ```docker-compose.yml``` in a text editor (such as nano) and make the following changes
   1. Change - ```SEARXNG_API_URL=http://server-ip:4000```
   2. Change - ```NEXT_PUBLIC_API_URL=http://server-ip:3001/api```
   3. Change - ```NEXT_PUBLIC_WS_URL=ws://server-ip:3001```

6. Build and start the Perplexica container using
    ```bash
    docker compose up -d --build
    ```

7. Access Perplexica by visiting ```http://server-ip:3000``` in your web browser

That's it! With these steps, you should be able to set up both Perplexica and Ollama on your system. If you found this helpful please share this post, donate to my Buymeacoffee, or clap if you're reading this on Medium. Till next time fair winds and following seas!
