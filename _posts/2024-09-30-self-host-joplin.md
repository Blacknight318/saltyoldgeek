---
title: "Self-Host a Joplin Sync Server in Proxmox"
description: "Step-by-step guide to creating a self-hosted Joplin sync server in a Proxmox LXC using Docker and Docker Compose, with reverse proxy configuration tips."
author: saltyoldgeek
date: 2024-09-30 16:40:00 -0500
categories: [Blogging]
tags: [proxmox, lxc, joplin, docker]
image:
  path: /assets/img/images/joplin-sync-server.webp
  height: 630
  width: 1200
---

## Intro

In a previous post, I had written a guide to set up Obsidian and CouchDB for sync, since then I've struggled to get in a groove and keep things running. This post is the first in a two-part series on setting Joplin and hosting your own sync server. The sync path is a little more straightforward than the Obsidian method. That being the case, and not really using Obsidian in a way that worked for me, I've switched. Let's get into setting up the server and in the next post I go over more on why I switched and how to set up the sync server in the Joplin clients themselves.

## Creating a base LXC for Joplin

We'll want to run a few commands to get a base LXC for our server. Since my home lab is a hyper-converged Promxox Cluster, and this project is using Docker so I decided to use a stripped-down LXC, the script for which you can find on [tteck's site](https://tteck.github.io/Proxmox).

### Running the Proxmox Script to Set Up LXC

Run the following in the shell on your Proxmox node/server. While going through the prompts use advances and change the disk size to 5GB to start, say yes to docker compose, and the rest you can leave as the default(maybe change the name) then you're good to go.

```bash
bash -c "$(wget -qO - https://github.com/tteck/Proxmox/raw/main/ct/alpine-docker.sh)"
```

## Joplin Sync Server

When researching this I found an article over on [Vultr by Humphrey Mpairwe](https://docs.vultr.com/how-to-host-a-joplin-server-with-docker-on-ubuntu) which served as my starting point.

### Important note on reverse proxies

If you're using NPM(Nginx Proxy Manger) or Traefik you'll want to go through that to set up a reverse proxy. In my case, I added a subdomain and forwarder with Cloudflare Tunnels.

### Bootstrapping the sync server itself

Run the following commands to get started with the prep work.

```bash
mkdir /opt/joplin
cd /opt/joplin
nano docker-compose.yml
```

Now we'll want to paste the following into the docker-compose.yml file.

```yaml
version: '3'

services:
  db:
    image: postgres:13
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always
    environment:
      - POSTGRES_PASSWORD=strong-password
      - POSTGRES_USER=joplin-user
      - POSTGRES_DB=joplindb
  app:
    image: joplin/server:latest
    container_name: joplin-server
    depends_on:
      - db
    ports:
      - "8080:8080"
    restart: always
    environment:
      - APP_PORT=8080
      - APP_BASE_URL=https://joplin.example.com
      - DB_CLIENT=pg
      - POSTGRES_PASSWORD=strong-password
      - POSTGRES_DATABASE=joplindb
      - POSTGRES_USER=joplin-user
      - POSTGRES_PORT=5432
      - POSTGRES_HOST=db
```

Once that's in place and you've changed the app base URL and passwords, press ctrl+x then y to save the file. Now we have just one more command to get things going.

```bash
docker compose up -d
```

After a minute you should be able to go to the URL we set up earlier, the default username is ```admin@example.com``` and the password is admin, which you'll want to change.

## Wrapup

If you found this useful consider following, or clapping if you're reading this on Medium, consider [buying me a coffee](https://www.buymeacoffee.com/twitter2).

Til next time fair winds and following seas.
