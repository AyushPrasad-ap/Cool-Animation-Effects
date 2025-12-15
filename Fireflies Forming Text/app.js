const canvas = document.getElementById("fireflies");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", () => location.reload());

// Firefly Settings
const FIREFLY_COUNT = 3300;
const fireflies = [];
let textPoints = [];

// ---------------------------------------
// CREATE TEXT MAP FOR "HELLOW"
// ---------------------------------------
function generateTextPoints() {
    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d");

    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    offCtx.fillStyle = "#fff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.font = `${canvas.width * 0.18}px Arial Black`;
    offCtx.fillText("HELLOW", canvas.width / 2, canvas.height / 2);

    const data = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;

    for (let y = 0; y < offCanvas.height; y += 6) {
        for (let x = 0; x < offCanvas.width; x += 6) {
            const i = (y * offCanvas.width + x) * 4;
            if (data[i + 3] > 150) {
                textPoints.push({ x, y });
            }
        }
    }
}

generateTextPoints();

// ---------------------------------------
// FIREFLY CLASS
// ---------------------------------------
class Firefly {
    constructor() {
        this.reset();
        this.chooseTarget();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 3 + 1;
        this.pulse = Math.random() * Math.PI * 2;
        this.baseAlpha = Math.random() * 0.6 + 0.4;

        // Random drifting velocity
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;

        this.state = "drift"; 
    }

    chooseTarget() {
        const p = textPoints[Math.floor(Math.random() * textPoints.length)];
        this.tx = p.x;
        this.ty = p.y;
    }

    update() {
        // Glow pulse
        this.pulse += 0.03;
        this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.25;

        if (this.state === "drift") {
            // Natural drift
            this.x += this.vx;
            this.y += this.vy;

            // Soft border wrapping
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // After some time, move into text
            if (Math.random() < 0.0015) {
                this.state = "assemble";
            }
        }

        // Move toward text point
        else if (this.state === "assemble") {
            const dx = this.tx - this.x;
            const dy = this.ty - this.y;

            this.x += dx * 0.05;
            this.y += dy * 0.05;

            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                this.state = "static";
            }
        }

        // Once in place, stay but pulse
        else if (this.state === "static") {
            this.x += (this.tx - this.x) * 0.1;
            this.y += (this.ty - this.y) * 0.1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(120,200,255, ${this.alpha})`;
        ctx.shadowBlur = 20;
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
