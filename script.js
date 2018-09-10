
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.x = 8;
camera.position.y = 3;
camera.position.z = 20;

var controls = new THREE.OrbitControls( camera );

var light = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( camera );
camera.add( light );

axis = new THREE.AxisHelper(75);
scene.add(axis);

var gridXZ = new THREE.GridHelper(100, 100);
scene.add(gridXZ);

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor("#cccccc");

renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

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

var render = function () {
  requestAnimationFrame( render );
  renderer.sortObjects = false;
  renderer.render(scene, camera);
};

render();
