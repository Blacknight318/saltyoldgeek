---
title: "Proxmox 8.1 Update Howto: Smooth & Seamless"
description: "Explore our hands-on review of the Proxmox 8.1 update. Key insights on the update process, cautions, and notable improvements."
author: saltyoldgeek
date: 2023-11-27 18:27:00 -0500
categories: [Blogging]
tags: ['proxmox 8.1 update']
image:
  path: /assets/img/images/proxmox81.webp
  height: 630
  width: 1200
---

## The Proxmox 8.1 Update

Proxmox released the 8.1 update on November 23rd, and if you're like me you might have wondered how this update would affect current operations. After performing the update myself, without changing anything, all is operating just the same with no big hiccups. The update actually helped resolve a minor hiccup I had with one of my ceph OSDs going offline. So let's get into updating Proxmox.

## Cautions and Warnings

With any upgrade there is the potential for braking changes, both known and unknown. With that it's always good to read the [release notes](https://pve.proxmox.com/wiki/Roadmap#Proxmox_VE_8.1) and make sure you perform your backups,m just in case.

## Performing the Update

This is a pretty simple one-liner, and though it isn't indicated post update I tend to err on the side of caution and perform a reboot after the update. Here's the update command.

```bash
apt update && apt -y dist-upgrade
```

## That's it?

That's it, easy peasy. If you're looking at updating from Proxmox 7 to 8 see my post [here](https://www.saltyoldgeek.com/posts/upgrading-proxmox/). Till next time fair winds and following seas.
