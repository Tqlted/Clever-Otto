var gridSize;
var grid;
var sizePx = 40;
var playing = new Boolean(false);
var points = new Array();
var currentPoint = 0;
var score;

var failAudio = new Audio('fail.wav');
var highlightAudio = new Audio('highlight.wav');
var scoreUpAudio = new Audio('scoreUp.wav');


function play() {
    window.location.href="game.html";
}

function startGame() {
    gridSize = Number(localStorage.getItem("gridSize"));
    grid = gridSize*gridSize;
    points = [];
    score = 0;
    updateScore();
    createItems();
    styleItems();
    setTimeout(() => {
    startRound();
    }, 200);
}

function createItems() {
    for(var i = 1; i<=grid; i++) {
    gameArea = document.getElementById("gameArea");
    const button = document.createElement('button');
    button.id = "" + i;
    console.log(i);
    button.addEventListener("click", function() {
        clickPoint(button.id);
    });
    gameArea.appendChild(button);
    if(i%gridSize == 0) {
        const newline = document.createElement("div");
        newline.class = "newline";
        
    }
    }
}

function styleItems() {
    const gameArea = document.getElementById("gameArea");
    gameArea.style.gridTemplateColumns = "repeat(" + gridSize + "," + sizePx/gridSize + "vw)";
    gameArea.style.gridTemplateRows = "repeat(" + gridSize +"," + sizePx/gridSize + "vw)";
    for(const item of gameArea.children) {
        item.style.width = sizePx/gridSize + "vw";
        item.style.height = sizePx/gridSize + "vw";
    }
}

function startRound() {
    playing = false;
    points.push( 
        Math.floor(1 + Math.random() * grid)
    );
    currentPoint = 0;
    updateScore();
    
    for (const [index, point] of points.entries()) {
        setTimeout(() => {
            highlightPoint(point);
            if (index === points.length - 1) {
                setTimeout(() => {
                    console.log("Your turn!");
                    playing = true;
                }, 900);
            }
        }, 900 * (index + 1));
    }
    
}

function highlightPoint(point) {
    highlightAudio.currentTime = 0;
    highlightAudio.play();
    const gameArea = document.getElementById("gameArea");
    for(const button of gameArea.children) {
        button.style.backgroundColor = "#EFEFFF";
    }
    const button = document.getElementById("" + point);
    setTimeout(function () {
        button.style.backgroundColor = "#EFEFFF";
    }, 500);
        button.style.backgroundColor = "#7777FF";
    
}

function clickPoint(point) {
    if (playing === true) {
        playing = false;
        highlightPoint(point);
        const rightPoint = points[currentPoint];
        if ("" + rightPoint == point) {
            console.log(rightPoint + " == " + point);
            currentPoint++;
            updateScore();
            if (currentPoint >= points.length) {
                setTimeout(function () {
                scoreUpAudio.play();
                score++;
                updateScore();
                startRound();
                }, 500);
            }
        } else {
            lose();
        }
        playing = true;
    }
}

function lose() {
    failAudio.play();
    alert("You lost!\nScore: " + score);
    window.location.href="index.html";
}

function updateScore() {
    document.getElementById('score').innerHTML = 'Score: ' + score + ' (' + currentPoint + '/' + points.length + ')';
}

function mainMenu() {
    if(localStorage.getItem("gridSize") == null) {
        localStorage.setItem("gridSize", "3");
    } 
    updateGridOption();
    document.getElementById('gridOption').addEventListener("contextmenu", function(event) {
        event.preventDefault();
        changeGridSize(event);
    });
    document.getElementById('gridOption').addEventListener("click", function(event) {
        changeGridSize(event);
    });
}

function updateGridOption() {
    gz = localStorage.getItem("gridSize");
    document.getElementById('gridOption').innerHTML = "Grid: " + gz + "×" + gz;
}

function changeGridSize(type) {
    gz = Number(localStorage.getItem("gridSize"));
    console.log(type.which);
    if(type.which == 1) {
        gz++;
    }
    else if(type.which == 3) {
        gz--;
    }
    if(gz < 2) gz = 2;
    if (gz > 10) gz = 10;
    localStorage.setItem("gridSize", "" +gz);
    updateGridOption();
}

