// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("threeD-container").appendChild(renderer.domElement);

// Set up DRACOLoader
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

// Load 3D model
const loader = new THREE.GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load("https://iswsz3cbm7tudiss.public.blob.vercel-storage.com/destroyed_car_07_raw_scan_compressed-pf4BnThyKKJfMbASae84IL1oaxKZP7.glb",
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(0, -2, 0);
        scene.add(model);
        interactiveModel = model;
    },
    undefined,
    (error) => {
        console.error("Error loading model:", error);
    }
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 10);
scene.add(ambientLight, directionalLight);

// Camera Position
camera.position.set(0, 5, 20);

// Interaction - Click & Drag Rotation
let interactiveModel = null;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

window.addEventListener("mousemove", (event) => {
    if (isDragging && interactiveModel) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        interactiveModel.rotation.y += deltaX * 0.01;
        interactiveModel.rotation.x += deltaY * 0.01;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

// Mouse Scroll Zoom Control
window.addEventListener("wheel", (event) => {
    const zoomSpeed = 0.5;
    camera.position.z += event.deltaY * 0.01 * zoomSpeed;
    camera.position.z = Math.max(5, Math.min(50, camera.position.z)); // Limit zoom range
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
