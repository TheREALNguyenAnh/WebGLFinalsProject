//Lab 8 Done by: Nguyen Anh Nguyen, Drexel Email: ndn35
//Thiyazan Qaissi, Drexel Email: ts3375

var canvas;
var gl;
var angle = 0.0;

class Light{
    constructor(loc,dir,amb,sp,dif,alpha,cutoff,type){
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
    turnOff(){this.status = 0;}
       
    turnOn(){this.status = 1;}
}

class Camera{
    constructor(vrp,u,v,n){
    	this.vrp = vrp;
    	this.u = normalize(u);
    	this.v = normalize(v);
    	this.n = normalize(n);
    	
    	this.projectionMatrix = perspective(90.0,1.0,0.1,200);
    	
    	this.updateCameraMatrix();
    }
    
    updateCameraMatrix(){
    	let t = translate(-this.vrp[0],-this.vrp[1],-this.vrp[2]);
    	let r = mat4(this.u[0], this.u[1], this.u[2], 0,
    		this.v[0], this.v[1], this.v[2], 0,
    		this.n[0], this.n[1], this.n[2], 0,
    		0.0, 0.0, 0.0, 1.0);
    	this.cameraMatrix = mult(r,t);
    }
    
    getModelMatrix(){
    	return this.modelMatrix;
    }
    
    setModelMatrix(mm){
    	this.modelMatrix = mm;
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
        let u4 = mult(rotationMatrix, vec4(this.u[0],this.u[1], this.u[2], 0));
        let v4 = mult(rotationMatrix, vec4(this.v[0],this.v[1], this.v[2], 0));
        this.u = vec3(u4[0],u4[1],u4[2]);
        this.v = vec3(v4[0],v4[1],v4[2]);
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

var camera1 = new Camera(vec3(0,20,0), vec3(1,0,0), vec3(0,0,-1), vec3(0,1,0));
var camera2 = new Camera(vec3(0, 5, 5), vec3(1, 0, 0), vec3(0, Math.sqrt(2)/2, -Math.sqrt(2)/2), vec3(0, Math.sqrt(2)/2, Math.sqrt(2)/2));
var light1 = new Light(vec3(0,0,0),vec3(0,1,-1),vec4(0.4,0.4,0.4,1.0), vec4(1,1,1,1), vec4(1,1,1,1),0,0,1);

class Drawable{
    constructor(tx,ty,tz,scale,rotX, rotY, rotZ, amb, dif, sp, sh){
    	this.tx = tx;
    	this.ty = ty;
    	this.tz = tz;
    	this.scale = scale;
    	this.modelRotationX = rotX;
    	this.modelRotationY = rotY;
    	this.modelRotationZ = rotZ;
    	this.updateModelMatrix();
    	
    	this.matAmbient = amb;
    	this.matDiffuse = dif;
    	this.matSpecular = sp;
    	this.matAlpha = sh;
    	
    	
    }
    	
    updateModelMatrix(){
        let t = translate(this.tx, this.ty, this.tz);		     		     		     
    	let s = scale(this.scale,this.scale,this.scale);
    	
    	let rx = rotateX(this.modelRotationX);
    	let ry = rotateY(this.modelRotationY);
    	let rz = rotateZ(this.modelRotationZ);
	
	this.modelMatrix = mult(t,mult(s,mult(rz,mult(ry,rx))));
    }
    
    getModelMatrix(){
    	return this.modelMatrix;
    }
    
    setModelMatrix(mm){
    	this.modelMatrix = mm;
    }    
}

var tri;
var cube;

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    var pos = vec3(0,0,0);
    var rot = vec3(0,0,0);
    var scale = 10.0;
    var amb = vec4(0.2,0.2,0.2,1.0);
    var dif = vec4(0.6,0.1,0.0,1.0);
    var spec = vec4(1.0,1.0,1.0,1.0);
    var shine = 100.0
    tri = new Plane(pos[0],pos[1],pos[2],scale,rot[0],rot[1],rot[2],amb,dif,spec,shine);
    cube = new Cube(0, 1, 0, 1, 0, 0, 0, amb, dif, spec, shine);
    
    window.addEventListener("keydown", function(event) {
        switch (event.key) {
            case "ArrowUp":
                camera2.moveForward(-0.1);
                break;
            case "ArrowDown":
                camera2.moveForward(0.1);
                break;
            case "ArrowLeft":
                camera2.moveRight(-0.1);
                break;
            case "ArrowRight":
                camera2.moveRight(0.1);
                break;
            case "Z":
                camera2.roll(1);
                break;
            case "z":
                camera2.roll(-1);
                break;
            case "X":
                camera2.pitch(1);
                break;
            case "x":
                camera2.pitch(-1);
                break;
            case "C":
                camera2.yaw(1);
                break;
            case "c":
                camera2.yaw(-1);
                break;
        }
    });

    render();
};

function render(){
    setTimeout(function(){
	requestAnimationFrame(render);
    	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        tri.draw(camera2);
        cube.draw(camera2);
    }, 100 );  //10fps
}


