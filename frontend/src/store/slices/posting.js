// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    loading: false,
    tags: [],
    categories: [],
    subCategories: [],
    posts: [],
    post: {},
    total: 0
};

const slice = createSlice({
    name: 'mail',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // SET LOADING
        setLoading(state, action) {
            state.loading = action.payload;
        },

        // GET TAGS
        getTagsSuccess(state, action) {
            state.tags = action.payload;
            state.loading = false;
        },

        // GET GATEGORIES
        getCategoriesSuccess(state, action) {
            state.categories = action.payload;
            state.loading = false;
        },

        // GET GATEGORIES
        getSubCategoriesSuccess(state, action) {
            state.subCategories = action.payload;
            state.loading = false;
        },

        // GET POSTS
        filterPostSuccess(state, action) {
            state.posts = action.payload.posts;
            state.total = action.payload.total;
            state.loading = false;
        },

        // GET POST
        getPostSuccess(state, action) {
            state.post = action.payload;
            state.loading = false;
        },

        // Delete POST
        deletePostSuccess(state, action) {
            state.posts = state.posts.filter((post) => post._id !== action.payload);
            state.loading = false;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTags() {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get('/base/tags');
            dispatch(slice.actions.getTagsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getCategories() {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get('/base/categories');
            dispatch(slice.actions.getCategoriesSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getSubCategories(categoryId = 'all') {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get(`/base/subCategories/${categoryId}`);
            dispatch(slice.actions.getSubCategoriesSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function filterPost(category = '', type = '', radius = '', keyword = '', page = 1) {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.post('/posting/posts', { category, type, radius, keyword, page });
            dispatch(slice.actions.filterPostSuccess(response.data));
        } catch (error) {
            console.log('error', error);
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getPost(id) {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get(`/posting/post/${id}`);
            dispatch(slice.actions.getPostSuccess(response.data));
            dispatch(slice.actions.setLoading(false));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function submitPost(data, closeModal) {
    return async () => {
        try {
            const response = await axios.postForm('/posting/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            closeModal();
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deletePost(id, successAction) {
    return async () => {
        try {
            const response = await axios.delete(`/posting/${id}`);
            dispatch(slice.actions.deletePostSuccess(id));
            successAction();
        } catch (error) {
            console.log('error', error);
            dispatch(slice.actions.hasError(error));
        }
    };
}
