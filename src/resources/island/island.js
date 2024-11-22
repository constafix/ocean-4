import * as THREE from 'three';
import { createBiome } from './biome.js';

function createIsland(scene) {
  const islandGroup = new THREE.Group();
  islandGroup.position.y = 10; // Поднятие острова на 10 единиц вверх

  // Размер острова
  const islandSize = 600; // Общий размер острова
  const biomes = [
    { color: 0xFFD700, height: 1, name: 'Песчаные пляжи', elevationRange: [0, 5] },
    { color: 0x2E8B57, height: 1, name: 'Мангровые заросли', elevationRange: [0, 5] },
    { color: 0x228B22, height: 2, name: 'Тропический лес', elevationRange: [5, 15] },
    { color: 0x006400, height: 2, name: 'Влажные болота', elevationRange: [5, 15] },
    { color: 0xFFFF00, height: 2, name: 'Цветущие луга', elevationRange: [5, 15] },
    { color: 0xADFF2F, height: 3, name: 'Луга и саванны', elevationRange: [10, 20] },
    { color: 0x32CD32, height: 3, name: 'Бамбуковые леса', elevationRange: [10, 20] },
    { color: 0x8B4513, height: 4, name: 'Горная местность', elevationRange: [15, 25] },
    { color: 0xADD8E6, height: 5, name: 'Тундра', elevationRange: [20, 30] },
    { color: 0xC2B280, height: 5, name: 'Сухие пустоши', elevationRange: [20, 30] }
  ];

  // Функция для равномерного распределения биомов по острову
  function distributeBiomes(biomes, islandSize) {
    const numBiomes = biomes.length;
    const biomesPerRow = Math.ceil(Math.sqrt(numBiomes));
    const sectionSize = islandSize / biomesPerRow;

    for (let i = 0; i < numBiomes; i++) {
      const row = Math.floor(i / biomesPerRow);
      const col = i % biomesPerRow;

      const xOffset = -islandSize / 2 + col * sectionSize;
      const zOffset = -islandSize / 2 + row * sectionSize;

      // Создание квадратного биома
      const geometry = new THREE.PlaneGeometry(sectionSize, sectionSize, 32, 32);

      createBiome({ x: xOffset, y: 0, z: zOffset }, geometry, biomes[i].color, biomes[i].height, biomes[i].name, biomes[i].elevationRange, scene);
    }
  }

  // Распределение биомов по острову
  distributeBiomes(biomes, islandSize);

  scene.add(islandGroup);
  return islandGroup;
}

export { createIsland };
