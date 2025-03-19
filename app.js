import { texNightSky, texDaySky, texGrass, texRoof, texCobble, texWood, texBrick } from './Textures/index.js'
import { FlyCam, RideCam, Light, SkyBox, TexLitDrawable } from './Objects/index.js'
import { getPlane } from './Library/index.js'
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
    light.step = 0
    light.maxStep = 10000

    let ground = new TexLitDrawable(gl, getPlane(3), shaderTL, texGrass, objLight)
    ground.trans = { s_x: 50, s_z: 50 }
    sceneItems.push(ground)

    let path = new TexLitDrawable(gl, getPlane(4), shaderTL, texCobble, objLight)
    path.trans = { s_x: 5, s_z: 15, t_y: 0.01, t_z: 35 }
    sceneItems.push(path)

    let lot = new TexLitDrawable(gl, getPlane(4), shaderTL, texCobble, objLight);
    lot.trans = { t_y: 0.01, s_x: 20, s_z: 20 };
    sceneItems.push(lot);

    let wall_a = new TexLitDrawable(gl, getPlane(0), shaderTL, texWood, objLight);
    wall_a.trans = { t_y: -3.5, t_z: 10, s_x: 3.5, s_z: 10, r_x: 90, r_y: 90 };
    sceneItems.push(wall_a);

    let roof_a = new TexLitDrawable(gl, getPlane(0), shaderTL, texRoof, objLight);
    roof_a.trans = { t_y: 10.5, t_z: 5.5, s_x: 7, s_z: 11, r_x: 37, r_y: 90 };
    sceneItems.push(roof_a);

    let wall_b = new TexLitDrawable(gl, getPlane(0), shaderTL, texWood, objLight);
    wall_b.trans = { t_y: 3.5, t_x: -10, s_x: 3.5, s_z: 10, r_z: 90 };
    sceneItems.push(wall_b);

    let wall_b2 = new TexLitDrawable(
        gl,
        [
            vec3(-10, 14.3, 0),
            vec3(-10, 7, 0),
            vec3(-10, 7, 10),
            vec3(-10, 7, -10),
            vec3(-10, 7, 0),
            vec3(-10, 14.3, 0),
        ],
        shaderTL,
        texWood,
        objLight
    );
    sceneItems.push(wall_b2);

    let wall_c = new TexLitDrawable(gl, getPlane(0), shaderTL, texWood, objLight);
    wall_c.trans = { t_y: 3.5, t_z: -10, s_x: 3.5, s_z: 10, r_x: 90, r_y: 90 };
    sceneItems.push(wall_c);

    let roof_b = new TexLitDrawable(gl, getPlane(0), shaderTL, texRoof, objLight);
    roof_b.trans = { t_y: 10.5, t_z: -5.5, s_x: 7, s_z: 11, r_x: -37, r_y: 90 };
    sceneItems.push(roof_b);

    let wall_d = new TexLitDrawable(gl, getPlane(0), shaderTL, texWood, objLight);
    wall_d.trans = { t_y: 3.5, t_x: 10, s_x: 3.5, s_z: 10, r_z: 90 };
    sceneItems.push(wall_d);

    let wall_d2 = new TexLitDrawable(
        gl,
        [
            vec3(10, 14.3, 0),
            vec3(10, 7, 0),
            vec3(10, 7, 10),
            vec3(10, 7, -10),
            vec3(10, 7, 0),
            vec3(10, 14.3, 0),
        ],
        shaderTL,
        texWood,
        objLight
    );
    sceneItems.push(wall_d2);

    

    animate()
}

function animate() {
    setInterval(function () {
        if (cam === ridecam) cam.increment(0.005)
        animateSun(light)
        render()
    }, 10)
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
    render()
})

gl.canvas.addEventListener('mousemove', event => {
    const r = canvas.getBoundingClientRect()

    mX = event.clientX - r.left
    mY = event.clientY - r.top
})

function animateSun(light) {
    light.step = (light.step + 1) % light.maxStep
    let newPos = vec4(
        100 * Math.sin(2 * 3.14 * (light.step / light.maxStep)),
        100 * Math.cos(2 * 3.14 * (light.step / light.maxStep)),
        0,
        1
    )

    if (light.position[1] > 0 && newPos[1] < 0) {
        light.diffuse = light.specular = vec4(0, 0, 0, 0)
        light.ambient = vec4(.5, .5, .5, 1)
        sky = nightsky
    } else if (light.position[1] < 0 && newPos[1] > 0) {
        light.diffuse = light.specular = vec4(1, 1, 1, 1)
        light.ambient = vec4(1, 1, 1, 1)
        sky = daysky
    }
    light.position = newPos
}
