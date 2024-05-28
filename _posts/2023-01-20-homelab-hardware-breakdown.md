---
title: "Proxmox Cluster Hardware: Lenovo & Raspberry Pi"
description: Dive into my home lab's Proxmox cluster hardware featuring Lenovo Thinkcentre models and a Raspberry Pi. Learn about high availability, CEPH storage, and more.
date: 2023-01-20 16:00:00 -0600
categories: [Blogging]
tags: [homelab, self-hosting, proxmox, lenovo, m700 tiny, m83 tiny, High Availability, CEPH storage, Raspberry Pi, UASP, DDR4, DDR3, M.2 SSD, Virtual Machines, networking]
---

Here's a short breakdown of the hardware that's currently running my home lab, most of it was picked based on cost and availability. In later posts, I'll go into how it was set up and what it's running.

- 2 x Lenovo Thinkcentre M83 Tiny
  - RAM on each upgraded with a 16GB RAM kit(DDR3 SODIMM 8GBx2 sticks)
  - Drive on each upgraded to a 128GB M.2 SSD in an M.2-to-SATA cage
  - External SSDs connected via an adapter that supports UASP
- 1 Lenovo Thinkcentre M700 Tiny
  - RAM Upgraded with a 16GB kit(DDR4 SODIMM 8GBx2 sticks)
  - Drive upgraded to 256GB M.2/NVME drive
  - External SSD connected with M.2-to-USB adapter(with UASP support)
- 1 Raspberry Pi for Homeassistant

Not listed above are a NAS and Firewall(might go over those at a later date). With the above hardware(excluding Raspberry Pi) I've created a ProxmoxVE HA cluster with a CEPH storage cluster built on the external drives, this supports redundancy for the VMs and allows better HA(high availability), not bad for a home lab. I'll be adding 2 more M83s as parts become available. With a CEPH cluster, it's best to have an odd number of nodes to have a quorum. Working on a post going over how I built the Proxmox cluster and what resources I used to get there. Till then fair winds and following seas.
