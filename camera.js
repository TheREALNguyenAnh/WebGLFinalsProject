class Camera {
    constructor(vrp, u, v, n) {
        this.vrp = vrp;
        this.u = normalize(u);
        this.v = normalize(v);
        this.n = normalize(n);

        this.projectionMatrix = perspective(90.0, 1.0, 0.1, 200);

        this.updateCameraMatrix();
    }

    updateCameraMatrix() {
        let t = translate(-this.vrp[0], -this.vrp[1], -this.vrp[2]);
        let r = mat4(this.u[0], this.u[1], this.u[2], 0,
            this.v[0], this.v[1], this.v[2], 0,
            this.n[0], this.n[1], this.n[2], 0,
            0.0, 0.0, 0.0, 1.0);
        this.cameraMatrix = mult(r, t);
    }

    moveForward(distance) {
        this.vrp = add(this.vrp, scale(distance, this.n));
        this.updateCameraMatrix();
    }

    moveRight(distance) {
        this.vrp = add(this.vrp, scale(distance, this.u));
        this.updateCameraMatrix();
    }

    roll(angle) {
        let rotationMatrix = rotate(angle, this.n);
        let u4 = mult(rotationMatrix, vec4(this.u[0], this.u[1], this.u[2], 0));
        let v4 = mult(rotationMatrix, vec4(this.v[0], this.v[1], this.v[2], 0));
        this.u = vec3(u4[0], u4[1], u4[2]);
        this.v = vec3(v4[0], v4[1], v4[2]);
        this.updateCameraMatrix();
    }

    pitch(angle) {
        let rotationMatrix = rotate(angle, this.u);
        let v4 = mult(rotationMatrix, vec4(this.v[0], this.v[1], this.v[2], 0));
        let n4 = mult(rotationMatrix, vec4(this.n[0], this.n[1], this.n[2], 0));
        this.v = vec3(v4[0], v4[1], v4[2]);
        this.n = vec3(n4[0], n4[1], n4[2]);
        this.updateCameraMatrix();
    }

    yaw(angle) {
        let rotationMatrix = rotate(angle, this.v);
        let u4 = mult(rotationMatrix, vec4(this.u[0], this.u[1], this.u[2], 0));
        let n4 = mult(rotationMatrix, vec4(this.n[0], this.n[1], this.n[2], 0));
        this.u = vec3(u4[0], u4[1], u4[2]);
        this.n = vec3(n4[0], n4[1], n4[2]);
        this.updateCameraMatrix();
    }
}
