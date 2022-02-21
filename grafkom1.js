function main() {

  var canvas = document.querySelector("#c");
  var canvasLeft = canvas.offsetLeft + canvas.clientLeft
  var canvasTop = canvas.offsetTop + canvas.clientTop

  // console.log(canvasLeft)
  // console.log(canvasTop)

  console.log(canvas.height)

  canvas.addEventListener('click', (event) => {
    var x = event.pageX - canvasLeft
    var y = event.pageY - canvasTop

    console.log(`X: ${x}, Y: ${y}`)
  })

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

  // Create buffer 
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Fill up geometry
  var vertexes = [
    0, 0,
    0, 0.5,
    0.35, 0.7,
    0.7, 0.5,
    0.7, 0,

    
  ];
  polygonVertexes = polygonVertex(vertexes)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polygonVertexes), gl.STATIC_DRAW);

  drawArrayCount = polygonVertexes.length/2
  drawScene(drawArrayCount)





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




  //***Rendering***//
  function drawScene(drawArrayCount) {
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
    var count = drawArrayCount;
    gl.drawArrays(primitiveType, offset, count);
  }
}

function polygonVertex(vertexes2D) {
  if (vertexes2D.length <= 4){
    return [];
  }

  if (vertexes2D.length % 2 != 0){
    return [];
  }


  const polygonVertex = [];

  const firstVertex = [vertexes2D[0], vertexes2D[1]];

  for (var i = 4; i < vertexes2D.length; i = i+2) {

    polygonVertex.push(firstVertex[0], firstVertex[1])
    polygonVertex.push(vertexes2D[i-2], vertexes2D[i-1])
    polygonVertex.push(vertexes2D[i], vertexes2D[i+1])
  }

  console.log(polygonVertex)
  return polygonVertex

}

main();