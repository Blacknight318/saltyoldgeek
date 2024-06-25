---
title: "Round Two: Enhancing the Ollama Cluster"
description: "Discover the challenges faced while improving the Ollama cluster with a Lenovo M700 Tiny and ADT-Link M.2 Extender. Learn from my hardware compatibility issues."
author: saltyoldgeek
date: 2024-06-04 23:00:00 -0500
categories: [Blogging]
tags: [Ollama, Open-WebUI, hardware, troubleshooting]
image:
  path: /assets/img/images/ollama-cluster-two.webp
  height: 630
  width: 1200
---

## Re-cap

Just over three weeks ago I wrote a post titled: [Setting Up an Ollama + Open-WebUI Cluster](https://www.saltyoldgeek.com/posts/ollama-cluster-part-i/?utm_source=internal), where I went over my first experiment in creating a entry barrier node for what was to become an Ollama cluster. In short, I could see the card but performance was negligible. Working on what I was previously able to accomplish it was time to bump things up.

## Round Two Setup

Using the same Nvidia Quadro K620 and USB-C Power supply the only item left was the adapter and host machine. This time it was a Lenovo M700 Tiny and the [ADT-Link M.2 NGFF NVMe Key M Extender Cable](https://www.amazon.com/dp/B07YDH8KW9). Originally this was going to go into the Wifi card slot on the motherboard, what I didn't think to check was that while the NVME drive was M key the wifi card was A+E keyed, ok, let's try the NVME slot and temporary mode the drive to an external NVME-to-USB adapter. The drive booted with no problem, however NVIDIA card was not recognized at all, it did spin the fan as would be expected when signaled on, but no dice in ```lspci```.

## Adapt to M.2 A+E Key?

Sadly, after much research, any adapter to the A+E key would only support PCIe 1x, which is not worth the effort. There is a possible solution that might still work for this task, but that's another post. Keep watching for updates, and until next time, fair winds and following seas.
