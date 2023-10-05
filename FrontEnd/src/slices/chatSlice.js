import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    activeChat: null,
    loading: false,
    error: null,
    usersInChat: [],
  },
  reducers: {
    fetchChatsRequest: (state) => {
      state.loading = true;
    },
    fetchChatsSuccess: (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    },
    fetchChatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    activateChat: (state, action) => {
      state.activeChat = action.payload;
    },
    // addMessage: (state, action) => {
    //   const { chatId, message } = action.payload;
    //   const chat = state.chats.find((chat) => chat.id === chatId);
    //   if (chat) {
    //     chat.messages.push(message);
    //   }
    // },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      let chat = state.chats.find((chat) => chat.id === chatId);
      if (!chat) {
          // If chat doesn't exist, create one and add to state.chats
          chat = { id: chatId, messages: [] };
          state.chats.push(chat);
      }
      chat.messages.push(message);
  },
  
  },
});

export const {
  fetchChatsRequest,
  fetchChatsSuccess,
  fetchChatsFailure,
  activateChat,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
