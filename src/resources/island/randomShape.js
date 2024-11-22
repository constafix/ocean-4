import * as THREE from 'three';

function createRandomShape(size) {
  const shape = new THREE.Shape();
  const points = [];
  const numPoints = 8 + Math.floor(Math.random() * 5); // Случайное количество точек

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radius = size * (0.5 + Math.random() * 0.5);
    points.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
  }

  shape.setFromPoints(points);
  shape.autoClose = true; // Закрытие контура

  const boundingBox = new THREE.Box2().setFromPoints(points);
  shape.boundingBox = boundingBox;

  // Метод для трансляции точки
  shape.translate = function(x, y) {
    this.getPoints().forEach(point => {
      point.x += x;
      point.y += y;
    });
    this.boundingBox.translate(new THREE.Vector2(x, y));
  };

  return shape;
}

export { createRandomShape };
