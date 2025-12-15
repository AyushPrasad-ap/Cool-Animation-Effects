const canvas = document.getElementById("vortex");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let w = canvas.width;
let h = canvas.height;

const centerX = w / 2;
const centerY = h / 2;

const particles = [];
const particleCount = 600;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * (Math.max(w, h) * 0.5) + 50;
        this.speed = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 2 + 1;

        const hue = 180 + Math.random() * 120; // blue > purple
        this.color = `hsla(${hue}, 100%, 60%, 1)`;
    }

    update() {
        this.angle += this.speed;
        this.radius -= 0.4;   // inward pull

        if (this.radius < 2) {
            this.reset();     // re-spawn outward
        }
    }

    draw() {
        const x = centerX + Math.cos(this.angle) * this.radius;
        const y = centerY + Math.sin(this.angle) * this.radius;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = canvas.width;
    h = canvas.height;
});
