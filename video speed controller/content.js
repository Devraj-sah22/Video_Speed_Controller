// Utility: Show floating speed change indicator
function showSpeedChange(speed) {
  let message = document.createElement("div");
  message.className = "video-speed-popup";
  message.textContent = `🎬 Speed: ${speed.toFixed(2)}x`;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.opacity = "0";
    setTimeout(() => message.remove(), 600);
  }, 1000);
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SET_SPEED") {
    const trySetSpeed = () => {
      const videos = document.querySelectorAll("video");
      if (videos.length === 0) {
        console.log("⚠️ No video elements found.");
        return;
      }
      videos.forEach(video => {
        video.playbackRate = request.speed;
        showSpeedChange(video.playbackRate);
      });
      console.log("✅ Video speed set to:", request.speed);
    };

    setTimeout(trySetSpeed, 500);
  }
});

// 🔥 Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (!e.shiftKey) return;

  const videos = document.querySelectorAll("video");
  if (videos.length === 0) return;

  videos.forEach(video => {
    let currentSpeed = video.playbackRate;

    if (e.key === "{") {
      currentSpeed = Math.min(currentSpeed + 0.25, 10);
      video.playbackRate = currentSpeed;
      showSpeedChange(currentSpeed);
      console.log("⏩ Increased speed to", currentSpeed);
    }

    if (e.key === "}") {
      currentSpeed = Math.max(currentSpeed - 0.25, 0.1);
      video.playbackRate = currentSpeed;
      showSpeedChange(currentSpeed);
      console.log("⏪ Decreased speed to", currentSpeed);
    }
  });
});

// Inject style for speed popup
const style = document.createElement("style");
style.textContent = `
.video-speed-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 15px 30px;
  border-radius: 15px;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.3);
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.5s ease;
}`;
document.head.appendChild(style);

// Show speed popup
function showSpeedChange(speed) {
  const el = document.createElement("div");
  el.className = "video-speed-popup";
  el.textContent = `🎬 Speed: ${speed.toFixed(2)}x`;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 500);
  }, 1000);
}

// Apply speed to all videos
function applySpeedToVideos(speed) {
  const videos = document.querySelectorAll("video");
  videos.forEach(v => v.playbackRate = speed);
  if (videos.length) {
    showSpeedChange(speed);
  }
}

// Load saved speed and set it
let savedSpeed = null;
chrome.storage.local.get(["preferredSpeed"], (res) => {
  if (res.preferredSpeed) {
    savedSpeed = res.preferredSpeed;
    applySpeedToVideos(savedSpeed);
  }
});

// Observe only video elements being added
const observer = new MutationObserver((mutations) => {
  let videoAdded = false;
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.tagName === "VIDEO" || (node.querySelector && node.querySelector("video"))) {
        videoAdded = true;
      }
    }
  }
  if (videoAdded && savedSpeed !== null) {
    applySpeedToVideos(savedSpeed);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Keyboard shortcuts for +/- 0.25x
document.addEventListener("keydown", (e) => {
  if (!e.shiftKey) return;

  const videos = document.querySelectorAll("video");
  if (!videos.length) return;

  videos.forEach(video => {
    let rate = video.playbackRate;

    if (e.key === "{") {
      rate = Math.min(rate + 0.25, 10);
    } else if (e.key === "}") {
      rate = Math.max(rate - 0.25, 0.1);
    } else {
      return;
    }

    video.playbackRate = rate;
    savedSpeed = rate; // update local variable
    showSpeedChange(rate);

    chrome.storage.local.set({ preferredSpeed: rate }, () => {
      console.log(`💾 Saved speed: ${rate}x`);
    });
  });
});
