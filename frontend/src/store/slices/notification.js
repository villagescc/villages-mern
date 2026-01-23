// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    total: 0,
    notifications: [],
    errors: {},
    loading: false
};

const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.errors = action.payload;
        },

        // GET ENDORSEMENTS
        getNotificationsSuccess(state, action) {
            state.notifications = action.payload;
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

export function getNotifications() {
    return async () => {
        try {
            const response = await axios.get('/notification/getByUser');
            dispatch(slice.actions.getNotificationsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setReadAll(successAction) {
    return async () => {
        try {
            const response = await axios.put('/notification/readAllByUser');
            if (!!response.data) successAction();
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteAll(successAction) {
    return async () => {
        try {
            const response = await axios.put('/notification/deleteAllByUser');
            if (!!response.data) successAction();
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
