import * as actionTypes from '../actions/actionTypes';


const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REGISTER_USER_REQUEST:
    case actionTypes.LOGIN_USER_REQUEST:
    case actionTypes.UPDATE_USER_REQUEST:
      return { ...state, loading: true };
    case actionTypes.REGISTER_USER_SUCCESS:
    case actionTypes.LOGIN_USER_SUCCESS:
    case actionTypes.UPDATE_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case actionTypes.REGISTER_USER_FAILURE:
    case actionTypes.LOGIN_USER_FAILURE:
    case actionTypes.UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
