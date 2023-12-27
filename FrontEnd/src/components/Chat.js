import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import { addMessage } from '../slices/chatSlice';
import { API_URL } from '../../config';

const Chat = ({ roomId, userId }) => {
  const [message, setMessage] = useState('');

  const chat = useSelector((state) =>
    state.chat.chats.find((chat) => chat.id === roomId)
  );
  const messages = chat ? chat.messages : [];

  const scrollViewRef = useRef();

  const socket = io(API_URL);
  const dispatch = useDispatch();

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    socket.emit('join', { username: userId, room: roomId });

    return () => {
      socket.emit('leave', { username: userId, room: roomId });
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() === '') {
      return; // Prevent sending empty messages
    }

    socket.emit('message', { roomId, userId, message });
    setMessage('');

    // You can add the sender's message to the UI immediately without waiting for the server response
    const newMessage = {
      userId,
      message,
    };
    dispatch(addMessage({ chatId: roomId, message: newMessage }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messageContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                msg.userId === userId ? styles.senderMessage : styles.receiverMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.userId === userId ? styles.senderBubble : styles.receiverBubble,
                ]}
              >
                <Text style={[styles.messageText, msg.userId === userId && styles.senderText]}>
                  {msg.message}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message here"
            value={message}
            onChangeText={(text) => setMessage(text)}
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6BCD9B',
    flexDirection: 'column',
  },
  messageContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 10,
    backgroundColor: '#6BCD9B',
  },
  input: {
    flex: 5.5,
    backgroundColor: '#f2f2f7',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
    borderColor: '#007BFF',
    borderWidth: 1,
    height: 45,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    shadowOffset: { height: 1, width: 0 },
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  message: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  senderMessage: {
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  receiverMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  senderBubble: {
    backgroundColor: '#007BFF',
  },
  receiverBubble: {
    backgroundColor: '#E1E1E1',
  },
  messageText: {
    color: '#000',
  },
  senderText: {
    color: '#fff',
  },
});

export default Chat;
