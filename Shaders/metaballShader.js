const metaballShader = `varying vec2 pos;

const int max_num_circles = 50;
uniform vec3 circles[max_num_circles];
uniform int num_circles;
uniform float fuzzyness;
uniform float size;
uniform vec3 ball_color;
uniform vec3 background_color;

void main(void){
    float density = 0.0;
    for(int i = 0; i < max_num_circles; i++){
        if(i >= num_circles) {break;}
        float d = length(pos - circles[i].xy);
        d = exp(-fuzzyness * d);
        
        density += max(d, 0.0);
    }

    float mask = step(size, density);
    vec3 color = mix(background_color, ball_color, mask);

    gl_FragColor = vec4(color, 1);
}`