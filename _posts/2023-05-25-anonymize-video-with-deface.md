---
title: Anonymizing Videos with Deface & Streamlit
description: Master video anonymization using Deface and Streamlit in Python. Get a hands-on guide to blurring faces in videos, including setup and code examples.
author: saltyoldgeek
date: 2023-05-25 15:51:00 -0500
categories: [Blogging]
tags: [Video Anonymization, Deface Python, Streamlit GUI, ONNX Runtime, Facial Blurring]
image:
  path: /assets/img/images/deface-post.webp
  height: 630
  width: 1200
---

*--- Updated 2023-05-26@11:50cst with revised code ---*

*--- Updated 2023-05-26@1200cst with revised setup instructions ---*

I was recently turned on to a Python module called [deface](https://github.com/ORB-HD/deface). After a little tweaking to get the Python environment and my Ubuntu environment(install libgl1-mesa) it was able to run through a video and successfully blurred the faces in a test video(Matrix training scened, lots of faces). That worked slick, if just a little slow on my setup, but it got me thinking. Most IT folks, or people that process FOIA requests, are reluctant and intimidated by the CLI(command line Interface), so I set out to build a GUI that would help with that.

## Building the UI

The UI needed to be simple, allow for uploading and downloading, display both the original and processed video for comparison, and be hostable in the event more horsepower was needed. Streamlit was my UI of choice, you can create a web interface using only Python code, and it's pretty slim at that. We'll go through the setup of your environment to run things first then the code.

## Setting things up

This assumes, for now, that you're either on a Windows machine running WSL or a Linux box(Ubuntu for this example). To setup run the series of commands in the CLI below

```bash
git clone https://github.com/Blacknight318/deface_streamlit_frontend.git
cd deface_streamlit_frontend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

If you get a libgl error, and are not using discrete graphics, run the following command

```bash
sudo apt install libgl1-mesa-glx
```

## The code

Below is the code along with instructions on how to run it past into a new file in the directory called app.py, or pull from my [Github repo](https://github.com/Blacknight318/deface_streamlit_frontend)

```python
import streamlit as st
import subprocess
import tempfile
import os


def main():
    st.title("Anonymizing Video Files")
    st.write("Blur faces in video files for anonymity.")
    
    # File selection
    video_file = st.file_uploader("Upload a video file", type=["mp4", "mov"])
    
    # Display video if a file is selected
    if video_file is not None:
        st.video(video_file)
        
        # Save uploaded file to temporary location
        temp_dir = tempfile.TemporaryDirectory()
        temp_file_path = os.path.join(temp_dir.name, video_file.name)
        with open(temp_file_path, "wb") as f:
            f.write(video_file.read())
           
        # Adding options to retain audio and set threshold for more customized processing
        add_option = st.checkbox("Add --keep-audio option")

        # Adding slider from 0.01 to 0.99 for threshold adjustment
        threshold = st.slider("Adjust threshold(default 0.2)", min_value=0.01, max_value=0.99, value=0.2, step=0.01)

        # Run deface CLI program
        if st.button("Run deface"):
            output_file = "defaced_video.mp4"
            command = ["deface", temp_file_path, "-o", output_file]
            if add_option:
                command.append("--keep-audio")
            
            if threshold != 0.2:
                command.extend(["-t", str(threshold)])
            
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()
            
            if process.returncode == 0:
                st.success("Deface process completed successfully!")
                st.video(output_file)
                
                # Download code
                with open('defaced_video.mp4', 'rb') as f:
                    st.download_button('Download MP4', f, file_name='defaced_video.mp4')
                    os.remove(output_file)
            else:
                st.error("Deface process failed. Error message:")
                st.code(stderr.decode("utf-8"))
        
        # Cleanup temporary directory
        temp_dir.cleanup()


if __name__ == "__main__":
    main()
```

And to run you'll do the following.

```bash
streamlit run app.py
```

If all went well you should see a screen showing 1 or more IP addresses with a port, something like ```http://192.168.0.57:8501```
Just head to that address and follow the prompts on the screen.

Have fun and until next time, fair winds and following seas.
