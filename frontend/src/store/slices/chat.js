// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    loading: false,
    state: null,
    chats: [],
    user: {},
    users: []
};

const slice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET USER
        getUserSuccess(state, action) {
            state.user = action.payload.user;
        },

        // GET USER CHATS
        getUserChatsSuccess(state, action) {
            state.chats = action.payload.chats;
        },

        // GET USERS
        getUsersSuccess(state, action) {
            state.users = action.payload;
        },

        // GET STATE
        getStateSuccess(state, action) {
            state.state = action.payload.state;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUser(id) {
    return async () => {
        try {
            const response = await axios.get(`/chat/user/${id}`);
            dispatch(slice.actions.getUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserChats(recipient) {
    alert(recipient);
    return async () => {
        try {
            const response = await axios.post('/chat/chats/filter', { recipient });
            dispatch(slice.actions.getUserChatsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function insertChat(chat) {
    return async () => {
        try {
            await axios.post('/chat/create', chat);
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUsers() {
    return async () => {
        try {
            const response = await axios.get('/chat/users');
            dispatch(slice.actions.getUsersSuccess(response.data.users));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function searchUsers(keyword) {
    return async () => {
        try {
            const response = await axios.post('/chat/users/search', { keyword });
            dispatch(slice.actions.getUsersSuccess(response.data.users));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getState() {
    return async () => {
        try {
            const response = await axios.get('/chat/state');
            dispatch(slice.actions.getStateSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setState(state) {
    return async () => {
        try {
            const response = await axios.put('/chat/state', { state });
            dispatch(slice.actions.getStateSuccess({ state }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
