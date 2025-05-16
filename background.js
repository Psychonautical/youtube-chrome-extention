let countSeconds = 0;
let interval = null;
let notificationCountdownSeconds=600
let currentTabYoutube=false
let firstNotify=false
let notificationInterval=0
const NOTIFICATIONINTERVAL=300
let isResetInProgress=false
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];  // Format: YYYY-MM-DD
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const currentDate = getCurrentDate();
    if (request.action === "resetTimer") {
        isResetInProgress=true
        stopTimer()
        let saveData = {};
        saveData[currentDate] = 0;
        console.log(saveData)
        chrome.storage.local.set(saveData);
        console.log("resetTimer executed")
        isResetInProgress=false
        sendResponse({ result: "Function executed!" });
    }
});

function sendTimer(timerData){
    let totalSeconds = timerData ? Math.round(timerData / 1000) : 0;
    chrome.runtime.sendMessage({ action: "timer", count:totalSeconds }, (response) => {
                 console.log(response.result);
    });
}
let isPlayingReturn=false;
function isPlaying(){
    return_value=false
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length > 0 && tabs[0].audible) {
        console.log("isPlaying true")
        isPlayingReturn = true
    } else {
        console.log("isPlaying false")
        isPlayingReturn = false
    }
});
}

function startTimer() {
    const currentDate = getCurrentDate();
    console.log("startTimer function")

    // Retrieve stored data for the current day
    chrome.storage.local.get([currentDate, "dailyLimit"], (data) => {
        let elapsedTime = data[currentDate] ? data[currentDate] : 0;
        let dailyLimit = data.dailyLimit ? data.dailyLimit * 60000 : null; // Convert minutes to milliseconds

        if (interval == null) {
            interval = setInterval(() => {
            isPlaying()
            if (isPlayingReturn==true) {
                countSeconds=countSeconds+1
                const newElapsedTime = elapsedTime + (countSeconds*1000);
                sendTimer(newElapsedTime)
                let saveData = {};
                saveData[currentDate] = newElapsedTime;
                console.log(saveData)
                if (!isResetInProgress) {
                chrome.storage.local.set(saveData);
             }
            
          

            if (currentTabYoutube==true && firstNotify==false) {
                notificationInterval=0
                if (dailyLimit && newElapsedTime >= dailyLimit) {
                    firstNotify=true
                    console.log("notifications created")
                    console.log(`${newElapsedTime} >= ${dailyLimit}`)

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
            if (notificationInterval>NOTIFICATIONINTERVAL && firstNotify==true) {
                firstNotify=false
                notificationInterval=0
            }
            }
           
        }, 1000);
        }
       
    });
}



function stopTimer() {
    if (interval) {
        console.log("stopTimer")
        clearInterval(interval);
        interval = null;
    }

}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
        if (interval==null){
            console.log("startTimer")
            startTimer();
            currentTabYoutube=true;
        }           
    } else {
        console.log("stopTimer")
        stopTimer();
        currentTabYoutube=false;
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
            if (interval==null) startTimer();
            currentTabYoutube=true;
        } else {
            console.log("stopTimer")
            stopTimer();
            currentTabYoutube=false;
        }
    });
});
