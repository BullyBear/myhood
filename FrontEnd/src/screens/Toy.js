import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';

import { S3Client, bucketName, region } from '../../config.js';
import { createToy } from '../API/toyAPI';


export default function Toy() {
  const [image, setImage] = useState(null);
  const [user_id, setUser_id] = useState(''); // Add user_id state

  const { user } = useSelector((state) => state.user);

  const onSubmit = async () => {
    if (!image || !user_id) {
      return;
    }

    // Generate a unique file name
    const uniqueFileName = `${uuidv4()}.jpg`;

    // Set the destination file key
    const destinationFileKey = `images/${uniqueFileName}`;

    // Prepare the upload params
    const uploadParams = {
      Bucket: bucketName,
      Key: destinationFileKey,
      Body: image,
      ContentType: 'image/jpeg',
    };

    // Upload the image to S3
    const s3UploadPromise = new Promise((resolve, reject) => {
      S3Client.putObject(uploadParams, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

    try {
      const data = await s3UploadPromise;
      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${destinationFileKey}`;
      console.log('imageUrl', imageUrl)

      // Create toy using the image URL and user_id
      const createdToy = await createToy({ image_url: imageUrl, user_id });
      console.log('Toy created:', createdToy);

      // Reset state and navigate back to the front page or toybox
      setImage(null);
      setUser_id('');
      // navigation.navigate(...)  // navigate back to the front page or toybox
    } catch (error) {
      console.error('Error creating toy:', error);
      // Display error message to the user
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        <Text>Upload Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      <TextInput
        placeholder="User ID"
        value={user_id}
        onChangeText={setUser_id} // Simplified onChangeText
        style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
      />
      <TouchableOpacity onPress={onSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
