---
title: "Time Series Analysis of Plausible Data"
description: "Discover how to track and analyze your website’s performance using the Plausible Analytics API with Python, Pandas, and Plotly."
author: saltyoldgeek
date: 2024-05-20 14:22:00 -0500
categories: [Blogging]
tags: [analytics, plausible, python, data]
image:
  path: /assets/img/images/plausibe-data.webp
  height: 630
  width: 1200
---

## Purpose of the notebook

Early on with this blog I wanted a way to track its usage, just to see if anyone was reading it, and it needed to be GDPR compliant. Enter [Plausible Analytics](https://plausible.io), it was GDPR compliant without needing the cookie or consent banners. This is great for simple metrics, especially for a small blog or site. Now, after a year of usage, there are a few features that would be nice to have. As of this writing the bounce rate is calculated by how many users navigate to another page on the site, this is something I'll be working on and sending out an updated post on that. This post will go over using the Plausible API to perform some time series analysis on data from Plausible. this will focus on visitors and pageviews. Let's dive in.

## Prerequisites

To get things started let's set up a Python virtual environment and Jupyter Labs to work with our data. The following commands will do both.

```bash
mkdir plausible
cd plausible
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install --upgrade jupyterlab ipywidgets
```

## Libraries and Pulling Data

Now that we have a working environment we'll get the libraries installed that we'll need along with a function that pulls data from plausible into a dataframe we can use.

### Libraries

Below is the code for the libraries we're going to use in this project, keep in mind that these are all the libraries for the final project.

```python
import requests
import pandas as pd
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from statsmodels.tsa.seasonal import seasonal_decompose
```

We can install these libraries using pip with the following command.

```bash
pip install --upgrade pandas plotly statsmodels
```

### Pulling Data from Plausible

We'll want to set a few keys/variables up for use when pulling the data.

```python
site_id = "Your Plausible Site ID Here"
api_key = "Your Plausible API Key Here"
```

Now we'll want to pull data for our site from Plausible API, you'll want to go to Account Settings in Plausible and scroll down to API Keys, then generate a key to work with, we'll also want the Site ID which is the domain listed in the site settings. Ok, let's build this function.

```python
# Function to get Plausible Analytics timeseries data
def get_plausible_timeseries_data():
    # Calculate the date range for the last 90 days
    date_to = datetime.today().strftime('%Y-%m-%d')
    date_from = (datetime.today() - timedelta(days=90)).strftime('%Y-%m-%d')

    # Setting the metrics we want to look at
    metrics='visitors,pageviews'

    # Actually pulling the data we want
    url = f"https://plausible.io/api/v1/stats/timeseries?site_id={site_id}&period=custom&date={date_from},{date_to}&metrics={metrics}"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    # Putting the data into a dataframe we can use for analysis
    results = data['results']
    df = pd.DataFrame(results)

    # Adjusting the date field so we can avoid future warnings and be more accurate
    df['date'] = pd.to_datetime(df['date'])
    
    return df
```

## Data Analysis

Now that we have the data let's perform some analysis, looking for patterns/seasonality, and graph it out for easier consumption.

### Seasonal Decomposition

While building this tool I had considered using code from an earlier project that leveraged Prophet and/or Neuralprohet engines, but after putting the data through 2 different AIs (ChatGPT 4o and Gemini 1.5) to get a quick analysis, I ended up going with the same process that ChatGPT 4o used, seasonal decomposition. There was a bit of tweaking to do to the original code to get it to work in the environment we're going to use, and changing the plots to Plotly from Matplotlib for more interactive data. Here's the end result code for performing the analysis.

```python
# Function to perform seasonal decomposition
def plot_seasonal_decomposition(df, column, period=7):
    decomposition = seasonal_decompose(df[column], model='additive', period=period)
    
    fig = make_subplots(rows=4, cols=1, shared_xaxes=True, subplot_titles=('Observed', 'Trend', 'Seasonal', 'Residual'))

    fig.add_trace(go.Scatter(x=decomposition.observed.index, y=decomposition.observed, name='Observed'), row=1, col=1)
    fig.add_trace(go.Scatter(x=decomposition.trend.index, y=decomposition.trend, name='Trend'), row=2, col=1)
    fig.add_trace(go.Scatter(x=decomposition.seasonal.index, y=decomposition.seasonal, name='Seasonal'), row=3, col=1)
    fig.add_trace(go.Scatter(x=decomposition.resid.index, y=decomposition.resid, name='Residual'), row=4, col=1)
    
    fig.update_layout(
        height=800, 
        title_text=f'{column.capitalize()} - Seasonal Decomposition',
        template='plotly_dark'
    )
    fig.show()
```

### Plotting the data

Here's the Plotly code used, besides being interactive I was able to use a dark theme that doesn't hurt the eyes as much, which also took some tweaking, here's that code.

```python
# Function to plot day of the week trends
def plot_day_of_week_trends(df):
    df = df.reset_index() 
    df['day_of_week'] = df['date'].dt.day_name()
    day_of_week_stats = df.groupby('day_of_week').mean(numeric_only=True)[['pageviews', 'visitors']]
    days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    day_of_week_stats = day_of_week_stats.reindex(days_order)

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=day_of_week_stats.index, y=day_of_week_stats['pageviews'], mode='lines+markers', name='Pageviews'))
    fig.add_trace(go.Scatter(x=day_of_week_stats.index, y=day_of_week_stats['visitors'], mode='lines+markers', name='Visitors'))
    
    fig.update_layout(
        title='Average Pageviews and Visitors by Day of the Week', 
        xaxis_title='Day of the Week', 
        yaxis_title='Count',
        template='plotly_dark'
    )
    fig.show()
```

## Main Code and Running

Now we'll create a main function, this isn't strictly necessary but it's good practice especially if you might be using it as a class in the future. Let's take a look.

```python
# Main function to load data and perform analysis
def main():
    df = get_plausible_timeseries_data()
    df.set_index('date', inplace=True)

    # Seasonal decomposition for pageviews and visitors
    plot_seasonal_decomposition(df, 'pageviews')
    plot_seasonal_decomposition(df, 'visitors')

    # Day of week trends
    plot_day_of_week_trends(df)
```

We then run it with the following code snippet.

```python
if __name__ == "__main__":
    main()
```

### It Lives

Once you have the code in your notebook be sure that you run all the cells(if you have them split up) and you should get several graphs.

- Pageviews - Seasonal Decomposition
- Visitors - Seasonal Decomposition
- Average Pageviews and Visitors by Day of the Week

That last graph has been the most useful so far, giving me metrics by day of the week to find the best time to release new posts. In a future post, I hope to look into the script Plausible uses to collect metrics and see if we can add a check the timer and drop any that are on the page for more than 10 seconds from the bounce rate numbers(this is how Google Analytics and Posthog calculate bounce rate). That's a topic for another time. Till next time, fair winds and following seas.
