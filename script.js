document.addEventListener("DOMContentLoaded", function() {
    var dateOutput = document.getElementById("date");
    var timeOutput = document.getElementById("time");
    var countdownDisplay = document.getElementById("countdown-display");
    var countdownFinished = false;
    var jsonDataElement = document.getElementById("json-data");

    // Function to update the clock and countdown
    function updateClockAndCountdown() {
        var now = moment();
        dateOutput.innerText = now.format('MMM DD, YYYY');
        timeOutput.innerText = now.format('HH:mm A');

        var currentTime = new Date().getTime();

        if (currentTime < targetEndTime) {
            var timeDiff = targetEndTime - currentTime;
            var hours = Math.floor(timeDiff / (1000 * 60 * 60));
            var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            var hoursStr = hours.toString().padStart(2, '0');
            var minutesStr = minutes.toString().padStart(2, '0');
            var secondsStr = seconds.toString().padStart(2, '0');

            countdownDisplay.innerHTML = hoursStr + 'h ' + minutesStr + 'm ' + secondsStr + 's';
        } else if (!countdownFinished) {
            countdownDisplay.innerText = 'Thanks to everyone for your Tips, See you next Time!';
            countdownDisplay.style.color = 'white';
            countdownFinished = true;
        }
    }

    // Function to update JSON data
    function updateJsonData() {
        // Use environment variables
        var apiKey = 'q7Y1qj9sszVjRG4VJfmqNFdLurZEUoWSzw9x7HFSqE';
        var apiUrl = 'https://api.jsonsilo.com/f019f4f4-ee0b-4aee-b619-4776b6cff56f';

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-SILO-KEY': apiKey,
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var jsonDataDiv = document.getElementById("json-data");
            var centeredTextDiv = document.querySelector(".centered-text"); // Select the element with the class "centered-text"

            if (data.status === "true") {
                // Display the extracted data in the "json-data" div
                var username = data.username;
                var site = data.site === "1" ? 'CB' : data.site === "2" ? 'SC' : 'Unknown';
                jsonDataDiv.style.visibility = 'visible';
                jsonDataDiv.textContent = site + ': ' + username;
            } else {
                // Hide the "json-data" div when status is not true
                jsonDataDiv.style.visibility = 'hidden';
                jsonDataDiv.textContent = '';
            }

            if (data.break === "true") {
                // Display the extracted data in the "json-data" div
                centeredTextDiv.style.visibility = 'visible';
            } else {
                // Hide the "json-data" div when break is not true
                centeredTextDiv.style.visibility = 'hidden';
            }
        })
        .catch(function(error) {
            console.error('Error fetching JSON data:', error);
            var jsonDataDiv = document.getElementById("json-data");
            jsonDataDiv.style.visibility = 'hidden'; // Hide the div in case of an error
        });
    }

    // Calculate the target time for today
    var targetTimeToday = moment().set({
        'hour': 8,
        'minute': 0,
        'second': 0,
        'millisecond': 0
    });
    if (moment().isAfter(targetTimeToday)) {
        targetTimeToday.add(1, 'days');
    }
    var targetEndTime = targetTimeToday.valueOf();

    // Function to update everything
    function updateAll() {
        updateClockAndCountdown();
        updateJsonData();
    }

    // Set intervals to update everything
    setInterval(updateAll, 10000);
    updateAll();
});
