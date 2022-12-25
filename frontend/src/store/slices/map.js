// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    users: [],
    errors: {},
    loading: false
};

const slice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.errors = action.payload;
        },

        // GET USERS
        getUsersSuccess(state, action) {
            state.users = action.payload;
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

export function getUsers() {
    return async () => {
        try {
            const response = await axios.get('/map/users');
            dispatch(slice.actions.getUsersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
