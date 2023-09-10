import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { S3Client, BUCKET_NAME, region, API_URL } from '../../config.js';
import { getToysWithinRadius, getAllToys, createToy, updateToy, deleteToy } from '../API/toyAPI';
import { fetchToysFromAPI, deleteToyInAPI, updateToyInAPI } from '../slices/toySlice';


export default function Toy() {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  //const [toys, setToys] = useState([]);
  const { toys = [], loading, error } = useSelector((state) => state.toy);
  //const { toys = [], loading, error } = useSelector((state) => state.toy.toys);
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [isCreatingToy, setIsCreatingToy] = useState(false);
  const [toyId, setToyId] = useState(null);



  useEffect(() => {
    const fetchToys = async () => {
      try {
        const response = await fetch(`${API_URL}/toys?user_id=${user.id}`);
        const data = await response.json();
        // Assuming each toy has fields image_url_one, image_url_two, etc.
        if (data.toys && data.toys.length > 0) {
          const toyImages = [
            data.toys[0].image_url_one,
            data.toys[0].image_url_two,
            data.toys[0].image_url_three,
            data.toys[0].image_url_four,
            data.toys[0].image_url_five
          ].filter(Boolean); // remove null or undefined values
          setImages(toyImages);
          setToyId(data.toys[0].id);
        }
      } catch (error) {
        console.error("Error fetching toys:", error);
      }
    };
  
    fetchToys();

  }, [user]);

//   useEffect(() => {
//     dispatch(fetchToysFromAPI()); // Assuming this action fetches all toys for a user
// }, [user, dispatch]);

  

  const onSubmit = async () => {
    if (images.length === 0 || !user || !user.id) {
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setIsCreatingToy(true);

    let imageUrls = [];
    for (const image of images) {
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

      const s3UploadPromise = new Promise((resolve, reject) => {
        S3Client.putObject(uploadParams, function (err, data) {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        });
      });

      await s3UploadPromise;
      const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${destinationFileKey}`;
      imageUrls.push(imageUrl);
    }

    const toyData = {
      image_urls: imageUrls,
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
      setImages([]);
      setIsCreatingToy(false);
      navigation.navigate('NavigationPage');
      dispatch(fetchToysFromAPI());
    } else {
      setIsCreatingToy(false);
    }
  };


  const removeImage = async (uri) => {
    const updatedImages = images.filter((image) => image !== uri);
    setImages(updatedImages);
  
    if (toyId === null) {
      console.error('Toy ID is not set.');
      return;
    }
  
    // Call your API update method
    const toyData = { image_urls: updatedImages, user_id: user.id };
    try {
      await dispatch(updateToyInAPI({ toyId, toyData })); // Using Redux dispatch to update
    } catch (error) {
      console.error('Failed to update toy:', error);
    }
  };
  
  


  const pickImage = async () => {
    if (images.length >= 5) {
      alert('You can only upload up to 5 images.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
  

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

    const onDelete = async (toyId) => {
    try {
      // Dispatching the action to delete the toy
      await dispatch(deleteToyInAPI(toyId));
      // Fetch toys again after deleting, if you want to.
      dispatch(fetchToysFromAPI());
    } catch (error) {
      console.error('Error deleting toy:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{`Selected ${images.length} out of 5 images`}</Text>
      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(item)}>
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {isCreatingToy && <ActivityIndicator size="large" color="#0000ff" />}


      <TouchableOpacity
      style={[styles.button, images.length === 0 && styles.buttonDisabled]}
      onPress={() => onDelete()} 
      disabled={images.length === 0 || isCreatingToy}
    >
      <Text style={styles.buttonText}>Delete Toy</Text>
    </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, images.length === 0 && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={images.length === 0 || isCreatingToy}
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
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
  });