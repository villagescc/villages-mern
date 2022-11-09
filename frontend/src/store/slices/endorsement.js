// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    endorsements: [],
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
        },

        // GET CONTACTS
        searchEndorsementsSuccess(state, action) {
            state.endorsements = action.payload.endorsements;
            state.total = action.payload.total;
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
        try {
            const response = await axios.post('/endorsement/search', { keyword, page });
            dispatch(slice.actions.searchEndorsementsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function saveEndorsement(endorsement) {
    return async () => {
        try {
            const response = await axios.post('/endorsement/save', endorsement);
            dispatch(slice.actions.modifyContactSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
