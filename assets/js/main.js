// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load('https://iswsz3cbm7tudiss.public.blob.vercel-storage.com/destroyed_car_07_raw_scan_compressed-pf4BnThyKKJfMbASae84IL1oaxKZP7.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(5, 5, 5);
    model.position.set(0, -2, 0);
    scene.add(model);
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(ambientLight, directionalLight);

// Camera Position
camera.position.set(0, 2, 15);

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
