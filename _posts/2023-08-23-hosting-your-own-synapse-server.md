---
title: Synapse Matrix Server Setup with Docker
description: Learn to set up a Synapse Matrix server with Docker. This guide covers config files, Nginx Proxy Manager settings, and server updates.
author: saltyoldgeek
date: 2023-08-24 09:28:00 -0500
categories: [Blogging]
tags: [Docker Synapse Configuration, Matrix Server Setup, Self-Hosted Synapse Guide, Docker for Matrix Synapse, Synapse Server Federation]
image:
  path: /assets/img/images/synapse-setup.webp
  height: 630
  width: 1200
---

Catching up on messages in the [r/selfhosted](https://www.reddit.com/r/selfhosted/) [Discord](https://discord.com/invite/UrZKzYZfcS)/[Matrix](https://matrix.to/#/#selfhosted:selfhosted.chat) groups got me thinking about documenting how I set my synapse instance should it be needed again in the future. This will be a shorter post and assumes that you already have Docker setup, if not check out the documentation [here](https://www.docker.com/get-started/). We'll also not be setting up a separate database instance with this and will instead to the included sqlite3. With that out of the way let's get started!

## Setting up the config

Before we start an instance we need to generate a config file and tweak a few things, here's how to generate the config file.

```bash
docker run -it --rm --mount type=volume,src=synapse-data,dst=/data -e SYNAPSE_SERVER_NAME=my.matrix.host -e SYNAPSE_REPORT_STATS=yes matrixdotorg/synapse:latest generate
```

Now we'll want to make a few tweaks to the config.

```bash
nano /var/lib/docker/volumes/synapse-data/_data/homeserver.yaml
```

Here is a sample of my config below.

```yaml
# Configuration file for Synapse.
#
# This is a YAML file: see [1] for a quick introduction. Note in particular
# that *indentation is important*: all the elements of a list or dictionary
# should have the same indentation.
#
# [1] https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html
#
# For more information on how to configure Synapse, including a complete accounting of
# each option, go to docs/usage/configuration/config_documentation.md or
# https://matrix-org.github.io/synapse/latest/usage/configuration/config_documentation.html
server_name: "matrix.my-domain.com"
pid_file: /data/homeserver.pid
public_baseurl: https://matrix.my-domain.com/
presence:
  enabled: true
allow_public_rooms_over_federation: true
enable_search: true
enable_metrics: true
listeners:
  - port: 8008
    tls: false
    type: http
    x_forwarded: true
    #bind_addresses: ['127.0.0.1', '0.0.0.0']
    resources:
      - names: [client, federation, metrics]
        compress: false
  # - port: 9000
    # type: metrics
    # bind_addresses: ['127.0.0.1', '0.0.0.0']
database:
  name: sqlite3
  args:
    database: /data/homeserver.db
log_config: "/data/matrix.my-domain.log.config"
media_store_path: /data/media_store
enable_registration: true
registrations_require_3pid:
  - email
report_stats: false
registration_shared_secret: "base64 key"
report_stats: false
macaroon_secret_key: "base-64 key"
form_secret: "base64 key"
signing_key_path: "/data/my-domain.signing.key"
trusted_key_servers:
  - server_name: "matrix.org"
email:
  smtp_host: 
  smtp_port: 587
  smtp_user: 
  smtp_pass: 
  require_transport_security: true
  notif_from: "Your Friendly %(app)s homeserver <noreply@my-domain.com>"
  app_name: my-domain
  invite_client_location: https://app.element.io
supress_key_server_warning: true
```

If you'd like to see more config options you can check out the documentation [here](https://matrix-org.github.io/synapse/latest/usage/configuration/config_documentation.html)

## Starting Synapse server

```bash
docker run -d --restart unless-stopped --name synapse --mount type=volume,src=synapse-data,dst=/data -p 8008:8008 -p 443:443  matrixdotorg/synapse
```

## Configuring NPM(Nginx Proxy Manager)

If you're using NPM, like me, there are a few extra settings we need to change to ensure federation works and block metrics to the outside, on the proxy host for your matrix instance go to the advances tab and paste in the following

```json
add_header Access-Control-Allow-Origin *;

location /.well-known/matrix/server {
    return 200 '{"m.server": "matrix.saltyoldgeek.com:443"}';
    default_type application/json;
    add_header Access-Control-Allow-Origin *;
}

location /_synapse/metrics{
  try_files $uri = 404;
}
```

**If you're using Cloudflare Tunnels check out [this](https://www.saltyoldgeek.com/posts/matrix-cloudflare-howto/) post**

## Testing and connection

You should be set to go now, to see if things are running you can browse to [http://matrix-my-domain.org](http://matrix-my-domain.org) or [http://docker-machine-ip:8008](http://docker-machine-ip:8008) and you should see a Matrix welcome page.
Now you should be able to with a client like [Element](https://app.element.io/#/room/#selfhosted:selfhosted.chat), be sure to edit the server address to point to your instance and register a user.

## Updating

To upgrade this instance follow the below commands, it will temporarily stop the service during the update.

```bash
docker pull matrixdotorg/synapse
docker stop synapse
docker rm synapse
docker run -d --restart unless-stopped --name synapse --mount type=volume,src=synapse-data,dst=/data -p 8008:8008 -p 443:443  matrixdotorg/synapse
```

## We're done

If all worked you should be up and running, you can check out the full documentation [here](https://matrix-org.github.io/synapse/latest/welcome_and_overview.html). In a future post, I'll be going through setting up the Matrix Admin panel and hosting your own Element instance. Till then fair winds and following seas!
