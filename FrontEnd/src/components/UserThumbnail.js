import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const UserThumbnail = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: user.image_url }} style={{ width: 50, height: 50, marginRight: 10 }} />
        <Text>{user.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserThumbnail;
