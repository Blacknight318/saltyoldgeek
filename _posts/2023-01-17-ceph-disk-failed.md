---
title: "Fixing a Ceph Disk in Proxmox: A Recovery Guide"
description: Step-by-step guide to recover a failed Ceph disk in a Proxmox Lenovo M700 Tiny. Learn to restore CEPH cluster health and maintain VM availability.
author: saltyoldgeek
date: 2023-01-17 15:30:00 -0600
categories: [Blogging]
tags: [homelab, Proxmox, Lenovo M700 Tiny, Ceph Disk Recovery, CEPH cluster, Virtual Machines, High Availability, NVME, OSD, Ceph Manager, USB Flash Drive]
---

Not long after writing the last blog the M.2(in a SATA conversion case) in my Lenovo M700 Tiny failed. After doing some detective work I resolved to work on getting the CEPH cluster back up and healthy. Listed below are the steps taken to get things back up and running.

1. Migrate VMs/CTs to an unaffected node to minimize drag on those VMs
2. Pluged in a spare USB Flash Drive(if possible matching the size of the failed drive)
3. Add as OSD in Proxmox CEPH GUI(this was a stop-gap till replacement acquired)
4. Purchased new 500GB NVME and NVME-to-USB adapter
5. Connect the new drive in the adapter and add it as an OSD to CEPH through Proxmox GUI
6. Remove flash drive as OSD from CEPH through Prommox GUI
7. Clear CEPH alerts/warnings using this CLI command

    ``` bash
    ceph crash archive-all
    ```

8. Restart CEPH Manager

After recovering some house cleaning was in order, added a few machines to the HA that needed it. Fingers crossed so far all is well, but I plan on upgrading all the drives to match with new hardware over time and dedicate a node or two just to CEPH, but that's for a later date.

Fair winds and following seas.
