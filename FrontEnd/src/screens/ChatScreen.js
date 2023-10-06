import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Chat from '../components/Chat';

const ChatScreen = ({ route }) => {
  const { roomId, userId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>ChatRoom</Text>
      </View>


      <Chat roomId={roomId} userId={userId} />

      {/* <View style={styles.footer}>
        <TextInput style={styles.input} placeholder="Type a message..."/>
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View> */}

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007BFF',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,  // for Android
    shadowOpacity: 0.3, // for iOS
    shadowRadius: 2,    // for iOS
    shadowOffset: { height: 2, width: 0 },  // for iOS
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  text: {
    color: '#fff',
    fontSize: 22,  // slightly larger for prominence
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 45,  // slightly taller for better touch targets
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 25,  // larger radius for rounder corners
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: '#f2f2f7',  // a light gray background
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,  // more horizontal padding for better appearance
    borderRadius: 25,
    elevation: 2,  // for Android
    shadowOpacity: 0.2, // for iOS
    shadowRadius: 1.5,  // for iOS
    shadowOffset: { height: 1, width: 0 },  // for iOS
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,  // made slightly larger
    fontWeight: '500',  // made slightly less bold for a more modern look
  },
});


export default ChatScreen;
