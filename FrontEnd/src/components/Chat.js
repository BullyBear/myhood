import React, { useState, useEffect, useRef } from 'react';
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

  // Uncomment line below and comment two below it if need to go back
  //const [messages, setMessages] = useState([]);
  const chat = useSelector(state => state.chat.chats.find(chat => chat.id === roomId));
  const messages = chat ? chat.messages : [];

  const scrollViewRef = useRef();


  const [usersInChat, setUsersInChat] = useState([]);

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
        //uncomment line below and comment line below it to go back
        //setMessages(prevMessages => [...prevMessages, data]);
        dispatch(addMessage({ chatId: roomId, message: data }));

    })
    .catch(error => {
        console.error('Error saving the message:', error);
    });

    setMessage('');
  };

  useEffect(() => {
    fetch(`${API_URL}/chat-messages/${roomId}`)
    .then(response => response.json())
    //uncomment lines below and comment lines below it to go back
    // .then(data => {
    //     setMessages(data);
    // })
    .then(data => {
      data.forEach(msg => {
          dispatch(addMessage({ chatId: roomId, message: msg }));
      });
  })
  
    .catch(error => {
        console.error('Error fetching past messages:', error);
    });
  }, [roomId]);

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -300}
        style={{flex: 1}}
    >

        <View style={styles.container}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messageContainer}>

                {messages.map((message, index) => {
                    const isSender = userId === message.user;
                    return (
                        <View 
                            key={index} 
                            style={isSender ? styles.senderMessage : styles.receiverMessage}
                        >
                            <View style={isSender ? styles.senderBubble : styles.receiverBubble}>
                                <Text style={isSender ? styles.senderText : styles.receiverText}>
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
    //paddingBottom: 50,
    paddingTop: 10,
    backgroundColor: '#6BCD9B',  // Set the background color
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
  minWidth: '20%',  // Minimum width
  maxWidth: '80%',  // Maximum width
  alignSelf: 'flex-end'
},

receiverBubble: {
  padding: 10,
  backgroundColor: '#E1E1E1',
  borderRadius: 20,
  borderBottomLeftRadius: 0,
  minWidth: '20%',  // Minimum width
  maxWidth: '80%',  // Maximum width
  alignSelf: 'flex-start'
},


receiverText: {
  color: '#000',
  flexWrap: 'wrap',   // Wrap the text
},

senderText: {
  color: '#fff',
  flexWrap: 'wrap',   // Wrap the text
},





});


export default Chat;
