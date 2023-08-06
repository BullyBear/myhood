import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location'; 

import { S3Client, BUCKET_NAME, region } from '../../config.js';
import { createToy } from '../API/toyAPI';

export default function Toy() {
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.user);

  const onSubmit = async () => {
    if (!image || !user || !user.id) {
      return;
    }

    // Request the user's location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const uniqueFileName = `${uuidv4()}.jpg`;
    const destinationFileKey = `images/${uniqueFileName}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
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
      const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${destinationFileKey}`;

      const toyData = {
        image_url: imageUrl,
        user_id: user.id,
        user_latitude: latitude,
        user_longitude: longitude,
      };

      const response = await fetch('http://127.0.0.1:8000/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toyData),
      });

      if (response.ok) {
        // Toy successfully created, do something
        setImage(null);
      } else {
        // Handle error if needed
        console.error('Failed to create toy:', response.status);
      }
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
});
