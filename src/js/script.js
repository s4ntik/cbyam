document.addEventListener("DOMContentLoaded", function () {
  const dateOutput = document.getElementById("date");
  const timeOutput = document.getElementById("time");
  const countdownDisplay = document.getElementById("countdown-display");
  const countdown = document.getElementById("countdown");
  let countdownFinished = false;
  let countdownInterval = null; // Store interval reference to clear it if needed

  const parseBoolean = (value) => {
    return ["true", "1", "yes"].includes(String(value).toLowerCase());
  };

  const updateJsonData = function (data) {
    if (!data) {
      console.error("Error updating JSON data: Data is undefined");
      return;
    }

    const siteStatus = document.getElementById("json-data");
    const lovense = document.getElementById("app");
    const brb = document.querySelector(".brb-class");
    const end = document.querySelector(".ending-class");
    const bigTextElement = document.querySelector(".big-text");
    const smallText2Element = document.querySelector(".small-text2");
    const progressBar = document.querySelector(".progress-bar");
    const superbowl = document.querySelector(".superbowl");
    const timer = document.querySelector(".timer");

    try {
      bigTextElement.innerHTML = replaceEmojiShortcodesWithImage(
        data["big-text"]
      );

      smallText2Element.innerHTML = replaceEmojiShortcodesWithImage(data["small-text2"]);

      const username = data.username;
      const site =
        parseInt(data.site, 10) === 1
          ? "CB"
          : parseInt(data.site, 10) === 2
          ? "SC"
          : "Unknown";
      siteStatus.textContent = `${site}: ${username}`;
      siteStatus.style.visibility = parseBoolean(data.status)
        ? "visible"
        : "hidden";

      brb.style.visibility = parseBoolean(data.brb) ? "visible" : "hidden";
      brb.style.opacity = parseBoolean(data.brb) ? "1" : "0";
      brb.style.transition = parseBoolean(data.brb)
        ? "opacity 2s linear"
        : "visibility 0s 2s, opacity 2s linear";

      end.style.visibility = parseBoolean(data.end) ? "visible" : "hidden";
      end.style.opacity = parseBoolean(data.end) ? "1" : "0";
      end.style.transition = parseBoolean(data.end)
        ? "opacity 2s linear"
        : "visibility 0s 2s, opacity 2s linear";
      progressBar.style.visibility = parseBoolean(data.gamemode)
        ? "visible"
        : "hidden";
      progressBar.style.opacity = parseBoolean(data.gamemode) ? "1" : "0";

      superbowl.style.visibility = parseBoolean(data.gamemode)
        ? "visible"
        : "hidden";
      superbowl.style.opacity = parseBoolean(data.gamemode) ? "1" : "0";

      lovense.style.visibility = parseBoolean(data.app) ? "visible" : "hidden";
      lovense.style.opacity = parseBoolean(data.app) ? "1" : "0";
      lovense.style.transition = parseBoolean(data.app)
        ? "opacity 2s linear"
        : "visibility 0s 2s, opacity 2s linear";

      timer.style.visibility = parseBoolean(data.timer) ? "visible" : "hidden";
      timer.style.opacity = parseBoolean(data.timer) ? "1" : "0";
      timer.classList.remove(
        parseBoolean(data.timer) ? "slide-in" : "slide-out"
      );
      timer.classList.add(parseBoolean(data.timer) ? "slide-out" : "slide-in");

      // Apply user-defined opacity and font size to #json-data
      if (data["user-opacity"]) {
        siteStatus.style.opacity = data["user-opacity"];
      }
      if (data["user-size"]) {
        siteStatus.style.fontSize = data["user-size"];
      }

      // Start countdown if data includes countdown time
      if (data.countdown) {
        const { year, month, day, hour, minute } = data.countdown;
        startCountdown(year, month, day, hour, minute);
      }
    } catch (error) {
      console.error("Error updating JSON data:", error);
    }
  };

  async function fetchData() {
    const apiUrl = "https://api.npoint.io/0689840ed795f3f9e622";

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      updateJsonData(data);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    }

    setTimeout(fetchData, 1000); // Slightly increase delay for better debouncing
  }

  function updateClock() {
    if (!dateOutput || !timeOutput) {
      console.error("Missing date or time output elements.");
      return;
    }

    const now = new Date();
    dateOutput.innerText = now.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const [hours, minutesAndPeriod] = timeString.split(":");
    const [minutes, period] = minutesAndPeriod.split(" ");

    timeOutput.innerHTML = `<span class="hour">${hours.trim()}</span>:<span class="minutes">${minutes.trim()}</span>&nbsp;<span class="period">${period.trim()}</span>`;
  }

  function startCountdown(
    targetYear,
    targetMonth,
    targetDay,
    targetHour,
    targetMinute
  ) {
    if (countdownInterval) clearInterval(countdownInterval); // Reset previous countdown

    const targetTime = new Date(
      targetYear,
      targetMonth - 1,
      targetDay,
      targetHour,
      targetMinute,
      0
    );

    if (Date.now() > targetTime.getTime()) {
      console.error("Target time is in the past!");
      countdown.innerText = "Stream is OVER!";
      countdownDisplay.innerText = "Thanks everyone for your support!!.";
      countdownDisplay.style.color = "white";
      return;
    }

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeDiff = targetTime - now;

      if (timeDiff <= 0) {
        clearInterval(countdownInterval);
        countdown.innerText = "Stream is OVER!";
        countdownDisplay.innerText =
          "Thanks to everyone for your Tips, See you next Time!";
        countdownDisplay.style.color = "white";
        countdownFinished = true;
        return;
      }

      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((timeDiff / 1000) % 60)
        .toString()
        .padStart(2, "0");

      countdownDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  function resetContainer() {
    const elm = document.querySelector(".container");
    elm.innerHTML = elm.innerHTML; // Avoids flickering
  }

  function bounceJsonData() {
    const jsonData = document.getElementById("json-data");
    if (!jsonData) {
      console.error("Element #json-data not found.");
      return;
    }

    let x = 0, y = 0;
    let xDirection = 1, yDirection = 1;
    const speed = 2; // Adjust speed as needed

    function move() {
      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;

      x += xDirection * speed;
      y += yDirection * speed;

      if (x <= 0 || x + jsonData.offsetWidth >= parentWidth) {
        xDirection *= -1;
      }
      if (y <= 0 || y + jsonData.offsetHeight >= parentHeight) {
        yDirection *= -1;
      }

      jsonData.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(move);
    }

    move();
  }

  // Initialize
  updateClock();
  setInterval(updateClock, 1000);
  fetchData();
  setInterval(resetContainer, 22000);
  bounceJsonData();
});
