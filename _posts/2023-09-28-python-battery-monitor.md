---
title: "Python Battery Monitor: A Deep Dive"
description: "Evolution of a battery monitor script, making it cross-platform using Python. Dive into the macOS tweaks, Ntfy setup, and the new logic for monitoring."
author: saltyoldgeek
date: 2023-09-28 16:05:00 -0500
categories: [Blogging]
tags: [Python, Battery Monitor, Ntfy, Scripting]
image:
  path: /assets/img/images/ntfy-battery-python.webp
  height: 630
  width: 1200
---

## Remix

After the previous post, I got to thinking, maybe the battery monitor could be written to be more cross-platform and maybe try streamlining things a little bit. Here's the breakdown of that script.

## Before Starting on an M1 Mac

This script will get tested on other platforms, and I'll update that here. For now, we'll get around an SSL library glitch on an M1 MacBook running macOS Monterey.

```bash
brew install openssl@1.1
pip install urllib3==1.26.6
```

## Setup Ntfy user, topic, and token

Next, we'll want to set up a topic, a write-only user, and a token for that user just for monitoring this device. This may not seem that important but, IMO, it's best to err on the side of security.

```bash
sudo ntfy user add macbook
sudo ntfy access macbook macbook write-only
sudo ntfy token add macbook
```

## The standard libraries to import

```bash
pip install psutil requests python-decouple
```

## The imports

Now for the imports, psutil is our main utility to check battery status and percentage requests for sending to our ntfy server. The rest is mostly for housekeeping to set up logging, timing, and pulling in the local .env values.

```python
import psutil
import requests
from time import sleep
from decouple import config
import logging
```

## .env setup

Speaking of the .env file, we'll want to use it in the same directory as the main script/executable.

```bash
SERVER_URL=https://my-site-here/topic  
NTFY_TOKEN=ntfy-token-here
```

Alternatively, you could export them as follows.

```bash
export SERVER_URL=https://my-site-here/topic
export NTFY_TOKE=ntfy-token-here
```

## Setting Globals

Now we'll want to set up a few global variables, these will set up our configs for logging and connecting to the [ntfy](https://ntfy.sh) server.

```python
server_url = config('SERVER_URL')  
ntfy_token = config('NTFY_TOKEN')  
logging.basicConfig(level=logging.ERROR)
```

## Pulling the battery data

This one is pretty straightforward but essential, without this function to pull battery data the rest of the script is moot.

```python
def get_battery_status():  
    battery = psutil.sensors_battery()  
    status = "Charging" if battery.power_plugged else "Not charging"  
    return status, battery.percent
```

## Sending the data to your Ntfy server

This function assumes you have a ntfy user setup with a token. When called it will format the message for the alert/notification and send it out to our ntfy server.

```python
def send_data_ntfy(status, percentage):  
    requests.post(  
        server_url,  
        data=f"Current state is {status}, battery is at {percentage}%",  
        headers={  
            "Authorization": "Bearer " + ntfy_token  
        },
        timeout=10  
    )
```

## Main loop

And now for the main course, here we're calling all the functions and checking to see if either the battery status or percentage has changed, if so it'll call the send_data_ntfy function with the current values to let us know something changed. It's a little simpler than the [previous bash script](https://www.saltyoldgeek.com/posts/ntfy-battery-script/), but I feel it's more to what we'd actually be looking for. We also have some logic to trap and log errors when sending to the ntfy server.

```python
def main():  
    previous_status = ""  
    previous_percentage = 0  
    while True:  
        status, percentage = get_battery_status()  
  
        if (previous_status != status) or (previous_percentage != percentage):  
            try:  
                send_data_ntfy(status, percentage)  
            except requests.RequestException as e:  
                logging.error(f"Failed to send data: {e}")  
        previous_status = status  
        previous_percentage = percentage  
        sleep(60)
```

## Pulling it all together

This is really here to check if we're running it as is and not part of a larger program, then kick off the main function. That's it.

```python
if __name__ == "__main__":
    main()
```

## Wrapping up

This was, for me, an exercise in coding something useful into something that was more cross-platform friendly, documenting it for later, and adding another piece of knowledge to the pool. Below will be the contents of the .env and main.py files. I hope you've found this helpful. Till next time, fair winds and following seas.

- .env

```bash
SERVER_URL=https://my-site-here/topic  
NTFY_TOKEN=ntfy-token-here
```

- main.py

```python
import psutil  
import requests  
from time import sleep  
from decouple import config  
import logging  
  
  
server_url = config('SERVER_URL')  
ntfy_token = config('NTFY_TOKEN')  
logging.basicConfig(level=logging.ERROR)  
  
  
def get_battery_status():  
    battery = psutil.sensors_battery()  
    status = "Charging" if battery.power_plugged else "Not charging"  
    return status, battery.percent  
  
  
def send_data_ntfy(status, percentage):  
    requests.post(  
        server_url,  
        data=f"Current state is {status}, battery is at {percentage}%",  
        headers={  
            "Authorization": "Bearer " + ntfy_token  
        },  
        timeout=10  
    )  
  
  
def main():  
    previous_status = ""  
    previous_percentage = 0  
    while True:  
        status, percentage = get_battery_status()  
  
        if (previous_status != status) or (previous_percentage != percentage):  
            try:  
                send_data_ntfy(status, percentage)  
            except requests.RequestException as e:  
                logging.error(f"Failed to send data: {e}")  
        previous_status = status  
        previous_percentage = percentage  
        sleep(60)  
  
  
if __name__ == "__main__":  
    main()
```

- requirements.txt

```text
psutil  
requests  
python-decouple
```
