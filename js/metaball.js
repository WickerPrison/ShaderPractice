const circleNumElm = document.getElementById("circle-num");
const fuzzynessElm = document.getElementById("fuzzyness");
const sizeElm = document.getElementById("size");
const ballColorElm = document.getElementById("ball-color");
const backgroundColorElm = document.getElementById("background-color");
const forceElm = document.getElementById("force");
const frictionElm = document.getElementById("friction");
const gravityElm = document.getElementById("gravity");
const bouncinessElm = document.getElementById("bounciness");

const app = new PIXI.Application({
    backgroundColor: 0x2980b9,
});

const frame = document.getElementById("frame");
frame.appendChild(app.view);
const canvas = frame.querySelector("canvas");

window.addEventListener("resize", () =>{
    const parent = app.view.parentNode;
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
    img.width = parent.clientWidth;
    img.height = parent.clientHeight;
});

let vShader = vertShader;
let fShader = metaballShader;
let uniforms = {};

const myFilter = new PIXI.Filter(vShader, fShader, uniforms);

const img = new PIXI.Sprite(PIXI.Texture.from(canvas));

img.filters = [myFilter];

app.stage.addChild(img);

app.ticker.add(animate);

let circles = [];
let velocities = [];
let circleNum;
let cursorForce;
let friction;
let gravity;
let bounciness;

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
    friction = Number(frictionElm.value);
    gravity = Number(gravityElm.value);
    bounciness = Number(bouncinessElm.value);
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
    for(let x = 0; x < circleNum * 3; x += 3){
        let y = x+1;
        let z = x + 2;
        if(circles[x] + circles[z] >= 1){
            velocities[x] = -1 * Math.abs(velocities[x]) * bounciness;
        }
        else if(circles[x] - circles[z] <=0){
            velocities[x] = Math.abs(velocities[x]) * bounciness;
        }

        if(circles[y] + circles[z] >= 1){
            velocities[y] = -1 * Math.abs(velocities[y]) * bounciness;
        }
        else if(circles[y] - circles[z] <=0){
            velocities[y] = Math.abs(velocities[y]) * bounciness;
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

        velocities[x] *= 1 - friction;
        velocities[y] *= 1 - friction;

        velocities[y] += gravity;
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