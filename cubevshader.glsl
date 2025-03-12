#version 300 es
in vec3 aPosition;
in vec2 aTextureCoord;

out vec2 vTextureCoord;
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
    gl_Position = projectionMatrix * cameraMatrix * modelMatrix * vec4(aPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vLightPosition = lightPosition;
    vLightAmbient = lightAmbient;
    vLightDiffuse = lightDiffuse;
    vLightSpecular = lightSpecular;
    vLightDirection = lightDirection;
    vLightCutoff = lightCutoff;
    vLightAlpha = lightAlpha;
}