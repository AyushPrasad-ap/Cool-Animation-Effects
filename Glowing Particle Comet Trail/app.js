const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 200;

const mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  createParticle(mouse.x, mouse.y);
});

window.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
  createParticle(mouse.x, mouse.y);
});

function createParticle(x, y) {
  particles.push({
    x,
    y,
    size: Math.random() * 4 + 1,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    life: 1,
    decay: Math.random() * 0.02 + 0.01,
  });

  if (particles.length > maxParticles) {
    particles.shift();
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 200, ${p.life})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,255,200,1)";
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= p.decay;
  });

  // Remove dead particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
}

function animate() {
  // Dark transparent layer for smooth trails
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawParticles();
  requestAnimationFrame(animate);
}

animate();




