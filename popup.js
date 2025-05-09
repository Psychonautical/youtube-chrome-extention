document.getElementById("clickMe").addEventListener("click", function() {
    alert("Button clicked!");
});


document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date().toISOString().split('T')[0];  // YYYY-MM-DD

    chrome.storage.local.get(currentDate, (data) => {
        let totalSeconds = data[currentDate] ? Math.round(data[currentDate] / 1000) : 0;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        document.getElementById("timeDisplay").innerText =
            `YouTube Time (${currentDate}): ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });
});

