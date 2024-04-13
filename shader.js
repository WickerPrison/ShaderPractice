const canvas = document.getElementById("myCanvas");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;


const app = new PIXI.Application({
    view: canvas,
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

let vShader = vertShader.innerHTML;
let fShader = fragShader.innerHTML;
let uniforms = {
    delta: 0,
    perlin: PIXI.Texture.from("https://imgs.search.brave.com/sksLJoDCQW0RHsKZKmH6UW5dUbikM3TcnX8zPfiID0M/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pLnN0/YWNrLmltZ3VyLmNv/bS9pMDB5eC5wbmc")
};

const myFilter = new PIXI.Filter(vShader, fShader, uniforms);

const texture = PIXI.Texture.from("https://imgs.search.brave.com/QCfVHGlr0akNgT0CWD4NRn2b09CvBRhyAiomYnKgYEM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L2Zp/Y3Rpb25hbGNyb3Nz/b3Zlci9pbWFnZXMv/MC8wMC9JbnZpbmNp/YmxlX0ZvcnRuaXRl/LndlYnAvcmV2aXNp/b24vbGF0ZXN0L3Nj/YWxlLXRvLXdpZHRo/LWRvd24vMjAwP2Ni/PTIwMjMxMTIyMjE1/NzQx");
const img = new PIXI.Sprite(texture);

img.anchor.x = 0.5;
img.anchor.y - 0.5;
img.filters = [myFilter]

app.stage.addChild(img);

app.ticker.add(animate);

let delta = 0;
function animate(){
    img.x = app.renderer.screen.width / 2;
    img.y = app.renderer.screen.height / 2;
    delta += 0.01;
    uniforms.delta = delta;
}