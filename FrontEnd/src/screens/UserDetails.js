import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function UserDetails({ route, navigation }) {
  const { user } = route.params;

  const onChatPressed = () => {
    // Navigate to the ChatScreen with the user details
  };

  return (
    <View>
      <Image source={{ uri: user.image_url }} style={{ width: 200, height: 200 }} />
      <Text>{user.name}</Text>
      <Text>{user.description}</Text>
      <TouchableOpacity onPress={onChatPressed}>
        <Text>Chat</Text>
      </TouchableOpacity>
    </View>
  );
}
