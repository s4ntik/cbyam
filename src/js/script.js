document.addEventListener("DOMContentLoaded", function () {
  const dateOutput = document.getElementById("date");
  const timeOutput = document.getElementById("time");
  const countdownDisplay = document.getElementById("countdown-display");
  const countdown = document.getElementById("countdown");

  let countdownFinished = false;
  let countdownInterval = null;

  // =========================
  // Helpers
  // =========================

  const parseBoolean = (value) => {
    return ["true", "1", "yes"].includes(
      String(value).toLowerCase()
    );
  };

  // Replace with your own emoji parser if needed
  function replaceEmojiShortcodesWithImage(text) {
    return text || "";
  }

  // =========================
  // Update UI
  // =========================

  function updateJsonData(data) {
    if (!data) {
      console.error("No data received");
      return;
    }

    try {
      const siteStatus =
        document.getElementById("json-data");

      const lovense =
        document.getElementById("app");

      const brb =
        document.querySelector(".brb-class");

      const end =
        document.querySelector(".ending-class");

      const bigTextElement =
        document.querySelector(".big-text");

      const smallText2Element =
        document.querySelector(".small-text2");

      const timer =
        document.querySelector(".timer");

      // Big text
      bigTextElement.innerHTML =
        replaceEmojiShortcodesWithImage(
          data["big-text"] || ""
        );

      // Small text
      smallText2Element.innerHTML =
        replaceEmojiShortcodesWithImage(
          data["small-text2"] || ""
        );

      // Username/site
      const username =
        data.username || "";

      const site =
        parseInt(data.site, 10) === 1
          ? "CB"
          : parseInt(data.site, 10) === 2
          ? "SC"
          : "Unknown";

      siteStatus.textContent =
        `${site}: ${username}`;

      siteStatus.style.visibility =
        parseBoolean(data.status)
          ? "visible"
          : "hidden";

      // BRB
      brb.style.visibility =
        parseBoolean(data.brb)
          ? "visible"
          : "hidden";

      brb.style.opacity =
        parseBoolean(data.brb)
          ? "1"
          : "0";

      brb.style.transition =
        parseBoolean(data.brb)
          ? "opacity 2s linear"
          : "visibility 0s 2s, opacity 2s linear";

      // END
      end.style.visibility =
        parseBoolean(data.end)
          ? "visible"
          : "hidden";

      end.style.opacity =
        parseBoolean(data.end)
          ? "1"
          : "0";

      end.style.transition =
        parseBoolean(data.end)
          ? "opacity 2s linear"
          : "visibility 0s 2s, opacity 2s linear";

      // APP
      lovense.style.visibility =
        parseBoolean(data.app)
          ? "visible"
          : "hidden";

      lovense.style.opacity =
        parseBoolean(data.app)
          ? "1"
          : "0";

      lovense.style.transition =
        parseBoolean(data.app)
          ? "opacity 2s linear"
          : "visibility 0s 2s, opacity 2s linear";

      // TIMER
      timer.style.visibility =
        parseBoolean(data.timer)
          ? "visible"
          : "hidden";

      timer.style.opacity =
        parseBoolean(data.timer)
          ? "1"
          : "0";

      timer.classList.remove(
        "slide-in",
        "slide-out"
      );

      timer.classList.add(
        parseBoolean(data.timer)
          ? "slide-out"
          : "slide-in"
      );

      // Custom opacity
      if (data["user-opacity"]) {
        siteStatus.style.opacity =
          data["user-opacity"];
      }

      // Custom font size
      if (data["user-size"]) {
        siteStatus.style.fontSize =
          data["user-size"];
      }

      // Countdown
      if (data.countdown) {
        const {
          year,
          month,
          day,
          hour,
          minute,
        } = data.countdown;

        startCountdown(
          year,
          month,
          day,
          hour,
          minute
        );
      }
    } catch (error) {
      console.error(
        "Error updating JSON data:",
        error
      );
    }
  }

  // =========================
  // JSON Hosting Fetch
  // =========================

  const JSON_URL =
    "https://jsonhosting.com/api/json/707f571a";

  let currentData = null;
  let isFetching = false;

  // 45 seconds = ~80 req/hour
  const POLLING_INTERVAL = 45000;

  async function fetchData() {
    if (isFetching) return;

    isFetching = true;

    try {
      const response = await fetch(
        `${JSON_URL}?t=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Rate limited
      if (response.status === 429) {
        console.warn(
          "JSONHosting rate limit hit"
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data = await response.json();

      // Update only if changed
      if (
        JSON.stringify(data) !==
        JSON.stringify(currentData)
      ) {
        currentData = data;
        updateJsonData(data);
      }
    } catch (error) {
      console.error(
        "Fetch failed:",
        error
      );
    } finally {
      isFetching = false;

      setTimeout(
        fetchData,
        POLLING_INTERVAL
      );
    }
  }

  // =========================
  // Clock
  // =========================

  function updateClock() {
    if (!dateOutput || !timeOutput) {
      console.error(
        "Clock elements missing"
      );
      return;
    }

    const now = new Date();

    dateOutput.innerText =
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

    const timeString =
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    const [hours, minutesAndPeriod] =
      timeString.split(":");

    const [minutes, period] =
      minutesAndPeriod.split(" ");

    timeOutput.innerHTML = `
      <span class="hour">${hours.trim()}</span>:
      <span class="minutes">${minutes.trim()}</span>
      &nbsp;
      <span class="period">${period.trim()}</span>
    `;
  }

  // =========================
  // Countdown
  // =========================

  function startCountdown(
    targetYear,
    targetMonth,
    targetDay,
    targetHour,
    targetMinute
  ) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdown.innerText =
      "Stream ends in";

    const targetTime = new Date(
      targetYear,
      targetMonth - 1,
      targetDay,
      targetHour,
      targetMinute,
      0
    );

    if (
      Date.now() >
      targetTime.getTime()
    ) {
      countdown.innerText =
        "Stream is OVER!";

      countdownDisplay.innerText =
        "Thanks everyone for your support!!";

      countdownDisplay.style.color =
        "white";

      return;
    }

    countdownInterval = setInterval(() => {
      const now = new Date();

      const timeDiff =
        targetTime.getTime() -
        now.getTime();

      if (timeDiff <= 0) {
        clearInterval(
          countdownInterval
        );

        countdown.innerText =
          "Stream is OVER!";

        countdownDisplay.innerText =
          "Thanks to everyone for your Tips, See you next Time!";

        countdownDisplay.style.color =
          "white";

        countdownFinished = true;

        return;
      }

      const hours = Math.floor(
        (timeDiff /
          (1000 * 60 * 60)) %
          24
      )
        .toString()
        .padStart(2, "0");

      const minutes = Math.floor(
        (timeDiff / (1000 * 60)) %
          60
      )
        .toString()
        .padStart(2, "0");

      const seconds = Math.floor(
        (timeDiff / 1000) % 60
      )
        .toString()
        .padStart(2, "0");

      countdownDisplay.innerHTML =
        `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  // =========================
  // Reset Container
  // =========================

  function resetContainer() {
    const elm =
      document.querySelector(".container");

    if (elm) {
      elm.innerHTML = elm.innerHTML;
    }
  }

  // =========================
  // Bounce Animation
  // =========================

  function bounceJsonData() {
    const jsonData =
      document.getElementById("json-data");

    if (!jsonData) {
      console.error(
        "#json-data not found"
      );
      return;
    }

    let x = 0;
    let y = 0;

    let xDirection = 1;
    let yDirection = 1;

    const speed = 2;

    function move() {
      const parentWidth =
        window.innerWidth;

      const parentHeight =
        window.innerHeight;

      x += xDirection * speed;
      y += yDirection * speed;

      if (
        x <= 0 ||
        x + jsonData.offsetWidth >=
          parentWidth
      ) {
        xDirection *= -1;
      }

      if (
        y <= 0 ||
        y + jsonData.offsetHeight >=
          parentHeight
      ) {
        yDirection *= -1;
      }

      jsonData.style.transform =
        `translate(${x}px, ${y}px)`;

      requestAnimationFrame(move);
    }

    move();
  }

  // =========================
  // Initialize
  // =========================

  function initialize() {
    try {
      updateClock();

      setInterval(
        updateClock,
        1000
      );

      fetchData();

      setInterval(
        resetContainer,
        22000
      );

      bounceJsonData();
    } catch (error) {
      console.error(
        "Initialization error:",
        error
      );

      setTimeout(
        initialize,
        2000
      );
    }
  }

  initialize();
});