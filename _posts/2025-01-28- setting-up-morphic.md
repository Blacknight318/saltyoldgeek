---
title: "Morphic.sh or Perplexica: Setup & Test"
description: "Is Morphic.sh a good Perplexica alternative? Learn how to set it up in Proxmox with Docker LXC, plus troubleshooting tips and first impressions."
author: saltyoldgeek
date: 2025-01-28 20:15:00 -0500
categories: [Blogging]
tags: [morphic, perplexity, ollama, qwen2, selfhost]
image:
  path: /assets/img/images/morphic.webp
  height: 630
  width: 1200
---

## Is morphic.sh an alternative to Perplexica?

While scrolling through news and misc articles I came across morphic.sh and a reference about Perplexity alternative, that had my attention. Having previously written a post on Perplexica as an alternative to Perplexity back in late [June of 2024](https://www.saltyoldgeek.com/posts/perplexica-with-ollama/) I wanted to see if this was on par(or maybe better/simpler). Let's go through the setup.

## Setup and install

For this we'll be setting up an Alpine Docker LXC in Proxmox and go from there. Note that for this we will want to setup a disk size of 5GB and 4GB of RAM for optimal performance.

- Run the following command and follow all prompts to set up the Docker LXC Environment.

    ```bash
    bash -c "$(wget -qO - https://github.com/tteck/Proxmox/raw/main/ct/alpine-docker.sh)"
    ```

- Fork the following Github repo using the Fork button [https://github.com/miurla/morphic]( https://github.com/miurla/morphic).
- Run this command to pull down your fork of morphic.

    ```bash
    git clone git@github.com:[YOUR_GITHUB_ACCOUNT]/morphic.git
    ```

- Now change into that directory.

    ```bash
    cd morphic
    ```

- Now we'll make the .env.local file from the example, there are a few things we need to change.

    ```bash
    cp .env.local.example .env.local
    ```

- Now let's get in to edit our .env.local file.

    ```bash
    nano .env.local
    ```

- Now let's comment out with # the OpenAI and Tavily key lines, they should look like the following.

    ```text
    ###############################################
    # Required Configuration
    # These settings are essential for the basic functionality of the system.
    ###############################################

    # OpenAI API key retrieved here: https://platform.openai.com/api-keys
    # OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]

    # Search Configuration
    # TAVILY_API_KEY=[YOUR_TAVILY_API_KEY]  # Get your
    # API key at: https://app.tavily.com/home
    ```

- Then let's enable Ollama by changing that line to the following.

    ```text
    # Ollama (Local AI)
    OLLAMA_BASE_URL=http://[your ollama address here]:11434
    ```

- Now hit ```ctrl+x``` and then ```y``` to save those changes.

- Now we'll make a small but important change to eliminate some library errors I was getting, run the following to edit that file.

    ```bash
    nano Dockerfile
    ```

- Make the following change.

    ```dockerfile
    FROM oven/bun:alpine
    ```

- Like before hit ```ctrl+x``` and ```y``` to save our changes.

## Let's get this up and running

- Now we can run the docker compose and build with the following command, this will take a few minutes to run.

    ```bash
    docker compose up -d
    ```

- Now we can go to the ip of our LXC and test it out [http://lxc-ip-here:3000](http://lxc-ip-here:3000)

## Troubleshooting

- If you run into an issue where the morphic page won't load try the following steps to restart our docker stack.

    ```bash
    docker compose down
    docker compose up -d
    ```

- If you get an error bubble on the page itself it should still run. As near as I can tell it's due to an extension that modifies the page that causes this particular issue.

## We're Done

That's it, we should now be up and running. There are still a few quirks and I'm early in the testing so there might be a more in depth review in the future.

If you found this post helpful please consider [Buying me a coffee](https://buymeacoffee.com/twitter2). Till next time fair winds and following seas.
