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
      });
      console.log("✅ Video speed set to:", request.speed);
    };

    // In case YouTube or other platforms load video later
    setTimeout(trySetSpeed, 500); // wait a bit and try again
  }
});
