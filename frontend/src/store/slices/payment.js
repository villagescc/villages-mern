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
  transactions: [],
  transaction: {},
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

    getTransactionsSuccess(state, action) {
      state.transactions = action.payload.transactions;
      state.total = action.payload.total;
    },

    getTransactionSuccess(state, action) {
      state.transaction = action.payload;
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

export function getMaxLimit(recipient) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.get(`/payment/getMaxLimit/${recipient}`);
      dispatch(slice.actions.getMaxLimitSuccess(response.data));
      dispatch(slice.actions.setLoading(false));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setLoading(false));
    }
  };
}

export function pay(paymentData, successAction, setIsSubmitting) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post(`/payment/pay`, paymentData);
      dispatch(slice.actions.paySuccess());
      successAction();
      dispatch(slice.actions.setLoading(false));
    } catch (error) {
      setIsSubmitting(false);
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setLoading(false));
    }
  };
}

export function getTransactions(filterData) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post('/payment/transactions', filterData);
      dispatch(slice.actions.getTransactionsSuccess(response.data));
      dispatch(slice.actions.setLoading(false));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setLoading(false));
    }
  };
}

export function getTransaction(id) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.get(`/payment/transaction/${id}`);
      if (response.data && response.data.success) dispatch(slice.actions.getTransactionSuccess(response.data.transaction));
      dispatch(slice.actions.setLoading(false));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setLoading(false));
    }
  };
}
