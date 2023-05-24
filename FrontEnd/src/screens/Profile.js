import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function Profile() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const onSubmit = () => {
    // Upload the image and description to your backend
  };

  return (
    <View>
      <TouchableOpacity onPress={() => {/* Pick an image */}}>
        <Text>Upload Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      <TextInput
        placeholder="Enter a description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity onPress={onSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
