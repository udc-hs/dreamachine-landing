import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/DRACOLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Lighting Fix for Mobile
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load Model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

const MODEL_URL = 'https://iswsz3cbm7tudiss.public.blob.vercel-storage.com/destroyed_car_07_raw_scan_compressed-pf4BnThyKKJfMbASae84IL1oaxKZP7.glb';

console.log("Model loading...");
loader.load(MODEL_URL, (gltf) => {
    const model = gltf.scene;
    model.scale.set(5, 5, 5);
    model.position.set(0, -2, 0);
    scene.add(model);
    console.log("Model loaded successfully.");
}, undefined, (error) => {
    console.error("Error loading model:", error);
});

// Camera Position
camera.position.set(0, 5, 20);

// Interaction - Click & Drag Rotation
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        if (scene.children.length > 2) {
            scene.children[2].rotation.y += deltaX * 0.005;
            scene.children[2].rotation.x += deltaY * 0.005;
        }
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Responsive Resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
