

document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date().toISOString().split('T')[0];  // YYYY-MM-DD
    const limitInput = document.getElementById("limitInput");
    const setLimitButton = document.getElementById("setLimit");


    // Load saved limit when the popup opens
    chrome.storage.local.get("dailyLimit", (data) => {
        if (data.dailyLimit) {
            limitInput.value = data.dailyLimit; // Set the saved limit
        }
    });

    setLimitButton.addEventListener("click", () => {
        const limitValue = parseInt(limitInput.value);
        if (limitValue > 0) {
            chrome.storage.local.set({ dailyLimit: limitValue });
            alert("Limit saved!");
        } else {
            alert("Please enter a valid limit.");
        }
    });




     chrome.storage.local.get([currentDate, "dailyLimit"], (data) => {
            let totalSeconds = data[currentDate] ? Math.round(data[currentDate] / 1000) : 0;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            timeDisplay.innerText = `YouTube Time (${currentDate}): ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // if (data.dailyLimit && minutes >= data.dailyLimit) {
            //     alert("You've exceeded your daily YouTube limit!");
            // }
        });
});

