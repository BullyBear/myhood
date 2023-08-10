import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView  } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, BUCKET_NAME_TWO } from '../../config.js'; 


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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [image, setImage] = useState(null);


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
        setImage(imageUrl);
      }
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };



  const handleRegister = async (values) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const location = await getLocation();
      values.user_latitude = location.coords.latitude;
      values.user_longitude = location.coords.longitude;
      values.profile_picture = image;
      console.log("Registration data being sent:", values);

      const response = await fetch('http://192.168.1.146:8000/register', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      console.log("Response received:", response);
      const responseBody = await response.json();
      console.log("Response body:", responseBody);

      if (response.ok) {
        setSuccessMessage('Registration successful! You can now login.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{ name: '', email: '', password: '', bio: '' }}
        onSubmit={handleRegister}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text>Name</Text>
            <TextInput
              name="name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              style={styles.input}
            />
            {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text>Email</Text>
            <TextInput
              name="email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text>Password</Text>
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

            <Text>Bio</Text>
            <TextInput
              name="bio"
              onChangeText={handleChange('bio')}
              onBlur={handleBlur('bio')}
              value={values.bio}
              style={styles.input}
              multiline
            />

            <Button title="Pick an image" onPress={handleImagePick} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}

            {error && <Text style={styles.errorText}>{error}</Text>}
            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

            <Button title={isLoading ? 'Loading...' : 'Register'} onPress={handleSubmit} disabled={isLoading} />
            <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 16,
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
});

export default RegistrationScreen;
