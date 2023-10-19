import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity  } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, BUCKET_NAME_TWO } from '../../config.js';
import { useDispatch, useSelector } from 'react-redux';
//import { registerUser, registerUserRequest, registerUserSuccess, registerUserFailure } from '../slices/userSlice';
import { registerUser, setSuccessMessage, setImageUrl, setError } from '../slices/userSlice';

import * as Notifications from 'expo-notifications';





const getLocation = async () => {
  console.log("Fetching location...");
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  let location = await Location.getCurrentPositionAsync({});
  console.log("Fetched location:", location);
  return location;
};

const pickImage = async () => {
  console.log("Picking image...");
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log("Image picked:", result);
  if (!result.cancelled) {
    return result.uri;
  }
};


const validationSchema = yup.object().shape({
  name: yup.string().required('Name is a required field.'),
  email: yup.string().email().required('Email is a required field.'),
  password: yup.string()
    .required('Password is a required field.')
    .min(8, 'Password must be at least 8 characters long.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
      'Password must have at least one uppercase letter, one lowercase letter, and one number.'
    ),
  bio: yup.string(),
});


const RegistrationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { isLoading, error, successMessage, image } = userState;

  // const [pushToken, setPushToken] = useState(null);


  // useEffect(() => {
  //   // Function to fetch the push token
  //   const fetchPushToken = async () => {
  //     try {
  //       const { status } = await Notifications.getPermissionsAsync();
  //       if (status !== 'granted') {
  //         const { status: newStatus } = await Notifications.requestPermissionsAsync();
  //         if (newStatus !== 'granted') {
  //           console.warn('Failed to get push token for push notification!');
  //           return;
  //         }
  //       }
  //       const tokenData = await Notifications.getExpoPushTokenAsync();
  //       setPushToken(tokenData.data);
  //     } catch (error) {
  //       console.error("Error fetching push token:", error.message);
  //     }
  //   };

  //   fetchPushToken();
  // }, []);


  useEffect(() => {
    // Clear the image when component unmounts
    return () => {
      dispatch(setImageUrl(null));
    };
  }, []);



  const handleImagePick = async () => {
    try {
      const img = await pickImage();
      if (img) {
        const response = await fetch(img);
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
        dispatch(setImageUrl(imageUrl)); 
        //dispatch(setImageUrl(null)); 
        console.log('Image successfully uploaded:', imageUrl);
      }
    } catch (error) {
      console.error("Error picking and uploading image:", error);
      dispatch(setError("Error picking and uploading image"));
    }
  };

  const handleRegister = async (values) => {
    try {
      const location = await getLocation();
      values.user_latitude = location.coords.latitude;
      values.user_longitude = location.coords.longitude;
      values.profile_picture = image;

      //values.push_token = pushToken;
      
      await dispatch(registerUser(values)); 
      dispatch(setImageUrl(null));
      
      // Navigate to LandingPage after successful registration
      navigation.navigate('Landing');
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formWrapper}>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        <Formik
            initialValues={{ name: '', email: '', password: '', bio: '' }}
            onSubmit={handleRegister}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>
                    <Text style={styles.labelText}>Name</Text>
                    <TextInput
                        name="name"
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        style={styles.input}
                    />
                    {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <Text style={styles.labelText}>Email</Text>
                    <TextInput
                        name="email"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        style={styles.input}
                    />
                    {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <Text style={styles.labelText}>Password</Text>
                    <TextInput
                        name="password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                        style={styles.input}
                    />
                    {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <Text style={styles.labelText}>Bio</Text>
                    <TextInput
                        name="bio"
                        onChangeText={handleChange('bio')}
                        onBlur={handleBlur('bio')}
                        value={values.bio}
                        style={styles.input}
                        multiline
                    />

                    <Button title="Pick an image" onPress={handleImagePick} color="blue" />
                    {/*{image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}*/}
                    {image && <Text style={styles.imageSelectedText}>Image Selected!</Text>}


                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
    <Text style={styles.buttonText}>
        {isLoading ? 'Loading...' : 'Register'}
    </Text>
</TouchableOpacity>


                </View>
            )}
        </Formik>
        </View>
        {/*<Button title="Go to Login" onPress={() => navigation.navigate('Login')} color="blue" style={styles.loginButton} />*/}

        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.boldButtonText}>Go Back</Text>
        </TouchableOpacity>

    </ScrollView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',  // Set the main axis direction to column
    justifyContent: 'space-between',  // Push content to the start and end of the container
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 80,
    backgroundColor: '#6BCD9B',
  },
  formWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%', 
    alignItems: 'center',
    marginTop: 40
  },
  
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontFamily: 'Roboto-Regular', // Font family from LoginScreen
    width: '100%',  // Stretching to full width
  },
  errorText: {
    color: 'red',
    fontFamily: 'Roboto-Regular',  // Font family from LoginScreen
  },
  successText: {
    color: 'green',
    fontFamily: 'Roboto-Regular',  // Font family from LoginScreen
  },
  labelText: {  // Optional, if you want to use these styles for labels
    fontFamily: 'Roboto-Regular', 
    fontSize: 24, 
    color: 'black',
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 30,  // Adding a 20-pixel margin to the bottom of the Register button
},
loginButton: {
  marginBottom: 10,  // Adjust the value to your liking
},
imageSelectedText: {
  color: 'black',
  fontFamily: 'Roboto-Regular',
  marginTop: 10,
  textAlign: 'center'
},
submitButton: {
  width: '60%',  // Reduce the width for a smaller button
  height: 40,    // Reduce the height for a smaller button
  backgroundColor: 'blue',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 25,
  marginTop: 125  // Increased margin-top to move the button lower
},


buttonText: {
  fontWeight: 'bold',
  color: 'white',
  fontSize: 18,  // or any other size you prefer
  textAlign: 'center',
  padding: 10,  // or adjust as needed
},

boldButtonText: {
  fontWeight: 'bold',
  color: 'blue',
  fontSize: 18,  // or any other size you prefer
  textAlign: 'center',
  padding: 10,  // or adjust as needed
},

boldButtonText: {
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
  backgroundColor: '#333', // Dark background for contrast
  color: '#fff', // White text
  padding: 10, // Padding for a larger touch target and better look
  borderRadius: 5, // Rounded corners
  marginTop: 150, // Give it some space from the list items
  alignSelf: 'center', // Center the button horizontally
  width: 120, // Set a fixed width
},


});




export default RegistrationScreen;