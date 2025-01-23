import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Load 3D model
const loader = new GLTFLoader();
loader.load('assets/models/destroyed_car_07_raw_scan_compressed.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(10, 10, 10);  // Increased size for visibility
    model.position.set(0, -2, 0);  // Adjusted position for proper placement
    scene.add(model);

    // Store model reference for interaction
    interactiveModel = model;
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);  // Increased intensity
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Stronger directional light
directionalLight.position.set(5, 10, 10);
scene.add(ambientLight, directionalLight);

// Camera Position (ensuring it's properly placed to view the model)
camera.position.set(0, 5, 20);

// Interaction - Rotate Model on Click
let interactiveModel = null;
window.addEventListener("click", () => {
    if (interactiveModel) {
        interactiveModel.rotation.y += 0.5;
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
