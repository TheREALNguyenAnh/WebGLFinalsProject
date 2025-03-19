#version 300 es
in vec3 aPosition;
in vec2 aTextureCoord;
in vec3 aNormal; // Normal attribute

out vec2 vTextureCoord;
out vec3 vNormal; // Pass the normal to the fragment shader
out vec3 vFragPos; // Pass the world position of the fragment

uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;

uniform vec4 lightPosition;
uniform vec4 lightAmbient;
uniform vec4 lightDiffuse;
uniform vec4 lightSpecular;
uniform vec3 lightDirection;
uniform float lightCutoff;
uniform float lightAlpha;

out vec4 vLightPosition;
out vec4 vLightAmbient;
out vec4 vLightDiffuse;
out vec4 vLightSpecular;
out vec3 vLightDirection;
out float vLightCutoff;
out float vLightAlpha;

void main() {
    vec4 worldPosition = modelMatrix * vec4(aPosition, 1.0);
    gl_Position = projectionMatrix * cameraMatrix * worldPosition;

    vTextureCoord = aTextureCoord;
    vNormal = normalize(mat3(modelMatrix) * aNormal); // Transform normal to world space
    vFragPos = vec3(worldPosition); // Store world position

    vLightPosition = lightPosition;
    vLightAmbient = lightAmbient;
    vLightDiffuse = lightDiffuse;
    vLightSpecular = lightSpecular;
    vLightDirection = lightDirection;
    vLightCutoff = lightCutoff;
    vLightAlpha = lightAlpha;
}
