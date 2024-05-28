---
title: Easy RobotPy Setup with Miniconda
description: Learn to set up a RobotPy development environment with Miniconda. This guide offers step-by-step instructions for installation, activation, and code testing.
author: saltyoldgeek
date: 2023-03-07 15:30:00 -0500
categories: [Blogging]
tags: [RobotPy Development Setup, Miniconda Installation, RobotPy Simulation, Python Robotics Environment, RobotPy Programming Guide]
image:
  path: /assets/img/images/robotpy-conda.webp
  height: 630
  width: 1200
---

## Intro

In this post, we'll look at setting up a development environment for RobotPy using Miniconda. You should follow the directions below and have a basic working RobotPy dev setup with minimal effort. Let's get started.

1. Download and install Miniconda from [this page](https://docs.conda.io/en/latest/miniconda.html).
2. Open a terminal with the cmd command
3. Create an environment with Miniconda

    ```powershell
    conda create --name robotpy python=3.9
    ```

4. Activate the environment

    ```powershell
    conda activate robotpy
    ```

5. Install the robotpy libraries and dependencies

    ```powershell
    pip install --upgrade robotpy[all]
    ```

6. Create a folder for your source code
7. Create a test file in the folder and copy in one code from one of the example files [here](https://github.com/robotpy/examples)
8. Test the code

    ```powershell
    python robot.py test
    ```

9. Run a simulation with the code

    ```powershell
    python robot.py sim
    ```

## Closing the loop

If you followed the steps above you should now have a working dev environment ready to use when writing and debugging your RobotPy code.
For tools for writing the code, I would recommend starting with [Visual Studio Code](https://code.visualstudio.com/), if you're looking for directions on how to update your RobotPy environment check out my post on [updating robotpy](https://www.saltyoldgeek.com/posts/robotpy-update/). If this post was helpful please consider supporting this blog by click the "Buy me a coffee" button below. Have fun and watch for more as the FRC season continues, till then fair winds and following seas.
