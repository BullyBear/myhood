import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import io from 'socket.io-client';
//import { GiftedChat } from 'react-native-gifted-chat';
import { useDispatch, useSelector } from 'react-redux';

import { addMessage } from '../slices/chatSlice';
import { API_URL } from '../../config';


const Chat = ({ roomId, userId }) => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [usersInChat, setUsersInChat] = useState([]);


  //const chat = useSelector(state => state.chat.chats.find(chat => chat.id === roomId));
  //const messages = chat ? chat.messages : [];




  const socket = io(API_URL); 
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit('join', { username: userId, room: roomId });

    return () => {
        socket.emit('leave', { username: userId, room: roomId });
        socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    // Emit event to send message to server
    socket.emit('message', { roomId, userId, message });

    // Save message to the backend
    fetch(`${API_URL}/chat-messages/${roomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId,
            userId,
            message
        })
    })
    .then(response => response.json())
    .then(data => {

        setMessages(prevMessages => [...prevMessages, data]);
        //dispatch(addMessage({ chatId: roomId, message: data }));

    })
    .catch(error => {
        console.error('Error saving the message:', error);
    });

    // Clear input field
    setMessage('');
  };

  useEffect(() => {
    // Fetch past messages when component mounts
    fetch(`${API_URL}/chat-messages/${roomId}`)
    .then(response => {
      if (!response.ok) {
          return response.text().then(text => {
              throw new Error(text);
          });
      }
      return response.json();
  })
    .then(data => {
        setMessages(data);
    })
    // .then(data => {
    //   data.forEach(msg => {
    //       dispatch(addMessage({ chatId: roomId, message: msg }));
    //   });
    // })
    .catch(error => {
        console.error('Error fetching past messages:', error);
    });
  }, [roomId]);




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
