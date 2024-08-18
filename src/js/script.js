document.addEventListener("DOMContentLoaded", function() {
    const dateOutput = document.getElementById("date");
    const timeOutput = document.getElementById("time");
    const countdownDisplay = document.getElementById("countdown-display");
    let countdownFinished = false;

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

    const updateCountdown = function() {
        const now = new Date().getTime();
        const targetTimeToday = moment().set({
            hour: 8,
            minute: 0,
            second: 0,
            millisecond: 0
        });

        if (moment().isAfter(targetTimeToday)) {
            targetTimeToday.add(1, "days");
        }

        const targetEndTime = targetTimeToday.valueOf();

        if (now < targetEndTime) {
            const timeDiff = targetEndTime - now;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            const hoursStr = hours.toString().padStart(2, "0");
            const minutesStr = minutes.toString().padStart(2, "0");
            const secondsStr = seconds.toString().padStart(2, "0");

            countdownDisplay.innerHTML = `${hoursStr}h ${minutesStr}m ${secondsStr}s`;
        } else if (!countdownFinished) {
            countdownDisplay.innerText = "Thanks to everyone for your Tips, See you next Time!";
            countdownDisplay.style.color = "white";
            countdownFinished = true;
        }
    };

    setInterval(updateClock, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(fetchData, 950);

    updateClock();
    updateCountdown();
    fetchData();
});
