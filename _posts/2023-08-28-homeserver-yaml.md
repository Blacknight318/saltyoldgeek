---
title: Guide to Customize Synapse Homeserver.yaml
description: Customize your Synapse Matrix server's homeserver.yaml. Learn to configure email, metrics, and security features for a better server setup.
author: saltyoldgeek
date: 2023-08-28 15:11:00 -0500
categories: [Blogging]
tags: [Synapse Homeserver, Homeserver.yaml, YAML Configuration, Synapse Matrix, Security Keys, SMTP, Email Verification, Prometheus Metrics, Federation, DynDNS, DuckDNS, Mailjet, Base64]
---

## The Config

In my previous post, [Setup Guide: Self-Hosted Synapse Matrix with Docker](https://www.saltyoldgeek.com/posts/hosting-your-own-synapse-server/#setting-up-the-config) I posted a bare bones homeserver.yaml file for your Synapse instance. In this post we'll go over a few of the changes that were made and why I choose to make them.

## my-domain

First, we'll get a few of the more obvious ones out of the way. Anything from the config in the previous post that has my-domain should be changed to the domain you intend to use. If you don't have one you can use a service like [DynDNS](https://account.dyn.com/) or [DuckDNS](https://www.duckdns.org/) to setup an agent and provide a free sub-domain name with their services. Be sure to remember what that is later for testing, and make sure you have it pointed to your instance public facing IP.

## base64

Next, we'll talk about the base64 keys. We wanted to have something random and long for these keys to ensure some level of security and anonymity. If you Google base64 bit string generators you can find a few different services, even easier is using this command in bash

```bash
dd if=/dev/urandom bs=1024 count=1 status=none | base64
```

## Email Server

If you choose to use email for registration and validation of accounts you'll want to use an SMTP service, either self-hosted or cloud-based depending on your setup or needs, in the past I've used [mailjet](https://www.mailjet.com/).

## Third Party ID

Along with the email server, you can also turn on email and a third-party id, or verification method for new accounts.

```yaml
registrations_require_3pid:
  - email
```

## Metrics

If you want to see [prometheus](https://prometheus.io/) metrics you can enable that with the following:

```yaml
enable_metrics: true
```

Just be sure to add the following into your NPM instance if you're using that, the below config blocks those metrics from the outside world.

```json
location /_synapse/metrics{
  try_files $uri = 404;
}
```

## Presence

This is a personal preference but it is nice to see if someone is online that you're talking to or "AFK".

```yaml
presence:
  enabled: true
```

## Federating

If you want to federate, as I do, and interconnect better with other servers you'll want to enable this setting in homeserver.yaml

```yaml
allow_public_rooms_over_federation: true
```

You'll also want to add this to your NPM config

```json
location /.well-known/matrix/server {
    return 200 '{"m.server": "matrix.saltyoldgeek.com:443"}';
    default_type application/json;
    add_header Access-Control-Allow-Origin *;
}
```

## Wrap-up

That should about wrap this up, if this was helpful let me know. Till the next one, fair winds and following seas.
