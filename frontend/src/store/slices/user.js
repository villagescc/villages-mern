// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  recentUsers: [],
  mostActiveUsers: [],
  mostConnectedUsers: [],
  transactionHistory: [],
  trustHistory: [],
  analytics: null,
  isUsersLoading: false,
  isAnalyticsLoading: false,
  isRecentPaymentLoading: false,
  // creditLinesIssued: null,
  // villagesHours: null,
  total: 0,
  users: [],
  user: {},
  setting: {},
  followers: [],
  followings: [],
  recentPayments: [],
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

    // user Verified
    userVerified(state, action) {
      for (let index = 0; index < state.users.length; index++) {
        if (state.users[index]._id === action.payload) {
          state.users[index].verified = !state.users[index].verified;
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
    },

    // get recent users
    setRecentUsers(state, action) {
      state.recentUsers = action.payload
      state.error = null
    },

    // set most active users
    setMostActiveUsers(state, action) {
      state.mostActiveUsers = action.payload
      state.error = null
    },

    // set most active users
    setMostConnectedUsers(state, action) {
      state.mostConnectedUsers = action.payload
      state.error = null
    },

    // set village hours
    // setVillagesHours(state, action) {
    //   state.villagesHours = action.payload
    //   state.error = null
    // },

    // set credit lines issued
    // setCreditLinesIssued(state, action) {
    //   state.creditLinesIssued = action.payload
    //   state.error = null
    // }

    // set analytics
    setAnalytics(state, action) {
      state.analytics = action.payload
      state.error = null
    },

    // set loading state for analytics 
    setIsAnalyticsLoading(state, action) {
      state.isAnalyticsLoading = action.payload
    },

    // set loading state for new users 
    setIsUserLoading(state, action) {
      state.isUsersLoading = action.payload
    },

    // set loading state for recent payments
    setIsRecentPaymentLoading(state, action) {
      state.isRecentPaymentLoading = action.payload
    },

    // set recent payments
    setRecentPayments(state, action) {
      state.recentPayments = action.payload
    },

    // set transaction history
    setTransactionHistory(state, action) {
      state.transactionHistory = action.payload
    },


    // set trust history
    setTrustHistory(state, action) {
      state.trustHistory = action.payload
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

export function getUserList(keyword = '', page = 1, value = 'Suggested', network = []) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post('/users/search', { keyword, page, value, network });
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
export function getUserByUserName(username) {
  return async () => {
    try {
      const response = await axios.get(`/users/username/${username}`);
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

export function saveSetting(data, successAction) {
  return async () => {
    try {
      const response = await axios.post('/users/profile/setting', data);
      if (response.data?.success) {
        successAction();
      }
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

export function deactive(afterAction) {
  return async () => {
    try {
      const response = await axios.get(`/users/deactive`);
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
export function saveUserData(userData, lng, lat, successAction) {
  return async () => {
    try {
      const response = await axios.post('/admin/users/edit', { userData, lng, lat });
      if (response.data?.success) {
        successAction();
        dispatch(slice.actions.editUserData(userData));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserByID(_id) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.get(`admin/user/${_id}`);
      dispatch(slice.actions.getUserSuccess(response.data.user));
      dispatch(slice.actions.setLoading(false));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setLoading(false));
    }
  };
}

export function searchUserData(keyword = '', page = 1) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post('admin/users/search', { keyword, page });
      dispatch(slice.actions.getUsersListSuccess(response.data));
      dispatch(slice.actions.setLoading(false));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setLoading(false));
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
export function userVerification(id, successAction) {
  return async () => {
    try {
      const response = await axios.post('/admin/users/verify', { "_id": id });
      if (response.data?.success) {
        successAction();
        dispatch(slice.actions.userVerified(id));
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

// Admin analytics 

export function getMostConnectedUsers(dateRange, viewport) {
  return async () => {
    dispatch(slice.actions.setIsUserLoading(true));
    try {
      const response = await axios.post('admin/users/getMostConnectedUsers', { dateRange, viewport });
      dispatch(slice.actions.setMostConnectedUsers(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setIsUserLoading(false));
    }
  };
}

export function getMostActiveUsers(dateRange, viewport) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    // dispatch(slice.actions.setIsAnalyticsLoading(true));
    try {
      const response = await axios.post('admin/users/getMostActiveUsers', { dateRange, viewport });
      dispatch(slice.actions.setMostActiveUsers(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setLoading(false));
      // dispatch(slice.actions.setIsUserLoading(false));
    }
  };
}

// export function getVillageHours() {
//   return async () => {
//     dispatch(slice.actions.setLoading(true));
//     try {
//       const response = await axios.post('admin/users/getVillageHours');
//       dispatch(slice.actions.setVillagesHours(response.data.villageHours));
//       dispatch(slice.actions.setLoading(false));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//       dispatch(slice.actions.setLoading(false));
//     }
//   };
// }

// export function getCreditLinesIssued() {
//   return async () => {
//     dispatch(slice.actions.setLoading(true));
//     try {
//       const response = await axios.post('admin/users/getVillageHours');
//       dispatch(slice.actions.setCreditLinesIssued(response.data.creditLinesIssued));
//       dispatch(slice.actions.setLoading(false));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//       dispatch(slice.actions.setLoading(false));
//     }
//   };
// }

export function getAnalytics(dateRange, viewport) {
  return async () => {
    dispatch(slice.actions.setIsAnalyticsLoading(true));
    try {
      const response = await axios.post('admin/users/getAnalytics', { dateRange, viewport });
      dispatch(slice.actions.setAnalytics(response.data.analytics));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setIsAnalyticsLoading(false));
    }
  };
}

export function getRecentPayments(page = 0, dateRange, viewport) {
  return async () => {
    dispatch(slice.actions.setIsRecentPaymentLoading(true));
    try {
      const response = await axios.post('admin/users/getRecentPayments', { page, dateRange, viewport });
      dispatch(slice.actions.setRecentPayments(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setIsRecentPaymentLoading(false));
    }
  };
}

export function getPaymentHistory(page = 0, dateRange, viewport) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post('admin/users/getPaymentHistory', { page, dateRange, viewport });
      dispatch(slice.actions.setTransactionHistory(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setLoading(false));
    }
  };
}

export function getTrustHistory(page = 0, dateRange, viewport) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post('admin/users/getTrustHistory', { page, dateRange, viewport });
      dispatch(slice.actions.setTrustHistory(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setLoading(false));
    }
  };
}