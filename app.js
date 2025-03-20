import { texNightSky, texDaySky, texGrass, texRoof, texCobble, texWood, texBrick, texCrate } from './Textures/index.js'
import { FlyCam, RideCam, Light, SkyBox, TexLitDrawable } from './Objects/index.js'
import { getPlane, getCube, getSphere, getFromFile } from './Library/index.js'
import { shSky, shTL} from './Shaders/index.js'

const proj = perspective(90, 1, 0.1, 100)
let gl, light, sky
let shaderTL, shaderSky
let daysky, nightsky
let sceneItems = []
let objLight = new Light(null, vec4(1, 1, 1, 1), vec4(1, 1, 1, 1), vec4(1, 1, 1, 1), 10)
let flycam = new FlyCam(0, 5, 40)
let ridecam = new RideCam()
let cam = flycam
const canvas = document.getElementById("gl-canvas")
gl = canvas.getContext('webgl2')

window.onload = () => {
    if (!gl)
        alert("WebGL 2.0 isn't available")

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.9, 0.9, 0.9, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.cullFace(gl.BACK)

    shaderTL = initShaders(gl, shTL.v, shTL.f)
    shaderSky = initShaders(gl, shSky.v, shSky.f)

    daysky = new SkyBox(gl, texDaySky, shaderSky)
    nightsky = new SkyBox(gl, texNightSky, shaderSky)
    nightsky.trans = { r_x: -90 }
    sky = daysky
    light = new Light(
        vec4(4, 100, 0, 0),
        vec4(1, 1, 1, 1),
        vec4(1, 1, 1, 1),
        vec4(1, 1, 1, 1),
        null
    )
    light.step = 0;
    light.maxStep = 10000;

    let ground = new TexLitDrawable(gl, getPlane(3), shaderTL, texGrass, objLight)
    ground.trans = { s_x: 50, s_z: 50 }
    sceneItems.push(ground)

    let path = new TexLitDrawable(gl, getPlane(4), shaderTL, texCobble, objLight)
    path.trans = { s_x: 5, s_z: 15, t_y: 0.01, t_z: 35 }
    sceneItems.push(path)

    let lot = new TexLitDrawable(gl, getPlane(4), shaderTL, texCobble, objLight);
    lot.trans = { t_y: 0.01, s_x: 20, s_z: 20 };
    sceneItems.push(lot);

    // HOUSE FRONT
    // f1
    let f_1a = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_1a.trans = { t_x: -7.5, t_y: 0.5, t_z: 15, s_x: 10 };
    sceneItems.push(f_1a);
    
    let f_1b = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_1b.trans = { t_x: 7.5, t_y: 0.5, t_z: 15, s_x: 10 };
    sceneItems.push(f_1b);

    // f2
    let f_2a = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_2a.trans = { t_x: -7.5, t_y: 1.6, t_z: 15, s_x: 10 };
    sceneItems.push(f_2a);
    
    let f_2b = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_2b.trans = { t_x: 7.5, t_y: 1.6, t_z: 15, s_x: 10 };
    sceneItems.push(f_2b);

    // f3
    let f_3a = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_3a.trans = { t_x: -7.5, t_y: 2.7, t_z: 15, s_x: 10 };
    sceneItems.push(f_3a);
    
    let f_3b = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_3b.trans = { t_x: 7.5, t_y: 2.7, t_z: 15, s_x: 10 };
    sceneItems.push(f_3b);

    // f4
    let f_4a = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_4a.trans = { t_x: -7.5, t_y: 3.8, t_z: 15, s_x: 10 };
    sceneItems.push(f_4a);
    
    let f_4b = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_4b.trans = { t_x: 7.5, t_y: 3.8, t_z: 15, s_x: 10 };
    sceneItems.push(f_4b);

    // f5
    let f_5a = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_5a.trans = { t_x: -7, t_y: 4.9, t_z: 15, s_x: 11 };
    sceneItems.push(f_5a);
    
    let f_5b = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_5b.trans = { t_x: 7, t_y: 4.9, t_z: 15, s_x: 11 };
    sceneItems.push(f_5b);
    
    // f6
    let f_6a = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_6a.trans = { t_x: -6.5, t_y: 6, t_z: 15, s_x: 12 };
    sceneItems.push(f_6a);
    
    let f_6b = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_6b.trans = { t_x: 6.5, t_y: 6, t_z: 15, s_x: 12 };
    sceneItems.push(f_6b);

    // f7
    let f_7 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    f_7.trans = { t_x: 0, t_y: 7.1, t_z: 15, s_x: 25 };
    sceneItems.push(f_7);

    // froof
    let f_r = new TexLitDrawable(
        gl,
        [
            vec3(0, 13, 16),
            vec3(0, 7.1, 16),
            vec3(-12.5, 7.1, 16),
            vec3(12.5, 7.1, 16),
            vec3(0, 7.1, 16),
            vec3(0, 13, 16),
        ],
        shaderTL,
        texWood,
        objLight
    );
    f_r.trans = {};
    sceneItems.push(f_r);

    // r1
    let r_1 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_1.trans = { t_x: 13, t_y: 0.5, t_z: 2, s_z: 25 };
    sceneItems.push(r_1);

    // r2
    let r_2 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_2.trans = { t_x: 13, t_y: 1.6, t_z: 2, s_z: 25 };
    sceneItems.push(r_2);

    // r3
    let r_3 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_3.trans = { t_x: 13, t_y: 2.7, t_z: 2, s_z: 25 };
    sceneItems.push(r_3);

    // r4
    let r_4 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_4.trans = { t_x: 13, t_y: 3.8, t_z: 2, s_z: 25 };
    sceneItems.push(r_4);

    // r5
    let r_5 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_5.trans = { t_x: 13, t_y: 4.9, t_z: 2, s_z: 25 };
    sceneItems.push(r_5);

    // r6
    let r_6 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_6.trans = { t_x: 13, t_y: 6, t_z: 2, s_z: 25 };
    sceneItems.push(r_6);

    // r7
    let r_7 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    r_7.trans = { t_x: 13, t_y: 7.1, t_z: 2, s_z: 25 };
    sceneItems.push(r_7);

    // l1
    let l_1 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_1.trans = { t_x: -13, t_y: 0.5, t_z: 2, s_z: 25 };
    sceneItems.push(l_1);

    // l2
    let l_2 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_2.trans = { t_x: -13, t_y: 1.6, t_z: 2, s_z: 25 };
    sceneItems.push(l_2);

    // l3
    let l_3 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_3.trans = { t_x: -13, t_y: 2.7, t_z: 2, s_z: 25 };
    sceneItems.push(l_3);

    // l4
    let l_4 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_4.trans = { t_x: -13, t_y: 3.8, t_z: 2, s_z: 25 };
    sceneItems.push(l_4);

    // l5
    let l_5 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_5.trans = { t_x: -13, t_y: 4.9, t_z: 2, s_z: 25 };
    sceneItems.push(l_5);

    // r6
    let l_6 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_6.trans = { t_x: -13, t_y: 6, t_z: 2, s_z: 25 };
    sceneItems.push(l_6);

    // r7
    let l_7 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    l_7.trans = { t_x: -13, t_y: 7.1, t_z: 2, s_z: 25 };
    sceneItems.push(l_7);

    // b1
    let b_1 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_1.trans = { t_x: 0, t_y: 0.5, t_z: -11, s_x: 25 };
    sceneItems.push(b_1);

    // b2
    let b_2 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_2.trans = { t_x: 0, t_y: 1.6, t_z: -11, s_x: 25 };
    sceneItems.push(b_2);

    // b3
    let b_3 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_3.trans = { t_x: 0, t_y: 2.7, t_z: -11, s_x: 25 };
    sceneItems.push(b_3);

    // b4
    let b_4 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_4.trans = { t_x: 0, t_y: 3.8, t_z: -11, s_x: 25 };
    sceneItems.push(b_4);

    // b5
    let b_5 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_5.trans = { t_x: 0, t_y: 4.9, t_z: -11, s_x: 25 };
    sceneItems.push(b_5);

    // b6
    let b_6 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_6.trans = { t_x: 0, t_y: 6, t_z: -11, s_x: 25 };
    sceneItems.push(b_6);

    // b7
    let b_7 = new TexLitDrawable(gl, getCube(), shaderTL, texWood, objLight);
    b_7.trans = { t_x: 0, t_y: 7.1, t_z: -11, s_x: 25 };
    sceneItems.push(b_7);

    // broof
    let b_r = new TexLitDrawable(
        gl,
        [
            vec3(0, 13, 14),
            vec3(0, 7.1, 14),
            vec3(-12.5, 7.1, 14),
            vec3(12.5, 7.1, 14),
            vec3(0, 7.1, 14),
            vec3(0, 13, 14),
        ],
        shaderTL,
        texWood,
        objLight
    );
    b_r.trans = {t_z: -25};
    sceneItems.push(b_r);

    // ROOF
    
    let roof_a = new TexLitDrawable(gl, getPlane(0), shaderTL, texRoof, objLight);
    roof_a.trans = { t_x: 7, t_y: 10.5, t_z: 2, s_x: 8, s_y: 7.5, s_z: 15, r_x: 0, r_y: 0, r_z: -25 };
    sceneItems.push(roof_a);

    let roof_b = new TexLitDrawable(gl, getPlane(0), shaderTL, texRoof, objLight);
    roof_b.trans = { t_x: -7, t_y: 10.5, t_z: 2, s_x: 8, s_y: 7.5, s_z: 15, r_x: 0, r_y: 180, r_z: 25 };
    sceneItems.push(roof_b);

    // SPINING CUBE

    let crate = new TexLitDrawable(gl, getCube(), shaderTL, texCrate, objLight);
    crate.trans = {t_x: 1, t_y: 5, t_z: 1, s_x: 3, s_y: 3, s_z: 3, r_y: 45, r_z: 45};
    // spin_cube.step = 0;
    sceneItems.push(crate);

    let path_time = 0
    let then = 0

    function animate(now) {
        now *= 0.001; // Convert to seconds
        const deltaTime = now - then;
        then = now;
        path_time = (path_time + deltaTime) % 10000;
        

        if (cam === ridecam) cam.increment(0.05 * deltaTime);
        animateSun(light, deltaTime);
        animateCubeSpin(crate);
        animateCubeMove(crate, path_time);
        render();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.disable(gl.DEPTH_TEST)
    sky.draw(cam.n, cam.v, proj)
    gl.enable(gl.DEPTH_TEST)

    for (let i = 0; i < sceneItems.length; i++) {
        sceneItems[i].draw(cam, proj, light)
    }
}

window.addEventListener('keydown', event => {
    switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'KeyZ':
        case 'KeyX':
        case 'KeyC':
        case 'KeyR':
            cam.handleKey(event.code, event.shiftKey)
            break
        case 'KeyT':
            cam = (cam === flycam) ? ridecam : flycam
            break
    }
})


