<template>
  <div id="container"></div>
  <button @click="toggle('inner')">切换到室内</button>
  <button @click="toggle('out')">切换到室外</button>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Animations from "../utils/animations";
import { update } from "@tweenjs/tween.js";

let scene, camera, renderer, controls, box, houseOut;

const initThree = () => {
  //场景
  scene = new THREE.Scene();
  //镜头
  camera = new THREE.PerspectiveCamera(
    90,
    document.body.clientWidth / document.body.clientHeight,
    0.1,
    100
  );
  //渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);
  document.getElementById("container").appendChild(renderer.domElement);
  //镜头控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.rotateSpeed = -0.25;

  //添加3D物体
  useHouseInner();
  useHouseOut();
  showCamerHelper();

  controls.target.set(3, 0, 0.01);
  camera.position.set(3, 0, 0);

  // 页面缩放事件监听
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // 更新渲染
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // 更新相机
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  animation();
};

//帧同步重绘
const animation = () => {
  requestAnimationFrame(animation);
  box.rotation.y = box.rotation.y + 0.001;
  houseOut.rotation.y = houseOut.rotation.y + 0.001;
  controls.update(); // required when damping is enabled
  update();
  renderer.render(scene, camera);
};

const useHouseInner = () => {
  //根据左右上下前后的顺序构建六个面的材质集
  const maps = [
    "/images/scene_left.jpeg",
    "/images/scene_right.jpeg",
    "/images/scene_top.jpeg",
    "/images/scene_bottom.jpeg",
    "/images/scene_front.jpeg",
    "/images/scene_back.jpeg",
  ];
  const materials = maps.map((texturePath) => {
    const map = new THREE.TextureLoader().load(texturePath);
    return new THREE.MeshBasicMaterial({ map });
  });
  box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
  box.geometry.scale(1, 1, -1);
  // box.rotation.y = Math.PI / 2;

  box.position.set(0, 0, 0);
  scene.add(box);
  return box;
};

const useHouseOut = () => {
  const textures = getTexturesFromAtlasFile("/images/house_out.jpg", 6);

  const materials = [];

  for (let i = 0; i < 6; i++) {
    materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }));
  }

  houseOut = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
  houseOut.geometry.scale(1, 1, -1);
  houseOut.position.set(3, 0, 0);
  scene.add(houseOut);
};

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
  const textures = [];

  for (let i = 0; i < tilesNum; i++) {
    textures[i] = new THREE.Texture();
  }

  const imageObj = new Image();

  imageObj.onload = function () {
    let canvas, context;
    const tileWidth = imageObj.height;

    for (let i = 0; i < textures.length; i++) {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context.drawImage(
        imageObj,
        tileWidth * i,
        0,
        tileWidth,
        tileWidth,
        0,
        0,
        tileWidth,
        tileWidth
      );
      textures[i].image = canvas;
      textures[i].needsUpdate = true;
    }
  };

  imageObj.src = atlasImgUrl;

  return textures;
}

const toggle = (type) => {
  let x, y, z;
  if (type === "inner") {
    (x = 0), (y = 0), (z = 0);
    Animations.animateCamera(
      camera,
      controls,
      { x, y, z },
      { x, y, z: 0.01 },
      1600,
      () => {}
    );
  } else {
    (x = 3), (y = 0), (z = 0);
    Animations.animateCamera(
      camera,
      controls,
      { x, y, z },
      { x, y, z: 0.01 },
      1600,
      () => {}
    );
  }
};
const showCamerHelper = () => {
  const helper = new THREE.CameraHelper(camera);
  scene.add(helper);
};
window.onload = initThree;
</script>
