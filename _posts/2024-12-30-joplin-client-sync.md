---
title: "Sync Joplin Clients with Self-Hosted Server"
description: "Learn how to sync Joplin clients (Mac, Windows, iOS, Android) with your self-hosted server. A step-by-step guide using the MacOS client example."
author: saltyoldgeek
date: 2024-12-30 00:30:00 -0500
categories: [Blogging]
tags: [proxmox, joplin, self, host, xda]
image:
  path: /assets/img/images/joplin-client-og.webp
  height: 630
  width: 1200
---

## Recap

It's been a minute since my last post, life happens, so here's a continuation of the previous post ["Self-Host a Joplin Sync Server in Proxmox"](https://www.saltyoldgeek.com//posts/self-host-joplin/). In that post we set up a self-hosted Joplin sync server, here we'll use that server to sync our [Joplin clients](https://joplinapp.org/download/) (be it Mac or Windows desktop, iPad, iPhone, or my favorite Android). We'll need the email and password we set up in the initial Docker Compose file on the server(or another user if you've added one).

## Joplin client

(*This post uses the MacOS client as an example*)

Here are the steps to set up the MacOS Client.

1. Click on Joplin at the top left of the screen
2. Click on settings
3. Click on Synchronization
4. Fill in the highlighted fields with the IP/URL of the sync server and the email and password we set up previously.

    ![Joplin Client Sync Menu](/assets/img/images/joplin-sync-client.webp)

5. Click Check synchronization configuration to make sure all works

## Wrap-up

That's it, pretty simple! If you're still on the fence about Joplin check out this post over on [XDA "9 reasons you should self-host Joplin on your Raspberry Pi"](https://www.xda-developers.com/reasons-self-host-joplin-raspberry-pi/).

Look forward to more posts coming up in the new year. If you found this post, or any of my other posts helpful, consider [buying me a coffee](https://buymeacoffee.com/twitter2). Til next time fair winds and following seas.
