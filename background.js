let startTime = null;
let interval = null;
let notificationCountdownSeconds=600
let currentTabYoutube=false
let firstNotify=false
let notificationInterval=0
const NOTIFICATIONINTERVAL=300
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];  // Format: YYYY-MM-DD
}

function startTimer() {
    startTime = Date.now();
    const currentDate = getCurrentDate();

    // Retrieve stored data for the current day
    chrome.storage.local.get([currentDate, "dailyLimit"], (data) => {
        let elapsedTime = data[currentDate] ? data[currentDate] : 0;
        let dailyLimit = data.dailyLimit ? data.dailyLimit * 60000 : null; // Convert minutes to milliseconds
        interval = setInterval(() => {
            const newElapsedTime = elapsedTime + (Date.now() - startTime);
            let saveData = {};
            saveData[currentDate] = newElapsedTime;
            chrome.storage.local.set(saveData);

            if (currentTabYoutube==true && firstNotify==false) {
                firstNotify=true
                notificationInterval=0
                if (dailyLimit && newElapsedTime >= dailyLimit) {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon.png", // Use your extension icon
                    title: "YouTube Limit Reached!",
                    message: "You've hit your daily YouTube watch limit!",
                    silent: false
                });
            }
            }
           
            notificationInterval+=1
            if (notificationInterval==NOTIFICATIONINTERVAL && firstNotify==true) {
                firstNotify=false
                notificationInterval=0
            }
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
        currentTabYoutube=true;
    } else {
        stopTimer();
        currentTabYoutube=false;
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
            if (!interval) startTimer();
            currentTabYoutube=true;
        } else {
            stopTimer();
            currentTabYoutube=false;
        }
    });
});
