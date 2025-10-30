import * as THREE from 'three';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js'

let camera, scene, renderer;

let  objects = [];

let velCubo = 0.001;

let parametrosGui;

var createGui = function(){
    const gui = new GUI();

    parametrosGui = {
        scale: 1,
        positionX : 0,
        lobaoScale : 30,
        lobaoRotationY: 0,
        opt : 'Origem'

    }

    let scale  = gui.add (parametrosGui, 'scale')
        .min (0.1)
        .max(10)
        .step (0.3)
        .name("Scale");
    scale.onChange(function(value){
        objects["ombro"].scale.x = objects["ombro"].scale.y = objects["ombro"].scale.z = value;
    }); 

    let position = gui.addFolder("Position");

    let lobao = gui.addFolder("Lobao");
    lobao.add (parametrosGui, 'lobaoScale')
        .min (0)
        .max(40)
        .step (1)
        .name("Scale")
        .onChange(function(value){
            objects["lobao"].scale.x  = objects["lobao"].scale.y = objects["lobao"].scale.z = value;
        }
    );
    lobao.add (parametrosGui, 'lobaoRotationY')
        .min (-2)
        .max(2)
        .step (0.1)
        .name("Rotation")
        .onChange(function(value){
            objects["lobao"].rotation.y =  value;
        }
    );
     let options = ['Origem', 'Lobao']
    lobao.add(parametrosGui, 'opt')
        .options(options)
        .name("Look")
        .onChange(function(value){
            console.log(value);
            if (value == "Lobao")
                camera.lookAt(objects["lobao"].position);
            else
                camera.lookAt(objects["ombro"].position);
        });


    position.add (parametrosGui, 'positionX')
        .min (-4)
        .max(4)
        .step (0.1)
        .name("X")
        .onChange(function(value){
            objects["ombro"].position.x = value;
        }
    ); 
}

