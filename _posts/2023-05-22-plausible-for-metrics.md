---
title: Plausible.io Analytics for GDPR
description: Learn to integrate Plausible.io for GDPR-compliant website metrics. Covers self-hosting, cloud options, ad blockers, and Nginx setup.
author: saltyoldgeek
date: 2023-05-23 09:25:00 -0500
categories: [Blogging]
tags: [Plausible.io, Jekyll, GDPR, Metrics, Analytics, Self-Host, Nginx, Ad Blockers, Plausible Setup, GDPR Compliance, Privacy, Blog Analytics]
---

In the last post, I went over some of the changes to this site to help improve both speed and privacy, in this post we'll go through how [Plausible.io Analytics](https://plausible.io) was integrated into this blog.

## Self-host or cloud with Plausible

Plausible allows you to self-host or pay for an account on their cloud servers. The choice is completely up to you, since they are hosted in Europe this could help alleviate concerns about GDPR, which is why I choose this option for the time being. This setup would still work with self-hosted with just a few minor changes, this may be atopic for a future blog post.

## Handling AdBlockers

There are 3 options that would work to implement Plausible, After reviewing how Plausible handles capturing metrics without cookies or fingerprinting visitors I decided to proxy the script through the blog, this gives more accurate numbers with minimal load on the site.

## NPM Advanced Config for blog proxy

```conf
location = /js/script.outbound-links.js {
    proxy_pass https://plausible.io/js/script.outbound-links.js;
    proxy_set_header Host plausible.io;
}

location = /api/event {
    proxy_pass https://plausible.io/api/event;
    proxy_set_header Host plausible.io;
    proxy_buffering on;
    proxy_http_version 1.1;

    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host  $host;
}
```

## One-line Head tag

```html
<script defer data-domain="saltyoldgeek.com" data-api="/api/event" src="/js/script.outbound-links.js"></script>
```

That should be it, test and make sure that you can pull the javascript through the proxy and you're done.
