//Lab 8 Done by: Nguyen Anh Nguyen, Drexel Email: ndn35
//Thiyazan Qaissi, Drexel Email: ts3375

class Cube extends Drawable {
    static vertexPositions = [
        // Front face
        vec3(-1, -1,  1),
        vec3( 1, -1,  1),
        vec3( 1,  1,  1),
        vec3(-1,  1,  1),
        // Back face
        vec3(-1, -1, -1),
        vec3(-1,  1, -1),
        vec3( 1,  1, -1),
        vec3( 1, -1, -1),
        // Top face
        vec3(-1,  1, -1),
        vec3(-1,  1,  1),
        vec3( 1,  1,  1),
        vec3( 1,  1, -1),
        // Bottom face
        vec3(-1, -1, -1),
        vec3( 1, -1, -1),
        vec3( 1, -1,  1),
        vec3(-1, -1,  1),
        // Right face
        vec3( 1, -1, -1),
        vec3( 1,  1, -1),
        vec3( 1,  1,  1),
        vec3( 1, -1,  1),
        // Left face
        vec3(-1, -1, -1),
        vec3(-1, -1,  1),
        vec3(-1,  1,  1),
        vec3(-1,  1, -1)
    ];

    static vertexTextureCoords = [
        // Front face
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1),
        // Back face
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1),
        // Top face
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1),
        // Bottom face
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1),
        // Right face
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1),
        // Left face
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1)
    ];

    static indices = [
        0, 1, 2, 0, 2, 3,    // Front face
        4, 5, 6, 4, 6, 7,    // Back face
        8, 9, 10, 8, 10, 11, // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23  // Left face
    ];

    static positionBuffer = -1;
    static textureCoordBuffer = -1;
    static indexBuffer = -1;

    static shaderProgram = -1;

    static aPositionShader = -1;
    static aTextureCoordShader = -1;

    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;

    static texture = -1;
    static uTextureUnitShader = -1;

    static uLightPositionShader = -1;
    static uLightAmbientShader = -1;
    static uLightDiffuseShader = -1;
    static uLightSpecularShader = -1;
    static uLightDirectionShader = -1;
    static uLightCutoffShader = -1;
    static uLightAlphaShader = -1;

    static initialize() {
        Cube.shaderProgram = initShaders(gl, "/cubevshader.glsl", "/cubefshader.glsl");
        gl.useProgram(Cube.shaderProgram);
        console.log(Cube.shaderProgram);

        if (!Cube.shaderProgram) {
            console.error("Failed to initialize shaders.");
            return;
        }

        // Load the data into the GPU
        Cube.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Cube.vertexPositions), gl.STATIC_DRAW);

        Cube.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Cube.vertexTextureCoords), gl.STATIC_DRAW);
        Cube.uTextureUnitShader = gl.getUniformLocation(Cube.shaderProgram, "uTextureUnit");

        Cube.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cube.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Cube.aPositionShader = gl.getAttribLocation(Cube.shaderProgram, "aPosition");
        Cube.aTextureCoordShader = gl.getAttribLocation(Cube.shaderProgram, "aTextureCoord");
        console.log(Cube.aPositionShader);
        console.log(Cube.aTextureCoordShader);

        Cube.uModelMatrixShader = gl.getUniformLocation(Cube.shaderProgram, "modelMatrix");
        Cube.uCameraMatrixShader = gl.getUniformLocation(Cube.shaderProgram, "cameraMatrix");
        Cube.uProjectionMatrixShader = gl.getUniformLocation(Cube.shaderProgram, "projectionMatrix");

        Cube.uLightPositionShader = gl.getUniformLocation(Cube.shaderProgram, "lightPosition");
        Cube.uLightAmbientShader = gl.getUniformLocation(Cube.shaderProgram, "lightAmbient");
        Cube.uLightDiffuseShader = gl.getUniformLocation(Cube.shaderProgram, "lightDiffuse");
        Cube.uLightSpecularShader = gl.getUniformLocation(Cube.shaderProgram, "lightSpecular");
        Cube.uLightDirectionShader = gl.getUniformLocation(Cube.shaderProgram, "lightDirection");
        Cube.uLightCutoffShader = gl.getUniformLocation(Cube.shaderProgram, "lightCutoff");
        Cube.uLightAlphaShader = gl.getUniformLocation(Cube.shaderProgram, "lightAlpha");
    }

    static initializeTexture() {
        var image = new Image();

        image.onload = function () {
            Cube.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, Cube.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        image.src = "./textures/crate_texture.jpg";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        if (Cube.shaderProgram == -1) {
            Cube.initialize()
            Cube.initializeTexture();
        }
    }

    draw(camera, light) {
        if (Cube.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(Cube.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.positionBuffer);
        gl.vertexAttribPointer(Cube.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.textureCoordBuffer);
        gl.vertexAttribPointer(Cube.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Cube.texture);
        gl.uniform1i(Cube.uTextureUnitShader, 0);

        gl.uniformMatrix4fv(Cube.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Cube.uCameraMatrixShader, false, flatten(camera.cameraMatrix));
        gl.uniformMatrix4fv(Cube.uProjectionMatrixShader, false, flatten(camera.projectionMatrix));

        const lightPosition = vec4(light.location[0], light.location[1], light.location[2], 1.0);
        gl.uniform4fv(Cube.uLightPositionShader, flatten(lightPosition));
        gl.uniform4fv(Cube.uLightAmbientShader, flatten(light.ambient));
        gl.uniform4fv(Cube.uLightDiffuseShader, flatten(light.diffuse));
        gl.uniform4fv(Cube.uLightSpecularShader, flatten(light.specular));
        gl.uniform3fv(Cube.uLightDirectionShader, flatten(light.direction));
        gl.uniform1f(Cube.uLightCutoffShader, light.cutoff);
        gl.uniform1f(Cube.uLightAlphaShader, light.alpha);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indexBuffer);

        gl.enableVertexAttribArray(Cube.aPositionShader);
        gl.enableVertexAttribArray(Cube.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, Cube.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.disableVertexAttribArray(Cube.aPositionShader);
        gl.disableVertexAttribArray(Cube.aTextureCoordShader);
    }
}
