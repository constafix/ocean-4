import * as THREE from 'three';
import { createTree, createRock, createBush } from './elements.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();

function createBiome(position, geometry, color, heightVariation, name, elevationRange, scene) {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  // Введение вариаций высоты
  const vertices = geometry.attributes.position.array;
  const vertexPositions = []; // Массив для хранения позиций вершин

  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 2] = elevationRange[0] + Math.random() * (elevationRange[1] - elevationRange[0]);
    vertexPositions.push({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] }); // Сохранение позиций вершин
  }
  geometry.attributes.position.needsUpdate = true;

  plane.rotation.x = -Math.PI / 2;
  group.add(plane);

  // Добавление границ для поверхности биома
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: color });
  const lines = new THREE.LineSegments(edges, lineMaterial);
  plane.add(lines);

  // Функция для размещения объектов на поверхности
  function placeObjectOnSurface(object) {
    // Выбираем случайную вершину
    const randomVertex = vertexPositions[Math.floor(Math.random() * vertexPositions.length)];
    object.position.set(randomVertex.x, randomVertex.z, randomVertex.y);
    group.add(object);
  }

  // Добавление деревьев, камней и кустарников к биому
  for (let i = 0; i < 10; i++) {
    placeObjectOnSurface(createTree());
    placeObjectOnSurface(createRock());
    placeObjectOnSurface(createBush());
  }

  // Загрузка шрифта и добавление текста
  fontLoader.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
    let text = name;
    const maxLineWidth = geometry.parameters.width * 0.8;

    // Разделение текста на строки
    const words = name.split(' ');
    let line = '';
    let formattedText = '';

    words.forEach((word) => {
      const testLine = line + word + ' ';
      const testGeometry = new TextGeometry(testLine, {
        font: font,
        size: Math.min(geometry.parameters.width, geometry.parameters.height) / 10,
        depth: 2, // Используем depth вместо устаревшего height
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 2
      });

      testGeometry.computeBoundingBox();
      const lineWidth = testGeometry.boundingBox.max.x - testGeometry.boundingBox.min.x;

      if (lineWidth > maxLineWidth) {
        formattedText += line + '\n';
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    formattedText += line;

    const textGeometry = new TextGeometry(formattedText, {
      font: font,
      size: Math.min(geometry.parameters.width, geometry.parameters.height) / 10,
      depth: 2, // Используем depth вместо устаревшего height
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 2
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // Цвет текста - белый
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 45, 0); // Поднятие текста
    textMesh.rotation.x = -Math.PI / 2; // Поворот текста, чтобы он был виден сверху
    textMesh.geometry.center(); // Центрирование текста
    group.add(textMesh);
  });

  group.position.set(position.x, position.y, position.z);
  scene.add(group);
}

export { createBiome };
