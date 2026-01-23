// import React, { useEffect, useState } from 'react';
// import { Sigma, EdgeShapes, RandomizeNodePositions, RelativeSize, ForceAtlas2, Filter } from 'react-sigma';

// import { useDispatch, useSelector } from 'store';
// import useAuth from 'hooks/useAuth';
// import useConfig from 'hooks/useConfig';
// import { useTheme } from '@mui/material/styles';

// const Path = () => {
//     const dispatch = useDispatch();
//     const theme = useTheme();
//     const { borderRadius } = useConfig();
//     const { user } = useAuth();
//     const graphState = useSelector((state) => state.graph);

//     const [graph, setGraph] = useState(null);
//     const [selectedNode, setSelectedNode] = useState(null);

//     // useEffect(() => {
//     //     dispatch(getGraph());
//     // }, []);

//     useEffect(() => {
//         setGraph(graphState.graph);
//     }, [graphState]);

//     return (
//       <div>
//           {!!graph && (
//             <Sigma
//               renderer="canvas"
//               graph={{
//                   nodes: graph?.nodes.map((node) => ({
//                       id: node?.key,
//                       label: node?.attributes?.username,
//                       color: node?.key === user?._id ? theme.palette.error.main : theme.palette.secondary.main,
//                   })),
//                   edges: graph?.edges
//                     .filter((edge) => edge.attributes && edge.attributes.limit > 0 && edge.source !== edge.target)
//                     .map((edge) => ({
//                         id: edge.key,
//                         source: edge.source,
//                         target: edge.target,
//                         animated: true,
//                         label: edge.attributes.limit.toString()
//                         // size: 0.5
//                     }))
//               }}
//               settings={{
//                   drawEdgeLabels: true,
//                   drawEdges: true
//                   // minEdgeSize: 2,
//                   // maxEdgeSize: 2,
//                   // minNodeSize: 10,
//                   // maxNodeSize: 10
//               }}
//               style={{
//                   width: '100%',
//                   height: '80vh',
//                   backgroundColor: '#fff',
//                   borderRadius: borderRadius
//               }}
//               onOverNode={(e) => setSelectedNode(e.data.node.id)}
//               onOutNode={(e) => setSelectedNode(null)}
//             >
//                 <EdgeShapes default="curvedArrow" />
//                 <RandomizeNodePositions>
//                     <Filter neighborsOf={selectedNode} />
//                     <ForceAtlas2 barnesHutOptimize barnesHutTheta={0.6} iterationsPerRender={1} linLogMode timeout={1000} worker />
//                     <RelativeSize initialSize={15} />
//                 </RandomizeNodePositions>
//             </Sigma>
//           )}
//       </div>
//     );
// };

// export default Path;

import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material/styles';
import '@react-sigma/core/lib/react-sigma.min.css';
import { MultiDirectedGraph } from 'graphology';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import { SigmaContainer, ControlsContainer, ZoomControl, FullScreenControl, SearchControl, useLoadGraph } from '@react-sigma/core';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';
import random from 'graphology-layout/random';
import { getGraph } from 'store/slices/graph';
import DefaultUserIcon from '../../../assets/images/auth/default.png';
import { SERVER_URL } from 'config';

const LoadGraphWithByProp = ({ graphFlag }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const { user } = useAuth();
  const graphState = useSelector((state) => state.graph);

  useEffect(() => {
    setGraphData(graphState.graph);
  }, [graphState]);

  useEffect(() => {
    graphFlag && dispatch(getGraph());
  }, []);

  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const MyGraph = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
      const graph = new MultiDirectedGraph();
      // const RED = '#FA4F40';
      // const BLUE = '#727EE0';
      // const GREEN = '#5DB346';

      // graph.addNode('John', { size: 15, label: 'John', type: 'image', image: './user.svg', color: RED });
      // graph.addNode('Mary', { size: 15, label: 'Mary', type: 'image', image: './user.svg', color: RED });
      // graph.addNode('Suzan', { size: 15, label: 'Suzan', type: 'image', image: './user.svg', color: RED });
      // graph.addNode('Nantes', { size: 15, label: 'Nantes', type: 'image', image: './city.svg', color: BLUE });
      // graph.addNode('New-York', { size: 15, label: 'New-York', type: 'image', image: './city.svg', color: BLUE });
      // graph.addNode('Sushis', { size: 7, label: 'Sushis', type: 'image', color: GREEN });
      // graph.addNode('Falafels', { size: 7, label: 'Falafels', type: 'image', color: GREEN });
      // graph.addNode('Kouign Amann', { size: 7, label: 'Kouign Amann', type: 'image', color: GREEN });

      // graph.addEdge('John', 'Mary', { type: 'line', label: 'works with', size: 5 });
      // graph.addEdge('Mary', 'Suzan', { type: 'line', label: 'works with', size: 5 });
      // graph.addEdge('Mary', 'Nantes', { type: 'arrow', label: 'lives in', size: 5 });
      // graph.addEdge('John', 'New-York', { type: 'arrow', label: 'lives in', size: 5 });
      // graph.addEdge('Suzan', 'New-York', { type: 'arrow', label: 'lives in', size: 5 });
      // graph.addEdge('John', 'Falafels', { type: 'arrow', label: 'eats', size: 5 });
      // graph.addEdge('Mary', 'Sushis', { type: 'arrow', label: 'eats', size: 5 });
      // graph.addEdge('Suzan', 'Kouign Amann', { type: 'arrow', label: 'eats', size: 5 });

      // // graph.nodes().forEach((node, i) => {
      // //     const angle = (i * 2 * Math.PI) / graph.order;
      // //     graph.setNodeAttribute(node, 'x', 100 * Math.cos(angle));
      // //     graph.setNodeAttribute(node, 'y', 100 * Math.sin(angle));
      // // });

      graphData?.nodes.forEach((node) => {
        graph.addNode(node?.key, {
          label: node?.attributes?.username,
          color: node?.key === user?._id ? theme.palette.error.main : theme.palette.secondary.main,
          size: 20,
          type: 'image',
          image: node?.attributes?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + node?.attributes?.profile?.avatar : DefaultUserIcon
        });
      });
      graphData?.edges.forEach((edge) => {
        graph.addEdge(edge.source, edge.target, {
          type: `arrow`,
          animated: true,
          label: edge.attributes.limit.toString(),
          size: 5
        });
      });
      // random.assign(graph);
      graph.nodes().forEach((node, i) => {
        const angle = (i * 2 * Math.PI) / graph.order;
        graph.setNodeAttribute(node, 'x', 10 * Math.cos(angle));
        graph.setNodeAttribute(node, 'y', 10 * Math.sin(angle));
      });
      loadGraph(graph);
    }, [loadGraph]);

    return null;
  };

  return (
    <SigmaContainer
      style={{
        height: '500px',
        backgroundColor: theme.palette.mode == 'dark' ? theme.palette.secondary[800] : theme.palette.primary.light
      }}
      settings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        defaultNodeType: 'image',
        defaultEdgeType: 'arrow',
        renderLabels: true,
        renderEdgeLabels: true,
        labelDensity: 0.07,
        labelGridCellSize: 60,
        labelRenderedSizeThreshold: 15,
        labelFont: 'Lato, sans-serif',
        zIndex: true
      }}
    >
      <MyGraph />
      <ControlsContainer position={'bottom-right'}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control />
      </ControlsContainer>
      <ControlsContainer position={'top-right'}>
        <SearchControl style={{ width: '200px' }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default LoadGraphWithByProp;
