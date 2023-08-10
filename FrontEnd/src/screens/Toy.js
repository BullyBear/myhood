import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { S3Client, BUCKET_NAME, region } from '../../config.js';
import { createToy } from '../API/toyAPI';

export default function Toy() {
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  console.log("[Toy Component] - Rendered with", { image, user });

  const onSubmit = async () => {
    console.log("[onSubmit] - Initiated");
    if (!image || !user || !user.id) {
      console.log("[onSubmit] - Missing data. Exiting...");
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

    console.log("[onSubmit] - Got user location:", { latitude, longitude });

    const response = await fetch(image); // Fetching the binary data from local URI
    const blob = await response.blob(); // Convert the response into a blob

    const uniqueFileName = `${uuidv4()}.jpg`;
    const destinationFileKey = `images/${uniqueFileName}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: destinationFileKey,
      Body: blob, // Use the blob data
      ContentType: 'image/jpeg',
    };

    console.log("[onSubmit] - About to POST toy data with image URI:", image);

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

      console.log("[onSubmit] - Image uploaded. Image URL:", imageUrl);

      const toyData = {
        image_url: imageUrl,
        user_id: user.id,
        user_latitude: latitude,
        user_longitude: longitude,
      };

      console.log("[onSubmit] - About to POST toy data:", toyData);

      const response = await fetch('http://192.168.1.146:8000/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toyData),
      });

      console.log("[onSubmit] - Received response from server:", response);

      if (response.ok) {
        console.log("[onSubmit] - Toy creation success");
        setImage(null);
        navigation.navigate('NavigationPage');
      } else {
        console.error('[onSubmit] - Failed to create toy:', response.status);
      }
    } catch (error) {
      console.error('[onSubmit] - Error creating toy:', error);
    }
  };

  const pickImage = async () => {
    console.log("[pickImage] - Initiated");
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
      console.log("[pickImage] - Image selected. URI:", result.uri);
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
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10
  },
});
