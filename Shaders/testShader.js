const fragShader = `varying vec2 pos;
uniform sampler2D texture1;
uniform float delta;

float zoom = 3.0;
float speed = 2.0;
vec4 water = vec4(0.145, 0.588, 0.745, 1);
vec4 foam = vec4(0.345, 0.788, 0.945, 1);

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b*cos(6.28318*(c*t+d));
}

float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}

void main(void){
    vec2 uv = pos * 2.0 - 1.0;
    vec2 uv0 = uv;
    
    vec3 a = vec3(0.5);
    vec3 b = vec3(-.13, 0.5, 0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.1084, -0.501, -0.551);
    
    vec3 outColor = vec3(0.0);
    
    //uv = fract(uv * 2.0) - 0.5;
    vec3 col = palette(length(uv0) + delta, a, b, c, d);
    
    float distance = sdHexagon(uv, 0.5);
    //distance = abs(distance);





    gl_FragColor = vec4(distance, distance, distance, 1.0);
}`