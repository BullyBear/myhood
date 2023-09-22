import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
//import { addMessage } from '../slices/chatSlice';
import { addMessage } from '../slices/chatSlice'; 



const Chat = ({ roomId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io('http://localhost:3000');
  const dispatch = useDispatch(); // Redux dispatch

  useEffect(() => {
    socket.on(`room ${roomId}`, (message) => {
      // Handle incoming messages and dispatch to Redux
      setMessages((prevMessages) => [...prevMessages, message]);
      dispatch(addMessage({ chatId: roomId, message }));
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    // Emit event to send message to server
    socket.emit('message', { roomId, userId, message });

    // Update local state with new message
    setMessages((prevMessages) => [...prevMessages, { user: userId, message }]);
    
    // Clear input field
    setMessage('');
  };

  return (
    <View>
      <Text>Chat with Submitter</Text>
      <View>
        {messages.map((message, index) => (
          <Text key={index}>{message.user}: {message.message}</Text>
        ))}
      </View>
      <TextInput
        placeholder="Type your message here"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Chat;
