let startTime = null;
let elapsedTime = 0;
let interval = null;

function startTimer() {
    startTime = Date.now();
    
    // Retrieve stored time so we continue from where we left off
    chrome.storage.local.get("youtubeTime", (data) => {
        elapsedTime = data.youtubeTime ? data.youtubeTime : 0;

        interval = setInterval(() => {
            const newElapsedTime = elapsedTime + (Date.now() - startTime);
            chrome.storage.local.set({ youtubeTime: newElapsedTime });
        }, 1000);
    });
}

function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
        if (!interval) startTimer();
    } else {
        stopTimer();
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
            if (!interval) startTimer();
        } else {
            stopTimer();
        }
    });
});
