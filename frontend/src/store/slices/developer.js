// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    developers: [],
    errors: {},
    loading: false
};

const slice = createSlice({
    name: 'developer',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.errors = action.payload;
        },

        // GET ALL DEVELOPER REQUEST
        getAllDeveloperSuccess(state, action) {
            state.developers = action.payload;
            state.errors = {};
        },

        // MODIFY CONTACT
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAllDeveloper() {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get('/getAllDeveloper');
            dispatch(slice.actions.getAllDeveloperSuccess(response.data.developerSettings));
            dispatch(slice.actions.setLoading(false));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.setLoading(false));
        }
    };
}

export function approveDeveloper(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.post('/approveDeveloper', data);
            if (response.data?.success) {
                dispatch(getAllDeveloper());
            }
            dispatch(slice.actions.setLoading(false));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.setLoading(false));
        }
    };
}