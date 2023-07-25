import { combineReducers } from 'redux';
import userSlice from '../slices/userSlice';
import toySlice from '../slices/toySlice';
import chatSlice from '../slices/chatSlice'; 

const rootReducer = combineReducers({
  user: userSlice,
  toy: toySlice,
  chat: chatSlice,
});

export default rootReducer;
