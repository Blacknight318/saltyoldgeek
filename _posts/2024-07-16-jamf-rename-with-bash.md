---
title: "Rename macOS Devices with JAMF API Tokens"
description: "Learn to rename iMacs, Mac Minis, and MacBooks using JAMF API tokens. Follow this guide for efficient device management in educational settings."
author: saltyoldgeek
date: 2024-07-16 13:05:00 -0500
categories: [Blogging]
tags: []
image:
  path: /assets/img/images/jamf-rename-api.webp
  height: 630
  width: 1200
---


## What is this tool and who is it for?

About 2 years ago the school I work for used a script they found, on JAMF Forums or StackOverflow probably, to rename static iMacs, Mac Minis, and MacBooks, through pre-stage enrollment using the serial number to lookup the barcode1 field with JAMF API. This worked slick, for a while.

Not giving it a thought we used the same script to prep machines this summer for a new lab rollout, at first it ran intermittently then not at all. Reaching out to JAMF support they sent me a couple of relevant posts on the forum showing how to get and use authentication tokens. After copying their script to request a token and modifying the script to use said token all was working again, for a bit. See the repeating theme?

Doing some more digging I found that the tokens were good for no more than 30 minutes, I'm struggling to understand why JAMF picked that time limit, by the way, to get the tokens you have to perform an API call using the username and password which is the only call you can make with them. Great! Time to add that in, which seems to defeat the intended purpose of security to me, just my opinion.

Below is the script I eventually came up with using the JAMF API documentation, scripting experience, and some help from AI to write the script. The $4, $5, and $6 variables refer to fields in the options section of your script in JAMF.

```bash
#!/bin/sh

jamfProURL=$4
user=$5
pass=$6

# request auth token
authToken=$(/usr/bin/curl --request POST --silent --url "$jamfProURL/api/v1/auth/token" --user "$user:$pass")

# parse auth token
token=$( /usr/bin/plutil \
-extract token raw - <<< "$authToken" )

# Pull serial number from system_profiler
serial=$(system_profiler SPHardwareDataType | awk '/Serial/ {print $4}')
if [ -z "$serial" ]; then
    echo "Failed to retrieve serial number"
    exit 1
fi
echo "Serial number: $serial"

# Pull computer name from Jamf Pro
response=$(curl --header "accept: text/xml" --silent --request GET --url "$jamfProURL/JSSResource/computers/serialnumber/${serial}/subset/general" --header "Authorization: Bearer $token")
if [ -z "$response" ]; then
    echo "Empty response from API"
    exit 1
fi

# Extracting the first barcode
barcode1=$(echo $response | /usr/bin/awk -F'<barcode_1>|</barcode_1>' '{print $2}')
if [ -z "$barcode1" ]; then
    echo "Failed to extract barcode_1"
    exit 1
fi
echo "Barcode 1 is: $barcode1"

# Setting computername
echo "Setting computer name..."
scutil --set ComputerName "$barcode1"
scutil --set HostName "$barcode1"
scutil --set LocalHostName "$barcode1"

echo "Computer name set successfully"

# expire auth token
/usr/bin/curl \
--header "Authorization: Bearer $token" \
--request POST \
--silent \
--url "$jamfProURL/api/v1/auth/invalidate-token"

# Perform JAMF Recon
sudo /usr/local/jamf/bin/jamf recon -verbose

exit 0
```

That's it, a quick script to request the auth token, pull the serial number and check it against JAMF API, parse out the barcode1 field from the return, and rename the machine. The jamf recon at the end ensures it's updated on JAMF as well.

Hopefully, you found this helpful(especially with deployments through JAMF). If so consider sharing this post and supporting the blog through [Buymeacoffee](https://www.buymeacoffee.com/twitter2), or by liking or clapping if you're reading this from one of the cross-posting sites. Till next time, fair winds and following seas.
