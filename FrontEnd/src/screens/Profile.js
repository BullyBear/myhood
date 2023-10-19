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
    <ScrollView style={styles.background} contentContainerStyle={styles.container}>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {user ? (
        <Formik
            initialValues={{ bio: user.bio }}
            onSubmit={handleUpdate}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>

      <View style={styles.bioContainer}>
          <Text style={styles.changeBioText}>Edit Bio</Text>

          <TextInput
              name="bio"
              onChangeText={handleChange('bio')}
              onBlur={handleBlur('bio')}
              value={values.bio}
              style={styles.input}
              multiline
          />
          {touched.bio && errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
      </View>

    {/* Modified the button here */}
    <TouchableOpacity style={styles.changeImageButton} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Select Image</Text>
    </TouchableOpacity>

    {image && <Image source={{ uri: image }} style={styles.image} />}
    {!image && user.profile_picture && <Image source={{ uri: user.profile_picture }} style={styles.image} />}

    <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
    <Text style={styles.buttonText}>Save Changes</Text>
    </TouchableOpacity>

    </View>
            )}
        </Formik>
        ) : (
            <Text>Loading user data...</Text>
        )}

        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.boldButtonText}>Go Back</Text>
        </TouchableOpacity>
    </ScrollView>
);
};



const styles = StyleSheet.create({
  background: {
      flex: 1,
      backgroundColor: '#6BCD9B',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingHorizontal: 10,
    marginTop: 50
},
formContainer: {
  alignItems: 'stretch', // Change from 'center' to 'stretch'.
  width: '100%',
  //marginTop: -100
},

input: {
  width: '90%',
  height: 80,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 15,
  paddingHorizontal: 10,
  alignSelf: 'center' 
},
changeImageButton: {
  marginTop: 40,
  backgroundColor: '#333',
  padding: 10,
  borderRadius: 5,
  alignSelf: 'center',
  width: 150, // Adjust this to the width you prefer
  alignItems: 'center' // This ensures the text inside the button is centered
},
saveChangesButton: {
  marginTop: 50, // Add space between the image and the button
  backgroundColor: 'blue',
  padding: 10,
  borderRadius: 5,
  alignSelf: 'center',
  width: 150, // Adjust this to the width you prefer
  alignItems: 'center' // This ensures the text inside the button is centered
},


buttonText: {
  color: '#fff',
  fontSize: 16
},

image: {
  width: 300,
  height: 300,
  marginTop: 20,
  marginBottom: 50,
  borderRadius: 10,
  alignSelf: 'center',  
},
  errorText: {
      color: 'red',
  },
  goBackButton: {
      marginTop: 100,
      alignSelf: 'center',
      borderRadius: 5,
      padding: 10
  },
  boldButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: '#333',
      color: '#fff',
      padding: 10,
      borderRadius: 5,
      width: 120,
      textAlign: 'center',
  },
  bioContainer: {
    marginTop: -40, 
},
changeBioText: {
  fontWeight: 'bold',
  fontSize: 16,
  alignSelf: 'center', // This will center the text horizontally
  marginBottom: 10, // Space between the text and the input box
}


});



export default Profile;