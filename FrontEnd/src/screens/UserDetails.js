// UserDetails.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function UserDetails({ route, navigation }) {
  const { user } = route.params;

  const onChatPressed = () => {
    // Navigate to the ChatScreen with the user details
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.image_url }} style={styles.image} />
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>{user.description}</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChatPressed}>
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

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
