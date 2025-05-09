let startTime = null;
let elapsedTime = 0;
let interval = null;

function startTimer() {
    startTime = Date.now();
    interval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        chrome.storage.local.set({ youtubeTime: elapsedTime });
    }, 1000);
}

function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        chrome.storage.local.set({ youtubeTime: elapsedTime });
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
