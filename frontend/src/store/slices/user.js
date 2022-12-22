// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    total: 0,
    users: [],
    user: {},
    followers: [],
    followings: [],
    postings: [],
    loading: false
};

const slice = createSlice({
    name: 'user',
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

        // GET USERS STYLE 1
        getUsersListSuccess(state, action) {
            state.users = action.payload.users;
            state.total = action.payload.total;
        },

        // GET USERS STYLE 1
        getUserSuccess(state, action) {
            state.user = action.payload;
            state.error = null;
        },

        // GET USERS STYLE 1
        getFollowersSuccess(state, action) {
            state.followers = action.payload;
            state.error = null;
        },

        // GET USERS STYLE 1
        getFollowingsSuccess(state, action) {
            state.followings = action.payload;
            state.error = null;
        },

        // GET USERS STYLE 1
        getPostingsSuccess(state, action) {
            state.postings = action.payload;
            state.error = null;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUserList(keyword = '', page = 1) {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.post('/users/search', { keyword, page });
            dispatch(slice.actions.getUsersListSuccess(response.data));
            dispatch(slice.actions.setLoading(false));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.setLoading(false));
        }
    };
}

export function getUser(id) {
    return async () => {
        try {
            const response = await axios.get(`/users/user/${id}`);
            dispatch(slice.actions.getUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getFollowers(id) {
    return async () => {
        try {
            const response = await axios.get(`/endorsement/followers/${id}`);
            dispatch(slice.actions.getFollowersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getFollowings(id) {
    return async () => {
        try {
            const response = await axios.get(`/endorsement/followings/${id}`);
            dispatch(slice.actions.getFollowingsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getPostings(id) {
    return async () => {
        try {
            const response = await axios.get(`/posting/getByUser/${id}`);
            dispatch(slice.actions.getPostingsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function uploadAvatar(data, successAction) {
    return async () => {
        try {
            const response = await axios.post(`/users/avatar`, data);
            successAction();
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function saveProfile(data, afterAction) {
    return async () => {
        try {
            const response = await axios.post(`/users/profile`, data);
            if(response.data?.success) {
                afterAction();
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function changePassword(data, afterAction) {
    return async () => {
        try {
            const response = await axios.post(`/users/password`, data);
            if(response.data?.success) {
                afterAction();
                dispatch(slice.actions.hasError({}));
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}
