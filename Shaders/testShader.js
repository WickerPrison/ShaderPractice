console.log("shader loaded");

const fragShader = `varying vec2 pos;
uniform sampler2D uSampler;
uniform sampler2D perlin;
uniform float delta;
vec4 water = vec4(0.145, 0.588, 0.745, 1);
vec4 foam = vec4(0.345, 0.788, 0.945, 1);

void main(void){
    float horizWave = sin(pos.x / (pos.y + 0.1) * 10.0 + delta) + sin(pos.x * pos.y * 30.0 - delta * 2.0) + sin(pos.x * 15.0 + delta * 2.0);
    
    float color = sin(pos.y * 30.0 - delta * 2.0 + horizWave) + 1.1;

    color = step(color, 0.3);
    vec4 outColor = mix(water, foam, color);

    gl_FragColor = outColor;
}`