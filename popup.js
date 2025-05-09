function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];  // Format: YYYY-MM-DD
}

document.addEventListener("DOMContentLoaded", () => {
    const currentDate = getCurrentDate();  // YYYY-MM-DD
    const limitInput = document.getElementById("limitInput");
    const setLimitButton = document.getElementById("setLimit");
    const resetCounterButton = document.getElementById("resetCounter");


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

     resetCounterButton.addEventListener("click", () => {
       if (confirm("Are you sure you want to proceed?")) {
            chrome.runtime.sendMessage({ action: "resetTimer" }, (response) => {
                 console.log(response.result);
            });
            console.log("User confirmed!");

        } else {
            console.log("User canceled!");
        }
    });




     chrome.storage.local.get([currentDate, "dailyLimit"], (data) => {
            let totalSeconds = data[currentDate] ? Math.round(data[currentDate] / 1000) : 0;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            timeDisplay.innerText = `YouTube Time (${currentDate}): ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        });
});

