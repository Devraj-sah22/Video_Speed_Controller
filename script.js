document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button");

  button.addEventListener("click", () => {
    const speedInput = document.getElementById("speedInput").value;
    const speed = parseFloat(speedInput);

    if (isNaN(speed) || speed < 0.1 || speed > 10) {
      alert("❌ Please enter a valid speed between 0.1 and 10.");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "SET_SPEED",
        speed: speed
      });
    });

    alert(`✅ Requested to set speed to ${speed}x`);
  });
});
