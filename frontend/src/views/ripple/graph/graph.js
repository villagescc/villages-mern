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

const LoadGraphWithByProp = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const { user } = useAuth();
  const graphState = useSelector((state) => state.graph);

  useEffect(() => {
    setGraphData(graphState.graph);
  }, [graphState]);

  useEffect(() => {
    dispatch(getGraph());
  }, []);

  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const MyGraph = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
      const graph = new MultiDirectedGraph();

      graphData?.nodes.forEach((node) => {
        graph.addNode(node?.key, {
          label: node?.attributes?.username,
          color: node?.key === user?._id ? theme.palette.error.main : theme.palette.secondary.main,
          type: 'image',
          image: node?.attributes?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + node?.attributes?.profile?.avatar : DefaultUserIcon
        });
      });
      graphData?.edges.forEach((edge) => {
        graph.addEdge(edge.source, edge.target, {
          type: `arrow`,
          animated: true,
          label: edge.attributes.limit
        });
      });
      graph.forEachNode((node, attributes) => {
        if (node == user._id) graph.setNodeAttribute(node, 'size', graph.degree(node) / 30 + 15);
        else graph.setNodeAttribute(node, 'size', graph.degree(node) / 30 + 3);
      });
      const positions = random(graph, { dimensions: ['x1', 'x2'] });
      random.assign(graph);
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
