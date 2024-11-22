precision highp float;

uniform sampler2D uTexture;
uniform vec3 sunDirection;
uniform vec3 sunColor;
uniform vec3 ambientLight;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 textureColor = texture2D(uTexture, vUv).rgb;

    vec3 lightDir = normalize(sunDirection);
    float lightIntensity = max(dot(vNormal, lightDir), 0.0);

    vec3 diffuse = lightIntensity * sunColor;
    vec3 ambient = ambientLight;

    vec3 finalColor = textureColor * (diffuse + ambient);
    gl_FragColor = vec4(finalColor, 1.0);
}
