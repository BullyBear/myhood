import * as actionTypes from './actionTypes';
import { getAllToys } from '../API/toyAPI';

export const fetchToysRequest = () => ({
  type: actionTypes.FETCH_TOYS_REQUEST,
});

export const fetchToysSuccess = (toys) => ({
  type: actionTypes.FETCH_TOYS_SUCCESS,
  payload: toys,
});

export const fetchToysFailure = (error) => ({
  type: actionTypes.FETCH_TOYS_FAILURE,
  payload: error,
});

export const fetchToys = () => async (dispatch) => {
  dispatch(fetchToysRequest());
  try {
    const fetchedToys = await getAllToys();
    dispatch(fetchToysSuccess(fetchedToys));
  } catch (error) {
    dispatch(fetchToysFailure(error));
  }
};
