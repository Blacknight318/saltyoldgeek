---
title: "PowerShell & AD: Sysadmin Unlocking"
description: Explore a sysadmin's challenges with Active Directory and a transformative PowerShell script. Boost IT efficiency with Salty Old Geek.
author: saltyoldgeek
date: 2023-10-06 16:30:00 -0500
categories: [Blogging]
tags: [powershell, ad, active directory, account lock]
image:
  path: /assets/img/images/powershell-unlock.webp
  height: 630
  width: 1200
---

## Why Write This PowerShell Script?

### **The Setting:**

A little over 5 years ago, I found myself in a company that catered to IT and Copier support for diverse clientele, ranging from medium-sized businesses to towns and even hospitals. My role? I had graduated from the regular support floor to work as a sysadmin for our internal IT group.

### **The Challenge:**

Imagine a vast interconnected web of offices, each boasting its own Active Directory (AD) Domain Controller (DC). This sprawling network included a specialized DC for Exchange authentication and another for Radius. While managing such a network was challenging, the real time-suck emerged from an unexpected source: a handful of iPhone users.

It wasn’t that these users were causing a massive disruption; it was the persistent and repetitive nature of their issue. Every time they changed their passwords, they’d forget to update their Wi-Fi and mail app settings. This oversight led to repeated account lockouts. And because of the non-instantaneous propagation across the network of DCs, unlocking became a frustrating game of whack-a-mole. Our existing tool, a clunky VB (Visual Basic) application with a dated GUI, didn't help either. One had to manually unlock each DC — a tedious and mind-numbingly repetitive task.

### **The Turning Point:**

There had to be a better way. My journey with PowerShell was still in its early days, but I saw it as the key to ending this repetitive grind. The initial script I developed automated the unlock process for each DC, but it still felt sequential and slow.

The game-changer was when I incorporated the ability to run each unlock command as an individual process. This tweak cut down on waiting time, especially with the slower DCs. After iterations, debugging, and converting it into a module, the efficient solution I envisioned finally came to life.

### **Fast Forward to Today:**

Although my current role rarely exposes me to such challenges, I believe this script can be a lifesaver for those still wrestling with dispersed DCs. So, let’s dive into its intricacies.

## **Breaking Down the PowerShell Script for Unlocking Active Directory Accounts**

### **Repository Link:**

