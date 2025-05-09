document.getElementById("clickMe").addEventListener("click", function() {
    alert("Button clicked!");
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("youtubeTime", (data) => {
        const timeSpent = Math.round(data.youtubeTime / 1000)
        document.getElementById("timeDisplay").innerText = `Time Spent: ${timeSpent} seconds`;
    });
});