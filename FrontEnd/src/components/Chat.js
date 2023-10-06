import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import { addMessage } from '../slices/chatSlice';
import { API_URL } from '../../config';

const Chat = ({ roomId, userId }) => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [usersInChat, setUsersInChat] = useState([]);

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
    socket.emit('message', { roomId, userId, message });
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
    })
    .catch(error => {
        console.error('Error saving the message:', error);
    });

    setMessage('');
  };

  useEffect(() => {
    fetch(`${API_URL}/chat-messages/${roomId}`)
    .then(response => response.json())
    .then(data => {
        setMessages(data);
    })
    .catch(error => {
        console.error('Error fetching past messages:', error);
    });
  }, [roomId]);

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{flex: 1}}
    >
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.messageContainer}>
                {messages.map((message, index) => {
                    const isSender = userId === message.user;
                    return (
                        <View 
                            key={index} 
                            style={isSender ? styles.senderMessage : styles.receiverMessage}
                        >
                            <View style={isSender ? styles.senderBubble : styles.receiverBubble}>
                                <Text style={isSender ? styles.senderText : styles.messageText}>
                                    {message.message}
                                </Text>
                            </View>
                        </View>
                    );
                })}
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
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 50,
    paddingTop: 10,
  },
  input: {
    flex: 5.5,  
    backgroundColor: '#fff',
    borderRadius: 7,
    paddingHorizontal: 15,
    marginRight: 5,

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
  senderMessage: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  receiverMessage: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  senderBubble: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    borderBottomRightRadius: 0,
    maxWidth: '70%',
  },
  receiverBubble: {
    padding: 10,
    backgroundColor: '#E1E1E1',
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    maxWidth: '70%',
  },
  messageText: {
    color: '#000',
  },
  senderText: {
    color: '#fff',
  },
});

export default Chat;
