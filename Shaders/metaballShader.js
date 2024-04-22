//This is the shader for the metaball simulation
//It renders the metaballs to the screen

const metaballShader = `varying vec2 pos;

//Bring in settings and variables from the CPU
const int max_num_circles = 50;
uniform vec3 circles[max_num_circles];
uniform int num_circles;
uniform float fuzzyness;
uniform float size;
uniform vec3 ball_color;
uniform vec3 background_color;

//This code is run in parallel for every pixel in the shader
void main(void){
    //The density determines if the pixel is part of a metaball or not
    float density = 0.0;

    //Each metaball is looped through and the density is increased based on how close the pixel is to the metaball
    for(int i = 0; i < max_num_circles; i++){
        if(i >= num_circles) {break;}
        float d = length(pos - circles[i].xy);
        d = exp(-fuzzyness * d);
        
        density += max(d, 0.0);
    }

    //Any pixel with a density greater than the size value set by the user is set to 1
    //Any pixel with a density less than the size value set by the user is set to 0
    float mask = step(size, density);

    //Any pixel with a value of 1 is given the ball_color
    //Any pixel with a value of 0 is given the background_color
    vec3 color = mix(background_color, ball_color, mask);

    //Output final results with alpha set to 1
    gl_FragColor = vec4(color, 1.0);
}`