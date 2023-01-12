// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    graph: null,
    nodes: [],
    edges: [],
    errors: {},
    loading: false
};

const slice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.errors = action.payload;
        },

        // GET GRAPH
        getGraphSuccess(state, action) {
            state.graph = action.payload;
            state.errors = {};
            state.loading = false;
        },

        // GET GRAPH DATA
        getPathSuccess(state, action) {
            const { paylogs } = action.payload;
            state.nodes = action.payload.nodes;
            state.edges = action.payload.edges;
            state.loading = false;
        },

        // MODIFY LOADING
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

export function getGraph() {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get('/payment/getGraph');
            dispatch(slice.actions.setLoading(false));
            dispatch(slice.actions.getGraphSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.setLoading(false));
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getPath(senderId, recipientId) {
    return async () => {
        try {
            const response = await axios.post('/payment/getPath', { senderId, recipientId });
            dispatch(slice.actions.getGraphSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
