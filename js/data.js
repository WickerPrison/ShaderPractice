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
        name: "Stylized Water Shader",
        link: "./viewShader.html",
        preview: "./previews/SimpleWaterShader.gif",
        vertShader: "standardVert.js",
        fragShader: "waterShader.js",
        textures: ["./textures/PerlinNoise.png"],
        type: ShaderType.VIEWSHADER
    },
    {
        name: "Dissolve Shader",
        link: "./viewShader.html",
        preview: "./previews/DissolveShader.gif",
        vertShader: "standardVert.js",
        fragShader: "dissolveShader.js",
        textures: ["./textures/PerlinNoise.png",
        "https://imgs.search.brave.com/lDjpsAjrjDAYmqNkbEGWICuUsMeq3jzEPvWEo1NgJCI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wNy8x/eDEtYXNwZWN0LXJh/dGlvLWphaW1lLXJl/aW1lci5qcGc",
        "https://imgs.search.brave.com/fTUl9Lkgmr6U4XQkoO2VW2W4R3ZeXJDHkDbaJ229koE/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vZGlnaXRh/bC1waG90b2dyYXBo/eS1zY2hvb2wuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDEz/LzA3L2JzLTAzLmpw/Zz9zc2w9MQ"],
        type: ShaderType.VIEWSHADER
    }
]