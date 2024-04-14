const sdfShader = `varying vec2 pos;

const int num_circles = 20;
uniform vec3 circles[num_circles];

void main(void){
    float color = 1.0;
    float density = 0.0;
    for(int i = 0; i < num_circles; i++){
        float d = length(pos - circles[i].xy);
        d = exp(- 15.0 *d);
        
        density += max(d, 0.0);
    }

    float mask = step(0.6, density);
    color *= mask;

    gl_FragColor = vec4(color, color, color, 1);
}`