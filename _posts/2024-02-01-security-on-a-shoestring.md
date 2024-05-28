---
title: "Software Hardening Tools for System Defense"
description: "Explore essential tools for software hardening to secure your system. Learn the setup for Aurora Agent Lite, Sysmon, and more to defend against threats."
author: saltyoldgeek
date: 2024-02-01 16:00:00 -0500
categories: [Blogging]
tags: [Software Hardening Tools, System Security Enhancement, Cybersecurity Best Practices, Malware Prevention Techniques, Computer Forensics Tools
]
image:
  path: /assets/img/images/aurora-security.webp
  height: 630
  width: 1200
---

## Security on a Shoestring

If you like me and work for a small shop or a local municipality then the following tools might be up your alley. This post is geared toward trying to build some security on little or no budget, and primarly for PCs. Let's dive in.

## System hardening

- [Aurora Agent Lite](https://www.nextron-systems.com/aurora/)
  - You'll need to unzip the agent folder and copy the license file to that folder
  - Open a cmd prompt and cd to the aurora directory
  - run the following ```aurora.exe --install```
- [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
  - [Swift on Security Rules](https://github.com/SwiftOnSecurity/sysmon-config)
  - Download and create a sysmon folder on the root of C:\
  - Run the following commands

```powershell
cd c:\sysmon
git clone https://github.com/SwiftOnSecurity/sysmon-config
sysmon -accepteula -i sysmon-config/sysmon-config.xml
```

- [ESET Online Scanner](https://www.eset.com/us/home/online-scanner/)
  - Run executable
  - Uncheck feedback and stats
  - Check enable advanced detection
  - Run quick scan(unless compromised then run full)
  - Click yes to periodic scanning
  - Skip office and install, close without feedback
- [Pulseway Agent](https://www.pulseway.com/downloads)(or really any RMM)
  - If not our agent from our dashboard be sure to login and register the device
  - Our server is sasd.pulseway.com
- [0patch Agent](https://dist.0patch.com/download/latestagent)
  - Install and login to the agent with your credentials as a free tier

## Why do I use these tools, and what do I use them for?

### Aurora Agent Lite

Aurora Agent Lite is a free tool that performs SIGMA Rule checks on the system, effectively looking for IoCs (Indicators of Compromise). These can be accessed by running the Aurora Lite Dashboard ```aurora.exe --dashboard``` or by looking in Eventviewer under Application and filtering on aurora for the source. This is more geared towards forensics to see what and how a suspect application was running and who or what it might have been talking to.

### Sysmon with Swift on Security Rules

Sysmon has been around for a while and can generate a lot of data(noisy and valuable) in the event logs under Microsoft Apps ==> Windows ==> sysmon ==> operational. Using the Swift on Security config helps squelch out some of the noise. Much like Aurora, this is more a forensics tool, also like Aurora, having it installed before something happens can give you or an investigator more information on what's happening in the background of your machine.

### ESET Online Scanner

On a new installation, this is more setting up the tool for potential use, the periodic scans are more what we're after as well as having an independent scan if we suspect a potential infection. Having a periodic scan is also nice for catching any potentially unwanted or malicious apps that are running without a specific incident for us to initiate one.

### Pulseway Agent

This could be any RMM, it's just the one I prefer to use, its niche is smb(small to medium business). If you have more machines than you can count on one hand then an RMM is a must.

### 0Patch Agent

There are a few tiers for 0patch, if you're on a shoestring budget the free tier still offers some benefits. This agent will inject micro-patches into memory at the runtime of a compromised application. On the free version, you'll get patches to vulnerabilities until the vendor patches them, then the onus is on you to keep that software or OS up to date.

## Wrapping up

If you're like me and working with a small budget, team, and handful of PCs these tools will help harden your systems just that little bit more, and hopefully cut down time and worry about your machine's security.  If you found this helpful please consider buying me a coffee by clicking the button below. Till next time fair winds and following seas.
