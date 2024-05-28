---
title: Building a Proxmox Cluster for Home Lab
description: Learn to build a Proxmox cluster for home lab use. Covers IP setup, installation, and node configuration. Includes tips on CEPH storage and backups.
author: saltyoldgeek
date: 2023-01-24 16:15:00 -0500
categories: [Blogging]
tags: [Homelab, Self-Host, Proxmox, Virtualization, Proxmox VE, CEPH, Balena Etcher, IP Address Configuration, Cluster Management, Node Configuration, VMs, LXC, NAS Storage, Backups]
---

In my last post, I listed the equipment I used to set up my home lab. In this post, I'll give you a quick rundown of how I went about setting that up.

## A few things you'll need

- IP Addresses to be statically set for each node
- Network ports open for each node
- Flash drive
- Monitor and keyboard(required for install only)
- ISO for your architecture, [see here](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso)
- [Balena Etcher](https://etcher.balena.io)
- If you decide to use CEPH min of 3 extra storage drives(internal or external if it supports UASP)

## Q&D Install

If you've installed Ubuntu before this won't be much different. Use Balena Etcher to write the ISO to a thumb drive, then boot to that thumb drive and choose to install Proxmox(If you're going to use CEPH it would be a good idea to leave those drives disconnected for now). Next, you'll want to choose the regional options that work best for you, enter the IPs you selected above, and set a root password. Once installed and rebooted we'll move on to some basic configs.

## Basic config

If like me, you are using the free version of Proxmox, then you'll want to have a few scripts handy after your first login, I recommend checking out [this site](https://tteck.github.io/Proxmox/). A few of the scripts I run are:

- Proxmox VA 7 Post Install
- Proxmox CPU scaling Governor
- Proxmox Dark Theme

After running the scripts you'd like in the shell of the node you're on you can create a cluster, under Datacenter choose Cluster and create a new cluster. Once that's done be sure to view and copy the Join Information as you'll need that to join the other nodes. You should be able to add nodes via the WebUI, after that the WebUI only runs on the main cluster node, [see here](https://pve.proxmox.com/wiki/Cluster_Manager#pvecm_join_node_to_cluster).

At this point, you can start setting up LCXs or VMs. I would recommend adding your NAS storage at this point and setting up backups just to be safe. I'm working on a quick setup for CEPH post along with a video on youtube, keep watching for that.

Till next time, fair winds and following seas.
