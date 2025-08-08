document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("speedInput");
  const button = document.querySelector("button");

  // Load stored speed
  chrome.storage.local.get(["preferredSpeed"], (res) => {
    if (res.preferredSpeed) {
      input.value = res.preferredSpeed;
    }
  });

  // On click, store and send speed to tab
  button.addEventListener("click", () => {
    const speed = parseFloat(input.value);
    if (isNaN(speed) || speed < 0.1 || speed > 10) {
      alert("Please enter a valid speed (0.1 to 10)");
      return;
    }

    chrome.storage.local.set({ preferredSpeed: speed });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (s) => {
          const videos = document.querySelectorAll("video");
          videos.forEach(v => v.playbackRate = s);
        },
        args: [speed]
      });
    });
    // alert(`✅ Speed set to ${speed}x and saved as preferred`);
  });
});


    
  