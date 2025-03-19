export default class FlyCam {
    constructor(e_x, e_y, e_z) {
        this.matrix = mat4()
        this.s_x = e_x
        this.s_y = e_y
        this.s_z = e_z
        this.eye = vec3(e_x, e_y, e_z)
        this.u = vec3(1, 0, 0)
        this.v = vec3(0, 1, 0)
        this.n = vec3(0, 0, 1)
        this.updateCamMatrix()

        this.controller = {
            ArrowUp: self => self.changeEye('-n'),
            ArrowDown: self => self.changeEye('+n'),
            ArrowLeft: self => self.changeEye('-u'),
            ArrowRight: self => self.changeEye('+u'),
            KeyZ: self => self.roll(10),
            KeyZ_S: self => self.roll(-10),
            KeyX: self => self.pitch(10),
            KeyX_S: self => self.pitch(-10),
            KeyC: self => self.yaw(10),
            KeyC_S: self => self.yaw(-10),
            KeyR: self => self.reset()
        }
    }    

    updateCamMatrix() {
        let t = translate(-this.eye[0], -this.eye[1], -this.eye[2]);
        let r = mat4(this.u[0], this.u[1], this.u[2], 0,
            this.v[0], this.v[1], this.v[2], 0,
            this.n[0], this.n[1], this.n[2], 0,
            0.0, 0.0, 0.0, 1.0);
        this.matrix = mult(r, t);
    }

    changeEye(axis) {
        if (axis === '+u') {
            this.eye = add(this.eye, scale(1, this.u));
        } else if (axis === '-u') {
            this.eye = add(this.eye, scale(-1, this.u));
        } else if (axis === '+n') {
            this.eye = add(this.eye, scale(1, this.n));
        } else if (axis === '-n') {
            this.eye = add(this.eye, scale(-1, this.n));
        }
        this.updateCamMatrix();
    }

    roll(angle) {
        let rotationMatrix = rotate(angle, this.n);
        let u4 = mult(rotationMatrix, vec4(this.u[0], this.u[1], this.u[2], 0));
        let v4 = mult(rotationMatrix, vec4(this.v[0], this.v[1], this.v[2], 0));
        this.u = vec3(u4[0], u4[1], u4[2]);
        this.v = vec3(v4[0], v4[1], v4[2]);
        this.updateCamMatrix();
    }

    pitch(angle) {
        let rotationMatrix = rotate(angle, this.u);
        let v4 = mult(rotationMatrix, vec4(this.v[0], this.v[1], this.v[2], 0));
        let n4 = mult(rotationMatrix, vec4(this.n[0], this.n[1], this.n[2], 0));
        this.v = vec3(v4[0], v4[1], v4[2]);
        this.n = vec3(n4[0], n4[1], n4[2]);
        this.updateCamMatrix();
    }

    yaw(angle) {
        let rotationMatrix = rotate(angle, this.v);
        let u4 = mult(rotationMatrix, vec4(this.u[0], this.u[1], this.u[2], 0));
        let n4 = mult(rotationMatrix, vec4(this.n[0], this.n[1], this.n[2], 0));
        this.u = vec3(u4[0], u4[1], u4[2]);
        this.n = vec3(n4[0], n4[1], n4[2]);
        this.updateCamMatrix();
    }

    reset() {
        this.eye = vec3(this.s_x, this.s_y, this.s_z);
        this.u = vec3(1, 0, 0);
        this.v = vec3(0, 1, 0);
        this.n = vec3(0, 0, 1);
        this.updateCamMatrix();
    }

    handleKey(key, shift) {
        let code = key
        if(shift) code += "_S"
        let fn = this.controller[code]
        if(fn) fn(this)
    }
}
