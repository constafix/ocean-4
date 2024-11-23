import * as THREE from 'three';

function createOceanFloor(scene) {
  const oceanFloorGeometry = new THREE.PlaneGeometry(1200, 1200, 50, 50); // Увеличиваем детализацию сетки
  const oceanFloorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, wireframe: true }); // Добавляем wireframe для отображения сетки
  const oceanFloor = new THREE.Mesh(oceanFloorGeometry, oceanFloorMaterial);
  oceanFloor.rotation.x = -Math.PI / 2;
  oceanFloor.position.y = -50; // Располагаем дно океана ниже уровня воды и острова
  scene.add(oceanFloor);
}

export { createOceanFloor };
