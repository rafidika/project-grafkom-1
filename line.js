function main() {

    let drawLineButton = document.getElementById("drawLine");
    drawLineButton.addEventListener("click", (e) => {
        drawLine();
    }) 

    // Initialize WebGL
    let canvas = document.querySelector("#c");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Get the stringify version of vertex shader and fragment shader
    let vertexShaderSrc = document.querySelector("#vertex-shader-2d").text;
    let fragmentShaderSrc = document.querySelector("#fragment-shader-2d").text;

    // Create vertex shader 
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);

    // Create Fragment Shader
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);

    // Create program
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Locate attribute location
    let attributeLocation = gl.getAttribLocation(program, "a_position");

    // Create buffer for attribute
    let attributeBuffer = gl.createBuffer();

    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);

    // Set default position of the line
    let defaultLinePos = [
        0, 0,
        0, 0.5,
        0, 0.5
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(defaultLinePos), gl.STATIC_DRAW);

    function drawLine() {
        // Convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Use the program
        gl.useProgram(program);

        // Turn on attribute
        gl.enableVertexAttribArray(attributeLocation);

        // Bind the attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // Draw the line
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}