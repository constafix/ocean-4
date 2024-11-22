import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

async function loadTexture(url) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load(url, (texture) => {
            resolve(texture);
        }, undefined, (error) => {
            reject(new Error(`Ошибка загрузки текстуры: ${error.message}`));
        });
    });
}

async function createOcean(scene, directionalLight) {
    const waterGeometry = new THREE.PlaneGeometry(4000, 4000); // Размеры океана, чтобы охватывал весь остров

    const waterTexture = await loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg');

    if (waterTexture) {
        waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
    }

    const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterTexture,
        alpha: 1.0,
        sunDirection: directionalLight.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 80,
        fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;
    water.position.y = 0; // Устанавливаем уровень воды на 0 для затопления краев острова
    scene.add(water);

    return water;
}

function animateWater(water, time) {
    water.material.uniforms['time'].value = time * 0.001; // Обновление времени для анимации воды
}

export { createOcean, animateWater };
