import { getProfiles } from "../db/profile";
import { initialDirect, initialSystem } from "../helper/constant";

const canvas = new OffscreenCanvas(16, 16);
const context = canvas.getContext("2d");

export function getIcon(outer: string, inner?: string) {
  if (!context) return;
  // 画一个空心圆
  context.scale(16, 16);
  context.clearRect(0, 0, 1, 1);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = outer;
  context.beginPath();
  context.arc(0.5, 0.5, 0.5, 0, 2 * Math.PI, true);
  context.closePath();
  context.fill();
  // 画一个实心圆
  if (inner) {
    context.fillStyle = inner;
  } else {
    context.globalCompositeOperation = "destination-out";
  }
  context.beginPath();
  context.arc(0.5, 0.5, 0.25, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);

  return context.getImageData(0, 0, 16, 16);
}

export async function setIcon(outer: string, inner?: string) {
  await chrome.action.setIcon({
    imageData: getIcon(outer, inner),
  });
}

async function init() {
  await setIcon(initialSystem.color);

  const profiles = await getProfiles();
  const { activeId } = await chrome.storage.local.get("activeId");
  const activeProfile = profiles.find((i) => `${i.id}` === activeId);
  if (activeProfile) {
    await setIcon(activeProfile.color);
  } else if (`${initialSystem.id}` === activeId) {
    await setIcon(initialSystem.color);
  } else {
    await setIcon(initialDirect.color);
  }
}

export default init;
