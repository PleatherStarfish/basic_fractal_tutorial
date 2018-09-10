class Faceter {
  constructor(geometry, depth = 1, skew = 200, rollOff = 2) {
    this.geometry = geometry;
    this.depth = depth;
    this.skew = skew
    this.rollOff = rollOff
    this.counter = 0;

  }

// Random floats within a range
// ------------------------------------------------------------------------------------------------------------------
randomRange(min, max, fixed=4, integers=false) {
    if (integers) {
      return (Math.floor(Math.random() * (max - min) + min));
    }
    else {
      return (parseFloat((Math.random() * (max - min) + min).toFixed(fixed)));
    }
  }
// ------------------------------------------------------------------------------------------------------------------


// Random number n such that (min < n < max)
// ------------------------------------------------------------------------------------------------------------------
randomExcludingZero(min, max) {
    const n = Math.random() * (max - min) + min;
    if (n > 0) {
      return n;
    }
    else {
      return this.randomExcludingZero(min, max);
    }
  }
// ------------------------------------------------------------------------------------------------------------------

offset(distanceToCenter, normal) {
  const pointOffset = ((distanceToCenter / this.randomRange(5, 10)) * normal) / (this.counter + 1);
  return pointOffset;
}

distanceToCenter( v, geometry, boundingBox ) {
    var dx = v.x - boundingBox.getCenter().x;
    var dy = v.y - boundingBox.getCenter().y;
    var dz = v.z - boundingBox.getCenter().z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

  // Find a random point a face and pushes it into the facetedGeo
  // ------------------------------------------------------------------------------------------------------------------
  getPointWithinFace(theFace, geometry) {
    const r = this.randomExcludingZero(0.0, 1.0);
    const s = this.randomExcludingZero(0.0, 1.0-r);
    const t = (1.0 - r - s);
    let v1 = geometry.vertices[ theFace.a ].clone();
    let v2 = geometry.vertices[ theFace.b ].clone();
    let v3 = geometry.vertices[ theFace.c ].clone();
    let point = ( v1.multiplyScalar(r) );
    point.add( v2.multiplyScalar(s) );
    point.add( v3.multiplyScalar(t) );
    return point;
  }
  // ------------------------------------------------------------------------------------------------------------------


  returnFaceted(geometry=this.geometry) {
    var facetedGeo = new THREE.Geometry();   // Create empty geometry which will be the output list

    while (this.counter < this.depth) {
      facetedGeo.vertices = geometry.vertices;
      let faces = geometry.faces.length;
      for ( let i = 0; i < faces; i++ ) {

            const theFace = geometry.faces[i];   // set a variable to the 0 index of the starting geometry
            const pointWithinFace = this.getPointWithinFace(theFace, geometry);
            facetedGeo.vertices.push(pointWithinFace);

            const lastVertexIndex = (facetedGeo.vertices.length - 1) // This is the index of the vertex on the face

            const face1 = new THREE.Face3( theFace.c, theFace.a, lastVertexIndex ); // add three new faces to facetedGeo
            const face2 = new THREE.Face3( theFace.b, theFace.c, lastVertexIndex );
            const face3 = new THREE.Face3( theFace.a, theFace.b, lastVertexIndex );

            facetedGeo.faces.push( face1 );
            facetedGeo.faces.push( face2 );
            facetedGeo.faces.push( face3 );

            const skewDiv = 1.0 / (this.skew * (this.counter + this.rollOff));
            for (let h = 0; h < facetedGeo.faces.length; h++) {
              let p1 = facetedGeo.vertices[facetedGeo.faces[h].a];
              p1.multiplyScalar(this.randomRange((1-skewDiv), (1+skewDiv)), this.randomRange((1-skewDiv), (1+skewDiv)), this.randomRange((1-skewDiv), (1+skewDiv)));
              let p2 = facetedGeo.vertices[facetedGeo.faces[h].b];
              p2.multiplyScalar(this.randomRange((1-skewDiv), (1+skewDiv)), this.randomRange((1-skewDiv), (1+skewDiv)), this.randomRange((1-skewDiv), (1+skewDiv)));
              let p3 = facetedGeo.vertices[facetedGeo.faces[h].c];
              p3.multiplyScalar(this.randomRange((1-skewDiv), (1+skewDiv)), this.randomRange((1-skewDiv), (1+skewDiv)), this.randomRange((1-skewDiv), (1+skewDiv)));
            }

      }

      // method recurses until we reach the "depth" passed to it by the constructor
      this.counter += 1;
      geometry = facetedGeo.clone();
    }

    // mesh.geometry.mergeVertices();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    // geometry.computeFaceNormals();
    // geometry.computeVertexNormals();

// Thanks to StackOverflow user Sayris for this code to calculate UVs
// ------------------------------------------------------------------------------------------------------------------
    geometry.computeBoundingBox();

    var max = geometry.boundingBox.max,
        min = geometry.boundingBox.min;
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    var faces = geometry.faces;

    geometry.faceVertexUvs[0] = [];

    for (var i = 0; i < geometry.faces.length ; i++) {

        var v1 = geometry.vertices[faces[i].a],
            v2 = geometry.vertices[faces[i].b],
            v3 = geometry.vertices[faces[i].c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
            new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
            new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
        ]);
    }
    geometry.uvsNeedUpdate = true;
 // ------------------------------------------------------------------------------------------------------------------

    return geometry;

    // if (this.counter < this.depth) { this.returnFaceted(geometry); } else { return geometry; }
  }

  returnConvexRock(xDimension = 50, yDimension = 50, zDimension = 50) {
    var points = [];
    for (var i = 0; i < 15; i++) {
        var randomX = -25 + Math.round(Math.random() * xDimension);
        var randomY = -25 + Math.round(Math.random() * yDimension);
        var randomZ = -25 + Math.round(Math.random() * zDimension);
        points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }

    let convexHull = new THREE.ConvexGeometry(points);
    return this.returnFaceted(convexHull);
  }

  returnShard(xDimension = 10, yDimension = 50, zDimension = 25) {
    var points = [];
    for (var i = 0; i < 15; i++) {
        var randomX = -25 + Math.round(Math.random() * xDimension);
        var randomY = -25 + Math.round(Math.random() * yDimension);
        var randomZ = -25 + Math.round(Math.random() * zDimension);
        points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }

    let convexHull = new THREE.ConvexGeometry(points);
    return this.returnFaceted(convexHull);
  }

  returnRiverRock(dimension = 50, faces = 1, xDimension = 0.5, yDimension = 0.1, zDimension = 0.3) {
    let sphere = new THREE.IcosahedronGeometry(dimension, faces);
    sphere.applyMatrix( new THREE.Matrix4().makeScale( xDimension, yDimension, zDimension ) );
    return this.returnFaceted(sphere);
  }
}
