const canvas = document.getElementById("vortexText");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let w = canvas.width;
let h = canvas.height;

const centerX = w / 2;
const centerY = h / 2;

const particles = [];
const particleCount = 2000;

let targetPoints = [];  // pixel coordinates that form HELLOW

// ---------- CREATE TEXT TARGET POINTS ----------
const textCanvas = document.createElement("canvas");
const tctx = textCanvas.getContext("2d");
textCanvas.width = w;
textCanvas.height = h;

tctx.fillStyle = "#fff";
tctx.font = "bold 200px Arial";
tctx.textAlign = "center";
tctx.textBaseline = "middle";

tctx.fillText("HELLOW", w / 2, h / 2);

let textData = tctx.getImageData(0, 0, w, h).data;

// store only the opaque pixels
for (let y = 0; y < h; y += 6) {
    for (let x = 0; x < w; x += 6) {
        let i = (y * w + x) * 4;
        if (textData[i + 3] > 150) {
            targetPoints.push({ x, y });
        }
    }
}

// ---------- PARTICLE CLASS ----------
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 0; // starts at center
        this.speed = Math.random() * 0.03 + 0.02;
        this.outSpeed = Math.random() * 1 + 0.4;
        this.size = Math.random() * 2 + 1;

        // random bright color
        const hue = 160 + Math.random() * 150;
        this.color = `hsla(${hue}, 100%, 60%, 1)`;

        // text target
        this.target = targetPoints[Math.floor(Math.random() * targetPoints.length)];
        this.phase = "vortex";  // vortex → attract → text
    }

    update() {
        if (this.phase === "vortex") {
            this.angle += this.speed;
            this.radius += this.outSpeed;

            if (this.radius > Math.max(w, h) * 0.4) {
                this.phase = "attract";
            }

            this.x = centerX + Math.cos(this.angle) * this.radius;
            this.y = centerY + Math.sin(this.angle) * this.radius;
        }

        else if (this.phase === "attract") {
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            this.x += dx * 0.05;
            this.y += dy * 0.05;

            // close enough → lock into final text
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                this.phase = "text";
            }
        }

        else if (this.phase === "text") {
            // gently float in place
            this.x += (this.target.x - this.x) * 0.1;
            this.y += (this.target.y - this.y) * 0.1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ---------- CREATE PARTICLES ----------
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// ---------- ANIMATION ----------
function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();

// resize support
window.addEventListener("resize", () => location.reload());
