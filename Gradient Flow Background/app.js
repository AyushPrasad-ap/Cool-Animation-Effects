const canvas = document.getElementById("gradient");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Blob settings
const blobs = [];
const blobCount = 5;

function randomColor() {
  const colors = [
    "#007BFF",   // Blue
    "#00D4FF",   // Cyan
    "#4B4BFF",   // Indigo
    "#1E90FF",   // Dodger blue
    "#5F9EA0"    // Cadet blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

class Blob {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.radius = Math.random() * 300 + 200;
    this.color = randomColor();

    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // bounce softly
    if (this.x < -200 || this.x > canvas.width + 200) this.speedX *= -1;
    if (this.y < -200 || this.y > canvas.height + 200) this.speedY *= -1;
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.2,
      this.x,
      this.y,
      this.radius
    );

    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Create blobs
for (let i = 0; i < blobCount; i++) {
  blobs.push(new Blob());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  blobs.forEach((blob) => {
    blob.update();
    blob.draw();
  });

  requestAnimationFrame(animate);
}

animate();
