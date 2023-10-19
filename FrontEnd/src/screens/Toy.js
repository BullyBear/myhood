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
import { MaterialIcons } from '@expo/vector-icons';

import { S3Client, BUCKET_NAME, region, API_URL } from '../../config.js';
import { getToysWithinRadius, getAllToys, createToy, updateToy, deleteToy } from '../API/toyAPI';
import { fetchToysFromAPI, deleteToyInAPI, updateToyInAPI } from '../slices/toySlice';


export default function Toy() {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  //const [toys, setToys] = useState([]);
 
  //const { toys, loading, error } = useSelector((state) => state.toy);
 // const { toys = [], loading, error } = useSelector((state) => state.toy);
  //const { toys = [], loading, error } = useSelector((state) => state.toy.toys); 

  
  const toys = useSelector((state) => state.toy.toys || []);
  const loading = useSelector((state) => state.toy.loading);
  const error = useSelector((state) => state.toy.error);


  


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

  setIsCreatingToy(true); // <- Set to true here

  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setIsCreatingToy(false); // <- Set to false if we can't get permissions
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

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
      navigation.navigate('NavigationPage');
      dispatch(fetchToysFromAPI());
    }
  } catch (error) {
    console.error('Error during toy submission:', error);
  } finally {
    setIsCreatingToy(false); // <- Set to false in the finally block to ensure it's called in any case
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
      console.log("deletetoyinapi dispatched");
      // Fetch toys again after deleting, if you want to.
      dispatch(fetchToysFromAPI());
      navigation.navigate('NavigationPage');
    } catch (error) {
      console.error('Error deleting toy:', error);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>{`Selected ${images.length} out of 5 images`}</Text>

      {/* Render the first row of images */}
      <FlatList
        data={images.length > 4 ? images.slice(0, 4) : images}
        keyExtractor={(item, index) => item}
        numColumns={2}
        renderItem={({ item, index }) => (
            <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity onPress={() => removeImage(item)}>
                    <Text>Remove</Text>
                </TouchableOpacity>
            </View>
        )}
      />


      {images.length === 5 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: images[4] }} style={styles.image} />
                <TouchableOpacity onPress={() => removeImage(images[4])}>
                    <Text>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
      )}
      
      


      {isCreatingToy && <ActivityIndicator size="large" color="#0000ff" />}

      <TouchableOpacity style={[styles.uploadButton, styles.pushedDown]} onPress={pickImage}>
        <MaterialIcons name="add-a-photo" size={24} color="white" />
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>


    <TouchableOpacity
      style={[styles.buttonWithIcon, images.length === 0 && styles.buttonDisabled]}
      onPress={onSubmit}
      disabled={images.length === 0 || isCreatingToy}
    >
      <MaterialIcons name="save" size={24} color="white" />
      <Text style={styles.buttonTextWithIcon}>Submit</Text>
    </TouchableOpacity>



    <TouchableOpacity
      style={[styles.deleteButton, images.length === 0 && styles.buttonDisabled]}
      onPress={() => onDelete(toyId)} 
      disabled={images.length === 0 || isCreatingToy}
    >
      <MaterialIcons name="delete" size={24} color="white" />
      <Text style={styles.deleteButtonText}>Delete Toy</Text>
    </TouchableOpacity>



    <TouchableOpacity 
      style={styles.goBackButton} 
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.goBackText}>Go Back</Text>
    </TouchableOpacity>

    </View>
  );
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
      backgroundColor: '#6BCD9B',
    },
    imageContainer: {
      flexDirection: 'column',  // Change to column direction
      margin: 10,               // Add some margin to separate the images in the grid
      alignItems: 'center',     // Center align for image and remove button
    },
    removeButton: {
      marginTop: 5,            // Add some top margin to separate the remove button from image
    },
    boldText: {
      fontWeight: 'bold',
    },
    
    image: {
      width: 150,              // Increase width to make the image larger in the grid
      height: 150,             // Increase height to keep aspect ratio 1:1
      borderRadius: 10,        // Add some rounded corners for better aesthetics
    },
    flatListContent: {
      padding: 10,             // Add some padding for the FlatList content
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
    boldButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
      backgroundColor: '#333', // Dark background for contrast
      color: '#fff', // White text
      padding: 10, // Padding for a larger touch target and better look
      borderRadius: 5, // Rounded corners
      //marginTop: 300, // Give it some space from the list items
      alignSelf: 'center', // Center the button horizontally
      width: 120, // Set a fixed width
    },
  oddList: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lastOddImage: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 100,   // This width should match the width of your image
    height: 100,  // This height can be the same as your image height, or can be smaller if you only want a horizontal spacer
    marginVertical: 10,  // Same margin as your image
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Green color for upload
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,   // <-- Add this line
  },
  pushedDown: {
    marginTop: 50, // or whatever value you need
},

  uploadButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  buttonWithIcon: {
    flexDirection: 'row',
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextWithIcon: {
    color: '#fff',
    marginLeft: 10,
  },
  
  
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336', // Red for destructive actions
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  goBackButton: {
    marginTop: 50,
  },
  goBackText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    width: 120,
  },

  

  });