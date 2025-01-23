// Load Three.js and required modules
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/DRACOLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Improve mobile rendering
document.getElementById("threeD-container").appendChild(renderer.domElement);

// ✅ Improved Lighting for Mobile Visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Increased intensity
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7.5);
scene.add(ambientLight, directionalLight);

// ✅ Adjusted Camera Position to Fix Black Screen Issue
camera.position.set(0, 3, 15); // Moved back slightly to ensure visibility

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

const onPointerDown = (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX || event.touches[0].clientX, y: event.clientY || event.touches[0].clientY };
};

const onPointerMove = (event) => {
    if (!isDragging || !interactiveModel) return;

    const x = event.clientX || event.touches[0].clientX;
    const y = event.clientY || event.touches[0].clientY;

    const deltaX = x - previousMousePosition.x;
    const deltaY = y - previousMousePosition.y;

    interactiveModel.rotation.y += deltaX * 0.005;
    interactiveModel.rotation.x += deltaY * 0.005;

    previousMousePosition = { x, y };
};

const onPointerUp = () => {
    isDragging = false;
};

// ✅ Touch and Mouse Events Merged for Cross-Device Support
window.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerup", onPointerUp);

// ✅ Fixed Zoom for Mobile (Limits Added)
const onScroll = (event) => {
    camera.position.z = Math.min(25, Math.max(5, camera.position.z + event.deltaY * 0.01));
};

// ✅ Works with Touchscreen Pinch Gesture
const onTouchZoom = (event) => {
    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!onTouchZoom.lastDistance) {
            onTouchZoom.lastDistance = distance;
            return;
        }

        const zoomChange = (distance - onTouchZoom.lastDistance) * 0.01;
        camera.position.z = Math.min(25, Math.max(5, camera.position.z - zoomChange));
        onTouchZoom.lastDistance = distance;
    }
};

// ✅ Event Listener for Pinch Gesture Zoom
window.addEventListener("wheel", onScroll);
window.addEventListener("touchmove", onTouchZoom);
window.addEventListener("touchend", () => { onTouchZoom.lastDistance = null; });

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
