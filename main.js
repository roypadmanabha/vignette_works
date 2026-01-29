// Initialize Lucide Icons
lucide.createIcons();

// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check LocalStorage or System Preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Toggle Handler
themeToggleBtn.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
    // Re-render icons if needed (Lucide usually handles static replacement, but for toggles we might need to manually toggle visibility classes if they were dynamic, but here we used CSS classes hidden/block)
});


// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Text Reveal
gsap.to('#hero-title', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 });
gsap.to('#hero-subtitle', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.8 });

// Section Headers Reveal
gsap.utils.toArray('section h2').forEach(header => {
    gsap.from(header, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
        }
    });
});

// Card Stagger Reveal (Highlights)
gsap.from('.highlight-card', {
    opacity: 0,
    y: 100,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
        trigger: '#highlights',
        start: 'top 70%',
    }
});

// Services List Reveal
gsap.from('.service-item', {
    opacity: 0,
    x: -50,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '#services',
        start: 'top 75%',
    }
});


// --- Three.js 3D Background ---
const canvasContainer = document.getElementById('canvas-container');

// Scene Setup
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI
canvasContainer.appendChild(renderer.domElement);

// Objects (Abstract Shapes)
// 1. Torus Knot (Main Centerpiece)
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// 2. Floating Particles - Red
const redParticlesGeometry = new THREE.BufferGeometry();
const particlesCount = 250;
const redPosArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    redPosArray[i] = (Math.random() - 0.5) * 20; // Spread within -10 to 10
}

redParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(redPosArray, 3));
const redParticlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xDC2626, // Red
    transparent: true,
    opacity: 0.8,
});
const redParticlesMesh = new THREE.Points(redParticlesGeometry, redParticlesMaterial);
scene.add(redParticlesMesh);

// 3. Floating Particles - Green
const greenParticlesGeometry = new THREE.BufferGeometry();
const greenPosArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    greenPosArray[i] = (Math.random() - 0.5) * 20; // Spread within -10 to 10
}

greenParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(greenPosArray, 3));
const greenParticlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x16A34A, // Green
    transparent: true,
    opacity: 0.8,
});
const greenParticlesMesh = new THREE.Points(greenParticlesGeometry, greenParticlesMaterial);
scene.add(greenParticlesMesh);


// Lights
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(ambientLight);


// Animation Loop
const clock = new THREE.Clock();
let mouseX = 0;
let mouseY = 0;

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate Main Object
    torusKnot.rotation.y = elapsedTime * 0.1;
    torusKnot.rotation.x = elapsedTime * 0.05;

    // Rotate Red Particles
    redParticlesMesh.rotation.y = -elapsedTime * 0.05;
    redParticlesMesh.rotation.x = mouseY * 0.5;
    redParticlesMesh.rotation.y += mouseX * 0.5;

    // Rotate Green Particles (slightly different speed for variety)
    greenParticlesMesh.rotation.y = elapsedTime * 0.04;
    greenParticlesMesh.rotation.x = -mouseY * 0.4;
    greenParticlesMesh.rotation.y += mouseX * 0.4;

    // Camera swaying interaction
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();


// Interactivity
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});
