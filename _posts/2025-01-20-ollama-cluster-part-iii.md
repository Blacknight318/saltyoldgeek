---
title: "Raspberry Pi 5 Ollama Llama3.x Performance"
description: "Discover Raspberry Pi 5's AI performance with different cases like Argon Neo. Compare benchmarks with MacBook Air M3 and Ryzen 7 for cost-effective setups!"
author: saltyoldgeek
date: 2025-01-20 17:05:00 -0500
categories: [Blogging]
tags: [ollama, openwebui,raspberry, pi, selfhost]
image:
  path: /assets/img/images/ollama-pi-5.webp
  height: 630
  width: 1200
---

*This post contains affiliate links. If you make a purchase through these links, I may earn a small commission at no extra cost to you. Thanks for supporting Salty Old Geek! It helps cover the costs of running the blog.*

## Why a Raspberry Pi 5

Back in April of this year, I posted an article about setting up an [Ollam, Llama3, and OpenWebUI](https://www.saltyoldgeek.com/posts/ollama-llama3-openwebui/). In parts one and two I looked at trying to create a 1U unit with an external GPU using some adapters and setting up a server using an old gaming PC with the same external GPU([Nvidia Quadro K620](https://amzn.to/4a7NBTd)). This did work but was under-spec'd with only 2GB VRAM. In the search for a cost-effective node structure I've narrowed it down to 2 options, the first of which we'll go over in this post, the [Raspberry Pi 5 8GB RAM](https://amzn.to/423vY58). Let's dive in!

## Testing

To give a reference between certain setups I started with a prompt to work the CPU and provide a meaningful run time.

### The test prompt and benchmark times

- Test prompt
  - "Write a detailed 500-word essay on the importance of renewable energy in combating climate change."

- Llama 3.1 model
  - Pi 5 time [Stock Case](https://amzn.to/4g15Ifb): 8min
  - Pi 5 time [3d case](https://www.printables.com/model/691202-raspberry-pi-5-case): 6 min
  - Pi 5 time [Argon Neo case](https://amzn.to/42t6K02): 5 min 30 sec
  - Beast time(Ryzen 7 5800x w/32GB RAM): 1 min 30 sec
  - [M3 Bacbook Air 8GB RAM](https://amzn.to/4h24pO6): Failed to complete, however MacBook Pro with 16GB did finish at or better than Beast's time  

- Lamma 3.2 model
  - Pi 5 time [Stock Case](https://amzn.to/4g15Ifb): 2 min 55 sec
  - Pi 5 time [3d case](https://www.printables.com/model/691202-raspberry-pi-5-case): 2min 50 sec
  - Pi 5 time [Argon Neo case](https://amzn.to/42t6K02): 2 min 30 sec
  - Beast time(Ryzen 7 5800x w/32GB RAM): 1 min
  - [M3 Bacbook Air 8GB RAM](https://amzn.to/4h24pO6): 38 sec

### NUMA, is it worth the patch?

While looking for ways to improve performance, if not with shorter times than with thermal performance, I came upon an article by [Jeff Geerling "NUMA Emulation speeds up Pi 5 (and other improvements)"](https://www.jeffgeerling.com/blog/2024/numa-emulation-speeds-pi-5-and-other-improvements) and decided to give that a try. Now, I tested this month after Jeff's post had been published, so the patch might now be standard in the Raspberry Pi kernel, and in my case, the patch made no meaningful difference.

## TLDR

For the best value, the Raspberry Pi 5 with the Argon Neo NVME case is my second choice(only to an M series MacBook/Mac Mini with 16GB RAM). If you're comfortable with a little longer answer times or some prompt tweaking then running the Pi setup with Ollama and llama3.2:latest  is the sweet spot. I may go into cost more in a future post. That said, if you wanted more power I'd go for the MacBook or Mac Mini, any M series with +16GB RAM and you'd still come in under a PC with NVIDIA GPU(s) equivalent for the job.

I hope you found this post helpful, if so consider [buying me a coffee](buymeacoffee.com/twitter2). till next time fair winds and following seas.
