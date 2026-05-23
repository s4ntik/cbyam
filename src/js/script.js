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
    return ["true", "1", "yes"].includes(String(value).toLowerCase());
  };

  function replaceEmojiShortcodesWithImage(text) {
    return text || "";
  }

  // =========================
  // UI Update
  // =========================

  function updateJsonData(data) {
    if (!data) {
      console.error("Data is undefined");
      return;
    }

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

      // Site status
      const username = data.username || "";
      const site = parseInt(data.site, 10) === 1 ? "CB" : parseInt(data.site, 10) === 2 ? "SC" : "Unknown";

      siteStatus.textContent = `${site}: ${username}`;
      siteStatus.style.visibility = parseBoolean(data.status) ? "visible" : "hidden";

      // BRB
      brb.style.visibility = parseBoolean(data.brb) ? "visible" : "hidden";
      brb.style.opacity = parseBoolean(data.brb) ? "1" : "0";
      brb.style.transition = parseBoolean(data.brb) ? "opacity 2s linear" : "visibility 0s 2s, opacity 2s linear";

      // Ending
      end.style.visibility = parseBoolean(data.end) ? "visible" : "hidden";
      end.style.opacity = parseBoolean(data.end) ? "1" : "0";
      end.style.transition = parseBoolean(data.end) ? "opacity 2s linear" : "visibility 0s 2s, opacity 2s linear";

      // Timer
      timer.style.visibility = parseBoolean(data.timer) ? "visible" : "hidden";
      timer.style.opacity = parseBoolean(data.timer) ? "1" : "0";
      timer.classList.remove("slide-in", "slide-out");
      timer.classList.add(parseBoolean(data.timer) ? "slide-out" : "slide-in");

      // Custom opacity
      if (data["user-opacity"]) {
        siteStatus.style.opacity = data["user-opacity"];
      }

      // Custom font size
      if (data["user-size"]) {
        siteStatus.style.fontSize = data["user-size"];
      }

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
  // Fetch Logic - Updated for Oracle Server
  // =========================

  // Your Oracle server URL (use HTTPS proxy or enable CORS on server)
  const ORACLE_SERVER_URL = "http://158.101.196.29:8000/data";
  
  // Use a CORS proxy that supports HTTPS
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const USE_PROXY = true; // Set to false if you enable CORS on your Oracle server

  let currentData = null;
  let pollingDelay = 5000;
  let isFetching = false;

  async function fetchData() {
    if (isFetching) return;

    isFetching = true;

    try {
      let url;
      if (USE_PROXY) {
        // Use CORS proxy to avoid mixed content and CORS issues
        url = `${CORS_PROXY}${ORACLE_SERVER_URL}?t=${Date.now()}`;
      } else {
        url = `${ORACLE_SERVER_URL}?t=${Date.now()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "Origin": window.location.origin
        }
      });

      if (response.status === 429) {
        console.warn("Rate limited. Increasing delay...");
        pollingDelay = Math.min(pollingDelay * 2, 60000);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();

      pollingDelay = 5000;

      if (JSON.stringify(data) !== JSON.stringify(currentData)) {
        currentData = data;
        updateJsonData(data);
      }
    } catch (error) {
      console.warn("Direct fetch failed:", error);
      await tryProxyFallback();
      pollingDelay = Math.min(pollingDelay * 2, 60000);
    } finally {
      isFetching = false;
      setTimeout(fetchData, pollingDelay);
    }
  }

  async function tryProxyFallback() {
    try {
      // Try different proxy services
      const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(ORACLE_SERVER_URL)}`,
        `https://corsproxy.io/?${encodeURIComponent(ORACLE_SERVER_URL)}`,
        `https://proxy.cors.sh/${ORACLE_SERVER_URL}`
      ];

      for (const proxyUrl of proxies) {
        try {
          const response = await fetch(proxyUrl);
          if (response.ok) {
            const text = await response.text();
            if (text.trim().startsWith("{")) {
              const data = JSON.parse(text);
              if (JSON.stringify(data) !== JSON.stringify(currentData)) {
                currentData = data;
                updateJsonData(data);
              }
              return;
            }
          }
        } catch (e) {
          console.warn(`Proxy ${proxyUrl} failed:`, e);
        }
      }
    } catch (proxyError) {
      console.error("All proxies failed:", proxyError);
    }
  }

  // =========================
  // Clock
  // =========================

  function updateClock() {
    if (!dateOutput || !timeOutput) {
      console.error("Missing clock elements");
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

    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    
    if (match) {
      const hours = match[1];
      const minutes = match[2];
      const period = match[3];
      timeOutput.innerHTML = `${hours}:${minutes} ${period}`;
    }
  }

  // =========================
  // Countdown
  // =========================

  function startCountdown(targetYear, targetMonth, targetDay, targetHour, targetMinute) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdown.innerText = "Stream ends in";

    const targetTime = new Date(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute, 0);

    if (Date.now() > targetTime.getTime()) {
      countdown.innerText = "Stream is OVER!";
      countdownDisplay.innerText = "Thanks everyone for your support!!";
      countdownDisplay.style.color = "white";
      return;
    }

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeDiff = targetTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        clearInterval(countdownInterval);
        countdown.innerText = "Stream is OVER!";
        countdownDisplay.innerText = "Thanks to everyone for your Tips, See you next Time!";
        countdownDisplay.style.color = "white";
        countdownFinished = true;
        return;
      }

      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60).toString().padStart(2, "0");
      const seconds = Math.floor((timeDiff / 1000) % 60).toString().padStart(2, "0");

      countdownDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  // =========================
  // Initialize
  // =========================

  function initialize() {
    try {
      updateClock();
      setInterval(updateClock, 1000);
      fetchData();
    } catch (error) {
      console.error("Initialization error:", error);
      setTimeout(initialize, 2000);
    }
  }

  initialize();
});