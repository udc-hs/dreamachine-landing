import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Placeholder Torus Knot
const geometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0xff5500, metalness: 0.8, roughness: 0.2 });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 10);
scene.add(ambientLight, directionalLight);

// Camera Position
camera.position.set(0, 5, 20);

// Smooth Rotation Variables
let targetRotationY = 0;
let rotationSpeed = 0.05;

// Interaction - Rotate Torus Knot on Click Smoothly
window.addEventListener("click", () => {
    targetRotationY += 0.5;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation towards target
    torusKnot.rotation.y += (targetRotationY - torusKnot.rotation.y) * rotationSpeed;

    // Slight continuous rotation
    torusKnot.rotation.x += 0.005;

    renderer.render(scene, camera);
}
animate();

// Responsive Resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
