import React, { useEffect, useState } from 'react';
import Graph from "graphology";
import {Sigma, EdgeShapes, NodeShapes, RandomizeNodePositions, RelativeSize, ForceAtlas2, Filter} from 'react-sigma';

import {useDispatch, useSelector} from "store";
import { getGraph } from "store/slices/graph";
import useAuth from "hooks/useAuth";
import useConfig from "hooks/useConfig";
import {useTheme} from "@mui/material/styles";

const Index = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const { user } = useAuth()
  const graphState = useSelector((state) => state.graph);

  const [ graph, setGraph ] = useState(null);
  const [ selectedNode, setSelectedNode ] = useState(null);

  useEffect(() => {
    dispatch(getGraph())
  }, [])

  useEffect(() => {
    setGraph(graphState.graph);
  }, [graphState])

  return (
    <div>
      {
        !!graph && (
          <Sigma
            renderer="canvas"
            graph={{
              nodes: graph?.nodes.map(node => ({
                id: node?.key,
                label: node?.attributes?.username,
                color: node?.key === user?._id ? theme.palette.error.main : theme.palette.secondary.main,
              })),
              edges: graph?.edges.filter(edge => edge.attributes && edge.attributes.limit > 0 && edge.source !== edge.target).map(edge => ({
                id: edge.key,
                source: edge.source,
                target: edge.target,
                animated: true,
                label: edge.attributes.limit.toString(),
                // size: 0.5
              }))
            }}
            settings={{
              drawEdgeLabels: true,
              drawEdges: true,
              // minEdgeSize: 2,
              // maxEdgeSize: 2,
              // minNodeSize: 10,
              // maxNodeSize: 10
            }}
            style={{
              width: '100%',
              height: '80vh',
              backgroundColor: '#fff',
              borderRadius: borderRadius
            }}
            onOverNode={ e => setSelectedNode(e.data.node.id) }
            onOutNode={ e => setSelectedNode(null) }
          >
            <EdgeShapes default="curvedArrow"/>
            <RandomizeNodePositions>
              <Filter neighborsOf={ selectedNode } />
              <ForceAtlas2
                barnesHutOptimize
                barnesHutTheta={0.6}
                iterationsPerRender={1}
                linLogMode
                timeout={1000}
                worker
              />
              <RelativeSize initialSize={15} />
            </RandomizeNodePositions>
          </Sigma>
        )
      }
    </div>
  );
};

export default Index;
