---
title: Setting Up Obsidian LiveSync with Couchdb
description: Learn how to enable real-time sync for Obsidian using CouchDB on Ubuntu. This guide covers installation, user creation, and configuring the LiveSync plugin.
author: saltyoldgeek
date: 2023-09-14 10:00:00 -0500
categories: [Blogging]
tags: [Obsidian, LiveSync, CouchDB, real-time sync, setup guide]
image:
  path: /assets/img/images/obsidian-livesync.webp
  height: 630
  width: 1200
---

I'd been looking for a way to have better sync with Obsidian notes and started looking for different sync options or maybe an alternative to Obsidian altogether. In the /r/selfhosted Matrix/Discord chat Dup suggested I try LiveSync. After some digging, I worked through setting up my own instance of CouchDB(a version of which is needed for the plugin to work). Here are the notes I wrote while setting this up, btw it works crazy fast.

## CouchDB Setup

```bash
sudo apt update
sudo apt install apt-transport-https gnupg
```

```bash
curl https://couchdb.apache.org/repo/keys.asc | gpg --dearmor | sudo tee /usr/share/keyrings/couchdb-archive-keyring.gpg >/dev/null 2>&1 source /etc/os-release
```

```bash
echo "deb [signed-by=/usr/share/keyrings/couchdb-archive-keyring.gpg] https://apache.jfrog.io/artifactory/couchdb-deb/ jammy main" | sudo tee /etc/apt/sources.list.d/couchdb.list >/dev/null
```

```bash
sudo apt update
sudo apt install couchdb
```

- [ ] Choose couchdb config
- [ ] Enter random code for erlang cookie
- [ ] Leave bind as 127.0.0.1 for now
- [ ] Provide admin password
- [ ] Test with the following command

```bash
curl http://127.0.0.1:5984
```

- [ ] Open and edit the /opt/couchdb/etc/local.ini file

```bash
nano /opt/couchdb/etc/local.ini
```

- [ ] Change the following line

```text
;bind_address = 127.0.0.1
```

to

```text
bind_address = 0.0.0.0
```

- [ ] The restart with the following command

```bash
sudo systemctl restart couchdb
```

- [ ] Go to CouchDB at [http://couchdb-ip:5984/_utils](http://couchdb-ip:5984/_utils)
- [ ] Go to setup/wrench icon
- [ ] Click setup for your type, i.e. cluster or single
- [ ] Enter admin creds and complete setup
- [ ] On the utils page create a new database by clicking "Create Database"
- [ ] Leave the default of "Non-Partitioned" and click create
- [ ] Go to the database tab and click on _users
- [ ] Click create a new document
- [ ] Paste in the following, change the username and password

```json
{
    "_id": "org.couchdb.user:dbreader",
    "name": "dbreader",
    "type": "user",
    "roles": [],
    "password": "plaintext_password"
}
```

- [ ] Now go back to the database tab
- [ ] Click on obsidian
- [ ] Click on permissions
- [ ] Add the user previously created to members(remember the username and password)

## LiveSync setup

- [ ] In Obsidian open the settings/gear icon
- [ ] Click on Community Plugins
- [ ] Click on Browse
- [ ] Search for LiveSync
- [ ] Install LiveSync
- [ ] Enable LiveSync
- [ ] Back in settings click on Self Hosted LiveSync
- [ ] Click on the satellite icon
- [ ] Change the server address to you couchdb ip
- [ ] Change username and password to the one previously created
- [ ] Change database to obsidian
- [ ] Optional: Click on the sync icon
- [ ] Change sync style to livesync

Let the fun begin, note that if more than one instance is in use at the time you may have conflicts to resolve from time to time. That's it, you're all set to go. If you're looking for a web accessable docker version checkout [this post](https://www.saltyoldgeek.com/posts/obsidian-remote-setup/)Till next time, fair winds and following seas.

### Sources

REF: https://www.geekbits.io/how-to-install-apache-couchdb-in-ubuntu-22-04/
REF: https://github.com/vrtmrz/obsidian-livesync/blob/main/docs/quick_setup.md
REF: https://stackoverflow.com/questions/3684749/creating-regular-users-in-couchdb
