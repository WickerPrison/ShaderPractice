const fragShader = `varying vec2 pos;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float delta;

vec4 transparent = vec4(0.0);

void main(void){
    vec4 image = texture2D(texture1, pos);
    vec4 image2 = texture2D(texture2, pos);
    vec4 perlin = texture2D(texture0, pos * 0.5);
    vec4 mask = step(perlin, vec4(sin(delta * 2.0) * 0.5 + 0.5));  
    vec4 outColor = mix(image, image2, vec4(mask.x));
    gl_FragColor = outColor;
}
`