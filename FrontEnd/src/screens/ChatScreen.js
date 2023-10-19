import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Chat from '../components/Chat';

const ChatScreen = ({ route }) => {
  const { roomId, userId } = route.params;

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>ChatRoom</Text>
      </View>


      <Chat roomId={roomId} userId={userId} style={styles.chatContainer} />


      {/* <View style={styles.footer}>
        <TextInput style={styles.input} placeholder="Type a message..."/>
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View> */}

<TouchableOpacity 
        style={{ marginTop: 50 }} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.boldButtonText}>Go Back</Text>
      </TouchableOpacity>

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6BCD9B',
    flexDirection: 'column',
  },
  chatContainer: {
    flex: 4,
  },
  header: {
    backgroundColor: '#007BFF',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: '#f2f2f7',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
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
  boldButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
    alignSelf: 'center',
    width: 120,
    marginBottom: 50
  },
});



export default ChatScreen;
