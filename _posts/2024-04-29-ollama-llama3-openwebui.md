---
title: Setup Llama 3 using Ollama and Open-WebUI
description: Discover how to quickly install and troubleshoot Ollama and Open-WebUI on MacOS and Linux with our detailed, practical guide.
author: saltyoldgeek
date: 2024-04-29 14:00:00 -0500
categories: [Blogging]
tags: [Ollama, Open-WebUI, hardware, troubleshooting]
image:
  path: /assets/img/images/ollama-openwebui.webp
  height: 630
  width: 1200
---

## Tested Hardware

Below is a list of hardware I've tested this setup on. In all cases things went reasonably well, the Lenovo is a little despite the RAM and I'm looking at possibly adding an eGPU in the future. Both Macs with the M1 processors run great, though the 8GB RAM on the Air means that your MacBook may stutter and/or stick, in hindsight if I'd done more research I would've gone for the 16GB RAM version.

- Lenovo M700 tiny
  - Intel(R) Core(TM) i7-6700
  - 32GB RAM
  - 500GB NVME Drive
  - Ubuntu Bonle 24.04 LTS
- MacBook Pro
  - M1 Processor
  - 16GB RAM
  - 500GB SSD
  - MacOS Sonoma 14.4.1
- MacBook Air
  - M3 Processor
  - 8GB RAM
  - 256GB SSD
  - MacOS Sonoma 14.4.1

## Setup

Now that we've looked at the hardware let's get started setting things up.

### Ollama

- Installation
  - For MacOS download and run the installer, that's it.
  - For Linux or WSL, run the following command

    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

- Now we'll want to pull down the Llama3 model, which we can do with the following command.

  ```bash
  ollama pull llama3
  ```

- Running Ollama
  - If you're on MacOS you should see a llama icon on the applet tray indicating it's running
    - If you click on the icon and it says restart to update, click that and you should be set.
  - For Linux you'll want to run the following to restart the Ollama service

    ```bash
    sudo systemctl restart ollama
    ```

### Open-Webui

- Prerequisites
  - Docker
    - For MacOS download and run the [Docker Desktop App](https://www.docker.com/products/docker-desktop/)
    - For Linux I would recommend using the convenience script with the command below.

      ```bash
      curl -fsSL https://get.docker.com -o get-docker.sh
      sudo sh get-docker.sh
      ```

- Install (for both Mac and Linux)
  - Here's the command to get a basic Open-WebUI up and running(NOTE: This will take a few minutes)

    ```bash
    docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
    ```

  - You should now be able to go to ```http://server-ip:8080/``` and set up an account, you're ready to start talking with your local llm.

### Troubleshooting

If you're concerned that something isn't running here are a few things to check.

- On macOS
  - Check that Ollama is running in the applet tray.
- On Ubuntu and MacOS
  - Perform the following ps command to check that Ollama is running

    ```bash
    ps -fe | grep ollama
    ```

    - Check that the Open-WebUI container is running with this command

    ```bash
    docker ps
    ```

## TLDR

Any M series MacBook or Mac Mini should be up to the task and near ChatGPT performance(provided you have 16GB RAM or more). The Lenovo on the other hand is still decent, if not a little slow, if I get the chance to get and test an eGPU I'll update this post. All-in-all this was a fun project and I hope you found this article useful, if so consider donating the the blog by clicking the Buy Me a Coffee button below. Until the next one, fair winds and following seas.

## References

- [https://ollama.com/](https://ollama.com/)
- [https://docs.openwebui.com](https://docs.openwebui.com)
- [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- [https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)