Before we begin, you can find the complete script on my GitHub repository for reference: [ADLockoutMulti.ps1 on GitHub](https://github.com/Blacknight318/PSScripts/blob/master/ADLockoutMulti.ps1).

### **1. The `Get-Lockout` Function:**

This function's main purpose is to retrieve a list of Active Directory lockouts.

```powershell
function Get-Lockout(){
    #Polling DC's for lockouts

    <#
    .Synopsis
        List Active Directory lockouts
    .Description
        This will pull a list of domain controllers and poll them for lockouts for the specified user.
    .Inputs
        Active Directory Username
    .Outputs
        List of servers, number of failed attempts, and lockout time. This also spits out an object for further use.
    .Link
        https://github.com/Blacknight318/PSScripts/blob/master/ADLockoutMulti.ps1
    #>

    [CmdletBinding()]
    param(    
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string]$User
    )
    $start = Get-Date
    $DomainControllers = Get-ADDomainController -Filter *
    
    <#
    The below function sets up the jobs to be cast and run by the main loop. 
    You could iterate Invoke-Command but this only works on servers with PSRemote connections allowed.
    #>
    $getLock = {
        Param(
            $userName,
            $serverName)
        
        $runup = Get-Date
        try {
            $lockup = Get-ADUser -Identity $userName -Server $serverName -Properties LockedOut,BadlogonCount,AccountLockoutTime -ErrorAction Stop
        }
        catch {
            $serverName = $serverName + " FAILED!!!"
        }
            $rundown = Get-Date
        $runTime = New-TimeSpan -Start $runup -End $rundown

        $writeItem = New-Object System.Object
                $writeItem | Add-Member NoteProperty -Name "Domain Controller" -Value $serverName
                $writeItem | Add-Member NoteProperty -Name "Bad Attempts" -Value $lockup.BadLogonCount
                $writeItem | Add-Member NoteProperty -Name "Lockout time" -Value $lockup.AccountLockoutTime
                $writeItem | Add-Member NoteProperty -Name "Locked Out" -Value $lockup.LockedOut
                $writeItem | Add-Member NoteProperty -Name "TTR" -Value $runTime
        $writeItem | Export-Csv -Append -Path "C:\temp\pslock.csv"
    }
    
    #Loading a blacklist text file of DC's to be skipped
    try {
        [string[]] $blist = Get-Content blistdc.txt -ErrorAction Stop
    }
    catch {}
    
    #The next If statement check is for expired passwords
    $expo = Get-ADUser -Identity $User -Properties PasswordExpired
    if($expo.PasswordExpired -eq $true){
        Write-Host "Password has expired for $user, press any key to continue." -ForegroundColor "Red"
        Read-Host
        #Read-Host -Prompt "$user has an expired password, press any key to continue" 
    }

    foreach ($DC in $DomainControllers){
        IF ($blist -contains $DC.Name) {continue} #Blacklist for readonly DR/DC
        $Server = $DC.Name
        Start-Job -ScriptBlock $getLock -ArgumentList @($User,$Server) | Out-Null
    }
    Get-Job | Wait-Job | Out-Null

    $lockOuts = Import-Csv -Path "C:\temp\pslock.csv" 
    #$lockOuts | Out-GridView
    $lockOuts | Format-Table
    $end = Get-Date
    $runtime = New-TimeSpan -Start $start -End $end
    Write-Host $runtime
    Get-Job | Remove-Job
    Remove-Item -Path "C:\temp\pslock.csv"
}
```

#### **Key Features:**

- **Domain Controllers Polling:** It fetches all available domain controllers using `Get-ADDomainController`.

- **Blacklist Mechanism:** By utilizing a blacklist (`blistdc.txt`), we can exclude specific domain controllers, especially handy for readonly or disaster recovery DCs.

- **Parallel Processing:** Instead of a linear approach, it uses `Start-Job` to initiate parallel checks on each DC. This expedites the whole process.

- **Password Expiry Check:** A unique touch to the function, it checks for expired passwords and informs the user.

### **2. The `Clear-Lockout` Function:**

This function is pivotal in actually clearing the account lockouts.

```powershell
Function Clear-Lockout{
    <#
    .Synopsis
        Clear Lockouts
    .Description
        Clear lockouts for a given user on all supplied Domain Controllers
    .Inputs
        Active Directory Username(required) and Domain Controllers(optional, if none supplied all available Domain Controllers will be cleared), also -Login to prompt for creds
    .Outputs
        Servers where lockouts were cleared
    .Link
        https://github.com/Blacknight318/PSScripts/blob/master/ADLockoutMulti.ps1
    #>

    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string]$User,

        [Parameter(Mandatory=$false)]
        [string[]]$Servers,

        [Parameter(Mandatory=$false)]
        [switch]$Login
    )
    
    if($Login -eq $true -and $creds -eq $null){
        $creds = Get-Credential
    }
    $start = Get-Date
    
    <#
    The below function sets up the jobs to be cast and run by the main loop. 
    You could iterate Invoke-Command but this only works on servers with PSRemote connections allowed.
    #>
    $unlock = {
        Param(
            $userName,
            $serverName,
            $creds)
        
        $runup = Get-Date
        try {
            if($creds -ne $null){
                Unlock-ADAccount -Identity $userName -Server $serverName -Credential $creds
            }
            else{
                Unlock-ADAccount -Identity $userName -Server $serverName
            }
        }
        catch {
            $serverName = $serverName + " FAILED!!!"
        }
        $rundown = Get-Date
        $runtime = New-TimeSpan -Start $runup -End $rundown
        $writeItem = New-Object System.Object
                $writeItem | Add-Member NoteProperty -Name "Domain Controller" -Value $serverName
                $writeItem | Add-Member NoteProperty -Name "TTR" -Value $runtime
        $writeItem | Export-Csv -Append -Path "C:\temp\clearedLocks.csv"
    }

    if($Servers -eq $null){
        $Servers = Get-ADDomainController -Filter *
    }
    
    try {
        [string[]] $blist = Get-Content blistdc.txt -ErrorAction Stop
    }
    catch {}

    foreach($Server in $Servers){
        IF ($blist -contains $Server.Name) {continue} #Blacklist for readonly DR/DC
        Start-Job -ScriptBlock $unlock -ArgumentList @($User, $Server, $creds) | Out-Null
        #Write-Host $Server " unlocked"
    }

    Get-Job | Wait-Job | Out-Null
    $end = Get-Date
    $runTime = New-TimeSpan -Start $start -End $end
    
    $cleared = Import-Csv -Path "C:\temp\clearedLocks.csv" 
    $cleared | Format-Table
    Write-Host $runTime
    #Invoke-Command -ComputerName $Servers -Credential $creds {Unlock-ADAccount -Identity $User -Credential $creds}
    Get-Job | Remove-Job
    Remove-Item -Path "C:\temp\clearedLocks.csv"
}
```

#### **Key Features:**

- **Flexible Input:** It can work with a specific list of servers or, by default, all domain controllers.

- **Optional Credential Prompt:** By using the `-Login` switch, it can prompt for credentials before proceeding.

- **Parallel Unlocking:** Similar to `Get-Lockout`, it employs `Start-Job` for parallel unlocks.

- **Blacklist Utilization:** The same blacklist (`blistdc.txt`) from `Get-Lockout` is used to skip unwanted DCs.

---

## **Wrapping Up:**

This PowerShell script stands as a testament to the power of automation and parallel processing. By leveraging these strengths, we've transformed a tedious, cyclical task into a streamlined, efficient process. Whether you're facing a similar issue or just looking to deepen your PowerShell knowledge, I hope this walk-through sheds some light on the potentials of scripting in IT administration.
