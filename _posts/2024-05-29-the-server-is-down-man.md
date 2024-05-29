---
title: "Recovering My Blog with Jekyll and Proxmox"
description: "Step-by-step guide to updating a Jekyll theme and recovering a blog with Proxmox, including setting up Chirpy and serving with Dockerized Nginx."
author: saltyoldgeek
date: 2024-05-29 10:10:00 -0500
categories: [Blogging]
tags: [proxmox, docker, jekyll, chirpy]
image:
  path: /assets/img/images/blog-recovery.webp
  height: 630
  width: 1200
---

## The Server is(was) Down

Today I decided to try and update the [Jekyll](https://jekyllrb.com/) theme for this site, [Chirpy](https://chirpy.cotes.page/). If you've watched the blog or gone to this blog's [status page](https://status.saltyoldgeek.com/status/blog) you probably noticed it was down for a few hours today. Needless to say, things didn't go as planned. It turns out that the last time I tried to update/recreate the blog site I chose the [Chirpy Starter](https://chirpy.cotes.page/posts/getting-started/#option-1-using-the-chirpy-starter) option instead of the [Github Fork](https://chirpy.cotes.page/posts/getting-started/#option-2-github-fork) option, and in trying to update it the whole thing went sideways. No problem I'd just restore from the backup/snapshot in Proxmox, which also failed and destroyed the LXC, great!

After a few failed attempts to restore this zombie LXC, I decided to try spinning up and small shared instance of Ubuntu on [Linode](https://www.linode.com/) which updated at a crawl, to be fair this was a shared instance and I probably was trying to update it at peak usage time. Dedicated nodes aren't cheap, at least for a small blog like this. Eventually, after several attempts to stand up the blog again, I created a new LXC and cloned the theme for easier updates in the future(as long as I remember). This post is as much for me to document the process, should I need it again in the future, and help anyone else wanting to start one of their own. Time to roll up the sleeves and get to work.

## Building the Blog

### Building the LXC in Proxmox

When I first started using [Proxmox](https://www.proxmox.com) there was a lot of experimentation to get things right. During that time I found an invaluable site to get things up and running quick, [Helper Scripts](https://helper-scripts.com/) by tteck. Let's use one of those to get the initial LXC up and running, in the shell of your Proxmox node paste in the following.

```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/ubuntu.sh)"
```

You can follow the prompts on screen and use the defaults(you'll need to rename and adjust settings), or choose advanced and tweak things to your liking, here are the spec settings I used.

- Ubuntu
- Ubuntu version 24.04
- Disable IPv6
- 2GB RRAM
- 2 Cores
- 15GB Storage

The reason for that RAM size and Cores was to allow overhead when initially building out or upgrading the theme, for day-to-day use you could halve those.

Now that that is out of the way we can continue with the rest of the setup for this LXC. We can click on our now LXC and then click on shell to get a few more things set up. Here are those commands.

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
adduser dave
usermod -aG sudo dave
usermod -aG docker dave
```

Now that docker is installed(we'll need this later), and permissions are set, we can start installing Jekyll.

```bash
sudo apt-get install ruby-full build-essential zlib1g-dev
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
gem install jekyll bundler
```

### Setting up Chirpy

We've now got docker installed and Jekyll working, now we'll want to follow the steps for the fork method shown above. Once you've created a fork we'll want to pull that down and set up a few globals, including an access token for a password with Github.

Let's get that token, on Github do the following

1. Click on your profile
2. Click on Settings
3. Click on Developer Settings
4. Click on Personal Access Tokens
5. Click on Fine Grained Tokens
6. Click on Generate Token
7. Give the token a name
8. Click Only Select Repositories
9. Choose the forked repository
10. Click on Repository permissions
11. Change Commit Statuses to Read and Write
12. Change Contents to Read and Write
13. Change Pull requests to Read and Write
14 Click Generate Token
15. Copy the token and paste it into a temporary note (once you leave the page you won't be able to use it again)

Now we'll run the following commands to pull down our repo and set up Git. Either in the console through Proxmox, or an SSH session if you prefer, run the following.

```bash
sudo apt install git npm
git clone https://github.com/your-github-username/your-github-fork-repo
cd your-github-fork-repo
git config --global user.name "your username here"
git config --global user.password "your github token here"
git config --global user.email "github associated email here"
git config --global credential.helper store
```

Ok, we're almost there. It's time to initialize the theme (if you are pulling down an existing, fork with posts, to a new machine you can skip this step).

```bash
bash tools/init
```

Whether you are pulling down a new or existing fork run the following to pull all the Ruby Gems, if you don't you'll get error after error.

```bash
bundle
```
While we're at it let's change, at a minimum, these four lines in _config.yml so your blog shows as you.

- title:
- lang:
- timezone:
- tagline:
- description:
- url:
- avatar:

We're set!

### Building the posts

You can write a post saved under _posts folder, keep these two things in mind

1. Filename format 2024-05-28-title-here.md
2. Minimum Frontmatter at the top

 ```markdown
  ---
  title: ""
  description: ""
  author: dave
  date: 2024-05-28 14:22:00 -0500
  categories: [Blogging]
  tags: [tag one, tag two]
  ---
 ```

To build the _site static site from these posts run the following command(you'll want to run this anytime you create a new post).

```bash
JEKYLL_ENV=production jekyll serve --config _config.yml
```

### Running Nginx to serve the blog

Lastly, we're going to use a Dockerized Nginx instance to serve up our static site under_site folder. This is a simple one-liner.

```bash
docker run --name blog-server -v /home/dave/fork-folder-name/_site:/usr/share/nginx/html:ro -d nginx
```

We're done! you should now be able to navigate to the IP of the server with HTTP and see your site. Hopefully, this helps you get started or recreate a site if, like me, you have a server crash. Till next time, fair winds and following seas.
