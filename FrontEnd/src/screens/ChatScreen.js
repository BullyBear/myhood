import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Chat from '../components/Chat';

const ChatScreen = ({ route }) => {
  // Uncomment the below line if you want to use the params
  // const { toyId, userId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>ChatRoom</Text>
      </View>

      {/* Uncomment the below line if you want to render the Chat component */}
      {/*<Chat roomId={toyId} userId={userId} />*/}

      <View style={styles.footer}>
        <TextInput style={styles.input} placeholder="Type a message..."/>
        <TouchableOpacity style={styles.sendButton}>
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
  header: {
    backgroundColor: '#007BFF',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
  },
});

export default ChatScreen;
