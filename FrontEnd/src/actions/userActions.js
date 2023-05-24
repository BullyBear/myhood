import * as actionTypes from './actionTypes';
import { registerUser as registerUserFromAPI, loginUser as loginUserFromAPI, updateUser as updateUserFromAPI } from '../API/userAPI';

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerUserRequest());
  try {
    const response = await registerUserFromAPI(userData);
    dispatch(registerUserSuccess(response.data));
  } catch (error) {
    dispatch(registerUserFailure(error.message));
  }
};

export const registerUserRequest = () => ({
  type: actionTypes.REGISTER_USER_REQUEST,
});

export const registerUserSuccess = (userData) => ({
  type: actionTypes.REGISTER_USER_SUCCESS,
  payload: userData,
});

export const registerUserFailure = (error) => ({
  type: actionTypes.REGISTER_USER_FAILURE,
  payload: error,
});

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginUserRequest());
  try {
    const response = await loginUserFromAPI(credentials);
    dispatch(loginUserSuccess(response.data));
  } catch (error) {
    dispatch(loginUserFailure(error.message));
  }
};

export const loginUserRequest = () => ({
  type: actionTypes.LOGIN_USER_REQUEST,
});

export const loginUserSuccess = (userData) => ({
  type: actionTypes.LOGIN_USER_SUCCESS,
  payload: userData,
});

export const loginUserFailure = (error) => ({
  type: actionTypes.LOGIN_USER_FAILURE,
  payload: error,
});

export const updateUser = (userId, userData) => async (dispatch) => {
  dispatch(updateUserRequest());
  try {
    const response = await updateUserFromAPI(userId, userData);
    dispatch(updateUserSuccess(response.data));
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
};

export const updateUserRequest = () => ({
  type: actionTypes.UPDATE_USER_REQUEST,
});

export const updateUserSuccess = (userData) => ({
  type: actionTypes.UPDATE_USER_SUCCESS,
  payload: userData,
});

export const updateUserFailure = (error) => ({
  type: actionTypes.UPDATE_USER_FAILURE,
  payload: error,
});
