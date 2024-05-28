---
title: "From NanoPi to Linode: Home Filtering Fixes"
description: Learn how I moved my home filtering from NanoPi Neo2 to Linode, overcoming hardware limits. Explore the new setup, challenges, and benefits.
author: saltyoldgeek
date: 2023-02-21 10:03:00 -0500
categories: [Blogging]
tags: [NanoPi Neo2, Raspberry Pi, AdGuard Home, Grafana, Prometheus, Docker, Internet Monitoring, Family IT, Tech Support, Tailscale, DNS Filtering, Remote Access, Hardware Monitoring, Debian, Ubuntu, CrowdSec Agent, CrowdSec Bouncer, Linode, Cloud Hosting, Firewall, DNS Queries, DNS Cache, Cloud Firewall, Network Monitoring, AdGuard Cloud, Cloud-Based DNS Filtering, Linode Setup, Tailscale Remote Access, Linode Firewall]
---

## Operational Glitches

In a previous post, I talked about setting up a home filter for internet/DNS traffic, at the time it was on a NanoPi Neo2. Since then I've encountered a few issues, mostly with hardware constraints for the software being used. The NanoPi Neo2 did well for the first 3 days, only needing some filter tweaking to accomodate apps and sites used at that location, after that things started to bog down. This was, most likely, due to caching and handling the increased DNS queries. The intention was to create a cloud/VPN-based AdGuard install as a backup, this had now become the primary. The issues I encountered seem to be related to storage and overhead space in RAM for spikes in traffic and logging, when running on the cloud, Poxmox cluster, or a Raspberry Pi 4 the same issues are negligible. There is however still some value in the onsite device, and that is the ability to monitor the internet connection speed, latency, and jitter to see if there are other factors at play. This was how I narrowed down the issue to AdGuard Home and DNS query processing to be the primary issue.

## When plan b becomes your plan a

The plan was to have a secondary AdGuard Home server set up either on my network or a cloud service. After giving it some thought I decided the best option, at least for now, is to set up AdGuard Home on a cloud host, Linode was fairly cheap for a shared core machine. Since this was also the fastest setup and had a cloud firewall that was simple to use and make changes that become the new plan. While it doesn't solve the issue of a secondary DNS for now, it works.

## The setup

Here is a brief overview of the steps used to set things up.

- Create [Linode](https://www.linode.com) account
- Setup first Linode instance, in my case small shared CPU with Ubuntu
- Update OS
- Install Tailscale for remote access
- Install AdGuard Home
- Create a Linode firewall and attach it to the server instance
- Set the firewall to drop all inbound traffic, except for DNS on those IP's you want to use this server(eventually looking to switch to DDNS names)
- Setup AdGuard Home rules, see the previous post on filtering
- Change router settings for those you want filtered to point to your public IP on Linode for filtering
-Make custom rules accordingly

That's it, a simple setup. The hardware setup at the users' end is still useful for monitoring the internet connection. While the filtering aspect for the NanoPi Neo2 I used couldn't keep up, a small 1l terminal/pc or a Raspberry Pi 4 would be more than capable of handling this traffic. I'll detail that in a future post. Til then fair winds and following seas.
