var shapeList = []


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
      color: "#FFFF00"

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

rerender()


function polygonVertexPerShape(vertexes2D) {
  /*
  vertexes2D: Array of Vertexes, from shape.vertexes
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