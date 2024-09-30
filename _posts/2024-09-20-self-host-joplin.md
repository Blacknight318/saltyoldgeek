---
title: "Quick and Dirty Guide for Joplin Server LXC"
description: ""
author: saltyoldgeek
date: 2024-09-20 18:35:00 -0500
categories: [Blogging]
tags: []
image:
  path: /assets/img/images/.webp
  height: 630
  width: 1200
---

## Proxmox LXC

We'll want to run a few commands to get a base LXC for our server. Since my home lab is a hyper-converged Promxox Cluster, and this project is using Docker so I decided to use a stripped-down LXC, the script for which you can find on [tteck's site](https://tteck.github.io/Proxmox). 

Run the following in the shell on your Proxmox node/server. While going through the prompts use advances and change the disk size to 5GB to start, say yes to docker compose, and the rest you can leave as the default(maybe change the name) then you're good to go.

```bash
bash -c "$(wget -qO - https://github.com/tteck/Proxmox/raw/main/ct/alpine-docker.sh)"
```

## Joplin Sync Server

When researching this I found an article over on [Vultr by Humphrey Mpairwe](https://docs.vultr.com/how-to-host-a-joplin-server-with-docker-on-ubuntu) which served as my starting point. If you're using NPM(Nginx Proxy Manger) or Traefik you'll want to go through that to set up a reverse proxy. In my case, I added a subdomain and forwarder with Cloudflare Tunnels. 

### *This needs to be done before setting up the Joplin Sync Server itself*

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

After a minute you should be able to go to the URL we set up earlier, the default username is admin@example.com and the password is admin, which you'll want to change.

## Joplin Notes and Sync

You should now be able to use the instructions on the main page, after logging in, to download, install, and setup the sync.

## Wrapup

In a few previous posts, I went through setting up Obsidian and using sync with CouchDB. While this worked it was a little more unstable across multiple instances/machines using Obsidian. After trying a few paid versions of note apps, like [Mem AI](https://mem.ai), but ultimately wanted something with ease of access and better markdown compatibility along with self-hosted, that was Joplin.

If you found this useful consider following, or clapping if you're reading this on Medium, consider [buying me a coffee](https://www.buymeacoffee.com/twitter2). 

Til next time fair winds and following seas.

