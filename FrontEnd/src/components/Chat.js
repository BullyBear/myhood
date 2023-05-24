import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { API_URL } from '../config';

const socket = io(API_URL);

export default function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.on(`room ${roomId}`, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off(`room ${roomId}`);
    };
  }, [roomId]);

  const onSendMessage = () => {
    socket.emit('chat message', { roomId, message: messageInput });
    setMessageInput('');
  };

  return (
    <View>
      {messages.map((message, index) => (
        <View key={index}>
          <Text>{message.sender}: {message.message}</Text>
        </View>
      ))}
      <TextInput value={messageInput} onChangeText={setMessageInput} />
      <TouchableOpacity onPress={onSendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
