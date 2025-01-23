import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 10);
scene.add(ambientLight, directionalLight);

// Camera Position
camera.position.set(0, 5, 20);

// Load 3D Car Model
const loader = new GLTFLoader();
let carModel = null;
loader.load('./assets/models/destroyed_car_07_raw_scan_compressed.glb', (gltf) => {
    carModel = gltf.scene;
    carModel.scale.set(5, 5, 5);
    carModel.position.set(0, -2, 0);
    scene.add(carModel);
}, undefined, (error) => {
    console.error('Error loading car model:', error);
});

// Smooth Rotation Variables
let targetRotationY = 0;
let rotationSpeed = 0.05;

// Interaction - Rotate Car on Click Smoothly
window.addEventListener("click", () => {
    if (carModel) {
        targetRotationY += 0.5;
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Ensure car model is loaded before rotating
    if (carModel) {
        carModel.rotation.y += (targetRotationY - carModel.rotation.y) * rotationSpeed;
    }

    renderer.render(scene, camera);
}
animate();

// Responsive Resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
