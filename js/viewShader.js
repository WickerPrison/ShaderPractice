const shaderData = data[sessionStorage.getItem("shaderIndex")];
const fragLink = document.getElementById("frag-link");
const vertLink = document.getElementById("vert-link");
const title = document.getElementById('title');
title.innerText = shaderData.name;
fragLink.href = "https://github.com/WickerPrison/ShaderPractice/tree/main/Shaders/" + shaderData.fragShader;
vertLink.href = "https://github.com/WickerPrison/ShaderPractice/tree/main/Shaders/" + shaderData.vertShader;

let firstScriptLoaded = false;
const ready = () => {
    if(!firstScriptLoaded){
        firstScriptLoaded = true;
    }
    else{
        setupShader();
    }
}

const setupShader = () =>{
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

    if(shaderData.textures){
        for(let i = 0; i < shaderData.textures.length; i++){
            uniforms["texture" + i] = PIXI.Texture.from(shaderData.textures[i]);
        }
    }
    
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
}

const loadScript = (shader) => {
    const scriptElm = document.createElement("script");
    scriptElm.src = "./Shaders/" + shader;
    scriptElm.onload = ready;
    document.head.appendChild(scriptElm);
}

loadScript(shaderData.vertShader);
loadScript(shaderData.fragShader);