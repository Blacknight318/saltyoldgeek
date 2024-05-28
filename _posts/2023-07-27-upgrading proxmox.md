---
title: "Upgrading Proxmox from v7 to v8: A Quick Guide"
description: Easily upgrade your Proxmox cluster from version 7 to 8. This guide covers package updates, CEPH settings, and tips for a smooth transition between versions.
author: saltyoldgeek
date: 2023-07-27 11:04:00 -0500
categories: [Blogging]
tags: [Ceph Cluster Settings, Community Edition Proxmox, Proxmox, Proxmox Cluster, Node Migration, Homelab, Enterprise Edition Proxmox, Proxmox Reboot, CLI Upgrade Steps, Pve7to8, Ceph, OSD Sync, Proxmox 7 To 8, Proxmox Cluster Update, Proxmox Resource Balancing, Ceph OSD Sync, Ceph Clusters, In-Place Upgrade]
image:
  path: /assets/img/images/proxmox-7to8.webp
  height: 630
  width: 1200
---

About a week ago I decided to dive in and move my Proxmox cluster from 7 to 8. After a week I'm comfortable with how things are running, and with that, this will be the TLDR version of how I upgraded/updated my cluster.

## Step 1, Update all existing packages

Even though I was doing all my updates through the cli, not all the packages were updated, this caused an issue with the pve7to8 binary that runs checks before the upgrade. Here's how to avoid that:

- Click on the node you plan to work on
- Click on Updates
- Click upgrade to upgrade all

## Step 2, Backup and/or move VMs/CTs

Be sure to move any VMs or LXC CT's to another node if possible, if not be sure to back them up and shut them down to avoid corruption.

## Step 3, For CEPH clusters ONLY

We need to set the noout flag to keep the sync across OSDs from bogging things down. Open the console for the node you are working on and type the following:

```bash
ceph osd set noout
```

## Step 4, Perform upgrade checks

In the console for the node you're upgrading type the following and make sure there are no errors, and that you are ok with any warnings you may receive:

```bash
pve7to8 --full
```

## Step 5, Add repositories

In the console copy and paste the following commands(these are for the community edition only, for enterprise copy the commands form [here](https://pve.proxmox.com/wiki/Upgrade_from_7_to_8#In-place_upgrade)):

```bash
sed -i 's/bullseye/bookworm/g' /etc/apt/sources.list
sed -i -e 's/bullseye/bookworm/g' /etc/apt/sources.list.d/pve-install-repo.list 
echo "deb http://download.proxmox.com/debian/ceph-quincy bookworm no-subscription" > /etc/apt/sources.list.d/ceph.list
```

## Step 6, Finally the upgrade

These next few steps will take some time so grab a coffee and let's dive in, as before, these are all run from the console:

```bash
apt update
apt dist-upgrade
```

After that type y and enter to proceed and wait till things finish

## Step 7, Reboot and CEPH setting

After the install is complete you'll want to reboot, after that, we have one more command to run on the console to get our CEPH OSDs back up to sync by typing:

```bash
ceph osd unset noout
```

## Rinse and Repeat

If you have a cluster of nodes like I do you'll want to repeat these steps on each node, one at a time, and be sure to watch your resource consumption as you move CTs and VM's around so one node doesn't get overworked while the others are updated. After that, we're done! As always, fair winds and following seas.
