//This is a very simple shader that just uses the a perlin noise texture to transition between two images

const fragShader = `varying vec2 pos;
// read in textures from the CPU
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float delta;

void main(void){
    //read in value of images and perlin noise at this pixel
    vec4 image = texture2D(texture1, pos);
    vec4 image2 = texture2D(texture2, pos);
    vec4 perlin = texture2D(texture0, pos * 0.5);

    //define a variable threshold that oscillates between 0 and 1 over time
    //when the perlin noise is above the threshold, the value of the mask is set to 1 
    //when the perlin noise is below the threshold, the value of the mask is set to 0
    vec4 mask = step(perlin, vec4(sin(delta * 2.0) * 0.5 + 0.5));

    //Where the mask is 0 set the pixel to show the first image
    //Where the mask is 1 set the pixel to show the second image
    vec4 outColor = mix(image, image2, vec4(mask.x));

    //render final results
    gl_FragColor = outColor;
}
`