function main() {

  var canvas = document.querySelector("#c");
  var canvasLeft = canvas.offsetLeft + canvas.clientLeft
  var canvasTop = canvas.offsetTop + canvas.clientTop
  var vertexClicked = null
  var shapeList = []
  var vertexes = []

  /* for draw polygon*/
  var newShape = null
  var tempVertex = null

  /*Click Listeners*/

  var drawOrEditInput = document.querySelector("#drawOrEdit");

  drawOrEditInput.addEventListener('change', (event) => {
    if (drawOrEditInput.value === "edit"){
      canvas.addEventListener('click', editClickHandler)
      canvas.addEventListener('mousemove', editMouseMoveHandler)

      canvas.removeEventListener('click', drawPolygonClickHandler)
      canvas.removeEventListener('mousemove', drawPolygonMouseMoveHandler)

      newShape = null
    }
    else if (drawOrEditInput.value === "draw")
      {
      canvas.addEventListener('click', drawPolygonClickHandler)
      canvas.addEventListener('mousemove', drawPolygonMouseMoveHandler)

      canvas.removeEventListener('click', editClickHandler)
      canvas.removeEventListener('mousemove', editMouseMoveHandler)
    }
  })

  
  canvas.addEventListener('click', editClickHandler)

  canvas.addEventListener('mousemove', editMouseMoveHandler)

  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
    //Find shader code
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    //Make shader
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    //Make program
    var program = createProgram(gl, vertexShader, fragmentShader);

  // Assign locations
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // Create buffer 
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Fill up geometry
//   var vertexes = [
//     0, 0,
//     0, 0.5,
//     0.35, 0.7,
//     0.7, 0.5,
//     0.7, 0,
//   ];
// 
//   for (var i = 0; i < vertexes.length; i++) {
//     vertexes[i] = vertexes[i]*30
//   }

  // var vertexes = [
  //   200, 400,
  //   400, 100,
  //   600, 400, 
  // ]


  shapeList = [
    {
      name: "polygon",
      vertexes: [
        {x: 200, y: 400},
        {x: 200, y: 200},
        {x: 400, y: 100},
        {x: 600, y: 200},
        {x: 600, y: 400},
      ],
    },
    {
      name: "polygon",
      vertexes: [
        {x: 0, y: 0},
        {x: 100, y: 0},
        {x:0, y:100}
      ],
    }
  ]


  applyVertex() 

  gl.useProgram(program);
  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

  drawScene()

  function editClickHandler(event){
    const vertexSize = 30
    var x = event.pageX - canvasLeft
    var y = event.pageY - canvasTop

    // console.log(`X: ${x}, Y: ${y}`)
    // console.log(vertexClicked)
    // console.log(shapeList)

    
    if (vertexClicked === null){
      var found = false
      shapeList.forEach(function(shape) {
        shape.vertexes.forEach(function(vertex) {
            if (y > vertex.y - vertexSize/2  && y < vertex.y + vertexSize /2
                && x > vertex.x - vertexSize/2 && x < vertex.x + vertexSize/2) {
                // alert('clicked an element');
                vertexClicked = vertex
                found = true
            }
        });
      })
      

      if (found === false){
        vertexClicked = null
      }
    }
    else 
    {
        vertexClicked.x = x
        vertexClicked.y = y
        updateVertex()
        drawScene()
        vertexClicked = null 
    }
  }

  function editMouseMoveHandler(event) {
    var x = event.pageX - canvasLeft
    var y = event.pageY - canvasTop
    if (vertexClicked !== null){
        vertexClicked.x = x
        vertexClicked.y = y
        updateVertex()
        drawScene()
    }
  }

  function drawPolygonClickHandler(event){
    const vertexSize = 30
    var x = event.pageX - canvasLeft
    var y = event.pageY - canvasTop
    

    console.log(`X: ${x}, Y: ${y}`)
    console.log(shapeList)
    
    if (newShape === null){
      tempVertex = {x:x,y:y}
      newShape = {name: "polygon", vertexes: [{x:x,y:y},tempVertex]}
      shapeList.push(newShape)
    }
    else 
    {
      let firstVertex = newShape.vertexes[0]
      let firstVertexClicked = false
      if (y > firstVertex.y - vertexSize/2  && y < firstVertex.y + vertexSize /2
          && x > firstVertex.x - vertexSize/2 && x < firstVertex.x + vertexSize/2) {
          firstVertexClicked = true
        }

      if (firstVertexClicked){
        newShape.vertexes.pop()
        newShape = null
      }
      else{
        tempVertex = {x:x,y:y}
        newShape.vertexes.push(tempVertex)
        
      }
      updateVertex()
      drawScene()
    }
  }

  function drawPolygonMouseMoveHandler(event) {
    var x = event.pageX - canvasLeft
    var y = event.pageY - canvasTop
    if (newShape !== null){
        tempVertex.x = x
        tempVertex.y = y
        updateVertex()
        drawScene()
    }
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }



  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  function applyVertex(){
    polygonVertexes = polygonVertex(shapeList)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polygonVertexes), gl.STATIC_DRAW);
  }

  function updateVertex(){
    polygonVertexes = polygonVertex(shapeList)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polygonVertexes), gl.STATIC_DRAW);
  }


  //***Rendering***//
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)


    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = polygonVertexes.length/2;
    gl.drawArrays(primitiveType, offset, count);
  }
}

// function polygonVertex(vertexes2D) {
//   if (vertexes2D.length <= 4){
//     return [];
//   }
// 
//   if (vertexes2D.length % 2 != 0){
//     return [];
//   }
// 
// 
//   const polygonVertex = [];
// 
//   const firstVertex = [vertexes2D[0], vertexes2D[1]];
// 
//   for (var i = 4; i < vertexes2D.length; i = i+2) {
// 
//     polygonVertex.push(firstVertex[0], firstVertex[1])
//     polygonVertex.push(vertexes2D[i-2], vertexes2D[i-1])
//     polygonVertex.push(vertexes2D[i], vertexes2D[i+1])
//   }
// 
//   console.log(polygonVertex)
//   return polygonVertex
// 
// }

function polygonVertex(shapeList){
  /*
    shapeList is a list of shapes

    shape is an object with name and vertexes attributes
    name used can be either polygon, square, rectangle, etc.
  */

  result = []

  for (var i = 0; i < shapeList.length; i++) {
    if (shapeList[i].name === "polygon")
      {
        result = result.concat(polygonVertexPerShape(shapeList[i].vertexes))
      }
  }

  return  result

}

function polygonVertexPerShape(vertexes2D) {
  /*
  vertexes2D: Array of Vertexes
  Vertexes = objects with x & y attributes
  */
  if (vertexes2D.length <= 2){
    return [];
  }


  const polygonVertex = [];

  const firstVertex = vertexes2D[0];




  for (var i = 2; i < vertexes2D.length; i++) {

    polygonVertex.push(firstVertex.x, firstVertex.y)
    polygonVertex.push(vertexes2D[i-1].x, vertexes2D[i-1].y)
    polygonVertex.push(vertexes2D[i].x, vertexes2D[i].y)
  }

  return polygonVertex
}

main()