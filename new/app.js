const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const STAR_COUNT = 1500;
const stars = [];

// Create 3D star objects
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: (Math.random() - 0.5) * canvas.width * 4,
    y: (Math.random() - 0.5) * canvas.height * 4,
    z: Math.random() * canvas.width
  });
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let s of stars) {
    s.z -= 4; // how fast stars approach camera

    // Reset star when it passes the camera
    if (s.z <= 0.1) {
      s.x = (Math.random() - 0.5) * canvas.width * 4;
      s.y = (Math.random() - 0.5) * canvas.height * 4;
      s.z = canvas.width;
    }

    // Perspective projection (3D → 2D)
    const k = 500 / s.z;
    const x = s.x * k + centerX;
    const y = s.y * k + centerY;

    // Star brightness increases as it gets closer
    const brightness = Math.max(0, 1 - s.z / canvas.width);

    // Draw star
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${brightness})`;
    ctx.arc(x, y, k * 2, 0, Math.PI * 2);
    ctx.fill();

    // Add a streak/trail behind the star
    ctx.strokeStyle = `rgba(255,255,255,${brightness * 0.8})`;
    ctx.lineWidth = k * 1.5;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - (s.x * k) * 0.1, y - (s.y * k) * 0.1);
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

animate();

// Handle resizing
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
