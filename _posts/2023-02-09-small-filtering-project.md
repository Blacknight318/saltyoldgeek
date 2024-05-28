---
title: Build a Home Filter with NanoPi Neo2 & AdGuard
description: Learn how I moved my home filtering from NanoPi Neo2 to Linode, overcoming hardware limits. Explore the new setup, challenges, and benefits.
author: saltyoldgeek
date: 2023-02-09 20:43:00 -0500
categories: [Blogging]
tags: [NanoPi Neo2, Raspberry Pi, AdGuard Home, Grafana, Prometheus, Docker, Internet Monitoring, Family IT, Tech Support, Tailscale, DNS Filtering, Remote Access, Hardware Monitoring, Debian, Ubuntu, CrowdSec Agent, CrowdSec Bouncer, Home Internet Filter, DNS Cache, Network Monitoring, Debian Setup, Remote SSH Access, DHCP Settings, Grafana Dashboard, Internet Safety]
---

## The basics

### Scoping the project

This project started with a text from my dad about slow internet and wondering if there was anything we could do. Thinking about my setup I pondered what I could shrink down and pack into a smaller device to help with this. It did need to meet a few requirements:

- Relatively small
- Low power consumption
- DNS filtering
- Remote access(to support it)
- Internet monitoring(not a requirement but still useful)
- Hardware/OS monitoring(again not required but useful)

### The hardware

