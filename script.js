var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;
canvasWidth = canvas.width;
canvasHeight = canvas.height;

const score = document.getElementById("score");
const life = document.getElementById("lifes");

var container = document.getElementsByClassName("container")[0];
container.style.width = canvas.width + "px";
container.style.height = canvas.height + "px";

var transparent = document.getElementsByClassName("transparent");

//game script
var mouseX;
var mouseY;

var frameCount = 0;

var lifes = 3;
var shots = 0;
var kills = 0;

var localBackground = localStorage.map;
var gunShot = new Audio();
gunShot.src ="assets/gunshot.wav";

canvas.addEventListener('mousemove', (e) =>{
    mouseX = e.x - container.getBoundingClientRect().left;
    mouseY = e.y - container.getBoundingClientRect().top;
});

canvas.addEventListener("click", (e) =>{
    collision_detection();
    shots++;
})

Cursor = {
    x: (canvasWidth / 2),
    y: (canvasHeight / 2),
    color: "black",
    draw: () => {
        c.strokeStyle = Cursor.color;
        c.beginPath();
        c.arc(Cursor.x, Cursor.y, 50, 0, 2 * Math.PI);  
        c.stroke();
        
        c.beginPath();
        c.arc(Cursor.x, Cursor.y, 25, 0, 2 * Math.PI);
        c.stroke();

        c.beginPath();
        c.arc(Cursor.x, Cursor.y, 1, 0, 2 * Math.PI);
        c.stroke();

        c.beginPath();
        c.moveTo((Cursor.x + 10), Cursor.y);
        c.lineTo((Cursor.x + 65), Cursor.y);
        c.moveTo((Cursor.x - 10), Cursor.y);
        c.lineTo((Cursor.x - 65), Cursor.y);
        c.moveTo(Cursor.x, (Cursor.y + 10));
        c.lineTo(Cursor.x, (Cursor.y + 65));
        c.moveTo(Cursor.x, (Cursor.y - 10));
        c.lineTo(Cursor.x, (Cursor.y - 65));
        c.stroke();

    },
    update: () => {
        if (mouseX != undefined && mouseY != undefined) {
            Cursor.x = mouseX;
            Cursor.y = mouseY;         
        }
        Cursor.draw();
    }
}

class Bird{
    constructor(id, y, health, widthOnCanvas, heightOnCanvas, staggerFrame, speed){
    this.id = id;
    this.x = canvasWidth;
    this.y = y;
    this.width = 375;
    this.height = 220;
    this.widthOnCanvas = widthOnCanvas;
    this.heightOnCanvas = heightOnCanvas;
    this.health = health;
    this.dead = false;
    this.sprite = new Image();
    this.frame = 0;
    this.StaggerFrame = staggerFrame;
    this.speed = speed;
    }
    update() {
        if (this.dead == false) {
            this.x -= this.speed;
            let position = Math.floor(frameCount/this.StaggerFrame) % 4;
            this.frame = position * this.width;  
        }
        else{
            this.fall(this.id);
        }
        this.draw();
    }
    draw() {
        this.sprite.src = 'assets/bird_sprite.png';
        c.drawImage(this.sprite, this.frame, 0, this.width, this.height, this.x, this.y, this.widthOnCanvas, this.heightOnCanvas);
    }
    fall(bird){
        this.y += 10;
        if (this.y > canvas.height) {
            for (let i = 0; i < birds.length; i++) {
                if (bird == birds[i].id) {
                    birds.splice(i, 1);
                    kills++
                }
            }
        }
    }
}

var birds = [];

var Spawn = {
    id: 0,
    y: 0,
    health: 1,
    widthOnCanvas: 75, 
    heightOnCanvas: 50, 
    staggerFrame: 15, 
    speed: 1,
    number: 0,
    spawner: () => {
        let a = Spawn;
        var value1; 
        if (frameCount % 180 == 0) {
            let position = Math.ceil(Math.random() * 10);
            if (position == 1 || position == 2 || position == 3 ) {
                Spawn.number = 1;
            }
            else if (position == 4 || position == 5 || position == 6){
                Spawn.number = 2;
            }
            else if (position == 7 || position == 8 || position == 9){
                Spawn.number = 3;
            }
            else{
                birds.push(new Bird(Spawn.id++, 250, 4, 150, 75, Spawn.staggerFrame, 0.5));
                return     
            }
            for (let i = 0; i < Spawn.number; i++) {
                a.id ++  
                a.speed = Math.random() * 2 + 1;
                a.y = Math.ceil(Math.random() * (canvasHeight - 100));   
                birds.push(new Bird(Spawn.id, Spawn.y, Spawn.health, Spawn.widthOnCanvas, Spawn.heightOnCanvas, Spawn.staggerFrame, Spawn.speed));
            } 
        }       
    }
}

function collision_detection(){
    for (let i = 0; i < birds.length; i++) {
        if (mouseX > birds[i].x && mouseX < (birds[i].x + birds[i].widthOnCanvas) && mouseY > birds[i].y && mouseY < (birds[i].y + birds[i].heightOnCanvas)) {
            birds[i].health--;
            Cursor.color = "red";
            setTimeout(function(){Cursor.color ="black"}, 100)
            if (birds[i].health <= 0) {
                birds[i].dead = true;
            }
        }   
    }
}

var pause = false;


function gameOver(){
    for (let i = 0; i < birds.length; i++){
        if (birds[i].x < 0) {
            lifes -= 1;
            birds.splice(i, 1);
        }
    }
    if (lifes <= 0) {
        displayEnd();
    }
}

function displayEnd() {
    canvas.style.display = 'none'
    document.getElementsByClassName("gameOver")[0].style.display = "grid";
    pause = true
    if (localStorage.highscore == undefined) {
        localStorage.setItem("highscore", frameCount);
    }
    if (localStorage.highscore < frameCount) {
        localStorage.setItem("highscore", frameCount);
    }
    document.getElementsByClassName("highscore")[0].innerHTML = "Highscore: " + localStorage.highscore;
    document.getElementsByClassName("kills")[0].innerHTML = "Kills: " + kills;
    document.getElementsByClassName("shots")[0].innerHTML = "Shots: " + shots;
    document.getElementsByClassName("thisScore")[0].innerHTML = "Score: " + frameCount;
}

function drawBackground() {
    if (localBackground == undefined) {
        localBackground = "assets/greenForest_background.png";
    }
    let background = new Image();
    background.src = localBackground;
    c.drawImage(background, 0, 0, canvasWidth, canvasHeight)
}

function update() {
    frameCount++
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    Spawn.spawner();  
    for (let i = 0; i < birds.length; i++) {
        birds[i].update();    
    }  
    Cursor.update();
    infoUpdate();
    gameOver();
    if (pause == true) {
        return  
    }
    requestAnimationFrame(update);
}

window.addEventListener("keypress", (e) =>{
    if (canvas.style.display == "block") {
        if (e.keyCode == 113) {
            if (pause == false) {
                pause = true;
                document.getElementsByClassName("pause")[0].style.display = "flex";
            }
            else{
                document.getElementsByClassName("pause")[0].style.display = "none";
                pause = false;
                update();
            }
          }
    }
});

function infoUpdate() {
    score.innerHTML = "Score: " + frameCount;
    life.innerHTML = "lifes left:" + lifes;
}

function start() {
    document.getElementsByClassName("startMenu")[0].style.display = "none";
    canvas.style.display = "block"; 
    localBackground = localStorage.map;
    update();
}

function resume() {
    document.getElementsByClassName("pause")[0].style.display = "none";
    pause = false;
    update();
}