const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters to display
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const chars = letters.split("");

// Font size of each drop
const fontSize = 14;

// Number of columns
const columns = canvas.width / fontSize;

// Array of drops — one per column
let drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function draw() {
  // Semi-transparent background to create comet/trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0"; // neon green
  ctx.font = `${fontSize}px monospace`;

  // Draw each drop
  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    // Reset drop after it falls off screen
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(draw, 33); // 30 FPS



// ------------------------------------------RANDOMIZED VERSION--------------------------------------------------

// const canvas = document.getElementById("matrix");
// const ctx = canvas.getContext("2d");

// // Set canvas to full screen
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // Characters to display
// const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// const chars = letters.split("");

// // Font size of each drop
// const fontSize = 12;

// // Number of columns
// const columns = canvas.width / fontSize;

// // Drops & per-column speeds
// let drops = [];
// let speed = [];

// for (let i = 0; i < columns; i++) {
//   drops[i] = Math.floor(Math.random() * canvas.height); // random start
//   speed[i] = Math.random() * 2 + 0.5; // random speed
// }

// function draw() {
//   // Semi-transparent background to create comet/trail effect
//   ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   ctx.fillStyle = "#0F0";
//   ctx.font = `${fontSize}px monospace`;

//   for (let i = 0; i < drops.length; i++) {

//     if (Math.random() > 0.98) continue; // random flicker

//     const char = chars[Math.floor(Math.random() * chars.length)];
//     ctx.fillText(char, i * fontSize, drops[i] * fontSize);

//     // Reset drop after it falls off screen
//     if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
//       drops[i] = 0;
//       speed[i] = Math.random() * 2 + 0.5; // new speed after reset
//     }

//     drops[i] += speed[i]; // random fall speed
//   }
// }

// setInterval(draw, 33);
