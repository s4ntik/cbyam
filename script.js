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

	// Function to update JSON data
	function updateJsonData() {
		// Use environment variables
		var apiUrl = 'https://api.npoint.io/0689840ed795f3f9e622';

		fetch(apiUrl, {
				method: 'GET',
				headers: {}
			})
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				console.log('Data:', data);

				var jsonDataDiv = document.getElementById("json-data");
				var centeredTextDiv = document.querySelector(".centered-text");
				var bigTextElement = document.querySelector(".big-text");

				// Update the big-text element based on data.break
				if (data.break === "true" && data['big-text'] !== "") {
					console.log('Updating big text element:', data['big-text']);
					bigTextElement.innerText = data['big-text'];
				} else {
					console.log('Condition not met for updating big text. data.break:', data.break, 'data[\'big-text\']:', data['big-text']);

					// Use default text if 'big-text' is empty
					bigTextElement.innerText = "I'll Be Right Back";
				}

				// Display the extracted data in the "json-data" div
				var username = data.username;
				var site = parseInt(data.site, 10) === 1 ? 'CB' : parseInt(data.site, 10) === 2 ? 'SC' : 'Unknown';

				jsonDataDiv.textContent = site + ': ' + username;

				// Update visibility and animation based on data.status and data.break
				if (data.status === "true") {
					jsonDataDiv.style.visibility = 'visible';
				} else {
					jsonDataDiv.style.visibility = 'hidden';
				}

				if (data.break === "true") {
					centeredTextDiv.style.visibility = 'visible';
					centeredTextDiv.style.opacity = '1';
					centeredTextDiv.style.animation = 'bounce-in-top 1.1s both';
				} else {
					centeredTextDiv.style.visibility = 'hidden';
					centeredTextDiv.style.opacity = '0';
					centeredTextDiv.style.transition = 'visibility 0s 2s, opacity 2s linear';
				}
			})
			.catch(function(error) {
				console.error('Error fetching JSON data:', error);
				var jsonDataDiv = document.getElementById("json-data");
				jsonDataDiv.style.visibility = 'hidden';
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
