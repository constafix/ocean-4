import * as THREE from 'three';

function createSailingShip(scene) {
  const ship = new THREE.Group();

  // Создание корпуса корабля с использованием сложной геометрии
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-5, 0);
  hullShape.quadraticCurveTo(-5, 5, 0, 10);
  hullShape.quadraticCurveTo(5, 5, 5, 0);
  hullShape.lineTo(-5, 0);

  const extrudeSettings = {
    steps: 2,
    depth: 50,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2
  };

  const hullGeometry = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.position.set(0, 5, 0);
  hull.rotation.x = Math.PI / 2; // Выровнять корпус по оси X
  ship.add(hull);

  // Создание палубы с текстурой
  const deckGeometry = new THREE.BoxGeometry(20, 1, 48);
  const deckTexture = new THREE.TextureLoader().load('path/to/deck_texture.jpg'); // Добавьте путь к вашей текстуре
  const deckMaterial = new THREE.MeshStandardMaterial({ map: deckTexture });
  const deck = new THREE.Mesh(deckGeometry, deckMaterial);
  deck.position.set(0, 10.5, 0);
  hull.add(deck);

  // Создание мачт с текстурами
  function createMast(x, y, z) {
    const mastGeometry = new THREE.CylinderGeometry(0.5, 0.5, 50, 32);
    const mastTexture = new THREE.TextureLoader().load('path/to/mast_texture.jpg'); // Добавьте путь к вашей текстуре
    const mastMaterial = new THREE.MeshStandardMaterial({ map: mastTexture });
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(x, y, z);
    return mast;
  }

  const mast1 = createMast(0, 30, -15);
  const mast2 = createMast(0, 30, 15);
  hull.add(mast1);
  hull.add(mast2);

  // Создание сложных парусов с текстурами
  function createSail(mast, width, height, x, y, z) {
    const sailGeometry = new THREE.PlaneGeometry(width, height);
    const sailTexture = new THREE.TextureLoader().load('path/to/sail_texture.jpg'); // Добавьте путь к вашей текстуре
    const sailMaterial = new THREE.MeshStandardMaterial({ map: sailTexture, side: THREE.DoubleSide });
    const sail = new THREE.Mesh(sailGeometry, sailMaterial);
    sail.position.set(x, y, z);
    sail.rotation.y = Math.PI / 2;
    mast.add(sail);
  }

  createSail(mast1, 20, 25, 0, 15, 0);
  createSail(mast1, 15, 20, 0, -15, 0);
  createSail(mast2, 15, 20, 0, 15, 0);
  createSail(mast2, 10, 15, 0, -15, 0);

  // Создание флага
  const flagGeometry = new THREE.PlaneGeometry(5, 3);
  const flagTexture = new THREE.TextureLoader().load('path/to/flag_texture.jpg'); // Добавьте путь к вашей текстуре
  const flagMaterial = new THREE.MeshStandardMaterial({ map: flagTexture, side: THREE.DoubleSide });
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(0, 50, 0);
  mast1.add(flag);

  // Создание носовой и кормовой частей
  function createBowStern(x, y, z) {
    const partGeometry = new THREE.BoxGeometry(4, 4, 20);
    const partTexture = new THREE.TextureLoader().load('path/to/part_texture.jpg'); // Добавьте путь к вашей текстуре
    const partMaterial = new THREE.MeshStandardMaterial({ map: partTexture });
    const part = new THREE.Mesh(partGeometry, partMaterial);
    part.position.set(x, y, z);
    return part;
  }

  const bow = createBowStern(0, 5, -35);
  const stern = createBowStern(0, 5, 35);
  hull.add(bow);
  hull.add(stern);

  // Добавление деталей: поручни, окна, рельсы и т.д.
  function createDetail(x, y, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const texture = new THREE.TextureLoader().load('path/to/detail_texture.jpg'); // Добавьте путь к вашей текстуре
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const detail = new THREE.Mesh(geometry, material);
    detail.position.set(x, y, z);
    return detail;
  }

  const details = [
    createDetail(0, 11, -20, 1, 1, 1),
    createDetail(0, 11, 20, 1, 1, 1),
    createDetail(10, 11, 0, 1, 1, 1),
    createDetail(-10, 11, 0, 1, 1, 1),
  ];

  details.forEach(detail => hull.add(detail));

  // Создание реек для парусов
  function createSpar(x, y, z, length) {
    const sparGeometry = new THREE.CylinderGeometry(0.2, 0.2, length, 8);
    const sparTexture = new THREE.TextureLoader().load('path/to/spar_texture.jpg'); // Добавьте путь к вашей текстуре
    const sparMaterial = new THREE.MeshStandardMaterial({ map: sparTexture });
    const spar = new THREE.Mesh(sparGeometry, sparMaterial);
    spar.position.set(x, y, z);
    spar.rotation.z = Math.PI / 2;
    return spar;
  }

  const spar1 = createSpar(0, 30, -15, 20);
  const spar2 = createSpar(0, 30, 15, 15);
  mast1.add(spar1);
  mast2.add(spar2);

  // Функция для анимации корабля
  hull.userData.animate = function(time) {
    this.position.y = 5 + Math.sin(time / 1000) * 2; // Корабль будет плавать вверх и вниз
  };

  scene.add(ship);
  return ship;
}

export { createSailingShip };
