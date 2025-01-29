!(function () {
  'use strict';

  const endpoint = '/api/event'; // Plausible API endpoint
  const domain = document.currentScript.getAttribute('data-domain');

  /**
   * Detect Honey Extension
   * Checks for Honey-specific DOM elements or global variables.
   */
  function detectHoneyExtension() {
    // Detect Honey by searching for injected DOM elements or global variables
    const honeyElement = document.querySelector(
      "[class^='__honey-'], [id^='__honey-']"
    );
    const honeyGlobal =
      window.__honeyChromeExtension || window.__honeyFirefoxExtension;
    return !!honeyElement || !!honeyGlobal;
  }

  /**
   * Send Detection Result to Plausible
   * Sends the Honey detection result as a custom event.
   */
  function sendHoneyDetectionEvent(isHoneyInstalled) {
    const payload = {
      n: 'honey_detection', // Event name
      u: window.location.href, // Current page URL
      d: domain, // Domain from script attribute
      props: {
        honey_installed: isHoneyInstalled ? 'yes' : 'no' // Custom property
      }
    };

    // Send the detection event
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(JSON.stringify(payload));
  }

  /**
   * Initialize Honey Detection Script
   */
  function init() {
    if (!domain) {
      console.error('Domain attribute is required for Honey detection script.');
      return;
    }

    // Detect Honey and send event
    const isHoneyInstalled = detectHoneyExtension();
    sendHoneyDetectionEvent(isHoneyInstalled);
  }

  // Run the script
  init();
})();
