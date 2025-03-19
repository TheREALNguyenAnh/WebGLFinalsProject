#version 300 es
precision mediump float;

in vec2 vTextureCoord;
in vec3 vNormal; // Normal from vertex shader
in vec3 vFragPos; // Fragment position in world space

in vec4 vLightPosition;
in vec4 vLightAmbient;
in vec4 vLightDiffuse;
in vec4 vLightSpecular;
in vec3 vLightDirection;
in float vLightCutoff;
in float vLightAlpha;

uniform sampler2D uTextureUnit;
uniform vec3 uViewPosition; // Camera position in world space

out vec4 fColor;

void main() {
    vec4 texColor = texture(uTextureUnit, vTextureCoord);
    
    // Normalize vectors
    vec3 N = normalize(vNormal);
    vec3 L = normalize(vec3(vLightPosition) - vFragPos); // Light direction
    vec3 V = normalize(uViewPosition - vFragPos); // View direction
    vec3 R = reflect(-L, N); // Reflection vector

    // Ambient lighting
    vec4 ambient = vLightAmbient * texColor;

    // Diffuse lighting (Lambertian)
    float diff = max(dot(N, L), 0.0);
    vec4 diffuse = diff * vLightDiffuse * texColor;

    // Specular lighting (Phong)
    float spec = pow(max(dot(V, R), 0.0), vLightAlpha);
    vec4 specular = spec * vLightSpecular;
    spec = clamp(spec, 0.0, 1.0);

    // Combine results
    fColor =  ambient + diffuse + specular;
}
