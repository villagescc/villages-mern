// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import menuReducer from './slices/menu';
import postingReducer from './slices/posting';
import notificationReducer from './slices/notification';

import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import endorsementReducer from './slices/endorsement';
import paymentReducer from './slices/payment';
import graphReducer from './slices/graph';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    menu: menuReducer,
    posting: postingReducer,

    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    endorsement: endorsementReducer,
    payment: paymentReducer,
    graph: graphReducer,
    notification: notificationReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    user: userReducer,
});

export default reducer;
