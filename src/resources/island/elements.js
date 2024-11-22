import * as THREE from 'three';

function createTree() {
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

  const leavesGeometry = new THREE.SphereGeometry(2, 16, 16);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(0, 3.5, 0);

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);

  return tree;
}

function createRock() {
  const rockGeometry = new THREE.DodecahedronGeometry(2, 0);
  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const rock = new THREE.Mesh(rockGeometry, rockMaterial);
  return rock;
}

function createBush() {
  const bushGeometry = new THREE.SphereGeometry(1.5, 8, 8);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  return bush;
}

export { createTree, createRock, createBush };
