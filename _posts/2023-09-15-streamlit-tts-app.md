---
title: Web-based Text-to-Speech with Coqui TTS
description: Learn to build a web-based Text-to-Speech app using Coqui TTS and Streamlit. A simple solution for screen fatigue or visual issues.
author: saltyoldgeek
date: 2023-09-15 10:30:00 -0500
categories: [Blogging]
tags: [Coqui TTS, Streamlit, Python, Accessibility, Visual Impairment]
image:
  path: /assets/img/images/coqui-tts.webp
  height: 630
  width: 1200
---


Having spent years in either IT or Electronics R&D and Repair my eyes are starting to have trouble focusing on fine detail, and being most of my work is now on screen it's had me looking at ways to alleviate that without super expensive computer glasses, for now. Here's one of my little pet projects, a web-based text-to-speech app using Coqui TTS libraries for Python and Streamlit. Let's dive in.

## Development environment setup

Let's get started with a basic python venv.

```bash
cd ~
mkdir coqui-tts
cd coqui-tts
python3 -m venv venv
source venv/bin/activate
```

## The code

```python
import torch
import streamlit as st
from TTS.api import TTS
import tempfile
import os


device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = 'tts_models/en/jenny/jenny'
tts = TTS(model_name).to(device)

st.title('Coqui TTS')

text_to_speak = st.text_area('Entire article text here:', '')


if st.button('Listen'):
    if text_to_speak:

        # temp path needed for audio to listen to
        temp_audio_path = './temp_audio.wav'

        tts.tts_to_file(text=text_to_speak, file_path=temp_audio_path)


        st.audio(temp_audio_path, format='audio/wav')


        os.unlink(temp_audio_path)

```

## Breaking down the code

The imports are pretty straightforward, torch is needed to determine the device type to best process the tts engine.

```python
import torch
import streamlit as st
from TTS.api import TTS
import tempfile
import os
```

This next section is all the setup for the tts engine processing object itself. Here torch is testing for cuda cores to process over standard cpu. For the models you could choose from a whole list, I'll post below how to find them, the one in the code just happens to be my favorite.

```python
device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = 'tts_models/en/jenny/jenny'
tts = TTS(model_name).to(device)
```

Now we have a few items to set up the streamlit webui, right now we'll want a title and text entry box.

```python
st.title('Coqui TTS')

text_to_speak = st.text_area('Entire article text here:', '')
```

Now for the main block of the program. Here a few operations are going on when the 'Listen' button is clicked, and if there is text in the text box from earlier, then the text is sent to our tts instance. From there the most stable way I found was to have the tts command output the audio to a temporary file until it is loaded up for playback on the site. Then we use the unlink command to clean up the temp files, both for efficiency and good hygiene as for security server side.

```python
if st.button('Listen'):
    if text_to_speak:

        # temp path needed for audio to listen to
        temp_audio_path = './temp_audio.wav'

        tts.tts_to_file(text=text_to_speak, file_path=temp_audio_path)


        st.audio(temp_audio_path, format='audio/wav')


        os.unlink(temp_audio_path)
```

Now that the code is out of the way here's how we run the app.

```bash
streamlit run main.py
```
