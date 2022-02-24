
var drawArraysCount
var gl
var positionBuffer
var colorBuffer
var shapeList = []

var drawSceneFunction = setup().drawScene


function setup() {
  var canvas = document.querySelector("#c");
  var canvasLeft = canvas.offsetLeft + canvas.clientLeft
  var canvasTop = canvas.offsetTop + canvas.clientTop
  

  gl = canvas.getContext("webgl");
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
  var colorLocation = gl.getAttribLocation(program, "a_color");

  positionBuffer = gl.createBuffer();

  applyVertex() 

   // Create a buffer for the colors.
  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Set the colors.
  setColors(gl, drawArraysCount);

  drawScene()




  function drawScene() {
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

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    gl.enableVertexAttribArray(colorLocation);
 
    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

   
     
    // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 4;          // 4 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset)

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = drawArraysCount;
    gl.drawArrays(primitiveType, offset, count);
  }

  return {
    drawScene: drawScene
  }
}


function applyVertex(){
  /*
shapeList : global
  */
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var vertexArray = processVertex(shapeList)
  drawArraysCount = vertexArray.length/2
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
}

function updateVertex(){

  applyVertex()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl, drawArraysCount);
}

function rerender() {
  updateVertex()
  drawSceneFunction()
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

function processVertex(shapeList){
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

    else if (shapeList[i].name === "line"){
      result = result.concat(processLine(shapeList[i].vertexes))
    }

    else if (shapeList[i].name === "square"){
      result = result.concat(processSquare(shapeList[i].vertexes))
    }
    else if (shapeList[i].name === "rectangle"){
      result = result.concat(processRectangle(shapeList[i].vertexes))
    }
  }

  return result

}

function setColors(gl, drawArraysCount) {
  // Pick 2 random colors.
  var r1 = 0;
  var b1 = 1;
  var g1 = 0;

  color = [r1, g1, b1, 1]



  var colorVertexBuffer = []

// 
//   for (var i = 0; i < drawArraysCount; i++) {
//     colorVertexBuffer = colorVertexBuffer.concat(color)
//   }

  for (var i = 0; i < shapeList.length; i++) {
    var shapeColorArray = processColors(shapeList[i])
    for (var j = 0;  j < (shapeList[i].vertexes.length - 2 )*3; j++) {
        colorVertexBuffer = colorVertexBuffer.concat(shapeColorArray)
      }  
  }

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        colorVertexBuffer),
      gl.STATIC_DRAW);
}


function processColors(shape){


  if (typeof shape.color !== 'undefined'){
      var colorHex = hexToRgb(shape.color)
      if (colorHex  !== null){
          return [colorHex.r/255.0, colorHex.g/255.0, colorHex.b/255.0, 1]
      }
      
  }


  return [1.0,0.5,0,1]

}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

