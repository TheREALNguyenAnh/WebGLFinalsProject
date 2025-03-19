class Light {
    constructor(loc, dir, amb, sp, dif, alpha, cutoff, type) {
        this.location = loc;
        this.direction = dir;
        this.ambient = amb;
        this.specular = sp;
        this.diffuse = dif;
        this.alpha = alpha;
        this.cutoff = cutoff;
        this.type = type;
        this.status = 1;
    }

    turnOff() { this.status = 0; }

    turnOn() { this.status = 1; }
}
