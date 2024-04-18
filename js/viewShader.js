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
let fShader = fragShader;
let uniforms = {
    delta: 0
};

const myFilter = new PIXI.Filter(vShader, fShader, uniforms);

const img = new PIXI.Sprite(PIXI.Texture.from(canvas));

img.filters = [myFilter];

app.stage.addChild(img);

app.ticker.add(animate);

let delta = 0;
function animate(){
    delta += 0.01;
    uniforms.delta = delta;
}