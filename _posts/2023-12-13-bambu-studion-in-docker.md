---
title: "Easy Bambu Studio Setup with Docker"
description: "Set up Bambu Studio on Linux easily with our Docker guide. Perfect for 3D printing enthusiasts seeking hassle-free installation."
author: saltyoldgeek
date: 2023-12-13 12:00:00 -0500
categories: [Blogging]
tags: [Bambu Studio Setup, Docker 3D Printing, Linux Docker Guide, Kasm Framework, Ubuntu 3D Printer Software]
image:
  path: /assets/img/images/bambu-docker.webp
  height: 630
  width: 1200
---

## Who is this for?

This is for those who have 1(or more) [Bambu Labs 3D Printer(s)](https://bambulab.com/en). This silos the Bambu Studio app by leveraging the Kasm framework, you can find out more about that [here](https://kasmweb.com/) After trying the [documented build for docker](https://github.com/bambulab/BambuStudio/wiki/Docker-Run-Guide), and struggling, I found an article on [Mariushosting here](https://mariushosting.com/how-to-install-bambu-studio-on-your-synology-nas/) using docker compose, which worked great. This is just a distilled-down version of that.

## Requirements

- Linux OS(bare metal or virtual/lxc)
- 4GB RAM(minimum)
- 2 CPU cores
- 15GB storage(not including OS)

## Setup Ubuntu 20.04 LXC with Docker

This is as simple as it gets, pulled from a list of scripts found [here](https://tteck.github.io/Proxmox/).

```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/docker.sh)"
```

## Installing Docker on an Ubuntu System Directly

This step is a condensed version of the steps found in [Docker's documentation](https://docs.docker.com/engine/install/ubuntu/).

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Prep LXC/Ubuntu

We want to set up a user that can access Docker without being root, we do that with the commands below.

```bash
adduser dave # Fill out questions as you wish
usermod -aG docker dave
apt update && apt -y upgrade
```

## Create docker-compose.yml

Now let's create a directory to store the docker-compose.yml and other data files.

```bash
cd ~
mkdir bambu-studio
cd bambu-studio
```

Then run the following to create a docker-compose.yml

```bash
nano docker-compose.yml
```

Then paste the following into the docker-compose.yml file, after that hit Ctrl+x and then y to save the file.

```yaml
version: "3.9"
services:
  bambustudio:
    image: ghcr.io/linuxserver/bambustudio:latest
    container_name: Bambu-Studio
    hostname: bambustudio
    mem_limit: 4g
    cpu_shares: 1024
    security_opt:
      - no-new-privileges:true
      - seccomp:unconfined
    healthcheck:
      test: curl -f http://localhost:3000/ || exit 1
    ports:
      - 8233:3000
    volumes:
      - /home/bambu/bambustudio:/config:rw
    environment:
      TZ:   America/Chicago
      PUID:   1026
      PGID:   100
      TITLE: Bambu-Studio
      CUSTOM_USER:  bambu
      PASSWORD: password
    restart: on-failure:5
```

## Starting things up

### **Keep in mind this will take a while to download on the first run**

Run the following command to get started.

```bash
docker compose up -d
```

Now you should be able to access the site from [http://server-ip:8233](http://server-ip:8233) and use the username and password to log in to Bumbu Studio running in Kasm. That's it! If you found this article helpful please consider buying me a coffee on the ko-fi link below. Till then fair winds and following seas.
