//The general idea of this shader is to scroll two perlin noise textures across each other in different directions to get water-like moving patterns
//Then a band of values is selected to be given a foam color to create moving, warping circles

const fragShader = `varying vec2 pos;
//Get texture and time from CPU
uniform sampler2D texture0;
uniform float delta;

//Set up variables
float zoom = 3.0;
float speed = 2.0;

//Define water and foam colors
vec4 water = vec4(0.145, 0.588, 0.745, 1);
vec4 foam = vec4(0.345, 0.788, 0.945, 1);

void main(void){
    //Define two positions that scroll over time in different directions based on speed
    vec2 input1 = vec2(fract(pos.x / zoom + delta / speed / 5.0), fract(pos.y / zoom + delta / speed / 6.0));
    vec2 input2 = vec2(fract(pos.x / zoom - delta / speed / 4.0), fract(pos.y / zoom + delta/ speed / 5.0));

    //Read in value of perlin noise texture at both previously defined positions
    vec4 perlinNoise1 = texture2D(texture0, input1);
    vec4 perlinNoise2 = texture2D(texture0, input2);

    //Take the average of the perlin noise texture at both positions
    vec4 color = (perlinNoise1 + perlinNoise2) / 2.0;

    //Define two masks at two different thresholds and get the difference of masks
    //This defines a band of values that are set to 1.0 while everything else is set to 0.0
    vec4 mask1 = vec4(step(color, vec4(0.55)));
    vec4 mask2 = vec4(step(color, vec4(0.5)));
    color = mask1 - mask2;

    //Ensure alpha is 1
    color.a = 1.0;

    //Set pixels with a value of 1 to have foam color
    //Set pixels with a value of 0 to have water color
    vec4 outColor = mix(water, foam, color);

    //Render final result
    gl_FragColor = outColor;
}`