function animateSun(light, deltaTime) {
    light.step = (light.step + deltaTime * 1000) % light.maxStep
    let newPos = vec4(
        100 * Math.sin(2 * Math.PI * (light.step / light.maxStep)),
        100 * Math.cos(2 * Math.PI * (light.step / light.maxStep)),
        0,
        1
    )

    if (light.position[1] > 0 && newPos[1] < 0) {
        light.diffuse = light.specular = vec4(0, 0, 0, 0)
        light.ambient = vec4(0.5, 0.5, 0.5, 1)
        sky = nightsky
    } else if (light.position[1] < 0 && newPos[1] > 0) {
        light.diffuse = light.specular = vec4(1, 1, 1, 1)
        light.ambient = vec4(1, 1, 1, 1)
        sky = daysky
    }
    light.position = newPos
}

function animateCubeSpin(cube){
    let cube_rx = cube.r_x;
    let cube_ry = cube.r_y;
    let cube_rz = cube.r_z;
    cube.trans = {r_x: cube_rx + 0.5, r_y: cube_ry + 0.5, r_z: cube_rz + 0.5};
}

function animateCubeMove(cube, circle){
    let cube_tx = cube.t_x;
    let cube_tz = cube.t_z;

    let cube_posx = Math.sin(1/2 * circle) * 25;
    let cube_posz = Math.cos(1/2 * circle) * 25;
    cube.trans = {t_x: cube_posx, t_z: cube_posz}
}
