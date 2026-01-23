const jsnx = require('jsnetworkx');
const Graph = require('graphology');

const { allSimplePaths } = require('graphology-simple-path');
//
// const G = new jsnx.MultiDiGraph();
// G.addEdgesFrom([
//   [1,2,{weight: 7}],
//   [1,3,{weight: 5}],
//   [2,3,{weight: 5}]
// ]);
// const [lengths, paths] = jsnx.singleSourceDijkstra(G, {source: 1});
// const path = jsnx.dijkstraPath(G, {source: 1, target: 3});
//
// const edges = G.edges();
//
// const weights = jsnx.getEdgeAttributes(G, "weight");
//
// // console.log(lengths, paths, path, edges, weights);
// console.log(G.inEdges());

const graph = new Graph();

// graph.mergeEdge('1', '2', { trust: 3, paid: 4 });
// graph.mergeEdge('1', '3', { trust: 5, paid: 4 });
// graph.mergeEdge('1', '4', { trust: 5, paid: 4 });
// graph.mergeEdge('2', '4', { trust: 0, paid: 4 });
// graph.mergeEdge('3', '4', { trust: 4, paid: 4 });
// graph.mergeEdge('4', '5', { trust: 2, paid: 4 });

graph.mergeEdge('1', '2', { trust: 2, paid: 4 });
graph.mergeEdge('1', '3', { trust: 1, paid: 4 });
graph.mergeEdge('1', '5', { trust: 5, paid: 4 });
graph.mergeEdge('2', '3', { trust: 2, paid: 4 });
graph.mergeEdge('2', '5', { trust: 1, paid: 4 });
graph.mergeEdge('3', '4', { trust: 4, paid: 4 });
graph.mergeEdge('4', '5', { trust: 5, paid: 4 });

let paths = allSimplePaths(graph, '1', '5');
console.log(paths);

let sum = 0;
paths.forEach(path => {
  console.log(path.join('->'))
  let min;
  for(let i=0; i<path.length-1; i++) {
    let limit = graph.getEdgeAttribute(path[i], path[i+1], 'trust');
    if(i === 0) min = limit;
    else min = min < limit ? min : limit
    console.log(limit)
  }
  for(let i=0; i<path.length-1; i++) {
    graph.setEdgeAttribute(path[i], path[i+1], 'trust', graph.getEdgeAttribute(path[i], path[i+1], 'trust') - min)
  }
  console.log("min:", min);
  sum += min;
})
console.log("sum:", sum)

paths = allSimplePaths(graph, '1', '5');
console.log(paths);

sum = 0;
paths.forEach(path => {
  console.log(path.join('->'))
  let min;
  for(let i=0; i<path.length-1; i++) {
    let limit = graph.getEdgeAttribute(path[i], path[i+1], 'trust');
    if(i === 0) min = limit;
    else min = min < limit ? min : limit
    console.log(limit)
  }
  for(let i=0; i<path.length-1; i++) {
    graph.setEdgeAttribute(path[i], path[i+1], 'trust', graph.getEdgeAttribute(path[i], path[i+1], 'trust') - min)
  }
  console.log("min:", min);
  sum += min;
})
console.log("sum:", sum)

