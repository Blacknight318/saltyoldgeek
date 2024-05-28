---
title: "Matrix Synapse Meets Cloudflare Tunnels"
description: "Enhance your Matrix Synapse server with Cloudflare Tunnels. Follow our guide for secure, efficient federation and metrics protection."
author: saltyoldgeek
date: 2023-12-15 12:30:00 -0500
categories: [Blogging]
tags: [Cloudflare Tunnels, Matrix Synapse Server, Web Application Firewall, Secure Federation, Prometheus Monitoring]
image:
  path: /assets/img/images/synapse-cloudflare.webp
  height: 630
  width: 1200
---

## Who this is for

This post is for those using [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/) and has set one up for a Matrix Synapse server. If you're looking at setting up your own Matrix Synapse server check out my post [here](https://www.saltyoldgeek.com/posts/hosting-your-own-synapse-server/) on setting that up, and [here](https://www.saltyoldgeek.com/posts/homeserver-yaml/) for configuring said server.

## Workers and .well-known for federation

Setting this up will enable federation of your server, which is useful not only for communicating with other users on other Matrix servers but also for using bridges to other services. On your main Cloudflare page open Workers & Pages and create a new application, then Create Worker, then click Deploy. Once it's deployed we'll want to edit that Worker.

- Click on the Worker you just created and go to Triggers. Click Add route, in the Route field enter the following:

```text
matrix.my-domain.com/.well-known/matrix/*
```

- Click add route, well also want to click on the three dots of the default route and disable it as it's not needed.
- Now click on Quick edit and paste in the following, changing your domain to match:

```javascript
const HOMESERVER_URL = "https://matrix.my-domain.com";
const IDENTITY_SERVER_URL = "https://vector.im";
const FEDERATION_SERVER = "matrix.my-domain.com:443";

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    switch (path) {
      case "/.well-known/matrix/client":
        return new Response(
            `{"m.homeserver": {"base_url": "${HOMESERVER_URL}"},"m.identity_server": {"base_url": "${IDENTITY_SERVER_URL}"}}`
        );
      case "/.well-known/matrix/server":
        return new Response(`{"m.server": "${FEDERATION_SERVER}"}`);
      default:
        return new Response("Invalid request");
      }
    },
};
```

- Then click Save and deploy

That's it for setting up the worker.

## Blocking metrics to the outside

This next bit is for those who have metrics turned on to monitor Synapse server activity through Prometheus. This time under Cloudflare go to your site/domain.

- Under Security on the left hand side go to WAF
- Click on Create rule
- Name the rule Matrix Metrics
- For Field select URI Path
- For Operator select equals
- For Value paste the following

```text
/_synapse/metrics
```

- For Choose action select Block
- For With response type select Default Cloudflare WAF block page

That's it, now we're all see. If you found this post helpful please consider buying me a coffee at that ko-fi link below or at [Buymeacoffee](https://www.buymeacoffee.com/twitter2). Till next time, fair winds and following seas.
