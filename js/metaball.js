//Get the user input elements
const circleNumElm = document.getElementById("circle-num");
const fuzzynessElm = document.getElementById("fuzzyness");
const sizeElm = document.getElementById("size");
const ballColorElm = document.getElementById("ball-color");
const backgroundColorElm = document.getElementById("background-color");
const forceElm = document.getElementById("force");
const frictionElm = document.getElementById("friction");
const gravityElm = document.getElementById("gravity");
const bouncinessElm = document.getElementById("bounciness");

//Create PIXI application and set background color
const app = new PIXI.Application({
    backgroundColor: 0x2980b9,
});

//Get frame element. This must be done after creating PIXI app
const frame = document.getElementById("frame");
frame.appendChild(app.view);
const canvas = frame.querySelector("canvas");

//set up required variables for shader
let vShader = vertShader;
let fShader = metaballShader;
let uniforms = {};

//instantiate the shader
const myFilter = new PIXI.Filter(vShader, fShader, uniforms);

//create a sprite from the canvas
const img = new PIXI.Sprite(PIXI.Texture.from(canvas));

//attach our shader to the sprite
img.filters = [myFilter];

//attach our sprite to the canvas
app.stage.addChild(img);

//declare variables for setUpMetaballs function
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
    //loop through circles and assign random position and velocity
    for(let i = 0; i < circleNum; i++){
        circles.push(Math.random() * 0.9 + 0.05, Math.random() * 0.9 + 0.05, 0.05);
        velocities.push(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, 0);
    }
    //send variables to the shader
    uniforms.circles = circles;
    uniforms.num_circles = circleNum;
    uniforms.fuzzyness = fuzzynessElm.value;
    uniforms.size = 0.601 - sizeElm.value;
    uniforms.ball_color = hexToRgb(ballColorElm.value);
    uniforms.background_color = hexToRgb(backgroundColorElm.value);

    //define CPU only variables
    cursorForce = forceElm.value;
    friction = Number(frictionElm.value);
    gravity = Number(gravityElm.value);
    bounciness = Number(bouncinessElm.value);
}

//Converts hex colors to the shader version of RGB that goes from 0-1 instead of 0-255
function hexToRgb(hex) {
    const color = hex;
    const r = parseInt(color.substr(1,2), 16)
    const g = parseInt(color.substr(3,2), 16)
    const b = parseInt(color.substr(5,2), 16)
    return [r/255, g/255, b/255];
}

//Call the setUpMetaballs function 
setUpMetaballs();

//set up the animate function with the PIXI ticker
app.ticker.add(animate);

//A lot or all of this could be done in the shader for much better performance, but I have not gotten that figured out quite yet
const mousePos = [];
function animate(){
    //Because of how the shader works, the circles array is an array of numbers where every set of 3 numbers is the x, y, and z values for a circle position
    for(let x = 0; x < circleNum * 3; x += 3){
        let y = x + 1;
        let z = x + 2;

        //If circle has hit the wall reverse its direction and modify speed based on bounciness
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
        
        //If mouse is on screen, find distance to circle and apply repelling force that decays with distance^2
        if(mousePos[0] != undefined){
            let xDist = mousePos[0] - circles[x];
            let yDist = mousePos[1] - circles[y];
            let distance = Math.sqrt(xDist * xDist + yDist * yDist);
            let forceX = cursorForce / (distance * distance * 50) * xDist / Math.abs(xDist);
            
            let forceY = cursorForce / (distance * distance * 50) * yDist / Math.abs(yDist);

            //if mouse button is held down force becomes attracting force
            if(mouseDown){
                velocities[x] += forceX / circles[z]/ 100;
                velocities[y] += forceY / circles[z] / 100;
            }
            else{
                velocities[x] -= forceX / circles[z]/ 100;
                velocities[y] -= forceY / circles[z] / 100;
            }
        }
        
        //Move circles by velocities
        circles[x] += velocities[x];
        circles[y] += velocities[y];

        //Reduce velocities by friction
        velocities[x] *= 1 - friction;
        velocities[y] *= 1 - friction;

        //Change velocities from gravity
        velocities[y] += gravity;
    }

    //Send final circle positions to shader
    uniforms.circles = circles;
}

//Keeps shader scaled appropriately when screen is resized
window.addEventListener("resize", () =>{
    const parent = app.view.parentNode;
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
    img.width = parent.clientWidth;
    img.height = parent.clientHeight;
});

//Updates mousePos variable whenever mouse moves
document.addEventListener('mousemove', event => {
    let rect = canvas.getBoundingClientRect();
    mousePos[0] = (event.clientX - rect.left) / (rect.right - rect.left);
    mousePos[1] = (event.clientY - rect.top) / (rect.bottom - rect.top);
})

//Keeps track of if the mouse button is being held down
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