For this project I used what I had on hand, a Raspberry Pi would've been preferable but as we all know those are expensive and had to find. However, I did have a [NanoPi Neo2](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_NEO2#:~:text=The%20NanoPi%20NEO2%20is%20a,files%20are%20ready%20for%20it.) with the OLED screen and metal case, it'd been sent for a different project that fizzled out and needed a new purpose. That being said you could use a [Raspberry Pi](https://www.raspberrypi.org/) if you can find one, or an [Orange Pi](http://www.orangepi.org/), or a thin terminal you can repurpose. Scrounging up a USB wall-wart and a USB A to Micro USB cable and an ethernet cable we were set for hardware.

### Getting started

*Before getting started a note here, it took several attempts to integrate the monitoring before I found I needed a larger MicroSD card than the 8GB that came with the Nano Pi, 16GB is a minimum but 32GB is better.* Hardware assembled it was time to get things loaded and running, here's a summary of the steps to get the basic remote access and filtering installed.

- Load OS, in my case and most Arm-based CPU's it'll be a Debian/Ubuntu-based OS
- Change the default password

  ```shell
  passwd
  ```

- Change the root password to something random and long

  ```shell
  sudo su
  passwd
  ```

- Update OS
  - In my case, the OS needed a tweak to set the time and enable systemd-timesynced and NTP to keep time and update

  - ```shell
    sudo apt update && sudo apt upgrade
    ```

- Install a few supporting utilities

  - ```shell
    sudo apt install nano mc curl
    ```

- Install [Tailscale](https://tailscale.com/download/linux) for remote ssh access, be sure to create an account if you don't have one
- (This step is optional) [Install Crowdsec agent and bouncer](https://docs.crowdsec.net/docs/getting_started/install_crowdsec/)
- Install [Adguard Home](https://github.com/AdguardTeam/AdGuardHome#getting-started)

  - ```shell
    curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
    ```

### Time to configure Adguard Home

Now that we have Adguard Home installed we'll need to go through the setup, open a browser and go to [http://insert-ip-here:3000](http://insert-ip-here:3000) and follow the online instructions, if like me you run into an error Adguard setup provides a link to deal with the port 53 error. We're not done though, now we'll flesh out the filtering on Adguard a bit more.

- Under the Settings menu
  - General settings
    - Check "Use AdGuard browsing security web service"
  - DNS settings
    - Add the following to "Upstream DNS servers"

      ```text
      https://dns.adguard.com/dns-query
      https://dns10.quad9.net/dns-query
      https://dns.cloudflare.com/dns-query
      ```

    - Add the following to "Bootstrap servers"

      ```text
      1.1.1.1:53
      9.9.9.9:53
      8.8.8.8:53
      ```

    - Add  the IP of your router to "Private reverse DNS servers"
    - Click to enable
      - "Enable EDNS client subnet"
      - "Enable DNSSEC"
      - "Disable resolving of IPv6 addresses"
  - Filters
    - DNS blocklists
      | Name | URL|
      |:-----|:---|
      | AdGuard DNS filter | https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt |
      | AdAway Default Blocklist | https://adaway.org/hosts.txt |
      | MalwareDomainList.com Hosts List | https://www.malwaredomainlist.com/hostslist/hosts.txt |
      | Steven Black blocklist | https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts |
      | Steven Black fakenews | https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews/hosts |
      | Blocklist Project abuse | https://blocklistproject.github.io/Lists/abuse.txt |
      | Blocklist Project ads | https://blocklistproject.github.io/Lists/ads.txt |
      | Blocklist Project crypto | https://blocklistproject.github.io/Lists/crypto.txt |
      | Blocklist Project malware | https://blocklistproject.github.io/Lists/malware.txt |
      | Blocklist Project ransomware | https://blocklistproject.github.io/Lists/ransomware.txt |
      | Blocklist Project scam | https://blocklistproject.github.io/Lists/scam.txt |
    - Custom filtering rules

      ```text
      @@||redirector.gvt1.com^
      @@||schoolportal.jostenspix.com^
      @@||ads.play.cbsi.video^
      @@||cbsinteractive.hb.omtrdc.net^$important
      @@||saa.cbsi.com^$important
      @@||vod-gcs-cedexis.cbsaavideo.com^$important
      @@||graph.facebook.com^$important
      @@||uwmadison.co1.qualtrics.com^$important
      ```

### Bringing the filter online

Now this will depend on what router you have so you'll need to find the instructions. We need to change the DNS servers that are handed out by DHCP, this will probably be in the DHCP settings. Make sure that the only DNS is the IP of the machine we just set up. Then disconnect and reconnect any devices there were connected during this change and you're good.

## The extras

### Install Docker

After setting a few machines with Docker I would strongly recommend following the directions [here](https://docs.docker.com/engine/install/ubuntu/) as they haven't failed me yet, installing docker from the default install repo on the other hand has caused me a few headaches in certain situations. The TLDR is to copy the cli fields one by one and run the hello-world docker to make sure it all works and you're good.

### Monitoring

For this, I start with an article by Jeff Geerling titled [Monitor your Internet with a Raspberry Pi](https://www.jeffgeerling.com/blog/2021/monitor-your-internet-raspberry-pi), with a few modifications. I started with the GitHub repo, modified the docker-compose.yml, and added another dashboard after that, ymmv. Here's what I did.

- ```shell
  git clone https://github.com/geerlingguy/internet-monitoring`
  cd internet-monitoring
  nano docker-compose.yml
  ```

  - Change prom/prometheus:v2.25.2 to prom/prometheus
  - Under nodeexp/command change the --collector line and line below to - "--collector.filesystem.ignored-mount-points='^/(sys|proc|dev|host|etc|rootfs/var/lib/docker/containers|rootfs/var/lib/docker/overlay2|rootfs/run/docker/netns|rootfs/var/lib/docker/aufs)($$|/)'"
  - Above this line add - "--path.rootfs=/rootfs"
  - Hit control+x and then yes to save
- run the following command

  - ```shell
    docker compose up -d
    ```

  - Note: if you're doing this on a pi or other box that uses an SD/MicroSD card it will take a while to finish and start
- Login to your new Grafana instance with [http://machine-ip-here:3030](http://machine-ip-here:3030)
  - Default username and password are admin and wonka, be sure to change that after you login
- Lastly, I imported another dashboard to monitor the system, [Raspberry pi & Docker Monitoring](https://grafana.com/grafana/dashboards/15120-raspberry-pi-docker-monitoring/)
  - Some tweaks to queries may be needed

## TLDR Version

If you've got some low-power hardware and some basic experience with Linux and Docker then you should be able to skim through the guides and commands above and build a decent little filter and monitor, it's a nice project and can help friends and family and yourself. Let me know if this helps you or tweaks you have made or would make. Till the next one fair winds and following seas.
