import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, bucketName, region } from '../../config.js';
import { createToy } from '../API/toyAPI';

export default function Toy() {
  const [image, setImage] = useState(null);
  const [user_id, setUser_id] = useState('');
  const { user } = useSelector((state) => state.user);

  const onSubmit = async () => {
    if (!image || !user || !user.user_id) {
      return;
    }

    const uniqueFileName = `${uuidv4()}.jpg`;
    const destinationFileKey = `images/${uniqueFileName}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: destinationFileKey,
      Body: image,
      ContentType: 'image/jpeg',
    };

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

      const createdToy = await createToy({ image_url: imageUrl, user_id });
      console.log('Toy created:', createdToy);

      setImage(null);
      setUser_id('');
    } catch (error) {
      console.error('Error creating toy:', error);
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TextInput
        placeholder="User ID"
        value={user_id}
        onChangeText={setUser_id}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#008CBA', // replace with desired color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff', // replace with desired color
    textAlign: 'center',
  },
  image: {
    width: 100, 
    height: 100, 
    marginVertical: 10
  },
  input: {
    borderWidth: 1, 
    padding: 5, 
    marginVertical: 10,
    width: '80%',
    textAlign: 'center'
  },
});
