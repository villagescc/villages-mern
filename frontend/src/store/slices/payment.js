// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    users: [],
    paylogs: [],
    total: 0,
    maxLimit: 0,
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
        getUsersSuccess(state, action) {
            state.users = action.payload;
            state.errors = {};
            state.maxLimit = 0;
        },

        // GET MAX LIMIT
        getMaxLimitSuccess(state, action) {
            state.maxLimit = action.payload.maxLimit;
            state.paylogs = action.payload.paylogs;
            state.errors = {};
        },

        // GET MAX LIMIT
        paySuccess(state) {
            state.maxLimit = 0;
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

export function getUsers() {
    return async () => {
        try {
            const response = await axios.get('/base/users/getRecipients');
            dispatch(slice.actions.getUsersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getMaxLimit(recipient) {
    return async () => {
        try {
            const response = await axios.get(`/payment/getMaxLimit/${recipient}`);
            dispatch(slice.actions.getMaxLimitSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function pay(paymentData, successAction) {
    return async () => {
        try {
            const response = await axios.post(`/payment/pay`, paymentData);
            dispatch(slice.actions.paySuccess());
            successAction()
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
