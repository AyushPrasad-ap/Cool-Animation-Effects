const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

const STAR_COUNT = 1000;
const stars = [];
let time = 0;

// Wormhole parameters
const baseSpeed = 0.008;
const rotationSpeed = 0.015;
const wobbleStrength = 0.00;

// Mouse control target
let mouseX = 0;
let mouseY = 0;

// Smooth lerped values
let tiltX = 0;
let tiltY = 0;

// Update mouse/touch position
window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX - centerX) / centerX; // -1 to 1
  mouseY = (e.clientY - centerY) / centerY; // -1 to 1
});

window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mouseX = (t.clientX - centerX) / centerX;
  mouseY = (t.clientY - centerY) / centerY;
});

// Create 3D stars
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: (Math.random() - 0.5) * canvas.width * 2,
    y: (Math.random() - 0.5) * canvas.height * 2,
    z: Math.random() * canvas.width,
  });
}

function animate() {
  time += 0.03;

  // Smooth interpolation (prevents jerks)
  tiltX += (mouseX - tiltX) * 0.05;
  tiltY += (mouseY - tiltY) * 0.05;

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let s of stars) {
    // Move forward
    s.z -= baseSpeed * canvas.width;

    if (s.z <= 0.1) {
      s.x = (Math.random() - 0.5) * canvas.width * 2;
      s.y = (Math.random() - 0.5) * canvas.height * 2;
      s.z = canvas.width;
    }

    // Wobble distortion
    const wobble = 1 + Math.sin(time + s.z * 0.01) * wobbleStrength;
    const zW = s.z * wobble;

    // Spiral rotation
    const angle = rotationSpeed * (canvas.width / zW);
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    let rx = s.x * cosA - s.y * sinA;
    let ry = s.x * sinA + s.y * cosA;

    // Add MOUSE tilt to the vortex
    rx += tiltX * (zW * 0.15);
    ry += tiltY * (zW * 0.15);

    // Perspective projection
    const perspective = canvas.width / zW;
    const px = rx * perspective + centerX;
    const py = ry * perspective + centerY;

    // Star brightness
    let brightness = 1 - s.z / canvas.width;
    brightness = Math.max(0, Math.min(1, brightness));

    ctx.fillStyle = `rgba(0, 200, 255, ${brightness})`;
    ctx.beginPath();
    ctx.arc(px, py, 2.2 * perspective, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

animate();

// Resize handling
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
});

