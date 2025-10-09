import * as THREE from 'three';
import { GLTFLoader } from '/three/jsm/loaders/GLTFLoader.js';
import { GUI } from '/three/jsm/libs/lil-gui.module.min.js';

let camera, scene, renderer;
let animais = [];
let gui;

// ---------------- Inicialização ----------------
export function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 8, 20);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaed6f1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Luzes
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Chão
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Carregar animais
    carregarAnimais();

    // GUI
    gui = new GUI();
    const opcoes = { Animal: "" };
    const lista = gui.add(opcoes, "Animal", []);
    lista.onChange((nome) => focarCamera(nome));

    // Atualiza lista depois do carregamento
    const interval = setInterval(() => {
        if (animais.length >= 6) {
            lista.options(animais.map(a => a.nome));
            clearInterval(interval);
        }
    }, 500);

    window.addEventListener('resize', onWindowResize);
    renderer.setAnimationLoop(animate);
}

// ---------------- Carregamento de modelos ----------------
function carregarAnimais() {
    const loader = new GLTFLoader();

    const modelos = [
        { nome: 'Tartaruga', caminho: 'assets/13103_pearlturtle_v1_l2.obj/', pos: new THREE.Vector3(-10, 0, -5) },
        //{ nome: 'Vaca2', caminho: 'models/cow.glb', pos: new THREE.Vector3(5, 0, -10) },
       // { nome: 'Panda1', caminho: 'models/panda.glb', pos: new THREE.Vector3(-15, 0, 10) },
      //  { nome: 'Panda2', caminho: 'models/panda.glb', pos: new THREE.Vector3(10, 0, 15) },
        //{ nome: 'Dino1', caminho: 'models/dino.glb', pos: new THREE.Vector3(15, 0, -5) },
       // { nome: 'Dino2', caminho: 'models/dino.glb', pos: new THREE.Vector3(-5, 0, 15) }
    ];

    modelos.forEach(({ nome, caminho, pos }) => {
        loader.load(
            caminho,
            (gltf) => {
                const obj = gltf.scene;
                obj.position.copy(pos);
                obj.scale.set(1.5, 1.5, 1.5);
                obj.name = nome;
                scene.add(obj);
                animais.push({ nome, obj });
            },
            undefined,
            (erro) => console.error(`Erro ao carregar ${nome}:`, erro)
        );
    });
}

// ---------------- Foco da câmera ----------------
function focarCamera(nome) {
    const animal = animais.find(a => a.nome === nome);
    if (animal) {
        camera.lookAt(animal.obj.position);
    }
}

// ---------------- Loop de animação ----------------
function animate() {
    renderer.render(scene, camera);
}

// ---------------- Resize ----------------
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
