import { useEffect } from 'react';
import Graph from 'graphology';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
import DefaultUserIcon from 'assets/images/auth/default.png';

import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import { SERVER_URL } from 'config';

import { isEmpty } from 'lodash';

const LoadGraph = ({ paylogs }) => {
    const loadGraph = useLoadGraph();
    const theme = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        const graph = new Graph();
        paylogs
            .filter((paylog) => paylog.payer && !isEmpty(paylog.payer) && paylog.recipient && !isEmpty(paylog.recipient))
            .forEach((paylog) => {
                if (!graph.hasNode(paylog.payer.username)) {
                    graph.addNode(paylog.payer.username, {
                        ...paylog.payer,
                        size: 20,
                        label: paylog.payer.username,
                        type: 'image',
                        image: paylog?.payer?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + paylog?.payer?.profile?.avatar : DefaultUserIcon
                    });
                }
                if (!graph.hasNode(paylog.recipient.username)) {
                    graph.addNode(paylog.recipient.username, {
                        ...paylog.recipient,
                        size: 20,
                        label: paylog.recipient?.username,
                        type: 'image',
                        image: paylog.recipient?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + paylog.recipient?.profile?.avatar : DefaultUserIcon
                    });
                }
                graph.addEdgeWithKey(paylog._id, paylog?.payer?.username, paylog?.recipient?.username, {
                    label: paylog.amount,
                    color: theme.palette.secondary.main,
                    size: 5
                });
            });
        graph.nodes().forEach((node, i) => {
            const angle = (i * 2 * Math.PI) / graph.order;
            graph.setNodeAttribute(node, 'x', 10 * Math.cos(angle));
            graph.setNodeAttribute(node, 'y', 10 * Math.sin(angle));
        });
        loadGraph(graph);
    }, [loadGraph]);

    return null;
};

const DisplayGraph = ({ paylogs }) => {
    return (
        <SigmaContainer
            settings={{
                nodeProgramClasses: { image: getNodeProgramImage() },
                defaultNodeType: 'image',
                defaultEdgeType: 'arrow',
                renderEdgeLabels: true,
                labelDensity: 0.07,
                labelGridCellSize: 60,
                labelRenderedSizeThreshold: 15,
                labelFont: 'Lato, sans-serif',
                zIndex: true,
                minEdgeSize: 10,
                maxEdgeSize: 10
            }}
            style={{ height: '500px', width: '100%' }}
        >
            <LoadGraph paylogs={paylogs} />
        </SigmaContainer>
    );
};

export default DisplayGraph;
