const canvas = document.getElementById("fireflies");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Track mouse
let mouse = { x: null, y: null };

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

// FIREFLY SETTINGS
const FIREFLY_COUNT = 200;
const fireflies = [];

class Firefly {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;

        this.baseAlpha = Math.random() * 0.5 + 0.5;
        this.alpha = this.baseAlpha;
        this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
        // Natural floating drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Glow pulsation
        this.pulse += 0.02;
        this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.25;

        // Mouse reactive movement
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 200) {
                // attraction strength (closer = stronger)
                let force = (200 - dist) / 200 * 0.03;
                this.x += dx * force;
                this.y += dy * force;
            }

            if (dist < 40) {
                // repulsion when extremely close
                let repel = (40 - dist) / 40 * 0.3;
                this.x -= dx * repel;
                this.y -= dy * repel;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(120, 200, 255, ${this.alpha})`;
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(150,200,255,1)";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create fireflies
for (let i = 0; i < FIREFLY_COUNT; i++) {
    fireflies.push(new Firefly());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireflies.forEach(f => {
        f.update();
        f.draw();
    });

    requestAnimationFrame(animate);
}

animate();
