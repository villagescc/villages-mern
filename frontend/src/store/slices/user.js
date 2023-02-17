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
    setting: {},
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

        // GET USERS
        getUsersSuccess(state, action) {
            state.users = action.payload;
        },

        // GET USERS List
        getUsersListSuccess(state, action) {
            state.users = action.payload.users;
            state.total = action.payload.total;
        },

        // GET USER DATA
        getUserSuccess(state, action) {
            state.user = action.payload;
            state.error = null;
        },

        // GET USER SETTING DATA
        getSettingSuccess(state, action) {
            state.setting = action.payload;
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

        // Edit User Data by admin
        editUserData(state, action) {
            state.user.email = action.payload.email;
            state.user.username = action.payload.username;
            state.user.profile.description = action.payload.description;
            state.error = null;
        },

        // user Activate
        userActivate(state, action) {
            for (let index = 0; index < state.users.length; index++) {
                if (state.users[index]._id === action.payload._id) {
                    state.users[index].isActive = !state.users[index].isActive;
                    break;
                }
            }
            // state.user.isActive = !action.payload.isActive;
            state.error = null;
        },

        // delete user
        deleteUser(state, action) {
            for (let index = 0; index < state.users.length; index++) {
                if (state.users[index]._id === action.payload._id) {
                    state.users.splice(index, 1);
                    break;
                }
            }
            state.error = null;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export function getUsers() {
    return async () => {
        dispatch(slice.actions.setLoading(true));
        try {
            const response = await axios.get('/base/users/getRecipients');
            dispatch(slice.actions.getUsersSuccess(response.data));
            dispatch(slice.actions.setLoading(false));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.setLoading(false));
        }
    };
}

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

export function getSetting() {
    return async () => {
        try {
            const response = await axios.get(`/setting`);
            dispatch(slice.actions.getSettingSuccess(response.data));
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
            dispatch(slice.actions.getPostingsSuccess(response.data));
            successAction();
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function uploadAvatarAsAdmin(data) {
    return async () => {
        try {
            console.log('data = ', data);
            const response = await axios.post(`/admin/users/avatar`, data);
            dispatch(slice.actions.getPostingsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function saveProfile(data, afterAction) {
    return async () => {
        try {
            const response = await axios.post(`/users/profile`, data);
            if (response.data?.success) {
                afterAction();
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function changePassword(data, afterAction) {
    return async () => {
        try {
            const response = await axios.post(`/users/password`, data);
            if (response.data?.success) {
                afterAction();
                dispatch(slice.actions.hasError({}));
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// admin
export function saveUserData(userData, successAction) {
    return async () => {
        try {
            const response = await axios.post('/admin/users/edit', userData);
            if (response.data?.success) {
                successAction();
                dispatch(slice.actions.editUserData(userData));
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function userActivate(user, successAction) {
    return async () => {
        try {
            const response = await axios.post('/admin/users/activate', user);
            if (response.data?.success) {
                successAction();
                dispatch(slice.actions.userActivate(user));
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deletUser(user, successAction) {
    return async () => {
        try {
            const response = await axios.post('/admin/users/delete', user);
            if (response.data?.success) {
                successAction();
                dispatch(slice.actions.deleteUser(user));
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
