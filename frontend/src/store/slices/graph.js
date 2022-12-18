// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    graph: null,
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

        // GET USERS
        getGraphSuccess(state, action) {
            state.graph = action.payload;
            state.errors = {};
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
        try {
            const response = await axios.get('/payment/getGraph');
            dispatch(slice.actions.getGraphSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
