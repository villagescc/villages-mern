// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
  endorsements: [],
  users: [],
  endorsementData: {},
  total: 0,
  errors: {},
  loading: false
};

const slice = createSlice({
  name: 'endorsement',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.errors = action.payload;
      state.loading = false;
    },

    // GET ENDORSEMENTS
    searchEndorsementsSuccess(state, action) {
      state.endorsements = action.payload.endorsements;
      state.total = action.payload.total;
      state.loading = false;
      state.errors = {};
    },

    // GET ENDORSEMENTS BY ID
    getEndorsementSuccess(state, action) {
      state.errors = {};
      state.endorsementData = action.payload;
    },

    // GET ENDORSEMENTS BY ID
    clearEndrosement(state) {
      state.errors = {};
      state.endorsementData = {};
    },

    // TO EDIT ENDROSEMENT DATA
    editEndrosementDetails(state, action) {
      state.errors = {};
      state.endorsementData = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.errors = {};
      state.users = action.payload;
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

export function searchEndorsements(keyword = '', page = 1) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post('/endorsement/search', { keyword, page });
      dispatch(slice.actions.searchEndorsementsSuccess(response.data));
      dispatch(slice.actions.hasError({}));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function saveEndorsement(endorsement, successAction) {
  return async () => {
    try {
      const response = await axios.post('/endorsement/save', endorsement);
      successAction();
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteEndorsement(recipient, text, weight, successAction) {
  return async () => {
    try {
      const response = await axios.post('/endorsement/delete', { recipient, text, weight });
      successAction();
      dispatch(slice.actions.hasError({}));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsers() {
  return async () => {
    try {
      const response = await axios.get('/base/users/getRecipients');
      dispatch(slice.actions.getUsersSuccess(response.data));
      dispatch(slice.actions.hasError({}));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// To get Endrosement data based on ID
export function getEndorsementDetail(id) {
  return async () => {
    try {
      const response = await axios.get(`/endorsement/getEndrosmentbyId/${id}`);
      dispatch(slice.actions.hasError({}));
      dispatch(slice.actions.getEndorsementSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// To clear state after Modal close
export function removeEndrosement() {
  return async () => {
    try {
      dispatch(slice.actions.clearEndrosement());
      dispatch(slice.actions.hasError({}));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// To Update endrosement Data while edit
export function editEndrosement(data) {
  return async () => {
    try {
      dispatch(slice.actions.editEndrosementDetails(data));
      dispatch(slice.actions.hasError({}));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// To Clear Errors
export function clearErrors() {
  return async () => {
    dispatch(slice.actions.hasError({}));
  };
}