---
title: Monitor Ubuntu Battery Alerts Using Bash
description: Learn how to set up battery alerts on an Ubuntu server using Bash. Monitor charge states and ensure uptime during power outages with this handy script.
author: saltyoldgeek
date: 2023-09-26 09:35:00 -0500
categories: [Blogging]
tags: [bash, ubuntu, battery alerts, scripting, NTFY, server monitoring, power management]
---

## Battery Alert to NTFY using Bash

Recently I've started an experiment to use an old laptop as an Ubuntu server. The reason is twofold, to see how it handles different types of loads and to have a built-in battery to keep certain services up. I'll write up on how I set that up in the future, once it's had some time to generate data. Aside from powertop to tune the power consumption I wanted to be alerted when the charge state changes or it goes above or below certain thresholds. Starting with NTFY and the post on [Network Chuck's](https://academy.networkchuck.com/blog/ntfy) site as a start, it needed a few tweaks to get working for me, it was time to open a shell and nano and get to work. Also, side note some of the tweaking was done with the help of [Google Bard](https://bard.google.com) and various [Stackoverflow](https://stackoverflow.com/) posts.

## Outlining the Script

Here is the basic script loop a few precursors, for error handling and a global variable to handle state change tracking in the loop, more on that later. Here's the basic loop.

```bash
#!/bin/bash

trap 'echo "Error executing the curl command: $?"'

PREVIOUS_STATUS=""

while true; do

    sleep 300 # Adjust polling time here in seconds
done
```

### Checking Batter Charge Percentage and State

The reason for this feature is to know when the laptop is either unplugged or the power is out.

```bash
# Get the current battery level
BATTERY_LEVEL=$(cat /sys/class/power_supply/BAT0/capacity) # Charge Percentage
BATTERY_STATUS=$(cat /sys/class/power_supply/BAT0/status) # Charging Status
```

### Triggering Alert on Status Change

For my situation I need to to pull the status(and charge percentage) from
/sys/class/power_supply/BAT0, ymmv. Here's the logic that takes care of that, this goes inside the while loop.

```bash
if [[ "$BATTERY_STATUS" != "$PREVIOUS_STATUS" ]]; then
    curl -s -o /dev/null --max-time 10 -d "Battery charging status has changed to $BATTERY_STATUS." https://ntfy.saltyoldgeek.com/asus1
fi
```

## Trigger on upper and lower thresholds

This one is pretty straightforward, we are comparing both the charge state and battery percentage, no need to keep reporting a low battery if it's charging.

```bash
if [[ "$BATTERY_LEVEL" -ge 80 ]] && [[ "$BATTERY_STATUS" == "Charging" ]]; then
    curl -s -o /dev/null --max-time 10 -d "Asus 1 battery at or above 80%!!" https://ntfy.saltyoldgeek.com/asus1
elif [[ "$BATTERY_LEVEL" -le 50 ]] && [[ "$BATTERY_STATUS" == "Discharging" ]]; then
    curl -s -o /dev/null --max-time 10 -d "Asus 1 battery low" https://ntfy.saltyoldgeek.com/asus1
fi     # Wait for 5 minutes (300 seconds) before checking again
```

### Setting Status check variable and sleep

This last one is setting up the previous status to compare with the next pull at the top of the loop, we need this set here in order to have a status compare up top, this is also why the variable PREVIOUS_STATUS is set to an empty string before the loop to keep it from erroring out on the first pass.

```bash
PREVIOUS_STATUS="$BATTERY_STATUS"

sleep 300
```

## TLDR: Here's the scripts in it's entirety

Here's the whole script, If you find this helpful let me know on my socials, or better yet, send support me over at [Ko-fi](https://ko-fi.com/saltyoldgeek). Till the next one, fair winds and following seas.

```bash
#!/bin/bash 

trap 'echo "Error executing the curl command: $?"' ERR

PREVIOUS_STATUS=""

while true; do

  # Get the current battery level
    BATTERY_LEVEL=$(cat /sys/class/power_supply/BAT0/capacity)     # Check if the battery level is below 20%
    BATTERY_STATUS=$(cat /sys/class/power_supply/BAT0/status)

    if [[ "$BATTERY_STATUS" != "$PREVIOUS_STATUS" ]]; then
        curl -s -o /dev/null --max-time 10 -d "Battery charging status has changed to $BATTERY_STATUS." https://ntfy.saltyoldgeek.com/asus1
    fi

    if [[ "$BATTERY_LEVEL" -ge 80 ]] && [[ "$BATTERY_STATUS" == "Charging" ]]; then
        curl -s -o /dev/null --max-time 10 -d "Asus 1 battery at or above 80%!!" https://ntfy.saltyoldgeek.com/asus1
    elif [[ "$BATTERY_LEVEL" -le 50 ]] && [[ "$BATTERY_STATUS" == "Discharging" ]]; then
        curl -s -o /dev/null --max-time 10 -d "Asus 1 battery low" https://ntfy.saltyoldgeek.com/asus1
    fi     # Wait for 5 minutes (300 seconds) before checking again

    PREVIOUS_STATUS="$BATTERY_STATUS"

    sleep 300

done
```
