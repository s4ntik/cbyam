document.addEventListener("DOMContentLoaded", function () {
    const dateOutput = document.getElementById("date");
    const timeOutput = document.getElementById("time");
    const countdownDisplay = document.getElementById("countdown-display");
    let countdownFinished = false;

    const updateJsonData = function (data) {
        const jsonDataDiv = document.getElementById("json-data");
        const centeredTextDiv = document.querySelector(".centered-text");
        const bigTextElement = document.querySelector(".big-text");
        const progressBar = document.querySelector(".progress-bar");
        const superbowl = document.querySelector(".superbowl");

        bigTextElement.innerText = data["big-text"];

        const username = data.username;
        const site = parseInt(data.site, 10) === 1 ? "CB" : parseInt(data.site, 10) === 2 ? "SC" : "Unknown";
        jsonDataDiv.textContent = `${site}: ${username}`;
        jsonDataDiv.style.visibility = data.status === "true" ? "visible" : "hidden";

        centeredTextDiv.style.visibility = data.break === "true" ? "visible" : "hidden";
        centeredTextDiv.style.opacity = data.break === "true" ? "1" : "0";
        centeredTextDiv.style.transition = data.break === "true" ? "opacity 2s linear" : "visibility 0s 2s, opacity 2s linear";

        progressBar.style.visibility = data.gamemode === "true" ? "visible" : "hidden";
        progressBar.style.opacity = data.gamemode === "true" ? "1" : "0";
        progressBar.classList.remove(data.gamemode === "true" ? "slide-in" : "slide-out");
        progressBar.classList.add(data.gamemode === "true" ? "slide-out" : "slide-in");

        superbowl.style.visibility = data.gamemode === "true" ? "visible" : "hidden";
        superbowl.style.opacity = data.gamemode === "true" ? "1" : "0";
        superbowl.classList.remove(data.gamemode === "true" ? "slide-in" : "slide-out");
        superbowl.classList.add(data.gamemode === "true" ? "slide-out" : "slide-in");
    };

    const fetchData = function () {
        const apiUrl = "https://api.npoint.io/0689840ed795f3f9e622";

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                updateJsonData(data);
            })
            .catch((error) => {
                console.error('Error fetching JSON data:', error);
                const jsonDataDiv = document.getElementById("json-data");
                jsonDataDiv.style.visibility = "hidden";
            });
    };

    const updateClock = function () {
        const now = moment();
        dateOutput.innerText = now.format("MMM DD, YYYY");
        timeOutput.innerText = now.format("HH:mm A");
    };

    const updateCountdown = function () {
        const now = new Date().getTime();

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

    const targetTimeToday = moment().set({ hour: 8, minute: 0, second: 0, millisecond: 0 });

    if (moment().isAfter(targetTimeToday)) {
        targetTimeToday.add(1, "days");
    }

    const targetEndTime = targetTimeToday.valueOf();

    setInterval(updateClock, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateJsonData, 10000);
    setInterval(fetchData, 20000);

    updateClock();
    updateCountdown();
    fetchData();
});
