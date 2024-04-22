// this shader creates a cool, infinitely repeating geometric pattern

const fragShader = `varying vec2 pos;

// get a time value from the CPU
uniform float delta;

// This is a standard function for generating a gradient of multiple colors. Explanation here: https://iquilezles.org/articles/palettes/
// This website was used to help determine the values to define the gradient: http://dev.thi.ng/gradients/ 
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b*cos(6.28318*(c*t+d));
}

// A Signed Distance Function is a function that defines the distance to a shape from every point, where points inside the shape have a negative distance, and points right on the boundary have a distance of 0
// This SDF for a hexagon was taken from here: https://iquilezles.org/articles/distfunctions2d/
float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}

void main(void){
    // this centers the coordinate system with the origin at the center of the shader
    vec2 uv = pos * 2.0 - 1.0;

    //store a version of the uv that will not be altered later
    vec2 uv0 = uv;
    
    //define the variables for the palette function 
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.8384, 0.5, 0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(-0.441, -0.051, -0.551);
    
    //declare a variable that will have our final result
    vec3 outColor = vec3(0.0);
    
    //loop through mulitple iterations of this code to generate increasingly smaller versions of the fractal pattern
    for(float i = 0.0; i < 4.0; i++){
        // centers the coordinate system of each fractal unit to its own section of the shader
        // an offset dependant on i is included to provide more variety to the pattern
        uv = fract(uv * (2.0 - i / 3.0)) - 0.5;
        
        // find the distance to a hexagon centered in the middle of the shader with a radius of 0.5
        float distance = sdHexagon(uv, 0.5);

        // get a color from the color gradient that is dependant on time, distance to the hexagon, and distance to center of the shader
        vec3 col = palette(distance + delta + length(uv0), a, b, c, d);

        // modify the hexagon distance variable using sin so it is repeatable
        // also make it depend on delta so it changes over time and on length(uv0) to increase variety
        distance = sin(distance * 6.0 + delta * 3.0 + length(uv0) * 5.0) / 6.0;

        // take the absolute value. This makes the inside and outside of the hexagon the same, essentially giving us the outline of the shape
        distance = abs(distance);
    
        // raise the inverse of the distance to the power of 1.4
        // inverting the distance flips the light and dark parts of the pattern, it also is responsible for the glowing effect
        // raising it to the power of 1.4 increases contrast
        distance = pow(0.02 / distance, 1.4);
    
        // on each iteration the results are added to the final color
        outColor += col * distance;
    }

    // render final color of pixel
    gl_FragColor = vec4(outColor, 1.0);
}`