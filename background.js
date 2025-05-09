let startTime = null;
let interval = null;

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];  // Format: YYYY-MM-DD
}

function startTimer() {
    startTime = Date.now();
    const currentDate = getCurrentDate();

    // Retrieve stored data for the current day
    chrome.storage.local.get(currentDate, (data) => {
        let elapsedTime = data[currentDate] ? data[currentDate] : 0;

        interval = setInterval(() => {
            const newElapsedTime = elapsedTime + (Date.now() - startTime);
            let saveData = {};
            saveData[currentDate] = newElapsedTime;
            chrome.storage.local.set(saveData);
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
