---
title: Host an Element Server with Docker
description: Learn how to host your own Element Web App Server using Docker. Gain complete control over your private chat server for enhanced privacy and data security.
author: saltyoldgeek
date: 2023-09-07 21:00:00 -0500
categories: [Blogging]
tags: [Element Web, Docker, Self-hosted, Private Server, Synapse, Matrix Protocol, Web App, Data Security, Privacy, Linux, DIY Server]
---

## The Foundation

This project assumes that you have a machine(Raspberry PI, Le Potato, old PC, Proxmox LXC, etc.) with Docker already installed. If you're using Promxox check out the scripts for a LXC setup [here](https://tteck.github.io/Proxmox/).

For those doing this bare metal, standard Debian/Ubuntu VM or LXC, and don't already have Docker setup,  run the following command and you'll be ready to move forward.

```bash
sudo apt install docker.io docker-compose
```

## The prep

Next, let's make a directory in the event we want to offload volumes or save a config or docker-compose.yml file in the future. Before we do that though we'll want to create a user and give them docker access to insulate things from the system a little.

To create and set up the user here are the commands, for the user feel free to answer the questions however you see fit.

```bash
adduser bob
usermod -aG docker bob
```

Ok, not that we've added the user and given them access to the docker group we can switch to that user'

```bash
su bob
```

Now we'll go to the home folder for our user and create the directory

```bash
cd ~
mkdir element-web
cd element-web
```

## Starting things up

Lastly, we'll want to start the element-web service, for now, we'll use a one-liner to get things going, in a future article I'll work to create a docker-compose.yml file for this, or possibly link to a gist here in the future, here we go.

```bash
docker run -d --restart unless-stopped --name element -p 4080:80 vectorim/element-web
```

You can change the port on the left side from 4080 to whatever you'd like it to be. And that's it. If you want to update it I'll add the commands for that below. Till next time, fair winds and following seas.

```bash
docker stop element
docker rm element
docker pull vectorim/element-web
docker run -d --restart unless-stopped --name element -p 4080:80 vectorim/element-web
```
