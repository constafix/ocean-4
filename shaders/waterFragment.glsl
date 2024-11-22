// waterFragment.glsl
uniform float time;
uniform sampler2D waterNormals;
uniform vec3 sunDirection;
uniform vec3 sunColor;
uniform vec3 waterColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vec2 uv = vUv;
    uv.x += time * 0.1;
    vec3 normal = texture2D(waterNormals, uv).rgb * 2.0 - 1.0;

    vec3 lightDir = normalize(sunDirection);
    float lightIntensity = max(dot(vNormal, lightDir), 0.0);
    
    vec3 reflection = reflect(-lightDir, normal);
    float fresnel = pow(1.0 - dot(vNormal, lightDir), 3.0) * 0.65 + 0.35;

    vec3 waterSurfaceColor = mix(waterColor, sunColor, lightIntensity);
    waterSurfaceColor *= fresnel;

    gl_FragColor = vec4(waterSurfaceColor, 1.0);
}
