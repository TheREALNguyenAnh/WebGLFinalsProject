// Lab 8 Done by: Nguyen Anh Nguyen, Drexel Email: ndn35
// Thiyazan Qaissi, Drexel Email: ts3375
class Plane extends Drawable {
    static vertexPositions = [
        vec3(-1, 0, 1), //Bottom left
        vec3(1, 0, 1), // Bottom right
        vec3(1, 0, -1), // Top right
        vec3(-1, 0, -1), // Top left
    ];

    static vertexTextureCoords = [
        vec2(0, 0), //Bottom left
        vec2(8, 0), // Bottom right
        vec2(8, 8), // Top right
        vec2(0, 8), // Top left
    ];

    static indices = [
        0, 1, 2,
        0, 2, 3
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

    static vPositions = [];
    static vIndices = [];
    static vTextureCoords = [];

    static uLightPositionShader = -1;
    static uLightAmbientShader = -1;
    static uLightDiffuseShader = -1;
    static uLightSpecularShader = -1;
    static uLightDirectionShader = -1;
    static uLightCutoffShader = -1;
    static uLightAlphaShader = -1;

    static initialize() {
        Plane.shaderProgram = initShaders(gl, "/planevshader.glsl", "/planefshader.glsl");
        gl.useProgram(Plane.shaderProgram);
        console.log(Plane.shaderProgram);

        if (!Plane.shaderProgram) {
            console.error("Failed to initialize shaders.");
            return;
        }

        Plane.vPositions = [];
        Plane.vIndices = [];
        Plane.vTextureCoords = [];

        // Subdivide the plane using the divideQuad function
        Plane.divideQuad(
            Plane.vertexPositions[0],
            Plane.vertexPositions[1],
            Plane.vertexPositions[2],
            Plane.vertexPositions[3],
             3,
            Plane.vertexTextureCoords
        );

        // Log some vertices and texture coordinates to verify subdivision
        console.log("Vertices after subdivision:", Plane.vPositions);
        console.log("Texture coordinates after subdivision:", Plane.vTextureCoords);
        console.log("Indices after subdivision:", Plane.vIndices);

        // Load the data into the GPU
        Plane.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Plane.vPositions), gl.STATIC_DRAW);

