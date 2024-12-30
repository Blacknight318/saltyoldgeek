---
title: Setting Up an Ollama + Open-WebUI Cluster
description: Discover how to set up a custom Ollama + Open-WebUI cluster. This guide covers hardware setup, installation, and tips for creating a scalable internal cloud.
author: saltyoldgeek
date: 2024-05-13 19:00:00 -0500
categories: [Blogging]
tags: [Ollama, Open-WebUI, hardware, troubleshooting]
image:
  path: /assets/img/images/ollama-cluster-one.webp
  height: 630
  width: 1200
---

## Why?

Having set up an Ollama + Open-WebUI machine in a previous post I started digging into all the customizations Open-WebUI could do, and amongst those was the ability to add multiple Ollama server nodes. This got me thinking about setting up multiple Ollama, and eventually Open-WebUI, nodes to load and share the work and make an internal cloud or cluster of sorts.

Before we build a cluster we first need a stable node(server/instance). We'll start by creating a BoM(Bill of Materials) to test. Here's my starter list(NOTE: This is not a shopping list, you'll see why in a moment).

- Lenovo M73 Tiny
- [Mini PCIe to PCIe adapter](https://amzn.to/40eiGBu)
- [USB C PD Power adapter](https://amzn.to/40cofjH)
- [Nvidia Quadro K620](https://amzn.to/3DKBOOy)

## Experimenting

The first thing I did was install Ubuntu 22.04 LTS on an external drive for testing, in the future this should be an onboard drive(SATA/NVME). This was fairly straightforward. After installing all updates I installed Ollama and OpenWebUI, see my post on setting that up [here](https://www.saltyoldgeek.com/posts/ollama-llama3-openwebui/?utm_source=internal). After installing and testing we now had a base to start from. Getting the GPU to work was a little less straightforward.

Powering this card was not going to work with the provided SATA to 6 Pin adapter, this was because the laptop drives these Tiny's use only outputs 3v and 5v out, this is where that USB C PD supply comes in. This part is relatively straightforward, cut the SATA port end off, tie the yellow to positive and black to negative, NOTE: before plugging anything into the PCIe adapter plug in the USB C PD supply and use the button to select 12v, it will remember this going forward.

Fitting the Mini PCIe end into the Lenovo Tiny required cutting back the plastic strain relief on the cable, and snapping off the extension tabs on the PCB(perforation dots are on the bottom indicating where to break/cut)

Now that the card is connected, it was time to install the drivers. You can do this through the driver download page from [Nvidia](https://www.nvidia.com/download/index.aspx) or using [Ubuntu's method](https://ubuntu.com/server/docs/nvidia-drivers-installation), be sure to use the 550 drivers. After I would recommend re-installing Ollama to ensure it sees the Nvidia Card. If you run into issues with it seeing the card check cables and connectors, make sure the power for the card is on, and run the following to see if the card is listed.

```bash
sudo lspci | grep nvidia
```

## Results?

While I was able to see the Nvidia card in lspci and Ollama, and it was working through the GPU, it was as slow, if not slightly slower, than CPU-only mode. This is likely because there aren't enough PCIe lanes for this to make a meaningful benefit. That said, I still learned that we can adapt the card, power it externally, and see it in Ubuntu. I also learned that putting this card in an HP ProDesk 600 G2 SFF would not boot, this is likely due to not enough power from the built-in power supply.

Coming up in this series I'll be testing more hardware and looking for used hardware that gets us full use of our GPU and still be lite, power efficient, and still be scalable. Till next time, fair winds and following seas.
