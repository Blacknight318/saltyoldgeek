---
title: Running Obsidian on ChromeOS with Docker
description: Learn to run Obsidian-Remote on ChromeOS using Docker. Ideal for old laptops or restricted settings. Covers Docker image creation and instance setup.
author: saltyoldgeek
date: 2023-09-12 15:43:00 -0500
categories: [Blogging]
tags: [Obsidian, Docker, Obsidian-Remote, docker-compose, setup guide]
---


## Why Obsidian-Remote?

The initial reason that drew me to Obsidian-Remote was that I needed a way to run it on an old laptop loaded up with ChromeOS Flex. Sure I could set up the linux environment for ChromeOS and set up Obsidian from there, but being an old laptop it tended to heat up and stutter, so I went looking. This works great for niche needs like that, or environments where you don't want to or can't install your own local version. With that, let's dive in.

## Creating the Docker image

- [ ] Clone the Repo

    ```bash
    git clone https://github.com/sytone/obsidian-remote.git
    cd obsidian-remote
    ```

- [ ] Modify the Dockerfile
    Open the Dockerfile to edit

    ```bash
    nano Dockerfile
    ```

    And make the following change from

    ```text
    ARG OBSIDIAN_VERSION=1.3.5
    ```

    to the latest version, as of writing this is 1.4.12

    ```text
    ARG OBSIDIAN_VERSION=1.4.12
    ```

- [ ] Now let's build it

    ```bash
    docker build --pull --rm -f "Dockerfile" -t obsidian-remote:latest "."
    ```

## Now to get the instance running

- [ ] Create a data folder

    ```bash
    mkdir ~/obsidian-remote-data
    cd obsidian-remote-data
    mkdir config
    mkdir vaults
    ```

    _NOTE: If you have an existing vault you can drop the files in ~/obsidian-remote-data/vaults_

- [ ] Next, we'll create a docker-compose.yml file

    ```bash
    nano docker-compose.yaml
    ```

    Paste in the following

    ```yaml
    services:
    obsidian:
        image: 'obsidian-remote:latest'
        container_name: obsidian-remote
        restart: unless-stopped
        ports:
            - 8080:8080
        volumes:
            - /root/obsidian-remote-data/vaults:/vaults
            - /root/obsidian-remote-data/config:/config
        environment:
            - TZ=America/Chicago
    ```

- [ ] Then run:

    ```bash
    docker compose up -d
    ```

- [ ] Open the then open [http://remote-ip-here:8080](http://remote-ip-here:8080)

## That's it

This should be customizable just like regular Obsidian and, with the exception of git, should handle all your regular plugins. Have fun and till next time, fair winds and following seas.

### Sources
REF: https://github.com/sytone/obsidian-remote#building-locally
