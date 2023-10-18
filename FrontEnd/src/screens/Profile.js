import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUserDataAction, updateUser } from '../slices/userSlice';
import { S3Client, BUCKET_NAME_TWO } from '../../config.js'; 



const validationSchema = yup.object().shape({
  bio: yup.string()
});


const Profile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.user.user); // Access user data from the redux store
  console.log("User data in Profile:", user);
  //const navigation = useNavigation(); // Initialize navigation


useEffect(() => {
  // Fetch initial user data if not present
  if (!user || !user.id) {
    dispatch(fetchUserDataAction());
  } else {
    // Update local state for profile_picture from Redux store
    if (user.profile_picture) {
      setImage(user.profile_picture);
    }
  }
}, [user, dispatch]); 



const handleUpdate = async (values) => {
  setIsLoading(true); // Set loading state
  const updatedData = {
    bio: values.bio,
    profile_picture: image || user.profile_picture,
    user_id: user.id
  };
  
  try {
    await dispatch(updateUser(updatedData));
    setIsLoading(false); // Reset loading state
    navigation.navigate('NavigationPage'); // Navigate to another page upon success
  } catch (error) {
    setIsLoading(false); // Reset loading state
    console.error("Error updating user:", error);
  }
};

  const handleImagePick = async () => {
    try {
      let imgResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!imgResult.cancelled) {
        const response = await fetch(imgResult.uri);
        const blob = await response.blob();
        const uniqueFileName = `${uuidv4()}.jpg`;
        const destinationFileKey = `images/${uniqueFileName}`;
  
        const uploadParams = {
          Bucket: BUCKET_NAME_TWO,
          Key: destinationFileKey,
          Body: blob,
          ContentType: 'image/jpeg',
        };
  
        const s3UploadPromise = new Promise((resolve, reject) => {
          S3Client.putObject(uploadParams, function(err, data) {
            if (err) {
              reject(err);
              return;
            }
            resolve(data);
          });
        });
        await s3UploadPromise;
        const imageUrl = `https://${BUCKET_NAME_TWO}.s3.amazonaws.com/${destinationFileKey}`;
        setImage(imageUrl);
      }
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {user ? (
      <Formik
        initialValues={{ bio: user.bio }} // Use user's current bio from redux store
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text>Bio</Text>
            <TextInput
              name="bio"
              onChangeText={handleChange('bio')}
              onBlur={handleBlur('bio')}
              value={values.bio}
              style={styles.input}
              multiline
            />
            {touched.bio && errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}

            <Button title="Change Image" onPress={handleImagePick} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}
            {/* Show the user's current image if no new image is picked */}
            {!image && user.profile_picture && <Image source={{ uri: user.profile_picture }} style={{ width: 200, height: 200, marginTop: 10 }} />}

            <Button title="Save Changes" onPress={handleSubmit} />
          </View>
          )}
        </Formik>
            ) : (
              <Text>Loading user data...</Text>
            )}


          <TouchableOpacity 
            style={{ marginTop: 50 }} 
            onPress={() => navigation.goBack()}
            >
          <Text style={styles.boldButtonText}>Go Back</Text>
          </TouchableOpacity>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#6BCD9B',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
  },
  successText: {
    color: 'green',
  },
  boldButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333', // Dark background for contrast
    color: '#fff', // White text
    padding: 10, // Padding for a larger touch target and better look
    borderRadius: 5, // Rounded corners
    marginTop: 300, // Give it some space from the list items
    alignSelf: 'center', // Center the button horizontally
    width: 120, // Set a fixed width
  },




});



export default Profile;