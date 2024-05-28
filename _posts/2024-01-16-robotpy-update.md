---
title: "RobotPy Update Guide for FRC 2024"
description: "Navigate FRC 2024 with our quick RobotPy update guide. Learn to update RoboRIO firmware and RobotPy efficiently, perfect for Python robotics enthusiasts!"
author: saltyoldgeek
date: 2024-01-16 11:00:00 -0500
categories: [Blogging]
tags: [RobotPy, FRC 2024, Python Robotics, RoboRIO Firmware Update, FRC Python Programming]
image:
  path: /assets/img/images/robotpy-update.webp
  height: 630
  width: 1200
---

## Intro

Another FRC(First Robotic Competition) season is upon us. This year FRC and WPILIB now officially support Python! With that, there are a few things you'll want to do if you're you're planning on using Python and RobotPy. If you haven't already been using RobotPy check out my posts on setting up RobotPy with [Miniconda](https://www.saltyoldgeek.com/posts/robotpy-dev-env/), or Python [venv](https://www.saltyoldgeek.com/posts/robotpy-venv-setup/). Let's get into it!

## Prerequisites

Before we can think about updating RobotPy we need to update the RoboRIO firmware first. Following the [official directions](https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-3/imaging-your-roborio.html) you'll want to make sure you have the latest LabView Driver Station installed, connect up either over wifi, or what I prefer USB, and make sure to update or format the RoboRIO with the latest version. Now that that's out of the way let's update PyFRC and RobotPy.

## RobotPy Updates

### Update RobotPy PC Install

First let's activate our environment, open a command line, and cd into the directory where last year's code resides, then run one of the two following commands depending on which Python environment you're using(Miniconda or Venv).

```bash
conda activate robotpy
```

or

```bash
.\venv\Scripts\activate.bat
```

Now we should be able to update our current RobotPy with the following commands(not this is only for the environment and not the robot.py and associated files).

```bash
pip install --upgrade pip
pip install --upgrade robotpy
```

### RobotPy on RoboRIO

With the official inclusion of RobotPy by FIRST and integration with WPILib here is how you update RobotPy for both your project and on the RoboRIO(Thank you to megarubber and virtuald over on [chiefdelphi](https://www.chiefdelphi.com/t/updating-robotpy/450477)). You can also find the [updated documentation here](https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-2/python-setup.html).

```bash
python -m robotpy init
python -m robotpy sync
```

### Testing

Before we close this post out it's a good idea to test our code to make sure it's compatible with the latest RobotPy version. To do that run the following command, if you have no errors you're good to go!

```bash
python -m robotpy test
```

## We're Done

If all of the above worked then we're ready to code our robot with RobotPy and Python. If you found this post helpful please consider hitting the "Buy me a coffee" button below and supporting this blog. Till next time fair winds and following seas.
