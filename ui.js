var canvas = document.querySelector("#c");
var colorInput = document.querySelector("#color_input");

function setupPolygon() {
	var canvasLeft = canvas.offsetLeft + canvas.clientLeft
	var canvasTop = canvas.offsetTop + canvas.clientTop

	/* for edit vetex*/
	var vertexClicked = null
	var squareLineClicked = null

	/* for draw polygon*/
	  var newShape = null
	  var tempVertex = null

	var drawPolygon = document.querySelector("#draw_polygon");
	var editVertex = document.querySelector("#edit_vertex");
	var colorPolygon = document.querySelector("#color_polygon");
	var drawALine = document.querySelector("#drawLine");
	var drawASquare = document.querySelector("#drawSquare");

	drawPolygon.addEventListener("click", (event) => {
		removeAllListeners()
		canvas.addEventListener('click', drawPolygonClickHandler)
	    canvas.addEventListener('mousemove', drawPolygonMouseMoveHandler)
	})

	editVertex.addEventListener("click", (event) => {
		removeAllListeners()
		canvas.addEventListener('click', editClickHandler)
	    canvas.addEventListener('mousemove', editMouseMoveHandler)
	})

	colorPolygon.addEventListener("click", (event) => {
		removeAllListeners()
		canvas.addEventListener('click', colorPolygonClickHandler)
	})

	drawALine.addEventListener("click", (e) => {
		drawLine();
		rerender();
	})

	drawASquare.addEventListener("click", (e) => {
		drawSquare();
		rerender();
	})

	canvas.addEventListener('click', drawPolygonClickHandler)
	canvas.addEventListener('mousemove', drawPolygonMouseMoveHandler)

	

	function removeAllListeners() {
		canvas.removeEventListener('click', drawPolygonClickHandler)
	    canvas.removeEventListener('mousemove', drawPolygonMouseMoveHandler)
		canvas.removeEventListener('click', editClickHandler)
	    canvas.removeEventListener('mousemove', editMouseMoveHandler)
	    canvas.removeEventListener('click', colorPolygonClickHandler)
	    newShape = null
	    vertexClicked = null
	}

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
		    rerender()
		    vertexClicked = null 
		}

		if (squareLineClicked === null){
		  var found = false
		  shapeList.forEach(function(shape) {
		  	if (shape.name === "square"){
		  		// console.log("Processing square")

		  		for (var i = 1; i < shape.vertexes.length; i++) {
		  			if (in_line(x,y, shape.vertexes[i-1].x, shape.vertexes[i].x, shape.vertexes[i-1].y, shape.vertexes[i].y) === true){
		  				squareLineClicked = []
		  				squareLineClicked[0] = shape.vertexes[i-1]
		  				squareLineClicked[1] = shape.vertexes[i]
		  				found = true
		  				// console.log('squareLineClicked')
		  			}
		  		}
		  		if (in_line(x,y, shape.vertexes[shape.vertexes.length-1].x, shape.vertexes[0].x, shape.vertexes[shape.vertexes.length-1].y, shape.vertexes[0].y) === true){
		  				squareLineClicked = []
		  				squareLineClicked[0] = shape.vertexes[shape.vertexes.length-1]
		  				squareLineClicked[1] = shape.vertexes[0]
		  				found = true
		  				// console.log('squareLineClicked')
		  		}
		  	}
		  })
		  

		  if (found === false){
		    squareLineClicked = null
		  }			
		}

		else{
			if (squareLineClicked[0].x === squareLineClicked[1].x){
				squareLineClicked[0].x = x
				squareLineClicked[1].x = x
			}

			else if (squareLineClicked[0].y === squareLineClicked[1].y){
				squareLineClicked[0].y = y
				squareLineClicked[1].y = y
			}
			rerender()
			squareLineClicked = null
		}
	}

	function editMouseMoveHandler(event) {
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

		if (vertexClicked !== null){
		    vertexClicked.x = x
		    vertexClicked.y = y
		    rerender()
		}

		if (squareLineClicked !== null){
			if (squareLineClicked[0].x === squareLineClicked[1].x){
				squareLineClicked[0].x = x
				squareLineClicked[1].x = x
			}

			else if (squareLineClicked[0].y === squareLineClicked[1].y){
				squareLineClicked[0].y = y
				squareLineClicked[1].y = y
			}
			rerender()
		}
	}

	function drawPolygonClickHandler(event){
		const vertexSize = 30
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

// 
// 		console.log(`X: ${x}, Y: ${y}`)
// 		console.log(shapeList)

		if (newShape === null){
		  tempVertex = {x:x,y:y}
		  newShape = {name: "polygon", vertexes: [{x:x,y:y},tempVertex], color: colorInput.value}
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
		  rerender()
		}
	}

	function drawPolygonMouseMoveHandler(event) {
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop
		if (newShape !== null){
		    tempVertex.x = x
		    tempVertex.y = y
		    rerender()
		}
	}



	function colorPolygonClickHandler(event) {
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop
		var selectedShape = selectShape(shapeList, x, y)


		if (selectedShape !== null){
			selectedShape.color = colorInput.value
			rerender()
		}
		
	}

	function selectShape(shapeList, cursorX, cursorY) {
		var selectShape = null

		shapeList.forEach(function(shape) {
			if (shape.name !== "line"){
				if (ray_casting(cursorX, cursorY, shape) === true){
					selectShape = shape
				}
			}
			else{
				if (select_line(cursorX, cursorY, shape) === true){
					selectShape = shape
				}
			}

			
		  })

		return selectShape
	}

	function ray_casting(cursorX, cursorY, shape){
	    var n = shape.vertexes.length
	    var is_in = false	
	    var x = cursorX
	    var y = cursorY
	    var x1,x2,y1,y2

	    for(var i=0; i < n-1; ++i){
	        x1=shape.vertexes[i].x;
	        x2=shape.vertexes[i+1].x;
	        y1=shape.vertexes[i].y;
	        y2=shape.vertexes[i+1].y;

	        // console.log(`x1 = ${x1}, x2 = ${x2}, y1 = ${y1}, y2 = ${y2}`)

	        if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1){
	            is_in=!is_in;
	        }
	    }


	    return is_in;
	}

	function select_line(cursorX, cursorY, shape){
	    var x = cursorX
	    var y = cursorY

	    var x1=shape.vertexes[0].x;
        var x2=shape.vertexes[1].x;
        var y1=shape.vertexes[0].y;
        var y2=shape.vertexes[1].y;

        /* Vertical Line */
        if (x1 === x2){
        	return x === x1 && ((y1 < y && y < y2) || (y2 < y && y < y1))
        }

        /* Horizontal Video */
        if (y1 === y2){
        	return y === y1 && ((x1 < x && x < x2) || (x2 < x && x < x1))
        }

        /* Formula of y = mx + c

        m = y2-y1/x2-s1

        c = y - mx
        /*/

        var m = (y2 - y1)/(x2 - x1)
        var c = y2 - m*x2

        if (y === (m*x + c)){
        	return ((x1<x && x<x2 && y1<y && y < y2) || (x1>x && x>x2 && y1>y && y>y2))
        }

	    return false;
	}

	function in_line(cursorX, cursorY, x1 ,x2, y1, y2) {
	    var x = cursorX
	    var y = cursorY
	    const vertexSize = 30

        /* Vertical Line */
        if (x1 === x2){
        	// console.log("Found vertical")
        	// console.log((x1 - vertexSize/2 < x && x < x1 + vertexSize/2) && ((y1 < y && y < y2) || (y2 < y && y < y1)))
        	return (x1 - vertexSize/2 < x && x < x1 + vertexSize/2) && ((y1 < y && y < y2) || (y2 < y && y < y1))
        }

        /* Horizontal Line */
        if (y1 === y2){
        	// console.log("Found Horizontal")
        	// console.log( (y1 - vertexSize/2 < y && y < y1 + vertexSize/2) && ((x1 < x && x < x2) || (x2 < x && x < x1)))
        	return (y1 - vertexSize/2 < y && y < y1 + vertexSize/2) && ((x1 < x && x < x2) || (x2 < x && x < x1))
        }

        /* Formula of y = mx + c

        m = y2-y1/x2-s1

        c = y - mx
        /*/

        var m = (y2 - y1)/(x2 - x1)
        var c = y2 - m*x2

        if (y === (m*x + c)){
        	return ((x1<x && x<x2 && y1<y && y < y2) || (x1>x && x>x2 && y1>y && y>y2))
        }

	    return false;
	}
}


setupPolygon()