import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function UserDetails({ route }) {

  // const { profile_picture } = route.params.user;
  // const name = useSelector((state) => state.user.user.name);
  // const bio = useSelector(state => state.user.user.bio);

  const { user } = route.params;


  const navigation = useNavigation();

  const onChatPressed = () => {
    navigation.navigate('ChatScreen');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profile_picture }} style={styles.image} />
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>{user.bio}</Text>
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