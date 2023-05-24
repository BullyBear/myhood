import { combineReducers } from 'redux';
import userReducer from './userReducer';
import chatReducer from './chatReducer';
import toySlice from './toySlice';

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  toy: toySlice,
});

export default rootReducer;
