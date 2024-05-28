---
title: "Blog Upgrades: New Analytics and Features"
description: Explore the newest updates on my blog, from shifting to Plausible Analytics for privacy to removing Disqus. Get insights into upcoming tech endeavors.
author: saltyoldgeek
date: 2023-05-19 13:07:00 -0500
categories: [Blogging]
tags: [Blog Updates, Nginx, Cloudflare, Google Analytics, Matomo Analytics, Plausible Analytics, Jekyll Theme, Self-Host, Disqus, Comments, FRC, Privacy, Crowdsec, Site Performance, Libre Computing Le Potato, Internet Monitoring Project]
---

It's been a bit since I last posted, so here's an update on What I've been working on lately. The first has been mostly working and family time now that the FRC 2023 season is over. This season came with a few new challenges. On the technical side, it's been working, well, working and developing my Python and 3d skills. Lastly working on this blog site.

## The Blog Infrastructure

Since starting this blog I've been basically self-host and running it through [Cloudflare](https://www.cloudflare.com/) and another reverse proxy with some log monitoring(mostly for security). On my own internal reverse proxy is a [Crowdsec](https://app.crowdsec.net/?next=%2Finstances) instance with a bouncer that talks back to Cloudflare. That will remain mostly untouched, except for some small performance improvements.

## What's changed?

Well, for starters I've completely ditched Google Analytics(connected via Cloudflare's Zaraz), and my own hosted [Matomo Analytics](https://matomo.org/) in an effort the be more privacy friendly. So, now the blog uses [Plausible Analytics](https://plausible.io) which is much more trimmed down but also more privacy-minded. Changing these two alone has improved the site's performance a bit.

In addition after seeing Disqus not getting comments, and also their security track record, I've decided to pull the Disqus comments add-on. For those who would like to interact Please check the sidebar or reach out to me on [Twitter](https://twitter.com/saltyoldgeek) and [Mastodon](https://hachyderm.io/@saltyoldgeek).

There have also been some updates to the Jekyll theme used for this blog. There is a major version change I'm going to start testing alongside this theme, so keep watch for that.

## Projects

One of the latest projects has been testing out the [Libre Computing Le Potato](https://libre.computer/products/aml-s905x-cc/) as an alternative to the unobtanium Raspberry Pi, at least for compute tasks. I'm also working on shrinking and refining the [Internet Monitoring Project](https://www.saltyoldgeek.com/posts/followup-to-filter-project/) and documenting setting up Plausible.

Till next time, fair winds and following seas.
