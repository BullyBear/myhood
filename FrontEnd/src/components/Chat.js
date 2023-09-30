import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import io from 'socket.io-client';
//import { GiftedChat } from 'react-native-gifted-chat';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../slices/chatSlice';

const Chat = ({ roomId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io('http://localhost:3000');
  const dispatch = useDispatch(); 


  useEffect(() => {
    socket.emit('join', { username: userId, room: roomId });

    return () => {
        socket.emit('leave', { username: userId, room: roomId });
        socket.disconnect();
    };
}, [roomId]);


  // useEffect(() => {
  //   socket.on(`room ${roomId}`, (message) => {
  //     // Handle incoming messages and dispatch to Redux
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //     dispatch(addMessage({ chatId: roomId, message }));
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [roomId]);


  const sendMessage = () => {
    // Emit event to send message to server
    socket.emit('message', { roomId, userId, message });

    // Update local state with new message
    setMessages((prevMessages) => [...prevMessages, { user: userId, message }]);
    
    // Clear input field
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.messageContainer}>
        {messages.map((message, index) => (
          <View key={index} style={styles.message}>
            <Text style={styles.messageUser}>{message.user}:</Text>
            <Text style={styles.messageText}>{message.message}</Text>
            {/* Add timestamp here if needed */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    padding: 10,
  },
  message: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  messageUser: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  messageText: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Chat;
