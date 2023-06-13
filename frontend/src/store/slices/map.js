// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    users: [],
    errors: {},
    posts: [],
    total: 0,
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
        },

        // GET POSTS
        filterPostSuccess(state, action) {
            state.posts = action.payload.posts;
            state.total = action.payload.total;
            state.loading = false;
        },
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

export function filterMap(filterData) {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.post('/map/posts', { filterData });
            dispatch(slice.actions.filterPostSuccess(response.data));
        } catch (error) {
            console.log('error', error);
            dispatch(slice.actions.hasError(error));
        }
    };
}
