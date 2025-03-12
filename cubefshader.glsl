#version 300 es
precision mediump float;

in vec2 vTextureCoord;
in vec4 vLightPosition;
in vec4 vLightAmbient;
in vec4 vLightDiffuse;
in vec4 vLightSpecular;
in vec3 vLightDirection;
in float vLightCutoff;
in float vLightAlpha;

uniform sampler2D uTextureUnit;

out vec4 fColor;

void main() {
    fColor = texture(uTextureUnit, vTextureCoord);
    // Use the light properties for lighting calculations
}