var loadObj = function(){
    let objLoader = new OBJLoader();
    let fbxLoader = new FBXLoader();

        fbxLoader.load (
        "assets/Pug.fbx",
        function(obj){
            obj.traverse(function (child){
                if (child instanceof THREE.Mesh){
                    child.TextureLoader = new THREE.TextureLoader();
                    child.material.map = child.TextureLoader.load('assets/Pug_texture.png');
                }
            });
            scene.add(obj);
            objects["pug"] = obj;
            obj.position.x = -90;
            obj.position.y = 10;   
            obj.scale.x = obj.scale.y = obj.scale.z = 0.1;

            
        },
        function(progress){
            console.log("ta vivo! "+(progress.loaded/progress.total)*100 + "%");
        },
        function(error){
            console.log("Deu merda " + error);
        });

const textureLoader = new THREE.TextureLoader();

fbxLoader.load(
  "assets/whnp3v2jflkw-Tree/Tree.fbx",
  function (obj) {
    console.log(" Modelo carregado com sucesso!");

    // Caminho da textura (você pode trocar por outro dos que viu na pasta)
    const texture = textureLoader.load(
      "assets/whnp3v2jflkw-Tree/Tree.fbm/bark_0021.jpg",
      () => console.log(" Textura carregada!"),
      undefined,
      () => console.warn(" Textura não encontrada!")
    );

    // Percorre todos os filhos do modelo e aplica material com a textura
    obj.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.9,
          metalness: 0.1,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Ajusta posição e escala
    obj.position.x = 50;
    obj.position.y = -7;
    obj.position.z = -30;
    obj.scale.x = obj.scale.y = obj.scale.z = 50;


    scene.add(obj);
  },
  function (progress) {
    console.log(`Carregando árvore: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
  },
  function (error) {
    console.error(" Erro ao carregar modelo:", error);
  }
);




    

        fbxLoader.load("assets/modern chair 11 fbx.FBX",
        function(obj){
            obj.traverse(function (child){
                if (child instanceof THREE.Mesh){
                    child.TextureLoader = new THREE.TextureLoader();
                    child.material.map = child.TextureLoader.load('assets/68-map/0027.jpg');
                }   
            });
            scene.add(obj);
            objects["notebook"] = obj;
            obj.position.x = 10;
            obj.position.y = -10;   
            obj.position.z = 40;
            obj.scale.x = obj.scale.y = obj.scale.z = 0.4;
            
        },
        function(progress){
            console.log("ta vivo! "+(progress.loaded/progress.total)*100 + "%");
        },
        function(error){
            console.log("Deu merda " + error);
        }
    );
}



var criaSer = function(){
    const geometry = new THREE.BoxGeometry( 2, 10, 2 );
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom
        new THREE.MeshBasicMaterial({ color: 0x00ffff }), // front
        new THREE.MeshBasicMaterial({ color: 0xff00ff })  // back
    ];
    const material = materials;
    let cube = new THREE.Mesh( geometry, material );

    let sphere = new THREE.Mesh(  new THREE.SphereGeometry( 2, 32, 32 )
        , new THREE.MeshBasicMaterial({ color: 0xff00ff } ) );
    objects["ombro"] = sphere;
    scene.add (sphere);

    let pivoOmbro = new THREE.Group();
    sphere.add(pivoOmbro);

    pivoOmbro.add(cube);
    objects["pivoOmbro"] = (pivoOmbro);

    objects["cubo1"] = (cube);
    cube.position.y-=5;

    sphere = new THREE.Mesh(  new THREE.SphereGeometry( 1.5, 32, 32 )
        , new THREE.MeshBasicMaterial({ color: 0xffffff } ) );
    objects["cotovelo"] = sphere;
    sphere.position.y-=4.5;
    cube.add(sphere);

    let pivoCotovelo = new THREE.Group();
    sphere.add(pivoCotovelo);

    cube = new THREE.Mesh( geometry, material );
    pivoCotovelo.add(cube);
    cube.position.y-= 5;
    objects["pivoCotovelo"] = (pivoCotovelo);
    
}

export function init() {

    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 200 );
   // camera.position.z = -20;
    
    //cria o mundo
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);

    renderer = new THREE.WebGLRenderer( );
    renderer.setSize( window.innerWidth, window.innerHeight );
    scene.add(new THREE.AmbientLight(0xffffff));
    
    criaSer();
    createGui();
    loadObj();
    camera.position.z = 60;
    //necessário se queremos fazer algo com animação
    renderer.setAnimationLoop( nossaAnimacao );
    
    document.body.appendChild( renderer.domElement );

    renderer.render( scene, camera );


    //GROUND
    let ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 1000, 1000 ),
        new THREE.MeshBasicMaterial( { color: 0x228B22 } ),
    )
    ground.rotation.x = - Math.PI / 2;
    ground.position.y -=7;
    
    //grass texture
    ground.material.map = new THREE.TextureLoader().load('materials/grasslight-big.jpg');
    ground.material.map.wrapS = THREE.RepeatWrapping;
    ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.material.map.repeat.set( 25, 25 );
    ground.material.map.anisotropy = 32;
    ground.material.map.encoding = THREE.sRGBEncoding;
    ground.receiveShadow = true;
    scene.add( ground)


    document.addEventListener('keydown', onKeyDown);

    document.addEventListener('mousemove', makeMove);
    document.addEventListener('mouseup', clickOn);
    document.addEventListener('mousedown', ClickOff);

    window.addEventListener( 'resize', onWindowResize );


   
   
}
var nossaAnimacao = function () {
   
         
    
    renderer.render( scene, camera );

}


/**
 * Section of mouse mouve
 * 
 */
var click = false;
var mousePosition = {
    x: 0,
    y: 0,
    z: 0
};

var  makeMove = function(e){
    
    if (click){
        let deltaX =  mousePosition.x - e.offsetX;
        let deltaY  =  mousePosition.y - e.offsetY;
        
        let eulerMat = new THREE.Euler(toRadians(deltaY)*0.1, toRadians(deltaX)*0.1, 0, "YXZ");
        let quater = new THREE.Quaternion().setFromEuler(eulerMat);
        camera.quaternion.multiplyQuaternions(quater,camera.quaternion);
    }
     mousePosition = {
        x: e.offsetX,
        y : e.offsetY
    }
}

var ClickOff  = function (e) {
    click = true;
}
var clickOn = function (e) {
    click = false;
    
}

var toRadians = function (value){
    return value*(Math.PI/180);
}




// Moves
var velOmbro = 0.01;
var velCotovelo = 0.01;

var onKeyDown = function (e){
   
    if (e.keyCode == 187){ // +
        objects["ombro"].scale.x+= 0.01;
        objects["ombro"].scale.y+= 0.01;
        objects["ombro"].scale.z+= 0.01;
    }

    if (e.keyCode == 189){ //-
        objects["cubo1"].scale.x-= 0.01;
        objects["cubo1"].scale.y-= 0.01;
        objects["cubo1"].scale.z-= 0.01;
    }

    if (e.keyCode == 82){ //R
         objects["pivoOmbro"].rotation.x-= velOmbro;
         if (objects["pivoOmbro"].rotation.x < -1.62 || objects["pivoOmbro"].rotation.x > 0.9)
            velOmbro*=-1;

    }
    if (e.keyCode == 32) // space
            velCubo = velCubo == 0 ? 0.001 : 0;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


