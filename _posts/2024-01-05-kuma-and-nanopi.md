---
title: "NanoPi Uptime Kuma Setup: A Quick Guide"
description: "Learn to set up Uptime Kuma on NanoPi NEO2 for efficient service monitoring. Includes Docker setup, update scripts, and power optimization."
author: saltyoldgeek
date: 2024-01-05 12:50:00 -0500
categories: [Blogging]
tags: [NanoPi NEO2 Setup, Uptime Kuma Installation, Docker Configuration, Service Monitoring DIY, Tech Project Guide]
image:
  path: /assets/img/images/kuma-pi.webp
  height: 630
  width: 1200
---

## Getting started

This project was to set up some old hardware for a basic service monitor and dashboard. This post will start by setting up a [NanoPi NEO2](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_NEO2), if you are using other hardware or a VM you can skip to the section on setting up [Docker](https://docs.docker.com/get-docker/), [Uptime Kuma](https://github.com/louislam/uptime-kuma/wiki/%F0%9F%94%A7-How-to-Install), and an update script(still in testing).

## NanoPi NEO2 Specific

### Setting up the  MicroSD Card

We'll need three things.

1. MicroSD Card(16GB or larger recommended)
2. [Balena Etcher](https://etcher.balena.io/)
3. [NanoPi NEO2 system image](https://download.friendlyelec.com/nanopineo2)
   - OneDrive --> 02_Testing or third party images --> accessory-ROMs --> h5_sd_ubuntu-oled-focal_4.14_arm64_20210616.img.zip

Open Balena Etcher then select Flash from file then choose the image we downloaded, then select the target MicroSD Card and flash(you may be asked for admin credentials). Now pop the MicroSD Card into the slot on the NanoPi NEO2 and plug it in. If you have a rig like mine you should be able to get the IP address from the OLED screen and ssh into it using the default username and password of ```pi```.

### Post initial boot

Not that we're up, and presumably SSH'd in, we can take care of some housekeeping tasks to get things moving.

Use the following commands to fix time issues and update.

```bash
sudo timedatectl set-timezone America/Chicago
sudo timedatectl set-time 2024-10-03
sudo timedatectl set-time 10:52:00
sudo apt update
sudo apt install systemd-timesyncd
sudo timedatectl set-ntp true
sudo apt dist-upgrade -y
```

Let's make a few changes, as needed, with npi-config.

```bash
sudo npi-config
sudo reboot
```

And create our own user and remove the default pi user.

```bash
sudo adduser dave
sudo usermod -aG sudo dave
exit
```

To extend the life of the MicroSD car we'll disable swap with the following.

```bash
sudo swapoff /mnt/512MB.swap
```

Since the ```pi``` user is tied to some default functions let's change the password to a random password of your choice, first login as your user(dave in the example).

```bash
sudo passwd pi
```

## Docker and Uptime Kuma

### Install Docker

Use the following script to install docker.

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Now we'll add our user dave to the docker group to make things a little easier and secure, you'll need to exit and log back in after running the following command.

```bash
sudo usermod -aG docker dave
```

### Uptime Kuma(w/Docker install)

Now we can install Uptime Kuma using the Docker install instructions [here](https://github.com/docker/docker-install). We're using docker instead of bare metal to keep things contained, and Docker images are less likely to be blocked, while NodeJS NPM packages are.

```bash
docker run -d --restart=always -p 80:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

## Keeping things up to date with a bash script

The script below will update both the apt packages and the docker container itself. Create a file called update.sh and paste it in the script below. When done and saved do a ```chmod +x update.sh```

```bash
#!/bin/bash

# Update package lists
sudo apt update

# Check for upgradable packages
UPGRADABLE=$(apt list --upgradable 2>/dev/null | wc -l)
if [ "$UPGRADABLE" -gt 1 ]; then
    echo "Upgradable packages found. Starting upgrade..."
    sudo apt dist-upgrade -y
else
    echo "No upgradable packages. System is up to date."
fi

# Define your image and container names
IMAGE_NAME="louislam/uptime-kuma:1"
CONTAINER_NAME="uptime-kuma"

# Define custom run options (excluding the image name)
CUSTOM_RUN_OPTIONS="-d --restart=always -p 80:3001 -v uptime-kuma:/app/data"

# Get the ID of the currently running image
CURRENT_IMAGE_ID=$(docker images -q $IMAGE_NAME)

# Pull the latest image
docker pull $IMAGE_NAME

# Get the ID of the latest image
LATEST_IMAGE_ID=$(docker images -q $IMAGE_NAME)

# Check if the pulled image is new
if [ "$CURRENT_IMAGE_ID" != "$LATEST_IMAGE_ID" ]; then
    # Stop the running container
    docker stop $CONTAINER_NAME

    # Remove the stopped container
    docker rm $CONTAINER_NAME

    # Run a new container with the updated image and custom run options
    docker run --name $CONTAINER_NAME $CUSTOM_RUN_OPTIONS $IMAGE_NAME
else
    echo "No new updates found for $IMAGE_NAME."
fi
```

## (Optional) Netdata tweak for CPU Temp

```bash
sudo /etc/netdata/edit-config charts.d.conf
```

And change:

```text
# sensors force
```

to

```text
sensors force
```

## (Optional) Improve power consumption w/Powertop

This isn't a large change, I'm getting around 1W with peaks up to about 1.5W.

```bash
sudo apt install powertop
sudo powertop --calibrate
sudo powertop --auto-tune
```

## Wrapping up

Hopefully, this can help you set up Uptime Kuma for service monitoring and alerts. If you found this post helpful please consider following the blog for more posts and clicking the Buymeacoffe link below. Till next time fair winds and following seas
