---
title: Building a Proxmox Cluster with Lenovo PCs
description: Discover how to build an efficient Proxmox cluster using Lenovo ThinkCentre PCs. Learn about cost-effective storage, power-saving tips, and CPU optimization.
author: saltyoldgeek
date: 2023-01-09 17:00:00 -0500
categories: [Blogging]
tags: [Homelab, Self-Host, Proxmox, Docker, Lenovo, M83 Tiny, M700 Tiny, Raspberry Pi Alternative, Virtualization, Lenovo ThinkCentre, CEPH, ZFS, iowait, Power Efficiency, CPU Overhead, VM, VLAN, Tailscale]
---

Seeing articles, and hearing podcasts, recently talking about alternatives to Raspberry Pi's alternatives I thought it would be good to give a rundown on my setup and experience over the last year with this. Not everything can easily be moved away from Raspberry Pi's, but with some ESP-32s or Adafruit Trinkets, you can move some of those off. To replace the processing power, and give me some expansion room, I did a little e-waste bin diving and managed to find a few Lenovo Thinkcentre M83s and one M700. I found some cheapish RAM on amazon to bring them up from 4GB to 16GB(for the M83) and eventually will go to 32GB for the M700. The M700 had an M.2 slot so I was able to add in a small M.2 drive for the OS and another SSD for storage(more on those later).

Starting with a few machines I tried going right for a Kubernetes cluster using bare metal, but that didn't go so easy especially since I'd been running them over wireless in my garage. After tearing down and rebuilding it into a Docker Swarm, then back to Kubernetes, I didn't feel like the full power of this cluster was being used. Eventually breaking down I bought a switch and tagged a port on my router for the lab VLAN, then set up the switch by my desk and stacked the little units up. This time creating a Proxmov VE cluster with a Tailscale node for remote access.

Having the cluster up now it was time to think about how and what VMs would be built. Originally after doing some research and rtfm, I downloaded a ubuntu CT template and set up a couple of machines, 2 with AdGuard and 1 for some docker containers. This worked ok, I even set up a backup to my NAS for the VMs. This was definitely and improvement, while I was at it I set the power management to balanced or powersave and tuned it with Powertop. I'd had full tower servers in the past and while they do over lots of resources they're also not nice to the power bill, and since this is in lieu of a Raspberry Pi I figured we should get close to that power limit too. These do idle around 8-12W and all but the M700 peaked around 35W, all have Intel Core i5s. What next?

Next was to try and improve the storage resiliency, I could use the Synology NAS but the version I have has 4 spinners and no slot for an NVME caching drive. Doing some more research I settled on CEPH, one problem though was that the M83s didn't have anywhere for a second internal storage. After a good bit of time looking into ZFS and CEPH and thinking over what applied best for me, I set up CEPH. The first test was with USB flash drives just to see if I could make it work, and I could but it took a constant 30-40% of CPU overhead, and most of that was iowait, not good.

Digging into the issue with iowait to see if it was even possible to drop the iowait usage I found that the drives were running BOT(bulk object transfer) mode, what I needed was a drive that ran UAS(Scsci over USB basically). For this, I used USB-to-SATA and USB-to-M.2 adapters with M.2 or SATA SSD this pretty much wiped out the iowait issue. Now I could start working on HA for critical services.

This has been a brief overview, there are lots of videos and blog posts from Adrea Spiese, Network Chuck, Techno Tim, Tech with Tim, Jeff Geerling, and others. I'm currently working on Youtube videos and blog posts laying out in more detail how I set up my environment in the hopes that it might help some of you, even if you're just getting started. I work IT for a school district so having a lab that has a simplified setup and easy instructions along with reliability means more fun and tinkering and not troubleshooting. I hope this encourages you into looking into used PCs, it saves landfills and e-waste and isn't as power-hungry as you might think.

Fair winds and following seas.
