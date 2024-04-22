//This is a very standard vertex shader that doesn't do anything interesting
//I have chosen to stick to 2D shaders on this website up to this point for performance reasons,
//but if I ever make 3D shaders for this website then the vertex shader will be more important

const vertShader = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 pos;

void main(void){
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    pos = aTextureCoord;
}`;