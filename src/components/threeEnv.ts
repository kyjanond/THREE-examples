import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { glbAssetLoaderSingleton } from "./geometryLoader";
import assetUrls from "./assets";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { IInfoProps } from "../react/info";
import InfoCard from "../react/info";
import ReactDOM from "react-dom";
import React from "react";

const stats:Stats = Stats();
const clock = new THREE.Clock();

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

let sceneContainer:HTMLElement;
let controls:OrbitControls;
let camera:THREE.PerspectiveCamera;

function createHelpers(scene:THREE.Scene){
  const axesHelper = new THREE.AxesHelper( 0.25 );
	scene.add( axesHelper );
	const gridHelper = new THREE.GridHelper( 10, 40 );
	scene.add( gridHelper );
}

function createLights(scene:THREE.Scene){
  const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
  scene.add( directionalLight1 );

  const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.4 );
  scene.add( directionalLight2 );

  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1;
  //const light = new THREE.AmbientLight(color, intensity);
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}

function moveAgents(scene:THREE.Scene,deltaTime:number){
  let parent = scene.getObjectByName("robotParent");
  if (parent == null){
    return;
  }
  parent.children.forEach(child => {
    child.rotateY(Math.PI*0.1*deltaTime);
    child.translateZ((0.5)*deltaTime);
  });
}

function instantiateGltf(scene:THREE.Scene){
  let parent = scene.getObjectByName("robotParent");
  if (parent == null){
    parent = new THREE.Object3D();
    parent.name = "robotParent";
  }
  else{
    parent.clear();
  }

  glbAssetLoaderSingleton.loadModel(assetUrls.bb8)
  .then((gltf:GLTF)=>{
    const model = gltf.scene;
    model.scale.multiplyScalar(0.01);
    model.position.set(0,0.75,0);
    for (let index = 0; index < 10; index++) {
      const gometryWrapper = new THREE.Object3D();
      gometryWrapper.add(model.clone(true));
      gometryWrapper.position.set(
        5-Math.random()*10,
        0,
        5-Math.random()*10,
      )
      gometryWrapper.rotateY(Math.random()*2*Math.PI);
      parent.add(gometryWrapper);
      
    }
    scene.add(parent);
  })
}

export default function init(container: HTMLElement, window: Window):void{
  sceneContainer = container;

  scene.background = new THREE.Color("#e6e6e6");

  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor("#e6e6e6",1);
  sceneContainer.appendChild( renderer.domElement );
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.set( 0, 1.75, -2 );
  camera.far = 100;
  scene.add(camera);

	sceneContainer.appendChild( stats.dom );

  controls = new OrbitControls( camera, renderer.domElement );
  
  createHelpers(scene);
  createLights(scene);
  instantiateGltf(scene);
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );
  clock.start();
  gameLoop();
  console.debug("---Scene initialized---")
}

const gameLoop = function () {
  const deltaTime = clock.getDelta();
	requestAnimationFrame( gameLoop );
  stats.begin();
	controls.update();
  moveAgents(scene,deltaTime);
  renderer.render(scene, camera);
	stats.end();
  renderer.info.render.calls;
  renderInfo({
    drawCalls:renderer.info.render.calls
  })
  renderer.info.reset();
};

function onWindowResize() {

	camera.aspect = sceneContainer.offsetWidth / sceneContainer.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( sceneContainer.offsetWidth, sceneContainer.offsetHeight );
}

function renderInfo(props:IInfoProps){
  ReactDOM.render(
    React.createElement(
      InfoCard, 
      props 
      ),document.getElementById("info")
  )
}