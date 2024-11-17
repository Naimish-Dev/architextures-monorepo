import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { ColladaLoader } from './three/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
window.THREE = THREE;
window.OrbitControls = OrbitControls;
window.ColladaLoader = ColladaLoader;
window.GLTFLoader = GLTFLoader;