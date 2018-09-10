// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 20;
camera.position.x = 8;
camera.position.y = 3;

//Orbit Control
var controls = new THREE.OrbitControls( camera );

// Create light
var light = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( camera );
camera.add( light );

//Axes Helper
axis = new THREE.AxisHelper(75);
scene.add(axis);

//grid helper xz
var gridXZ = new THREE.GridHelper(100, 100);
scene.add(gridXZ);

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#cccccc");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// GEOMETRY
// ------------------------------------------------

var geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( -10,  10, 0 ),
	new THREE.Vector3( -10, -10, 0 ),
	new THREE.Vector3(  10, -10, 0 )
);

geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
geometry.computeFaceNormals();

const material = new THREE.MeshPhongMaterial( { color: 0x0000ff, side: THREE.DoubleSide } );
mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);

// Render Loop
var render = function () {
  requestAnimationFrame( render );
  renderer.sortObjects = false;
  renderer.render(scene, camera);
};

render();
