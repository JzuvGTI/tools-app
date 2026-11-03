// public/js/scripts.js
// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.getElementById('theme-body');
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  body.classList.toggle('bg-black');
  body.classList.toggle('bg-white');
  body.classList.toggle('text-white');
  body.classList.toggle('text-gray-900');
  themeToggle.querySelector('i').classList.toggle('fa-moon');
  themeToggle.querySelector('i').classList.toggle('fa-sun');
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Language Selector (Placeholder for translation logic)
const languageSelectors = [document.getElementById('language-selector'), document.getElementById('mobile-language-selector')];
languageSelectors.forEach(selector => {
  if (selector) {
    selector.addEventListener('change', (e) => {
      const lang = e.target.value;
      console.log(`Bahasa diubah ke: ${lang}`);
    });
  }
});

// Anime.js untuk Animasi Judul dan Deskripsi
anime({
  targets: '.animate__title',
  translateY: [-50, 0],
  opacity: [0, 1],
  duration: 1000,
  easing: 'easeOutQuad'
});
anime({
  targets: '.animate__description',
  translateY: [50, 0],
  opacity: [0, 1],
  duration: 1000,
  delay: 300,
  easing: 'easeOutQuad'
});

// Three.js Interconnected Cubes Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("cell-canvas"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cubeCount = window.innerWidth < 768 ? 20 : 40;
const cubeSize = 0.3;
const maxDistance = 3;
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4bffa5, transparent: true, opacity: 0.5 });

const cubes = [];
class Cube {
  constructor() {
    this.geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    this.mesh = new THREE.Mesh(this.geometry, cubeMaterial);
    this.mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    );
    scene.add(this.mesh);
  }

  update() {
    this.mesh.position.add(this.velocity);
    if (Math.abs(this.mesh.position.x) > 5) this.velocity.x *= -1;
    if (Math.abs(this.mesh.position.y) > 5) this.velocity.y *= -1;
    if (Math.abs(this.mesh.position.z) > 5) this.velocity.z *= -1;
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }
}

for (let i = 0; i < cubeCount; i++) {
  cubes.push(new Cube());
}

function animate() {
  requestAnimationFrame(animate);
  cubes.forEach(cube => cube.update());
  scene.children = scene.children.filter(child => !(child instanceof THREE.Line));
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const distance = cubes[i].mesh.position.distanceTo(cubes[j].mesh.position);
      if (distance < maxDistance) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          cubes[i].mesh.position,
          cubes[j].mesh.position
        ]);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
      }
    }
  }
  scene.rotation.y += 0.002;
  renderer.render(scene, camera);
}

camera.position.z = window.innerWidth < 768 ? 10 : 8;
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});