document.addEventListener('DOMContentLoaded', () => {
	const harrisElectoral = document.getElementById('harris-electoral');
	const trumpElectoral = document.getElementById('trump-electoral');
	const harrisVotes = document.getElementById('harris-votes');
	const trumpVotes = document.getElementById('trump-votes');

	async function fetchElectionResults() {
		const timestamp = Date.now();
		const apiUrl = `https://s3.amazonaws.com/graphics.axios.com/elex-results-2024/live/2024-11-05/results-president-summary-latest.json?${timestamp}`;

		try {
			const response = await fetch(apiUrl);
			const data = await response.json();
			displayResults(data);
		} catch (error) {
			console.error("Fetch error:", error);
		}
	}

	function displayResults(data) {
		const harris = data.candidates.find(candidate => candidate.last === 'Harris');
		const trump = data.candidates.find(candidate => candidate.last === 'Trump');

		// Update electoral votes
		harrisElectoral.textContent = harris.electoralVotesWon;
		trumpElectoral.textContent = trump.electoralVotesWon;

		// Create status messages conditionally
		const harrisStatus = [
			harris.statesWon > 0 ? `Won ${harris.statesWon} state${harris.statesWon > 1 ? 's' : ''}` : '',
			harris.statesLeading > 0 ? `Leading in ${harris.statesLeading} state${harris.statesLeading > 1 ? 's' : ''}` : ''
		].filter(Boolean).join('; ');

		const trumpStatus = [
			trump.statesWon > 0 ? `Won ${trump.statesWon} state${trump.statesWon > 1 ? 's' : ''}` : '',
			trump.statesLeading > 0 ? `Leading in ${trump.statesLeading} state${trump.statesLeading > 1 ? 's' : ''}` : ''
		].filter(Boolean).join('; ');

		// Update vote count, percentage, and status for each candidate
		harrisVotes.innerHTML = `
    ${harrisStatus ? harrisStatus + '<br>' : ''}
    ${harris.voteCount.toLocaleString()} votes (${harris.votePct}%)
  `;
		trumpVotes.innerHTML = `
    ${trumpStatus ? trumpStatus + '<br>' : ''}
    ${trump.voteCount.toLocaleString()} votes (${trump.votePct}%)
  `;

		// Update the width of the progress bars based on electoral votes
		document.querySelector('.side.left').style.setProperty('--width', `${harris.electoralVotesWon / 538 * 100}%`);
		document.querySelector('.side.right').style.setProperty('--width', `${trump.electoralVotesWon / 538 * 100}%`);
	}

	// Initial fetch and set interval for updates every 30 seconds
	fetchElectionResults();
	setInterval(fetchElectionResults, 30000);
});