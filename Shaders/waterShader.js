const fragShader = `varying vec2 pos;
uniform sampler2D texture0;
uniform float delta;

float zoom = 3.0;
float speed = 2.0;
vec4 water = vec4(0.145, 0.588, 0.745, 1);
vec4 foam = vec4(0.345, 0.788, 0.945, 1);

void main(void){
    vec2 input1 = vec2(fract(pos.x / zoom + delta / speed / 5.0), fract(pos.y / zoom + delta / speed / 6.0));
    vec4 perlinNoise1 = texture2D(texture0, input1);
    vec2 input2 = vec2(fract(pos.x / zoom - delta / speed / 4.0), fract(pos.y / zoom + delta/ speed / 5.0));
    vec4 perlinNoise2 = texture2D(texture0, input2);
    vec4 color = (perlinNoise1 + perlinNoise2) / 2.0;
    vec4 mask1 = vec4(step(color, vec4(0.55)));
    vec4 mask2 = vec4(step(color, vec4(0.5)));
    color = mask1 - mask2;
    //color += vec4(step(circle, vec4(0.5)));
    color.a = 1.0;
    vec4 outColor = mix(water, foam, color);
    gl_FragColor = outColor;
}`