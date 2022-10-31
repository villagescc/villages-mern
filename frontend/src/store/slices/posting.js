// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    categories: [],
    posts: []
};

const slice = createSlice({
    name: 'mail',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET GATEGORIES
        getCategoriesSuccess(state, action) {
            state.categories = action.payload;
        },

        // GET POSTS
        filterPostSuccess(state, action) {
            state.posts = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCategories() {
    return async () => {
        try {
            const response = await axios.get('/posting/categories');
            dispatch(slice.actions.getCategoriesSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function filterPost() {
    return async (category, type, radius, keyword) => {
        try {
            const response = await axios.post('/posting/posts', { category, type, radius, keyword });
            dispatch(slice.actions.filterPostSuccess(response.data));
        } catch (error) {
            console.log('error', error);
            dispatch(slice.actions.hasError(error));
        }
    };
}
