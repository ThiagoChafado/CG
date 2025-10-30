import * as THREE from 'three';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


let camera, scene, renderer;

let  objects = [];

let velCubo = 0.001;

var parametrosGUI;

var createGui = function(){
	const gui = new GUI();

	parametrosGUI = {
		scalaMonstro: 1,
		posMonstroX: 0,
		posMonstroY: 0,
		posMonstroZ: 0,

		monstroColorT: "#899400",

		skyColor: "#00bfff",
		
		formaCabeca : "Redonda"
		
	}

	let fazScala = gui.add(parametrosGUI, 'scalaMonstro').min(0.1).max(2).step(0.1).name("Scala Monstro");
	fazScala.onChange(function(parametro){
        console.log(parametro);
		objects["ombro"].scale.x = objects["ombro"].scale.y = objects["ombro"].scale.z =  parametro;
	});

	let posicao = gui.addFolder("Posicao");
	
	let posX = posicao.add(parametrosGUI, 'posMonstroX').min(-4).max(4).step(0.5).name("Pos. X");
	posX.onChange(function(parametro){
		elements["tronco"].position.x =  parametro;
	});
	let posY = posicao.add(parametrosGUI, 'posMonstroY').min(-4).max(4).step(0.5).name("Pos. Y");
	posY.onChange(function(parametro){
		elements["tronco"].position.y =  parametro;
	});
	let posZ = posicao.add(parametrosGUI, 'posMonstroZ').min(-4).max(4).step(0.5).name("Pos. Z");
	posZ.onChange(function(parametro){
		elements["tronco"].position.z =  parametro;
	});

	let cores = gui.addFolder("Closet");
	/*let tronColor = cores.addColor(parametrosGUI, 'monstroColorT').name("Camiseta");
	tronColor.onChange(function(parametro){
		elements["tronco"].material.color = new THREE.Color(parametro);//.setHex(parametro.replace("#", "0x"));
	});*/

	let skyColor = cores.addColor(parametrosGUI, 'skyColor').name("Sky");
	skyColor.onChange(function(parametro){
		scene.background = new THREE.Color(parametro);
	});


	let opcoesCabeca = ["Redonda", "Quadrada"];
	let opcHead = cores.add(parametrosGUI, 'formaCabeca').options(opcoesCabeca).name("Cabeça");
	opcHead.onChange(function(parametro){
		let cabeca;
		
		if (parametro == "Redonda"){
			cabeca = new THREE.Mesh(new THREE.SphereGeometry(1.5,32, 32), new THREE.MeshStandardMaterial({color: 0x0000ff})); // 0,10,5
		}else if (parametro == "Quadrada"){
			cabeca = new THREE.Mesh(new THREE.BoxGeometry(3,2, 1.2), new THREE.MeshStandardMaterial({color: 0x0000ff})); // 0,10,5
		}
			cabeca.position.x = elements["cabeca"].position.x;
			cabeca.position.y = elements["cabeca"].position.y;
			cabeca.position.z = elements["cabeca"].position.z;

			elements["tronco"].remove(elements["cabeca"]);
			elements["tronco"].add(cabeca);
			elements["cabeca"] = cabeca;
	});
}


var loadObjects = function(){
	let objLoader = new OBJLoader();
	

	objLoader.load(
		'assets/Monkey_Suzanne.obj',//o que carregar
		function(obj){ //função executada após o loading
			
			obj.traverse(
				function (child){
					if (child instanceof THREE.Mesh){
						child.material = new THREE.MeshStandardMaterial({color: 0x0000ff});
						console.log("passou aqui !!!");
					}
				}
			);

			obj.scale.x = 3;
			obj.scale.y = 3;
			obj.scale.z = 3;
			
			obj.rotation.x-= Math.PI/2; //rotação de 90°	
			
			scene.add(obj);
			objects['mamaco'] = obj;
			console.log("Carregou!");
		},
		function (andamento){ //função executada durante o loading
			console.log(andamento.loaded/andamento.total*100 + "%");
		},
		function(error){//função executada se deu problema
			console.log("Deu erro: "+error);
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

    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 100 );
   // camera.position.z = -20;
    
    //cria o mundo
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( );
    renderer.setSize( window.innerWidth, window.innerHeight );

    criaSer();
    createGui();

    camera.position.z = 40;
    //necessário se queremos fazer algo com animação
    renderer.setAnimationLoop( nossaAnimacao );
    
    document.body.appendChild( renderer.domElement );

    renderer.render( scene, camera );

    document.addEventListener('keydown', onKeyDown);

    document.addEventListener('mousemove', makeMove);
    document.addEventListener('mouseup', clickOn);
    document.addEventListener('mousedown', ClickOff);

    window.addEventListener( 'resize', onWindowResize );

    loadObjects();

}

var nossaAnimacao = function () {
   // objects["pivoCotovelo"].rotation.x-= velCotovelo;
   // if (objects["pivoCotovelo"].rotation.x < -2.14 || objects["pivoCotovelo"].rotation.x > 1.3)
     //   velCotovelo*=-1;
         
    
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
        console.log("x>"+ deltaX + " y: " + deltaY);


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


