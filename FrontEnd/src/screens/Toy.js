import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { S3Client, BUCKET_NAME, region, API_URL } from '../../config.js';

import {
  getToysWithinRadius,
  getAllToys,
  createToy,
  updateToy,
  deleteToy,
} from '../API/toyAPI';


export default function Toy() {
  const [image, setImage] = useState(null);
  const [toys, setToys] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [isCreatingToy, setIsCreatingToy] = useState(false);

  console.log("[Toy Component] - Rendered with", { image, user });

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const response = await fetch(`${API_URL}/toys`);
        const data = await response.json();
        setToys(data);
      } catch (error) {
        console.error("Error fetching toys:", error);
      }
    };

    fetchToys();
  }, []);

  const onSubmit = async () => {
    if (!image || !user || !user.id) {
      console.log("[onSubmit] - Missing data. Exiting...");
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

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

    setIsCreatingToy(true);

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

      const response = await fetch(`${API_URL}/toys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toyData),
      });

      if (response.ok) {
        setImage(null);
        setIsCreatingToy(false);
        navigation.navigate('NavigationPage');
      } else {
        console.error('[onSubmit] - Failed to create toy:', response.status);
      }
    } catch (error) {
      console.error('[onSubmit] - Error creating toy:', error);
      setIsCreatingToy(false);
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
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {isCreatingToy && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}
      {toys && toys.toys && toys.toys.length > 0 && user ? (
        toys.toys
          .filter(toy => toy.user_id === user.id)
          .map(toy => (
            <View key={toy.id} style={styles.toyItem}>
              <Image source={{ uri: toy.image_url }} style={styles.toyImage} />
            </View>
          ))
      ) : (
        <Text>No toys available.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        disabled={isCreatingToy}
      >
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
    marginVertical: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  toyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  toyImage: {
    width: 250,
    height: 250,
    marginRight: 10,
    borderRadius: 25,
  },
});
