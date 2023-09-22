import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Chat from '../components/Chat';


const ChatScreen = ({ route }) => {
  //const { toyId, userId } = route.params;

  return (
    <View>
      <Text style={styles.text}>ChatRoom</Text>
      {/*<Chat roomId={toyId} userId={userId} />*/}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ChatScreen;
