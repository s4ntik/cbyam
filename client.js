const image = document.getElementById('moving-image');

let posX = 0;
let posY = 0;
let rotation = 0;
let opacity = 1;
let mirror = false;
let resize = 1;

let targetPosX = 0;
let targetPosY = 0;
let targetRotation = 0;

const interpolationFactor = 0.2; // Adjust this value for smoother or faster movement

function updateImageStyle() {
  posX += (targetPosX - posX) * interpolationFactor;
  posY += (targetPosY - posY) * interpolationFactor;
  rotation += (targetRotation - rotation) * interpolationFactor;

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
    targetPosX = data.x;
    targetPosY = data.y;
    targetRotation = data.rotation;
    opacity = data.opacity;
    mirror = data.mirror;
    resize = data.resize;
  }
};

socket.onopen = function() {
  socket.send(JSON.stringify({ type: 'request_image' }));
};

socket.onerror = function(error) {
  console.error('WebSocket error:', error);
};

function update() {
  updateImageStyle();
  requestAnimationFrame(update);
}

update();
