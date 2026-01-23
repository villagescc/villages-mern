import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    title: '',
    message: '',
    okLabel: '',
    onOkClick: () => {}
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const dialog = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        openDialog(state, action) {
            const { open, title, message, okLabel, onOkClick } = action.payload;

            state.open = open || initialState.open;
            state.title = title || initialState.title;
            state.message = message || initialState.message;
            state.okLabel = okLabel || initialState.okLabel;
            state.onOkClick = onOkClick || initialState.onOkClick;
        },

        closeDialog(state) {
            state.open = false;
        },

        initDialog(state) {
            state.open = initialState.open;
            state.title = initialState.title;
            state.message = initialState.message;
            state.okLabel = initialState.okLabel;
            state.onOkClick = initialState.onOkClick;
        }
    }
});

export default dialog.reducer;

export const { closeDialog, openDialog, initDialog } = dialog.actions;
