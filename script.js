let numberofTries = prompt("Number of tries");
let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = parseInt(numberofTries);

const BAR_THICKNESS = (WINNING_SCORE*100)-50;
const BAR_HEIGHT = 10;
const PROGRESS_START = 400 - (BAR_THICKNESS/2);

let showWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
let player1Bar = 50;
let player2Bar = -50;

function calculateMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(evt) {
    if(showWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    progress = document.getElementById("progressBar");
    progressContext = canvas.getContext("2d");

    let framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
        progressBar();
    }, 1000/framesPerSecond);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener("mousemove", function(evt) {
        let mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

function computerMovement() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

    if(paddle2YCenter < ballY) {
        paddle2Y += 6;
    }else {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    
    if(showWinScreen) {
        return;
    }

    computerMovement();

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if(ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else {
            player2Score++;
            ballReset();
        }
    }

    if(ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else {
            player1Score++;
            ballReset();
        }
    }

    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (let i=0; i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, "white");
    }
}

function progressBar() {

    if(showWinScreen) {
        if(player1Score >= WINNING_SCORE) {
            colorRect(PROGRESS_START, 10, BAR_THICKNESS, BAR_HEIGHT, "yellow");
            canvasContext.fillText("Left Player won", 350, 200);
        } else if (player2Score >= WINNING_SCORE) {
            colorRect(PROGRESS_START, 10, BAR_THICKNESS, BAR_HEIGHT, "green");
            canvasContext.fillText("Right Player won", 350, 200);
        } 
        
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }

    // progress bar base
    colorRect(PROGRESS_START, 10, BAR_THICKNESS, BAR_HEIGHT, "white");

    // player1 progress bar
    colorRect(PROGRESS_START, 10, player1Bar * player1Score, BAR_HEIGHT, "yellow");

    // player2 progress bar
    colorRect(BAR_THICKNESS+PROGRESS_START, 10, player2Bar * player2Score, BAR_HEIGHT, "green");
}


function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, "black");
    
    drawNet();

    // player 1
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

    // player2 (computer)
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

    colorCircle(ballX, ballY, 10, "white");

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function ballReset(){
    // progressBar();

    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}