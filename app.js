//Lab 8 Done by: Nguyen Anh Nguyen, Drexel Email: ndn35
//Thiyazan Qaissi, Drexel Email: ts3375

//This file is the main file that will be run to display the 3D objects on the screen.
var canvas;
var gl;
var angle = 0.0;

var camera1 = new Camera(vec3(0, 20, 0), vec3(1, 0, 0), vec3(0, 0, -1), vec3(0, 1, 0));
var camera2 = new Camera(vec3(0, 5, 5), vec3(1, 0, 0), vec3(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2), vec3(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2));
var light1 = new Light(vec3(0, 1, 0), vec3(0, 1, -1), vec4(0.4, 0.4, 0.4, 1.0), vec4(0.8, 0.8, 0.8, 0.8), vec4(1, 1, 1, 1), 0, 0, 1);

var tri;
var cube;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var pos = vec3(0, 0, 0);
    var rot = vec3(0, 0, 0);
    var scale = 10.0;
    var amb = vec4(0.2, 0.2, 0.2, 1.0);
    var dif = vec4(0.6, 0.1, 0.0, 1.0);
    var spec = vec4(0.2, 0.2, 0.2, 1.0);
    var shine = 10.0;
    plane = new Plane(pos[0], pos[1], pos[2], scale, rot[0], rot[1], rot[2], amb, dif, spec, shine);
    cube = new Cube(0, 1, 0, 1, 0, 0, 0, amb, dif, spec, shine);

    window.addEventListener("keydown", function (event) {
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

function render() {
    setTimeout(function () {
        requestAnimationFrame(render);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        plane.draw(camera2, light1);
        cube.draw(camera2, light1);
    }, 100);  //10fps
}


