const canvas = document.getElementById("myCanvas");
const circleNumElm = document.getElementById("circle-num");
const fuzzynessElm = document.getElementById("fuzzyness");
const sizeElm = document.getElementById("size");
const ballColorElm = document.getElementById("ball-color");
const backgroundColorElm = document.getElementById("background-color");
const forceElm = document.getElementById("force");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;


const app = new PIXI.Application({
    view: canvas,
    backgroundColor: 0x2980b9,
    // width: windowWidth,
    // height: windowHeight,
    //resolution: window.devicePixelRatio,
    //autoDensity: true
});

window.addEventListener("resize", () =>{
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    app.renderer.resize(windowWidth, windowHeight);
});

let vShader = vertShader;
let fShader = metaballShader;
let uniforms = {
    delta: 0,
    perlin: PIXI.Texture.from("https://imgs.search.brave.com/sksLJoDCQW0RHsKZKmH6UW5dUbikM3TcnX8zPfiID0M/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pLnN0/YWNrLmltZ3VyLmNv/bS9pMDB5eC5wbmc")
};

const myFilter = new PIXI.Filter(vShader, fShader, uniforms);

const img = new PIXI.Sprite(PIXI.Texture.from(canvas));

img.anchor.x = 0.5;
img.anchor.y = 0.5;
img.filters = [myFilter];

canvas.filters = [myFilter];

app.stage.addChild(img);

app.ticker.add(animate);

let circles = [];
let velocities = [];
let circleNum;
let cursorForce;

function setUpMetaballs(){
    circles = [];
    velocities = [];
    circleNum = circleNumElm.value;
    for(let i = 0; i < circleNum; i++){
        circles.push(Math.random() * 0.9 + 0.05, Math.random() * 0.9 + 0.05, 0.05);
        velocities.push(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, 0);
    }
    uniforms.circles = circles;
    uniforms.num_circles = circleNum;
    uniforms.fuzzyness = fuzzynessElm.value;
    uniforms.size = 0.601 - sizeElm.value;
    cursorForce = forceElm.value;
    uniforms.ball_color = hexToRgb(ballColorElm.value);
    uniforms.background_color = hexToRgb(backgroundColorElm.value);
}

function hexToRgb(hex) {
    const color = hex;
    const r = parseInt(color.substr(1,2), 16)
    const g = parseInt(color.substr(3,2), 16)
    const b = parseInt(color.substr(5,2), 16)
    return [r/255, g/255, b/255];
  }

setUpMetaballs();

const mousePos = [];

function animate(){
    img.x = app.renderer.screen.width / 2;
    img.y = app.renderer.screen.height / 2;

    for(let x = 0; x < circleNum * 3; x += 3){
        let y = x+1;
        let z = x + 2;
        if(circles[x] + circles[z] >= 1){
            velocities[x] = -1 * Math.abs(velocities[x]);
        }
        else if(circles[x] - circles[z] <=0){
            velocities[x] = Math.abs(velocities[x]);
        }

        if(circles[y] + circles[z] >= 1){
            velocities[y] = -1 * Math.abs(velocities[y]);
        }
        else if(circles[y] - circles[z] <=0){
            velocities[y] = Math.abs(velocities[y]);
        }
        
        if(mousePos[0] != undefined){
            let xDist = mousePos[0] - circles[x];
            let yDist = mousePos[1] - circles[y];
            let distance = Math.sqrt(xDist * xDist + yDist * yDist);
            let forceX = cursorForce / (distance * distance * 50) * xDist / Math.abs(xDist);
            
            let forceY = cursorForce / (distance * distance * 50) * yDist / Math.abs(yDist);

            if(mouseDown){
                velocities[x] += forceX / circles[z]/ 100;
                velocities[y] += forceY / circles[z] / 100;
            }
            else{
                velocities[x] -= forceX / circles[z]/ 100;
                velocities[y] -= forceY / circles[z] / 100;
            }
        }
        
        circles[x] += velocities[x];
        circles[y] += velocities[y];

        velocities[x] *= 0.999;
        velocities[y] *= 0.999;
    }

    uniforms.circles = circles;
}

document.addEventListener('mousemove', event => {
    let rect = canvas.getBoundingClientRect();
    mousePos[0] = (event.clientX - rect.left) / (rect.right - rect.left);
    mousePos[1] = (event.clientY - rect.top) / (rect.bottom - rect.top);
})

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

document.getElementById("apply-button").addEventListener("click", () => {
    setUpMetaballs();
})