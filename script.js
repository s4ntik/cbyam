document.addEventListener("DOMContentLoaded", function() {
	var dateOutput = document.getElementById("date");
	var timeOutput = document.getElementById("time");
	var countdownDisplay = document.getElementById("countdown-display");
	var countdownFinished = false;
	var jsonDataElement = document.getElementById("json-data");

	// Function to update the clock
	var updateClock = function() {
		var now = moment();
		dateOutput.innerText = now.format('MMM DD, YYYY');
		timeOutput.innerText = now.format('HH:mm A');
	};

	// Function to update the countdown
	function updateCountdown() {
		var now = new Date().getTime();

		if (now < targetEndTime) {
			var timeDiff = targetEndTime - now;
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

	function updateJsonData() {
		// Use environment variables
		var apiKey = '$2a$10$QPfLNnNVeEMEgIqh0o9eZOThxz4QiQj2QjNz7AlW/iethFoFyUrsO';
		var apiUrl = 'https://api.jsonbin.io/v3/b/6508fbd54138103063578140';

		fetch(apiUrl, {
				method: 'GET',
				headers: {
					'X-Access-Key': apiKey,
					'X-Bin-Meta': false
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
					var site = data.site === 1 ? 'CB' : data.site === 2 ? 'SC' : 'Unknown';
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

	// Calculate the target time for today and update the countdown
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

	// Set intervals to update the clock, countdown, and JSON data
	setInterval(updateClock, 1000);
	updateClock();

	setInterval(updateCountdown, 1000);
	updateCountdown();

	// Initial call to update JSON data
	setInterval(updateJsonData, 10000);
	updateJsonData();
});
