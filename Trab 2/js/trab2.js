import * as THREE from 'three';
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

let camera, scene, renderer;
let animais = [];
let parametrosGui;
let gui;
let cameraTarget = null;

// ---------------- Inicialização ----------------
export function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaed6f1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Luzes
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Chão
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    camera.position.set(0, 15, 30);

    // Carrega animais
    carregarAnimais();
    
    window.addEventListener('resize', onWindowResize);
    renderer.setAnimationLoop(animate);
}

function cameraMouseMove(event) {
    if (!cameraTarget) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        camera.position.x += mouseX * 0.5;
        camera.position.y += mouseY * 0.5;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

window.addEventListener('mousemove', cameraMouseMove, false);   


// ---------------- Carregar Animais ----------------
function carregarAnimais() {
    const loader = new OBJLoader();

    const modelos = [
        { 
            nome: 'Tartaruga', 
            caminho: 'assets/13103_pearlturtle_v1_l2.obj', 
            pos: new THREE.Vector3(-10, 0, 5),
            scale: 0.5,
            rot: new THREE.Euler(-Math.PI / 2, 0, 0) // normal
        },
        { 
            nome: 'Gato', 
            caminho: 'assets/12221_Cat_v1_l3.obj', 
            pos: new THREE.Vector3(10, 0, -10),
            scale: 0.5,
            rot: new THREE.Euler(-Math.PI / 2, 0, 0)
        },
        { 
            nome: "T-rex", 
            caminho: "assets/T-rex Model.obj", 
            pos: new THREE.Vector3(-20, -20, -10),
            scale: 0.1, // T-Rex é muito grande
            rot: new THREE.Euler(0, Math.PI / 2, 0) // ajusta orientação corretamente
        },
        {
            nome: "Cavalo",
            caminho: "assets/16267_American_Paint_Horse_Nuetral_new.obj",
            pos: new THREE.Vector3(15, 0, 15),
            scale: 0.2, // Cavalo é muito grande
            rot: new THREE.Euler(-Math.PI /2, 0, 20) // ajusta orientação corretamente
        },
        {
            nome: "Cachorro",
            caminho: "assets/10680_Dog_v2.obj",
            pos: new THREE.Vector3(0, 0, 0),
            scale: 0.5,
            rot: new THREE.Euler(-Math.PI /2, 0, 0) // ajusta orientação corretamente
        },
        {
            nome: "Peixe",
            caminho: "assets/fish.obj",
            pos: new THREE.Vector3(25, 10, -5),
            scale: 3,
            rot: new THREE.Euler(0, 0, 0) // ajusta orientação corretamente
        }


    ];

    let animaisCarregados = 0;

    modelos.forEach(({ nome, caminho, pos, scale, rot }) => {
        loader.load(
            caminho,
            (obj) => {
                obj.position.copy(pos);
                obj.scale.set(scale, scale, scale);
                obj.rotation.copy(rot);
                obj.name = nome;
                scene.add(obj);
                animais.push({ nome, obj });
                animaisCarregados++;

                console.log("Animal carregado:", nome, obj.position);

                if (animaisCarregados === modelos.length) {
                    criarGUI();
                }
            },
            undefined,
            (erro) => console.error(`Erro ao carregar ${nome}:`, erro)
        );
    });
}


// ---------------- Criar GUI ----------------
function criarGUI() {
    gui = new GUI();
    parametrosGui = { Animal: animais[0].nome }; // valor inicial
    const nomesAnimais = animais.map(a => a.nome);

    const lista = gui.add(parametrosGui, "Animal", nomesAnimais);
    lista.name("Animais");

    lista.onChange((nome) => {
        console.log("GUI mudou para:", nome);
        focarCamera(nome);
    });

    // Foca inicialmente no primeiro animal
    focarCamera(parametrosGui.Animal);
}

// ---------------- Resize ----------------
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ---------------- Focar Camera ----------------
function focarCamera(nome) {
    const animal = animais.find(a => a.nome === nome);
    if (!animal) {
        console.log("Animal não encontrado:", nome);
        return;
    }

    const alvo = animal.obj.position.clone();
    cameraTarget = {
        pos: new THREE.Vector3(alvo.x + 5, alvo.y + 3, alvo.z + 10),
        lookAt: new THREE.Vector3(alvo.x, alvo.y + 2, alvo.z)
    };

    console.log("Camera target definido:", cameraTarget);
}

// ---------------- Animação ----------------
function animate() {
    if (cameraTarget) {
        camera.position.lerp(cameraTarget.pos, 0.1);
        camera.lookAt(cameraTarget.lookAt);

        if (camera.position.distanceTo(cameraTarget.pos) < 0.1) {
            camera.position.copy(cameraTarget.pos);
            camera.lookAt(cameraTarget.lookAt);
            cameraTarget = null;
        }
    }

    renderer.render(scene, camera);
}
