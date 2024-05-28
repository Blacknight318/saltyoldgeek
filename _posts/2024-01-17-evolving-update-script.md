---
title: "Docker and System Updates with Python"
description: "Learn to automate Docker and system updates using Python. Diving into script evolution from Bash to Python, with practical examples and ChatGPT insights."
author: saltyoldgeek
date: 2024-01-17 21:30:00 -0500
categories: [Blogging]
tags: [Python Automation, Docker Updates Script, Bash to Python Scripting, System Update Automation, ChatGPT Scripting Insights]
image:
  path: /assets/img/images/python-updater.webp
  height: 630
  width: 1200
---

## The OG script in bash

If you saw my post ["NanoPi Uptime Kuma Setup: A Quick Guide"](https://www.saltyoldgeek.com/posts/kuma-and-nanopi/?ref=internal) then you might remember the update script at the end. It was semi-purpose written just for that project to make things easier to update, without getting into something like Ansible or Portainer, which are both good options. For my situation I wanted something a bit more generic, even with ChatGPT, the bash script was a tad too cumbersome for me. That took me back to something a bit more familiar, Python.

## Evolving the script

Having knowledge of Python, but with limited time to work through bigger chunks I decided to turn to ChatGPT to help write the script. Keeping in mind the need for utility and structuring it in a way I would be comfortable with, I went about this using the chain of thought methodology. This helped keep the chunks small and testable while still being able to keep up with code changes. If you'd like to see how I worked through it check out the [chain of thought](https://chat.openai.com/share/55eba7fd-9efc-42a0-9251-b87023106a41).

In the end, there are two pieces to this project, a config.json file for more customizability, and the main.py script.

### config.json

```json
{  
    "package_manager": "apk",  
    "docker_containers": [  
        {  
            "name": "element",  
            "image": "vectorim/element-web:latest",  
            "run_command": "-d --restart unless-stopped --name element -p 4080:80 vectorim/element-web"  
        },  
        {  
            "name": "synapse",  
            "image": "matrixdotorg/synapse:latest",  
            "run_command": "-d --restart unless-stopped --name synapse --mount type=volume,src=synapse-data,dst=/data -p 8008:8008 -p 443:443 matrixdotorg/synapse"  
        }  
    ]  
}
```

### main.py

```python
import json  
import os  
import subprocess  
  
  
# Function to load and parse the config.json file  
def load_config(file_path):  
    try:  
        with open(file_path, 'r') as file:  
            return json.load(file)  
    except Exception as e:  
        print(f"Error reading the config file: {e}")  
        return None  
  
  
def update_apt():  
    os.system('sudo apt update && sudo apt upgrade -y')  
    print("System updated using apt.")  
  
  
def update_yum():  
    os.system('sudo yum update -y')  
    print("System updated using yum.")  
  
  
def update_brew():  
    os.system('brew update && brew upgrade')  
    print("System updated using brew.")  
  
  
def update_apk():  
    os.system('apk update && apk upgrade')  
    print("System updated using apk.")  
  
  
def run_update(package_manager):  
    # Get the update function based on the package manager  
    update_function = update_commands.get(package_manager)  
  
    # Execute the update function if it exists  
    if update_function:  
        update_function()  
    else:  
        print(f"Package manager '{package_manager}' not supported.")  
  
  
def update_docker_containers(containers):  
    for container in containers:  
        name = container.get("name")  
        image = container.get("image")  
        run_command = container.get("run_command")  
  
        if not all([name, image, run_command]):  
            print(f"Container {name} is missing required fields.")  
            continue  
  
        print(f"Checking for updates for container: {name}")  
  
        # Pull the latest image and capture the output  
        pull_command = f"docker pull {image}"  
        pull_result = subprocess.run(pull_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)  
  
        # Check if the image was updated  
        if ('Status: Downloaded newer image' in pull_result.stdout.decode() or 'Status: Image is up to date' not in  
                pull_result.stdout.decode()):  
            print(f"Updating container: {name}")  
  
            # Stop and remove the existing container (if it exists)  
            os.system(f"docker stop {name}")  
            os.system(f"docker rm {name}")  
  
            # Run the container with the specified run command  
            os.system(run_command)  
            print(f"Container {name} updated and running.")  
        else:  
            print(f"No updates found for container: {name}")  
  
  
def main():  
    # Load the configuration  
    config = load_config(config_file_path)  
    if config:  
        print("Config loaded successfully")  
        # Print the loaded config for debugging purposes  
        print(json.dumps(config, indent=4))  
    else:  
        print("Failed to load config")  
  
    run_update(config["package_manager"])  
  
    update_docker_containers(config["docker_containers"])  
  
  
if __name__ == '__main__':  
    # Path to your config.json file  
    config_file_path = 'config.json'  
  
    # Dictionary mapping package managers to their update functions  
    update_commands = {  
        "apt": update_apt,  
        "yum": update_yum,  
        "brew": update_brew,  
        "apk": update_apk  
    }  
  
    main()
```

## Wrapping up

As you might be able to tell, this is for more than just updating system packages, this is meant for updating a system with multiple docker containers, something like a Matrix server also hosting Element, both in containers. This is a little of a niche case, but it may still be useful to you, maybe even the chain of thought process as well.

If you find this or other articles helpful please consider clicking the "Buy me a coffee" button below and supporting this blog.  Till next time, fair winds and following seas.
