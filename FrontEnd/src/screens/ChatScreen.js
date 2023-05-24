import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const ChatScreen = ({ route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { toyId, userId } = route.params;

  // Connect to socket.io server
  const socket = io('http://localhost:3000');

  useEffect(() => {
    // Listen for incoming messages from server
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    // Emit event to join chat room
    socket.emit('join', { toyId, userId });

    // Clean up function to disconnect socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Emit event to send message to server
    socket.emit('message', { toyId, userId, message });

    // Update local state with new message
    setMessages((messages) => [...messages, { user: userId, message }]);
    
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

export default ChatScreen;
