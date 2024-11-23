import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createIsland } from './src/resources/island/island.js'; // Импортируем функцию createIsland из island.js
import { createOcean, animateWater } from './src/resources/ocean/ocean.js'; // Импортируем функции createOcean и animateWater из ocean.js
import { createOceanFloor } from './src/resources/ocean/oceanFloor.js'; // Импортируем функцию createOceanFloor из oceanFloor.js

// Создание сцены
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Создание камеры
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000 // Увеличиваем дальность обзора камеры
);
camera.position.set(800, 800, 800); // Установка камеры сбоку-сверху
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Направление камеры на центр

// Создание рендера
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавление яркости источникам света
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Увеличение интенсивности до 1.5
directionalLight.position.set(-1, 1, 1).normalize();
scene.add(directionalLight);

// Создание объектов острова
const island = createIsland(scene);

// Создание дна океана
createOceanFloor(scene);

// Установка управления камерой на один из объектов
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Включение сглаживания движений

// Создание океана
let water;
createOcean(scene, directionalLight).then((createdWater) => {
  water = createdWater;
}).catch((error) => {
  console.error('Error creating ocean:', error);
});

// Анимация
function animate(time) {
  requestAnimationFrame(animate);

  if (water) {
    animateWater(water, time);
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();
