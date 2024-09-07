const imageContainer = document.getElementById('image-container');
let images = {};

// Function to update the style of an image
function updateImageStyle(id, properties) {
    const img = document.getElementById(id);
    if (img) {
        img.style.left = `${properties.x}px`;
        img.style.top = `${properties.y}px`;
        img.style.transform = `rotate(${properties.rotation}deg) ${properties.mirror ? 'scaleX(-1)' : ''} ${properties.resize !== 1 ? `scale(${properties.resize})` : ''}`;
        img.style.opacity = properties.opacity;
    }
}

// Function to load an image
function loadImage(url, id) {
    const img = document.getElementById(id);
    if (img) {
        img.src = url;
    }
}

// Initialize WebSocket connection
const socket = new WebSocket('wss://obsy.fly.dev/:3000');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'images') {
        // Clear existing images
        imageContainer.innerHTML = '';
        images = data.images;

        // Add or update images
        for (const [id, properties] of Object.entries(images)) {
            let img = document.getElementById(id);
            if (!img) {
                img = document.createElement('img');
                img.id = id;
                img.style.position = 'fixed';
                img.addEventListener('click', () => {
                    // Handle image click for update
                    selectImage(id);
                });
                imageContainer.appendChild(img);
            }
            img.src = properties.src;
            updateImageStyle(id, properties);
        }
    }
};

function selectImage(id) {
    const properties = images[id];
    if (properties) {
        // Update controls with selected image properties
        document.getElementById('opacity').value = properties.opacity;
        document.getElementById('opacity-input').value = properties.opacity;
        document.getElementById('rotation').value = properties.rotation;
        document.getElementById('rotation-input').value = properties.rotation;
        document.getElementById('mirror').checked = properties.mirror;
        document.getElementById('resize').value = properties.resize;
    }
}

// Send updates to the server
function sendUpdate(id, properties) {
    const data = JSON.stringify({ type: 'update_image', id, properties });
    socket.send(data);
}

// Event listeners for control elements
document.getElementById('opacity').addEventListener('input', function() {
    const id = Object.keys(images)[0]; // Assuming we have one selected
    if (id) {
        const opacity = this.value;
        sendUpdate(id, { opacity });
    }
});

document.getElementById('opacity-input').addEventListener('change', function() {
    const id = Object.keys(images)[0];
    if (id) {
        const opacity = this.value;
        document.getElementById('opacity').value = opacity;
        sendUpdate(id, { opacity });
    }
});

document.getElementById('rotation').addEventListener('input', function() {
    const id = Object.keys(images)[0];
    if (id) {
        const rotation = this.value;
        sendUpdate(id, { rotation });
    }
});

document.getElementById('rotation-input').addEventListener('change', function() {
    const id = Object.keys(images)[0];
    if (id) {
        const rotation = this.value;
        document.getElementById('rotation').value = rotation;
        sendUpdate(id, { rotation });
    }
});

document.getElementById('mirror').addEventListener('change', function() {
    const id = Object.keys(images)[0];
    if (id) {
        const mirror = this.checked;
        sendUpdate(id, { mirror });
    }
});

document.getElementById('resize').addEventListener('input', function() {
    const id = Object.keys(images)[0];
    if (id) {
        const resize = this.value;
        sendUpdate(id, { resize });
    }
});

document.getElementById('add-image').addEventListener('click', () => {
    const url = document.getElementById('image-url').value;
    const data = JSON.stringify({
        type: 'add_image',
        src: url,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        mirror: false,
        resize: 1
    });
    socket.send(data);
});

document.getElementById('delete-image').addEventListener('click', () => {
    const id = Object.keys(images)[0];
    if (id) {
        const data = JSON.stringify({ type: 'delete_image', id });
        socket.send(data);
    }
});
