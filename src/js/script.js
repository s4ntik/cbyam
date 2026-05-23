document.addEventListener("DOMContentLoaded", function () {
  const dateOutput = document.getElementById("date");
  const timeOutput = document.getElementById("time");
  const countdownDisplay = document.getElementById("countdown-display");
  const countdown = document.getElementById("countdown");

  let countdownFinished = false;
  let countdownInterval = null;

  // =========================
  // DVD STATUS ANIMATION
  // =========================

  const siteStatus = document.getElementById("json-data");

  let dvdRunning = false;
  let x = 100;
  let y = 100;
  let dx = 2;
  let dy = 2;
  let dvdFrame = null;

  function startDVD() {
    if (dvdRunning || !siteStatus) return;

    dvdRunning = true;

    siteStatus.style.position = "fixed";
    siteStatus.style.zIndex = "9999";

    function loop() {
      const rect = siteStatus.getBoundingClientRect();

      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      x += dx;
      y += dy;

      if (x <= 0 || x >= maxX) {
        dx *= -1;
        x = Math.max(0, Math.min(x, maxX));
      }

      if (y <= 0 || y >= maxY) {
        dy *= -1;
        y = Math.max(0, Math.min(y, maxY));
      }

      siteStatus.style.left = x + "px";
      siteStatus.style.top = y + "px";

      dvdFrame = requestAnimationFrame(loop);
    }

    dvdFrame = requestAnimationFrame(loop);
  }

  function stopDVD() {
    dvdRunning = false;

    if (dvdFrame) {
      cancelAnimationFrame(dvdFrame);
      dvdFrame = null;
    }
  }

  // =========================
  // Helpers
  // =========================

  const parseBoolean = (value) => {
    return ["true", "1", "yes"].includes(String(value).toLowerCase());
  };

  function replaceEmojiShortcodesWithImage(text) {
    return text || "";
  }

  // =========================
  // UI Update
  // =========================

  function updateJsonData(data) {
    if (!data) return;

    try {
      const siteStatus = document.getElementById("json-data");
      const brb = document.querySelector(".brb-class");
      const end = document.querySelector(".ending-class");
      const bigTextElement = document.querySelector(".big-text");
      const smallText2Element = document.querySelector(".small-text2");
      const timer = document.querySelector(".timer");

      // Text
      bigTextElement.innerHTML = replaceEmojiShortcodesWithImage(data["big-text"] || "");
      smallText2Element.innerHTML = replaceEmojiShortcodesWithImage(data["small-text2"] || "");

      // Site status text
      const username = data.username || "";
      const site =
        parseInt(data.site, 10) === 1
          ? "CB"
          : parseInt(data.site, 10) === 2
          ? "SC"
          : "Unknown";

      siteStatus.textContent = `${site}: ${username}`;

      const statusOn = parseBoolean(data.status);

      siteStatus.style.visibility = statusOn ? "visible" : "hidden";

      // DVD animation toggle
      if (statusOn) {
        startDVD();
      } else {
        stopDVD();
      }

      // BRB
      brb.style.visibility = parseBoolean(data.brb) ? "visible" : "hidden";
      brb.style.opacity = parseBoolean(data.brb) ? "1" : "0";

      // Ending
      end.style.visibility = parseBoolean(data.end) ? "visible" : "hidden";
      end.style.opacity = parseBoolean(data.end) ? "1" : "0";

      // Timer
      timer.style.visibility = parseBoolean(data.timer) ? "visible" : "hidden";
      timer.style.opacity = parseBoolean(data.timer) ? "1" : "0";

      // Countdown
      if (data.countdown) {
        const { year, month, day, hour, minute } = data.countdown;
        startCountdown(year, month, day, hour, minute);
      }
    } catch (error) {
      console.error("Error updating UI:", error);
    }
  }

  // =========================
  // FETCH DATA
  // =========================

  const API_URL = "https://hypnotist-condone-financial.ngrok-free.dev/data";

  let currentData = null;
  let pollingDelay = 5000;
  let isFetching = false;

  async function fetchData() {
    if (isFetching) return;
    isFetching = true;

    try {
      const response = await fetch(`${API_URL}?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (JSON.stringify(data) !== JSON.stringify(currentData)) {
          currentData = data;
          updateJsonData(data);
        }

        pollingDelay = 5000;
      }
    } catch (err) {
      console.warn("Fetch failed:", err);
      pollingDelay = Math.min(pollingDelay * 2, 60000);
    } finally {
      isFetching = false;
      setTimeout(fetchData, pollingDelay);
    }
  }

  // =========================
  // CLOCK
  // =========================

  function updateClock() {
    const now = new Date();

    dateOutput.innerText = now.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    timeOutput.innerText = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // =========================
  // COUNTDOWN
  // =========================

  function startCountdown(y, m, d, h, min) {
    if (countdownInterval) clearInterval(countdownInterval);

    const target = new Date(y, m - 1, d, h, min);

    countdown.innerText = "Stream ends in";

    countdownInterval = setInterval(() => {
      const diff = target - new Date();

      if (diff <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.innerText = "Stream is OVER!";
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      countdownDisplay.innerText =
        `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  // =========================
  // INIT
  // =========================

  function initialize() {
    updateClock();
    setInterval(updateClock, 1000);
    fetchData();
  }

  initialize();
});