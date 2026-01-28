const canvas = document.getElementById("flapCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const overlay = document.getElementById("overlay");

let bird, pipes, frame, score, highScore, gameActive;

function startGame() {
    score = 0;
    frame = 0;
    gameActive = true;
    highScore = localStorage.getItem("flapHighScore") || 0;
    highScoreEl.innerText = highScore;
    overlay.style.display = "none";

    bird = { x: 50, y: 200, w: 30, h: 24, velocity: 0, gravity: 0.25, jump: 4.5 };
    pipes = [];
    requestAnimationFrame(update);
}

window.addEventListener("keydown", e => { if(e.code === "Space") bird.velocity = -bird.jump; });
canvas.addEventListener("touchstart", () => { bird.velocity = -bird.jump; });

function update() {
    if (!gameActive) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Spawn Pipes
    if (frame % 90 === 0) {
        let gap = 120;
        let minPipeHeight = 50;
        let pipeHeight = Math.floor(Math.random() * (canvas.height - gap - minPipeHeight * 2)) + minPipeHeight;
        pipes.push({ x: canvas.width, y: 0, w: 50, h: pipeHeight, type: 'top' });
        pipes.push({ x: canvas.width, y: pipeHeight + gap, w: 50, h: canvas.height, type: 'bottom' });
    }

    pipes.forEach((p, index) => {
        p.x -= 2;

        // Collision detection
        if (bird.x < p.x + p.w && bird.x + bird.w > p.x &&
            bird.y < p.y + p.h && bird.y + bird.h > p.y) {
            gameOver();
        }

        if (p.x + p.w < 0) {
            if(p.type === 'top') {
                score++;
                scoreEl.innerText = score;
            }
            pipes.splice(index, 1);
        }
    });

    if (bird.y + bird.h > canvas.height || bird.y < 0) gameOver();

    frame++;
    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bird
    ctx.fillStyle = "#fde047";
    ctx.fillRect(bird.x, bird.y, bird.w, bird.h);

    // Draw Pipes
    ctx.fillStyle = "#bc13fe";
    pipes.forEach(p => {
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(p.x, p.y, p.w, p.h);
    });
}

function gameOver() {
    gameActive = false;
    if (score > highScore) localStorage.setItem("flapHighScore", score);
    overlay.style.display = "block";
    document.querySelector(".overlay h2").innerText = "SYSTEM CRASH!";
}