import * as THREE from 'three';
import { createNoise4D } from 'simplex-noise';

const noise4D = createNoise4D();
const size = 1024; // Размер карты высот
const scale = 400; // Масштабирование шума
const heightScale = 50; // Масштаб высоты
const minHeight = 30; // Минимальная высота

function generateHeightMap() {
  const heightMapData = [];
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const distToEdge = Math.min(x, z, size - x, size - z) / (size / 2);
      const edgeFactor = Math.max(0, Math.min(1, distToEdge));
      let y = noise4D(x / scale, 0, z / scale, 0) * heightScale * edgeFactor * edgeFactor + minHeight; // Уменьшаем высоту у краев
      y = Math.max(y, minHeight); // Проверка, чтобы высота была не ниже минимальной
      heightMapData.push(y);
    }
  }
  return heightMapData;
}

function smoothHeightMap(heightMapData, size) {
  const smoothedData = new Array(size * size).fill(0);
  for (let x = 1; x < size - 1; x++) {
    for (let z = 1; z < size - 1; z++) {
      const i = x + z * size;
      const neighbors = [
        heightMapData[i],
        heightMapData[i - 1],
        heightMapData[i + 1],
        heightMapData[i - size],
        heightMapData[i + size],
        heightMapData[i - size - 1],
        heightMapData[i - size + 1],
        heightMapData[i + size - 1],
        heightMapData[i + size + 1]
      ];
      smoothedData[i] = neighbors.reduce((sum, val) => sum + val, 0) / neighbors.length;
    }
  }
  return smoothedData;
}

async function loadShader(url) {
  const response = await fetch(url);
  return response.text();
}

async function createTerrain(scene) {
  const heightMapData = generateHeightMap();
  const smoothedHeightMapData = smoothHeightMap(heightMapData, size);

  const terrainTexture = new THREE.TextureLoader().load('textures/rocky_terrain_diff_1k.jpg');

  const vertexShader = await loadShader('./shaders/terrainVertex.glsl');
  const fragmentShader = await loadShader('./shaders/terrainFragment.glsl');

  const terrainMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: terrainTexture },
      sunDirection: { value: new THREE.Vector3(-1, 1, 1).normalize() },
      sunColor: { value: new THREE.Color(0xffffff) },
      ambientLight: { value: new THREE.Color(0x404040) }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });

  const planeGeometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
  const positionAttribute = planeGeometry.attributes.position;

  for (let i = 0, l = positionAttribute.count; i < l; i++) {
    const x = positionAttribute.getX(i);
    const z = positionAttribute.getY(i); // Здесь меняем getZ на getY
    const y = smoothedHeightMapData[i];
    positionAttribute.setXYZ(i, x, z, y); // Меняем местами y и z
  }

  planeGeometry.computeVertexNormals();

  const terrainPlane = new THREE.Mesh(planeGeometry, terrainMaterial);
  terrainPlane.position.y = 10; // Поднимаем плоскость над уровнем океана
  terrainPlane.rotation.x = -Math.PI / 2; // Поворачиваем плоскость для правильной ориентации

  scene.add(terrainPlane);

  return terrainPlane;
}

export { createTerrain };
