var canvas = document.querySelector("#c");
var colorInput = document.querySelector("#color_input");

function setupPolygon() {
	var canvasLeft = canvas.offsetLeft + canvas.clientLeft
	var canvasTop = canvas.offsetTop + canvas.clientTop

	/* for edit vetex*/
	var vertexClicked = null

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
	}

	function editMouseMoveHandler(event) {
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

		if (vertexClicked !== null){
		    vertexClicked.x = x
		    vertexClicked.y = y
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
			if (ray_casting(cursorX, cursorY, shape) === true){
				selectShape = shape
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
}


setupPolygon()