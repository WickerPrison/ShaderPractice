const canvas = document.getElementById("myCanvas");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;


const app = new PIXI.Application({
    view: canvas,
    backgroundColor: 0x2980b9,
    width: windowWidth,
    height: windowHeight,
    resolution: window.devicePixelRatio,
    autoDensity: true
});

window.addEventListener("resize", () =>{
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    app.renderer.resize(windowWidth, windowHeight);
});

let vShader = vertShader;
let fShader = sdfShader;
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

const circles = [];
const velocities = [];
for(let i = 0; i < 20; i++){
    circles.push(Math.random() * 0.9 + 0.05, Math.random() * 0.9 + 0.05, Math.random() / 50 + 0.02);
    velocities.push(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, 0);
}
uniforms.circles = circles;

const mousePos = [];

function animate(){
    img.x = app.renderer.screen.width / 2;
    img.y = app.renderer.screen.height / 2;

    for(let x = 0; x < 30; x += 3){
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
            let forceX = 0.0005 / (distance * distance * 50) * xDist / Math.abs(xDist);
            
            let forceY = 0.0005 / (distance * distance * 50) * yDist / Math.abs(yDist);

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

        // velocities[x] *= 0.999;
        // velocities[y] *= 0.999;
    }

    uniforms.circles = circles;
}

document.addEventListener('mousemove', event => {
    mousePos[0] = event.clientX / document.documentElement.clientWidth;
    mousePos[1] = event.clientY / document.documentElement.clientHeight;
})

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}
