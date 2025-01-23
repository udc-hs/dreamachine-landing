// Load Three.js and required modules
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/DRACOLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7.5);
scene.add(ambientLight, directionalLight);

// Camera Position
camera.position.set(0, 2, 10);

// Load GLTF model with DRACO compression
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

let interactiveModel = null;

loader.load('https://iswsz3cbm7tudiss.public.blob.vercel-storage.com/destroyed_car_07_raw_scan_compressed-pf4BnThyKKJfMbASae84IL1oaxKZP7.glb', (gltf) => {
    interactiveModel = gltf.scene;
    interactiveModel.scale.set(5, 5, 5);
    interactiveModel.position.set(0, -2, 0);
    scene.add(interactiveModel);
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

// Mouse and Touch Controls for Click-and-Drag Rotation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const onMouseDown = (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
};

const onMouseMove = (event) => {
    if (!isDragging || !interactiveModel) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    interactiveModel.rotation.y += deltaX * 0.005; // Adjust speed of rotation
    interactiveModel.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: event.clientX, y: event.clientY };
};

const onMouseUp = () => {
    isDragging = false;
};

// Touch event handling for mobile
const onTouchStart = (event) => {
    isDragging = true;
    previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
};

const onTouchMove = (event) => {
    if (!isDragging || !interactiveModel) return;

    const deltaX = event.touches[0].clientX - previousMousePosition.x;
    const deltaY = event.touches[0].clientY - previousMousePosition.y;

    interactiveModel.rotation.y += deltaX * 0.005;
    interactiveModel.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
};

const onTouchEnd = () => {
    isDragging = false;
};

// Scroll Zoom Control
const onScroll = (event) => {
    camera.position.z += event.deltaY * 0.01;
};

// Add event listeners
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("wheel", onScroll);
window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);

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
