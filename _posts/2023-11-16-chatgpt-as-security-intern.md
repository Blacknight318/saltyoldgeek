---
title: ChatGPT As Your New Security Intern
description: "Streamline your security audits with ChatGPT! This guide shows how to distill lengthy reports into actionable insights, perfect for small IT teams."
author: saltyoldgeek
date: 2023-11-16 14:38:00 -0500
categories: [Blogging]
tags: [chatgpt, siem, wazuh, ]
image:
  path: /assets/img/images/chatgpt-intern.webp
  height: 630
  width: 1200
---

## ChatGPT, really?

Here me out, this isn't saying that ChatGPT is a beacon of security, as recent articles have highlight, but more like a tool, or if you prefer, and intern. We can use ChatGPT to help do some of the scut work, with supervision, to find commonalities and distill down the long vulnerability and security audit reports

## First Steps

First thing we'll want to do is export our data and look at the column headers. For me that would be the target and status coliumns for Wazuh security audit report. We'll then updload/attach that to the GPT 4 chat, along with that I used the following prompt:

```text
I'd like your help breaking down the failed check in the attached csv file and grouping them by target, then giving a brief summary of what each is and how to affectively mitigate the changes.
```

This gives us a high level view, kinda like an executive summary report, to start with.

## Adding some context

Next thing I did was to add a bit of context, I do this for each system under review as each might have a different function or access. Here's a sample:

```text
The machine in question is behind a cloudflare tunnel, it hosts a jekyll blog instance that generates a static site, that site is then exposed to the outside using a docker instance of nginx. The only publicly accesable data is from the nginx server static site via HTTP. SSH access is only allowed over a VPN tunnel.
```

From there you should be able to lookup those vulnerabilities and rremediations. Hopefuly this helps lighten the load for those who work IT security, especially the smale team. Till next time fair winds and following seas.