        Plane.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Plane.vTextureCoords), gl.STATIC_DRAW);
        Plane.uTextureUnitShader = gl.getUniformLocation(Plane.shaderProgram, "uTextureUnit");

        Plane.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Plane.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Plane.vIndices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Plane.aPositionShader = gl.getAttribLocation(Plane.shaderProgram, "aPosition");
        Plane.aTextureCoordShader = gl.getAttribLocation(Plane.shaderProgram, "aTextureCoord");
        //console.log(Plane.aPositionShader);
        //console.log(Plane.aTextureCoordShader);

        Plane.uModelMatrixShader = gl.getUniformLocation(Plane.shaderProgram, "modelMatrix");
        Plane.uCameraMatrixShader = gl.getUniformLocation(Plane.shaderProgram, "cameraMatrix");
        Plane.uProjectionMatrixShader = gl.getUniformLocation(Plane.shaderProgram, "projectionMatrix");

        Plane.uLightPositionShader = gl.getUniformLocation(Plane.shaderProgram, "lightPosition");
        Plane.uLightAmbientShader = gl.getUniformLocation(Plane.shaderProgram, "lightAmbient");
        Plane.uLightDiffuseShader = gl.getUniformLocation(Plane.shaderProgram, "lightDiffuse");
        Plane.uLightSpecularShader = gl.getUniformLocation(Plane.shaderProgram, "lightSpecular");
        Plane.uLightDirectionShader = gl.getUniformLocation(Plane.shaderProgram, "lightDirection");
        Plane.uLightCutoffShader = gl.getUniformLocation(Plane.shaderProgram, "lightCutoff");
        Plane.uLightAlphaShader = gl.getUniformLocation(Plane.shaderProgram, "lightAlpha");
    }
    static initializeTexture() {
        var image = new Image();

        image.onload = function () {
            Plane.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, Plane.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        }

        image.src = "256x grass block.png";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        if (Plane.shaderProgram == -1) {
            Plane.initialize()
            Plane.initializeTexture();
        }

    }

    draw(camera, light) {
        if (Plane.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(Plane.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.positionBuffer);
        gl.vertexAttribPointer(Plane.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.textureCoordBuffer);
        gl.vertexAttribPointer(Plane.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Plane.texture);
        gl.uniform1i(Plane.uTextureUnitShader, 0);


        gl.uniformMatrix4fv(Plane.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Plane.uCameraMatrixShader, false, flatten(camera.cameraMatrix));
        gl.uniformMatrix4fv(Plane.uProjectionMatrixShader, false, flatten(camera.projectionMatrix));

        const lightPosition = vec4(light.location[0], light.location[1], light.location[2], 1.0);
        gl.uniform4fv(Plane.uLightPositionShader, flatten(lightPosition));
        gl.uniform4fv(Plane.uLightAmbientShader, flatten(light.ambient));
        gl.uniform4fv(Plane.uLightDiffuseShader, flatten(light.diffuse));
        gl.uniform4fv(Plane.uLightSpecularShader, flatten(light.specular));
        gl.uniform3fv(Plane.uLightDirectionShader, flatten(light.direction));
        gl.uniform1f(Plane.uLightCutoffShader, light.cutoff);
        gl.uniform1f(Plane.uLightAlphaShader, light.alpha);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Plane.indexBuffer);

        gl.enableVertexAttribArray(Plane.aPositionShader);
        gl.enableVertexAttribArray(Plane.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, Plane.vIndices.length, gl.UNSIGNED_SHORT, 0);
        gl.disableVertexAttribArray(Plane.aPositionShader);
        gl.disableVertexAttribArray(Plane.aTextureCoordShader);
    }

    static divideQuad(a, b, c, d, depth, texCoords) {
        if (depth > 0) {
            var v1 = mult(0.5, add(a, b));
            var v2 = mult(0.5, add(b, c));
            var v3 = mult(0.5, add(c, d));
            var v4 = mult(0.5, add(d, a));
            var v5 = mult(0.5, add(a, c));

            var t1 = mult(0.5, add(texCoords[0], texCoords[1]));
            var t2 = mult(0.5, add(texCoords[1], texCoords[2]));
            var t3 = mult(0.5, add(texCoords[2], texCoords[3]));
            var t4 = mult(0.5, add(texCoords[3], texCoords[0]));
            var t5 = mult(0.5, add(texCoords[0], texCoords[2]));

            this.divideQuad(a, v1, v5, v4, depth - 1, [texCoords[0], t1, t5, t4]);
            this.divideQuad(v1, b, v2, v5, depth - 1, [t1, texCoords[1], t2, t5]);
            this.divideQuad(v2, c, v3, v5, depth - 1, [t2, texCoords[2], t3, t5]);
            this.divideQuad(v3, d, v4, v5, depth - 1, [t3, texCoords[3], t4, t5]);
        } else {
            var indexA = Plane.findVertex(a, texCoords[0]);
            var indexB = Plane.findVertex(b, texCoords[1]);
            var indexC = Plane.findVertex(c, texCoords[2]);
            var indexD = Plane.findVertex(d, texCoords[3]);

            // Triangle #1
            Plane.vIndices.push(indexA);
            Plane.vIndices.push(indexB);
            Plane.vIndices.push(indexC);

            // Triangle #2
            Plane.vIndices.push(indexC);
            Plane.vIndices.push(indexD);
            Plane.vIndices.push(indexA);
        }
    }

    static findVertex(vertex, texCoord) {
        var loc = Plane.vPositions.findIndex(v => v[0] === vertex[0] && v[1] === vertex[1] && v[2] === vertex[2]);
        if (loc < 0) {
            Plane.vPositions.push(vertex);
            Plane.vTextureCoords.push(texCoord);
            return Plane.vPositions.length - 1;
        } else {
            return loc;
        }
    }
}

