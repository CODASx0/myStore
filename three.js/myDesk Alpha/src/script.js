import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { gsap } from 'gsap'




/**
 * Loaders
 */


const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    //loaded
    () => {
        window.setTimeout(() => { 
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 0.8, value: 0 })
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        },1000)

    },
    //progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)



gltfLoader.load(
    '/models/macbookAir13.glb',
    (gltf) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        gltf.scene.rotation.y = Math.PI
        gltf.scene.position.x = 0
        gltf.scene.position.y = -0.8
        scene.add(gltf.scene)
    }
)



/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const textLoader = new RGBELoader(loadingManager)
textLoader.load('/textures/cyclorama_hard_light_1k.hdr',
    (texture) => {
        const pmremGenerator = new PMREMGenerator(renderer)
        pmremGenerator.compileEquirectangularShader()

        const envMap = pmremGenerator.fromEquirectangular(texture).texture


        texture.dispose();
        pmremGenerator.dispose();


        // 设置场景的环境贴图
        scene.environment = envMap
        // 设置背景亮度

        //scene.background = envMap
        scene.background = new THREE.Color(0xAAAAAA)

        scene.rotation.y = 0
        gui.add(scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('Scene Rotation Y')

    }
)

// overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    //wireframe: true,
    transparent: true,
    uniforms: {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 })
)
testSphere.scale.set(0.5, 0.5, 0.5)
testSphere.visible = false;
gui.add(testSphere, 'visible').name('Test Sphere Visible');
scene.add(testSphere)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 0)
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('Light X')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('Light Y')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('Light Z')



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(12, sizes.width / sizes.height, 0.1, 100)
camera.position.set(20, 10, - 20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true

//创建BokehPass
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const bokehPass = new BokehPass(scene, camera, {
    focus: 30,
    aperture: 0.000000025,
    maxblur: 0.01,

    width: sizes.width,
    height: sizes.height
})



composer.addPass(bokehPass)

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    //composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()