document.addEventListener("DOMContentLoaded", function() {
    const dateOutput = document.getElementById("date");
    const timeOutput = document.getElementById("time");
    const countdownDisplay = document.getElementById("countdown-display");
    const countdown = document.getElementById("countdown");
    let countdownFinished = false;  // Flag to prevent further updates when countdown ends

    const updateJsonData = function(data) {
        if (!data) {
            console.error('Error updating JSON data: Data is undefined');
            return;
        }

        const siteStatus = document.getElementById("json-data");
        const lovense = document.getElementById("app");
        const brb = document.querySelector(".centered-text");
        const bigTextElement = document.querySelector(".big-text");
        const progressBar = document.querySelector(".progress-bar");
        const superbowl = document.querySelector(".superbowl");
        const timer = document.querySelector(".timer");

        try {
            bigTextElement.innerHTML = replaceEmojiShortcodesWithImage(data["big-text"]);

            const username = data.username;
            const site = parseInt(data.site, 10) === 1 ? "CB" : parseInt(data.site, 10) === 2 ? "SC" : "Unknown";
            siteStatus.textContent = `${site}: ${username}`;
            siteStatus.style.visibility = data.status === "true" ? "visible" : "hidden";

            brb.style.visibility = data.brb === "true" ? "visible" : "hidden";
            brb.style.opacity = data.brb === "true" ? "1" : "0";
            brb.style.transition = data.brb === "true" ? "opacity 2s linear" : "visibility 0s 2s, opacity 2s linear";

            progressBar.style.visibility = data.gamemode === "true" ? "visible" : "hidden";
            progressBar.style.opacity = data.gamemode === "true" ? "1" : "0";

            superbowl.style.visibility = data.gamemode === "true" ? "visible" : "hidden";
            superbowl.style.opacity = data.gamemode === "true" ? "1" : "0";

            lovense.style.visibility = data.app === "true" ? "visible" : "hidden";
            lovense.style.opacity = data.app === "true" ? "1" : "0";
			lovense.style.transition = data.app === "true" ? "opacity 2s linear" : "visibility 0s 2s, opacity 2s linear";
			
            timer.style.visibility = data.timer === "true" ? "visible" : "hidden";
            timer.style.opacity = data.timer === "true" ? "1" : "0";
            timer.classList.remove(data.timer === "true" ? "slide-in" : "slide-out");
            timer.classList.add(data.timer === "true" ? "slide-out" : "slide-in");

        } catch (error) {
            console.error('Error updating JSON data:', error);
        }
    };

    const fetchData = async () => {
        const apiUrl = "https://api.npoint.io/0689840ed795f3f9e622";

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            updateJsonData(data);
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    };

    const updateClock = function() {
        const now = moment();
        dateOutput.innerText = now.format("MMM DD, YYYY");
        timeOutput.innerText = now.format("HH:mm A");
    };

    const startCountdown = function(targetHour, targetMinute) {
        const now = moment();
        let targetTimeToday = moment().set({
            hour: targetHour,
            minute: targetMinute,
            second: 0,
            millisecond: 0
        });

        // If the target time has passed for today, set it for tomorrow
        if (now.isAfter(targetTimeToday)) {
            targetTimeToday.add(1, "days");
        }

        const countdownInterval = setInterval(() => {
            const now = moment();
            const timeDiff = targetTimeToday.diff(now);

            if (timeDiff <= 0) {
                // Countdown finished
                clearInterval(countdownInterval);
                countdown.innerText = "Stream is OVER!";
                countdownDisplay.innerText = "Thanks to everyone for your Tips, See you next Time!";
                countdownDisplay.style.color = "white";
                countdownFinished = true;
                return;
            }

            // Update the countdown display with hours, minutes, and seconds
            const duration = moment.duration(timeDiff);
            const hours = Math.floor(duration.asHours()).toString().padStart(2, "0");
            const minutes = duration.minutes().toString().padStart(2, "0");
            const seconds = duration.seconds().toString().padStart(2, "0");

            countdownDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    };

    // Start all processes
    updateClock();
    setInterval(updateClock, 1000);

    // Example: Countdown to 6 PM (18:00)
    startCountdown(22, 0);

    // Fetch JSON data every 950ms
    setInterval(fetchData, 950);

    // Reset the container every 22 seconds using cloneNode(true)
    function resetContainer() {
        const elm = document.querySelector('.container');
        const newone = elm.cloneNode(true);
        elm.parentNode.replaceChild(newone, elm);
    }
    setInterval(resetContainer, 22000);
});
