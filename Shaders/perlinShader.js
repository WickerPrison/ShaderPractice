const perlinShader = `varying vec2 pos;
uniform sampler2D uSampler;
uniform sampler2D perlin;
uniform float delta;

void main(void){
    vec4 vince = texture2D(uSampler, pos);
    vec2 input1 = vec2(fract(pos.x / 4.0 + delta/10.0), fract(pos.y / 4.0 + delta/15.0));
    vec4 perlinNoise1 = texture2D(perlin, input1);
    vec2 input2 = vec2(fract(pos.x - delta/4.0), fract(pos.y - delta/2.0));
    vec4 perlinNoise2 = texture2D(perlin, input2);
    vec4 color = (perlinNoise1 + perlinNoise2) / 2.0;
    color = vec4(step(color, vec4(0.5)));
    color.a = color.y;
    gl_FragColor = vince * color;
}`