import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createTerrain } from './terrain.js'; // Импортируем функцию createTerrain из terrain.js
import { createOcean, animateWater } from './ocean.js'; // Импортируем функции createOcean и animateWater из ocean.js

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

// Добавление источников света для океана
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(-1, 1, 1).normalize();
scene.add(directionalLight);

// Создание карты высот
let terrainPlane;
createTerrain(scene).then((createdTerrain) => {
  terrainPlane = createdTerrain;

  // Установка управления камерой
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(terrainPlane.position);
  controls.enableDamping = true; // Включение сглаживания движений

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
}).catch((error) => {
  console.error('Error creating terrain:', error);
});

// Создание океана
let water;
createOcean(scene, directionalLight).then((createdWater) => {
  water = createdWater;
}).catch((error) => {
  console.error('Error creating ocean:', error);
});
