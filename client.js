const image = document.getElementById('moving-image');

let posX = 0;
let posY = 0;
let rotation = 0;
let opacity = 1;
let mirror = false;
let resize = 1;

function updateImageStyle() {
  let transformValue = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
  if (mirror) {
    transformValue += ' scaleX(-1)';
  }
  if (resize !== 1) {
    transformValue += ` scale(${resize})`;
  }
  image.style.transform = transformValue;
  image.style.opacity = opacity;
}

function loadImage(url) {
  image.src = url;
}

const socket = new WebSocket('wss://obsy.fly.dev/:3000');
socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'image') {
    loadImage(data.src);
  }
  else if (data.type === 'position') {
    posX = data.x;
    posY = data.y;
    rotation = data.rotation;
    opacity = data.opacity;
    mirror = data.mirror;
    resize = data.resize;
    updateImageStyle();
  }
};

socket.onopen = function() {
  socket.send(JSON.stringify({ type: 'request_image' }));
};

socket.onerror = function(error) {
  console.error('WebSocket error:', error);
};
