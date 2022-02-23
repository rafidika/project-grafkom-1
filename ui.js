var canvas = document.querySelector("#c");
var canvasLeft = canvas.offsetLeft + canvas.clientLeft
var canvasTop = canvas.offsetTop + canvas.clientTop

/* for edit vetex*/
var vertexClicked = null

/* for draw polygon*/
  var newShape = null
  var tempVertex = null

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