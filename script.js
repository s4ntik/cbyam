document.addEventListener("DOMContentLoaded", function () {
   const dateOutput = document.getElementById("date");
   const timeOutput = document.getElementById("time");
   const countdownDisplay = document.getElementById("countdown-display");
   let countdownFinished = false;
   const jsonDataElement = document.getElementById("json-data");
   let currentEventId = null; // Store the current eventId

   const containers = {
      awayTeam: $("#away-team-container"),
      homeTeam: $("#home-team-container"),
      matchDetails: $("#match-details"),
      info: $("#info-container"),
   };

   const createTeamDiv = function (team) {
      const teamDiv = $('<div class="team">');
      const teamLogoContainer = $(`<div class="team-logo" style="background-color: #${team.color}">`);
      const teamLogo = $(`<img src="${team.logo}" alt="${team.displayName}">`);
      const teamInfo = $('<div class="team-info">');
      const teamName = $(`<h2 class="team-name">${team.displayName}</h2>`);
      const teamRecord = $(`<p class="team-record">${team.record}</p>`);

      teamLogoContainer.append(teamLogo);
      teamInfo.append(teamName);
      teamDiv.append(teamLogoContainer, teamInfo, teamRecord);

      return teamDiv;
   };

   const displayGameData = function (data, eventId) {
      const event = data.sports[0].leagues[0].events.find(event => event.id === eventId);

      if (!event) {
         console.error("Event not found with ID:", eventId);
         return null; // Returning null in case of an error
      }

      const competitors = event.competitors;

      const teamsData = competitors.map((team) => ({
         homeAway: team.homeAway,
         teamDiv: createTeamDiv(team),
         score: team.score,
         record: team.record,
         winner: team.winner,
      }));

      const gameData = {
         teamsData: teamsData,
         matchScore: {
            score1: competitors[0].score,
            score2: competitors[1].score,
         },
         matchTimeLapsed: event.summary,
      };

      return gameData;
   };

   const updateHTMLWithData = function (gameData) {
      // Clear existing content
      Object.values(containers).forEach((container) => container.empty());

      gameData.teamsData.forEach((team) => {
         team.homeAway === "away" ?
            containers.homeTeam.append(team.teamDiv) :
            containers.awayTeam.append(team.teamDiv);
      });

      const gameInfo = `
  <div class="match-details">
    <div class="match-score">
      <span class="match-score-number${gameData.teamsData[0].winner ? ' match-score-number-winner' : ''}">
        ${gameData.matchScore.score1}
      </span>
      <span class="match-score-divider">:</span>
      <span class="match-score-number${gameData.teamsData[1].winner ? ' match-score-number-winner' : ''}">
        ${gameData.matchScore.score2}
      </span>
    </div>
    <div class="match-time-lapsed">${gameData.matchTimeLapsed}</div>
  </div>
`;
      containers.matchDetails.html(gameInfo);

      const maxMatchHeight = Math.max(
         containers.homeTeam.height(),
         containers.awayTeam.height()
      );
      $(".match").height(maxMatchHeight);
   };

   const updateJsonData = function (data) {
      console.log('Data:', data);

      const jsonDataDiv = document.getElementById("json-data");
      const centeredTextDiv = document.querySelector(".centered-text");
      const bigTextElement = document.querySelector(".big-text");
      const matchDiv = document.querySelector(".match");

      if (data.break === "true" && data["big-text"] !== "") {
         console.log('Updating big text element:', data['big-text']);
         bigTextElement.innerText = data["big-text"];
      } else {
         console.log('Condition not met for updating big text. data.break:', data.break, 'data[\'big-text\']:', data['big-text']);
         bigTextElement.innerText = data["big-text"];
      }

      const username = data.username;
      const site =
         parseInt(data.site, 10) === 1 ?
         "CB" :
         parseInt(data.site, 10) === 2 ?
         "SC" :
         "Unknown";

      jsonDataDiv.textContent = `${site}: ${username}`;

      jsonDataDiv.style.visibility = data.status === "true" ? "visible" : "hidden";

      if (data.break === "true") {
         centeredTextDiv.style.visibility = "visible";
         centeredTextDiv.style.opacity = "1";
         centeredTextDiv.style.transition = "opacity 2s linear";
      } else {
         centeredTextDiv.style.visibility = "hidden";
         centeredTextDiv.style.opacity = "0";
         centeredTextDiv.style.transition =
            "visibility 0s 2s, opacity 2s linear";
      }
      if (data.gamemode === "true") {
         matchDiv.style.visibility = "visible";
         matchDiv.style.opacity = "1";
         matchDiv.style.transition = "opacity 2s linear";
      } else {
         matchDiv.style.visibility = "hidden";
         matchDiv.style.opacity = "0";
         matchDiv.style.transition =
            "visibility 0s 2s, opacity 2s linear";
      }

      // Update currentEventId if eventId is present in the response
      if (data.eventId) {
         currentEventId = data.eventId;
      }
   };

   const fetchData = function () {
      const apiUrl = "https://api.npoint.io/0689840ed795f3f9e622";

      fetch(apiUrl)
         .then((response) => response.json())
         .then((data) => {
            updateJsonData(data);

            const timestamp = new Date().getTime();
            const url =
               "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn×tamp=" +
               timestamp;

            $.ajax({
               url: url,
               method: "GET",
               success: function (data) {
                  const gameData = displayGameData(data, currentEventId);
                  if (gameData) {
                     updateHTMLWithData(gameData);
                  }
               },
               error: function (error) {
                  console.error("Error fetching data:", error);
               },
            });
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
         countdownDisplay.innerText =
            "Thanks to everyone for your Tips, See you next Time!";
         countdownDisplay.style.color = "white";
         countdownFinished = true;
      }
   };

   const targetTimeToday = moment().set({
      hour: 8,
      minute: 0,
      second: 0,
      millisecond: 0,
   });

   if (moment().isAfter(targetTimeToday)) {
      targetTimeToday.add(1, "days");
   }

   const targetEndTime = targetTimeToday.valueOf();

   setInterval(updateClock, 1000);
   setInterval(updateCountdown, 1000);
   setInterval(updateJsonData, 10000);
   setInterval(fetchData, 20000); // 20 seconds in milliseconds

   // Initial calls
   updateClock();
   updateCountdown();
   fetchData(); // Initial call to fetch data
});
