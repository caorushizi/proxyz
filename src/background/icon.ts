const canvas = new OffscreenCanvas(16, 16);
const context = canvas.getContext("2d");

export function getIcon() {
  if (!context) return;
  context.clearRect(0, 0, 16, 16);
  context.fillStyle = "#00FF00"; // Green
  context.fillRect(0, 0, 16, 16);

  return context.getImageData(0, 0, 16, 16);
}

function init() {
  chrome.action.setIcon({
    imageData: getIcon(),
  });
}

export default init;
