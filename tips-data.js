document.addEventListener('DOMContentLoaded', function() {
    const leftSideDisplay = document.getElementById('left_side');
    const rightSideDisplay = document.getElementById('right_side');
    let socket;

    function connectWebSocket() {
        socket = new WebSocket('wss://baka.fly.dev/:3000');

        socket.addEventListener('open', function(event) {
            console.log('WebSocket connection established.');
        });

        socket.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);

            // Check if the message contains the desired data
            if (data && data.source && data.user && data.amount) {
                // Update counters based on the amount
                switch (data.amount) {
                    case '8':
                        handleAmount(data.amount, 'left');
                        break;
                    case '9':
                        handleAmount(data.amount, 'right');
                        break;
                    // Add more cases if needed
                }
            }
        });

        socket.addEventListener('close', function(event) {
            console.log('WebSocket connection closed. Attempting to reconnect...');
            setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
        });
    }

    function handleAmount(amount, side) {
        if (side === 'left') {
            // Update left side count
            updateDisplay(++leftSideCount, rightSideCount);
        } else if (side === 'right') {
            // Update right side count
            updateDisplay(leftSideCount, ++rightSideCount);
        }
    }

    let leftSideCount = 0;
    let rightSideCount = 0;

    function updateDisplay(leftCount, rightCount) {
        const totalAmountCount = leftCount + rightCount;

        // Ensure totalAmountCount is not zero to avoid division by zero
        const leftPercentage = totalAmountCount !== 0 ? (leftCount / totalAmountCount) * 100 : 0;
        const rightPercentage = totalAmountCount !== 0 ? (rightCount / totalAmountCount) * 100 : 0;

        // Update the width of the bars
        document.querySelector('.left-bar').style.width = leftPercentage + '%';
        document.querySelector('.right-bar').style.width = rightPercentage + '%';

        // Update the percentage display
        updatePercentageDisplay(leftSideDisplay, leftPercentage);
        updatePercentageDisplay(rightSideDisplay, rightPercentage);
    }

    function updatePercentageDisplay(element, percentage) {
        element.querySelector('.bar-percentage').textContent = percentage.toFixed(1) + '%';
    }

    // Start the initial WebSocket connection
    connectWebSocket();
});
