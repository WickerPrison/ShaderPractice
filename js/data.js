const ShaderType = {
    OWNPAGE: "OWNPAGE",
    VIEWSHADER: "VIEWSHADER"
}

const data = [
    {
        name: "Metaball Simulation",
        link: "./metaballs.html",
        preview: "./previews/MetaballShader.gif",
        type: ShaderType.OWNPAGE
    },
    {
        name: "Simple Water Shader",
        link: "./viewShader.html",
        preview: "./previews/SimpleWaterShader.gif",
        vertShader: "standardVert.js",
        fragShader: "testShader.js",
        type: ShaderType.VIEWSHADER
    }
]