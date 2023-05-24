import * as actionTypes from '../actions/actionTypes';

const initialState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CHATS_REQUEST:
      return { ...state, loading: true };
    case actionTypes.FETCH_CHATS_SUCCESS:
      return { ...state, loading: false, chats: action.payload };
    case actionTypes.FETCH_CHATS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case actionTypes.ACTIVATE_CHAT:
      return { ...state, activeChat: action.payload };
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload.message],
              }
            : chat
        ),
      };
    default:
      return state;
  }
};

export default chatReducer;
