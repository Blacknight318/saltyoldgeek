---
title: "Setup RobotPy: A Step-by-Step Guide"
description: Guide to set up a RobotPy Dev Environment using Python's venv. Covers Python installation, Visual Studio Code & Roborio integration.
author: saltyoldgeek
date: 2023-04-05 12:45:00 -0500
categories: [Blogging]
tags: [Python Setup for RobotPy, RobotPy Virtual Environment, Python Installation Guide, 'robot.py Creation', Robotics Programming]
image:
  path: /assets/img/images/robotpy-venv.webp
  height: 630
  width: 1200
---


## 1. Install Python

- For Windows install from either the [Microsoft Store](https://apps.microsoft.com/detail/9pjpw5ldxlz5?hl=en-us&gl=US) or from [Python Site](https://www.python.org/downloads/windows/) directly
- MacOS should already have Python installed
- For Linux, you can install using your package manager
  - ie Ubuntu run

    ```shell
    sudo apt install python3 python3-pip
    ```

## 2. Create a project folder and setup Python venv(virtual environment)

- For Linux or Mac

    ```shell
    mkdir robotpy
    cd robotpy
    python3 -m venv robotpy
    source robotpy/bin/activate
    pip install --upgrade robotpy[all]
    ```

- For Windows

    ```cmd
    cd Documents
    mkdir robotpy
    python3 -m venv robotpy
    .\robotpy\Scripts\Activate.bat
    pip install --upgrade robotpy[all]
    ```

## 3. Create basic robot.py and test

- Download and install [Visual Studio Code](https://code.visualstudio.com/) for your platform
- Open the folder we created previously
- Create a new file called robot.py
- Paste in code from one of these [examples](https://github.com/robotpy/examples)

## 4. (Optional) Roborio Installer

- You can find documentation [here](https://robotpy.readthedocs.io/en/stable/install/packages.html#install-packages), this is the TLDR version, be sure you are connected to a powered-on Roborio via a USB cable

  ```shell
    pip install robotpy-installer
    python -m robotpy_installer download-python
    python -m robotpy_installer install-python
    python -m robotpy_installer download robotpy[commands2]
    python -m robotpy_installer install robotpy[commands2]
    ```

## 5. Test your code

- Before deploying your code to the Roborio it is always best to test using the command below

    ```shell
    python robot.py test
    ```

  - Now that you've proved out sytax errors it's time to simulate and see if it's doing what you want with the following command

  ```shell
    python robot.py sim
  ```

## Closing

This should help you get started with a Python virtual environment for robotpy, there is tons more documentation [here](https://robotpy.readthedocs.io/en/stable/index.html) to dive into, if you're looking for directions on how to update your RobotPy environment check out my post on [updating robotpy](https://www.saltyoldgeek.com/posts/robotpy-update/). If this post was helpful please consider supporting this blog by click the "Buy me a coffee" button below. Good luck and have fun coding!
