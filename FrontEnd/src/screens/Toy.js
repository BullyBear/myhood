import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { S3Client, BUCKET_NAME, region } from '../../config.js';
import { createToy, updateToy, deleteToy } from '../API/toyAPI';
import { toyAdded, toyUpdated, toyDeleted } from '../slices/toySlice';

export default function Toy({ toyId }) {
  const [toy, setToy] = useState(null); 
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.user);
  const toys = useSelector((state) => state.toys);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if(toyId) {
      const toyData = toys.find(t => t.id === toyId);
      setToy(toyData);
      if(toyData) setImage(toyData.image_url);
    }
  }, [toyId, toys]);

  const onSubmit = async () => {
    if (!image || !user || !user.id) {
      return;
    }

    let location = await requestUserLocation();

    if (!location) return;

    const { latitude, longitude } = location.coords;

    const imageUrl = await uploadImageToS3(image);

    if (!imageUrl) return;

    const toyData = {
      image_url: imageUrl,
      user_id: user.id,
      user_latitude: latitude,
      user_longitude: longitude,
    };

    let response;
    if(toy) {
      response = await updateToy(toy.id, toyData);
      if(response) {
        dispatch(toyUpdated(response));
      }
    } else {
      response = await createToy(toyData);
      if(response) {
        dispatch(toyAdded(response));
      }
    }

    if(response) navigation.navigate('NavigationPage');
  };

  const onDelete = async () => {
    if(!toy) return;

    const response = await deleteToy(toy.id);
    if(response) {
      dispatch(toyDeleted(toy.id));
      navigation.navigate('NavigationPage');
    }
  };

  const pickImage = async () => {
    const result = await requestImageFromLibrary();

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
        <Text style={styles.buttonText}>{toy ? "Update" : "Submit"}</Text>
      </TouchableOpacity>
      {toy && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF0000' }]} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const requestUserLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }
  return await Location.getCurrentPositionAsync({});
}

const uploadImageToS3 = async (image) => {
  const response = await fetch(image);
  const blob = await response.blob();
  const uniqueFileName = `${uuidv4()}.jpg`;
  const destinationFileKey = `images/${uniqueFileName}`;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: destinationFileKey,
    Body: blob,
    ContentType: 'image/jpeg',
  };

  try {
    await new Promise((resolve, reject) => {
      S3Client.putObject(uploadParams, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${destinationFileKey}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

const requestImageFromLibrary = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return { cancelled: true };
  }
  return await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
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
