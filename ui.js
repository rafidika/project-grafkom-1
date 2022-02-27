var canvas = document.querySelector("#c");
var colorInput = document.querySelector("#color_input");

function setupPolygon() {
	var canvasLeft = canvas.offsetLeft + canvas.clientLeft
	var canvasTop = canvas.offsetTop + canvas.clientTop

	/* for edit vetex*/
	var vertexClicked = null
	var squareLineClicked = null

	//for edit rectangle
	var shapeIdxClicked = null;
	var VertexIdx = null;

	//for draw rectangle
	var numOfVertices = 0;
	var newRectangle = null;
	var newVertex1 = {x:-1, y:-1};
	var newVertex2 = {x:-1, y:-1};

	/* for draw polygon*/
	  var newShape = null
	  var tempVertex = null

	// for draw rectangle

	var drawPolygon = document.querySelector("#draw_polygon");
	var editVertex = document.querySelector("#edit_polygon");
	var colorPolygon = document.querySelector("#color_polygon");
	var drawALine = document.querySelector("#draw_line");
	var drawASquare = document.querySelector("#draw_square");

	var drawARectangle = document.querySelector("#draw_rectangle");
	var editARectangle = document.querySelector("#edit_rectangle");
	// var submitButton = document.querySelector("#loadButton");

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


	drawARectangle.addEventListener("click", (event) => {
		removeAllListeners()
		canvas.addEventListener('click', drawRectangleClickHandler)
	    canvas.addEventListener('mousemove', drawRectangleMouseMoveHandler)
	})

	editARectangle.addEventListener("click", (event) => {
		removeAllListeners()
		canvas.addEventListener('click', editRectangleClickHandler)
	    canvas.addEventListener('mousemove', editRectangleMouseMoveHandler)
	})

	// submitButton.addEventListener("click", (e) => {
	// 	let files = document.getElementById('fileInput').files;
	// 	let fr = new FileReader();
	// 	fr.onload = () => {
	// 		let result = JSON.parse(fr.result);
	// 		// let formatted = JSON.stringify(result, null, 2);
	// 		console.log(result);
	// 	}
	// 	fr.readAsText(files);
	// })

	//canvas.addEventListener('click', drawPolygonClickHandler)
	//canvas.addEventListener('mousemove', drawPolygonMouseMoveHandler)

	

	function removeAllListeners() {
		canvas.removeEventListener('click', drawPolygonClickHandler)
	    canvas.removeEventListener('mousemove', drawPolygonMouseMoveHandler)
		canvas.removeEventListener('click', editClickHandler)
	    canvas.removeEventListener('mousemove', editMouseMoveHandler)
	    canvas.removeEventListener('click', colorPolygonClickHandler)
		canvas.removeEventListener('click', drawRectangleClickHandler)
		canvas.removeEventListener('mousemove', drawRectangleMouseMoveHandler)
		canvas.removeEventListener('click', editRectangleClickHandler)
		canvas.removeEventListener('mousemove', editRectangleMouseMoveHandler)
	    newShape = null
		newRectangle = null
	    vertexClicked = null

	}

	function editRectangleClickHandler(event){
		const vertexSize = 30
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

		if (vertexClicked== null){ //no rectangle's vertex clicked
			var found = false

			for (let i = 0; i< shapeList.length; i++){
				if(shapeList[i].name === "rectangle"){
					var RectVertex = shapeList[i].vertexes;
					for(let j=0; j<RectVertex.length; j++){
						vertex = RectVertex[j];
						if (y > vertex.y - vertexSize/2  && y < vertex.y + vertexSize /2
							&& x > vertex.x - vertexSize/2 && x < vertex.x + vertexSize/2) {
							// alert('clicked an element');
							vertexClicked = vertex
							found = true
							shapeIdxClicked=i;
							VertexIdx=j;

						}
					}
				}
			}
			
  
			if (found === false){
			  	shapeIdxClicked=null;
				VertexIdx=null;
				vertexClicked = null;
			}
		}
		else{
			vertexClicked.x = x
		    vertexClicked.y = y
		    rerender()
			vertexClicked=null;
		}

	}


	function editRectangleMouseMoveHandler(event){
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

		var m1, m2, c1, c2;
		
		if (vertexClicked !== null){

			vertexClicked.x = x
		    vertexClicked.y = y

			var move1Idx = ((VertexIdx + 5)%4);
			var move2Idx = ((VertexIdx + 3)%4);
			var stayIdx = ((VertexIdx +2)%4);

			var vertex1 = shapeList[shapeIdxClicked].vertexes[move1Idx]
			var vertex2 = shapeList[shapeIdxClicked].vertexes[stayIdx]
			var vertex3 = shapeList[shapeIdxClicked].vertexes[move2Idx]

			//persamaan garis awal: y = m1 x + c1

			if ((vertex1.x != vertex2.x) && (vertex1.y != vertex2.y) && (vertex3.x != vertex2.x) && (vertex3.y != vertex2.y)){
				var m1 = (vertex1.y - vertex2.y)/(vertex1.x - vertex2.x);
				var c1 = vertex2.y - m1*vertex2.x;
				var m2 = -1/m1;
				var c2 = vertex2.y - m2*vertex2.x;

				vertex1.x = (vertexClicked.x + m1*vertexClicked.y - m1*c1)/(m1*m1 + 1);
				vertex1.y = (vertexClicked.x * m1 + m1*m1*vertexClicked.y + c1)/(m1*m1 + 1);
				vertex3.x = (vertexClicked.x + m2*vertexClicked.y - m2*c2)/(m2*m2 + 1);
				vertex3.y = (vertexClicked.x * m2 + m2*m2*vertexClicked.y + c2)/(m2*m2 + 1);
			}

			if (vertex1.x == vertex2.x){
				vertex1.y = vertexClicked.y;
			}

			if (vertex3.x == vertex2.x){
				vertex3.y = vertexClicked.y;
			}

			if (vertex1.y == vertex2.y){
				vertex1.x = vertexClicked.x;
			}
			if (vertex3.y == vertex2.y){
				vertex3.x = vertexClicked.x;
			}

			rerender();

		}
	}

	function drawRectangleClickHandler(event){
		const vertexSize = 30
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

		
// 
// 		console.log(`X: ${x}, Y: ${y}`)
// 		console.log(shapeList)
		if (numOfVertices == 2){
			let x1 = newRectangle.vertexes[0].x;
			let x2 = newRectangle.vertexes[1].x;
			let y1 = newRectangle.vertexes[0].y;
			let y2 = newRectangle.vertexes[1].y;
			
			if((x1 != x2) && (y1!=y2)){
				let m = (y2 - y1)/(x2-x1);

				if((m>1)||(m<-1)){
					newVertex1.x = x;
					newVertex1.y = -1/m * x + 1/m * x2 + y2;
					newVertex2.x = x1 -x2 + newVertex1.x;
					newVertex2.y = y1 - y2 + newVertex1.y;
				}
				else{
					newVertex1.y = y;
					newVertex1.x = x2 - m*y + m*y2;
					newVertex2.x = x1 -x2 + newVertex1.x;
					newVertex2.y = y1 - y2 + newVertex1.y;
				}

				numOfVertices = 0;
				
			}
			else if (x1 == x2){
				newVertex1.x = x;
				newVertex1.y = y2;
				newVertex2.x = x;
				newVertex2.y = y1;

			}
			else if (y1 == y2){
				newVertex1.y = y;
				newVertex1.x = x2;
				newVertex2.y = y;
				newVertex2.x = x1;
			}

			newRectangle.vertexes[2] = newVertex1;
			newRectangle.vertexes[3] = newVertex2;
			rerender()
			newRectangle = null;
		}
		else if (numOfVertices == 1){
			newRectangle.vertexes[numOfVertices] = {x:x, y:y}
			numOfVertices = numOfVertices + 1;
		}
		else if (newRectangle === null){
		  newRectangle = {name: "rectangle", vertexes: [{x:x,y:y}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}], color: colorInput.value}
		  shapeList.push(newRectangle)
		  numOfVertices = numOfVertices + 1;
		  
		}
		
	}

	function drawRectangleMouseMoveHandler(event){
		var x = event.pageX - canvasLeft
		var y = event.pageY - canvasTop

		if (newRectangle !== null){
			if(numOfVertices == 2){
				let x1 = newRectangle.vertexes[0].x;
				let x2 = newRectangle.vertexes[1].x;
				let y1 = newRectangle.vertexes[0].y;
				let y2 = newRectangle.vertexes[1].y;
			
			if((x1 != x2) && (y1!=y2)){
				let m = (y2 - y1)/(x2-x1);
				if((m>1)||(m<-1)){
					newVertex1.x = x;
					newVertex1.y = -1/m * x + 1/m * x2 + y2;
					newVertex2.x = x1 -x2 + newVertex1.x;
					newVertex2.y = y1 - y2 + newVertex1.y;
				}
				else{
					newVertex1.y = y;
					newVertex1.x = x2 - m*y + m*y2;
					newVertex2.x = x1 -x2 + newVertex1.x;
					newVertex2.y = y1 - y2 + newVertex1.y;
				}
			}
			else if (x1 == x2){
				newVertex1.x = x;
				newVertex1.y = y2;
				newVertex2.x = x;
				newVertex2.y = y1;

			}
			else if (y1 == y2){
				newVertex1.y = y;
				newVertex1.x = x2;
				newVertex2.y = y;
				newVertex2.x = x1;
			}
				newRectangle.vertexes[2] = newVertex1;
				newRectangle.vertexes[3] = newVertex2;
				rerender();

			}
		}
		//rerender();
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