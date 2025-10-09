import * as THREE from 'three';

let camera, scene, renderer;

let cube, sphere;

var criaCubo = function(){
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshBasicMaterial( { color: 0x0000ff,wireframe:true } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
}

var criaRetangulo = function(){
    const geometry = new THREE.BoxGeometry( 1, 2, 0.5 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube2 = new THREE.Mesh( geometry, material );
    cube2.position.x = 3;
    scene.add( cube2 );
}

var criaEsfera = function(){
    //with wireframe
    const geometry = new THREE.SphereGeometry( 1, 32, 32 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000,wireframe:true } );
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = -3;
    scene.add( sphere );
}  

var criaCilindro = function(){
    const geometry = new THREE.CylinderGeometry( 1, 1, 2, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.x = 5;
    scene.add( cylinder );
}

export function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
   // camera.position.z = -20;
    
    //cria o mundo
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( );
    renderer.setSize( window.innerWidth, window.innerHeight );

    criaCubo();
    criaRetangulo();
    criaEsfera();
    criaCilindro();

    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = 1.5;

    //necessário se queremos fazer algo com animação
    //renderer.setAnimationLoop( protetorTela );
    
    document.body.appendChild( renderer.domElement );

    renderer.render( scene, camera );

    window.addEventListener( 'resize', onWindowResize );

}

let velocityCube = {x:0.06,y:0.01};
let velocitySphere = {x:0.01,y:0.02};

function protetorTela() {
    cube.position.x += velocityCube.x;
    cube.position.y += velocityCube.y;

    sphere.position.x += velocitySphere.x;
    sphere.position.y += velocitySphere.y;

    //máximos 
    const xLimit = 5;
    const yLimit = 3;

    // Verifica colisão e inverte direção
    if (cube.position.x > xLimit || cube.position.x < -xLimit) {
        velocityCube.x = -velocityCube.x;
    }
    if (cube.position.y > yLimit || cube.position.y < -yLimit) {
        velocityCube.y = -velocityCube.y;
    }

    if (sphere.position.x > xLimit || sphere.position.x < -xLimit) {
        velocitySphere.x = -velocitySphere.x;
    }
    if (sphere.position.y > yLimit || sphere.position.y < -yLimit) {
        velocitySphere.y = -velocitySphere.y;
    }

    renderer.render(scene, camera);
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
