---
title: "Fixing JAMF Renaming Script Issues"
description: "JAMF renaming script not working? Fix field name changes, password issues, and intermittent execution. Get your script running smoothly again."
author: saltyoldgeek
date: 2024-08-12 18:35:00 -0500
categories: [Blogging]
tags: [apple, jamf, bash, api, macos]
image:
  path: /assets/img/images/fix-the-script.webp
  height: 630
  width: 1200
---

## Recap

In a [previous post](https://www.saltyoldgeek.com/posts/jamf-rename-with-bash/) I wrote about creating a script to rename a Mac using the barcode1 field within JAMF. Since then we've done a few deployments and noticed a few tweaks/changes in JAMF. This post will go over what's new.

## Users and Passwords

This came to me from another JAMF Pro user, at some point, JAMF had changed the minimum password length and disabled any accounts that didn't meet this requirement. We also decided to add read access API Integrations and API Roles. This wasn't a huge deal, but it did make troubleshooting the next issue more of a challenge.

## Field Names and Variables

In the script we created, it calls fillable fields from JAMF, we used $4, $5, and $6. At some point it seems the field names in the script changed to variable names, this left the field names as $user instead of $5, etc. This was under Settings > Scripts > Options, after clearing the Parameters to default we can then change the fields under the Policies> Options > Scripts itself. With those out of the way, we should now be able to run the script.

## Order of Operations

The last issue to tackle was a little trickier. We were seeing intermittent execution and completion of the script, we ruled out network issues and Prestage Enrollments. We finally narrowed it down to the script's priority within the policy. We changed it from after to before resolving the intermittent execution issue.

## Wrapup

Correcting the Parameters fields, ensuring account permissions and passwords meet requirements, cleared up those issue. This is a good reminder to subscribe and read the [Release Notes/Changelogs](https://learn.jamf.com/en-US/bundle/jamf-pro-release-notes-current/page/New_Features_and_Enhancements.html).

If you found this article helpful consider [buying me a coffee](https://buymeacoffee.com/twitter2). Till next time, fair winds and following seas.
