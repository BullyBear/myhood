import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { loginUser, loginUserSuccess, loginUserFailure } from '../slices/userSlice';


const validationSchema = yup.object().shape({
  email: yup.string().email().required('Email is a required field.'),
  password: yup.string().required('Password is a required field.'),
});

const LoginScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const userFromStore = useSelector((state) => state.user.user);

  // const navigation = useNavigation();


 


  const onSubmit = async (values) => {
    console.log('Submitting login with values:', values); 
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const resultAction = await dispatch(loginUser(values));
      setIsLoading(false);
      
      // Check the result of dispatched action
      if (resultAction.type === loginUserSuccess.type) {
        navigation.navigate('FrontPage', { name: resultAction.payload.user.name });
      } else if (resultAction.type === loginUserFailure.type) {
        setError('Login failed.');
      }
      

    } catch (err) {
      console.error('Login error:', err.message); 
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
};


return (
  
  <View style={styles.container}>
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}> 
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
          {error && <Text style={styles.errorText}>{error}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit} 
            disabled={isLoading}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {isLoading ? 'Loading...' : 'Submit'}
            </Text>
          </TouchableOpacity>
  
        </View>

      )}
    </Formik>
    <View style={{ marginTop: 200 }}> 




{/* <Button color="blue" title="Forgot Password?" onPress={() => navigation.navigate('AuthNavigator', { screen: 'ForgotPasswordScreen' })} /> */}



    {/* <Button 
      title="Forgot Password?" 
      onPress={() => {
        navigation.navigate('ForgotPasswordScreen');
        console.log("Navigating to ForgotPasswordScreen");
      }} 
      color="blue"
    />


    <Button 
      title="Invite User" 
      onPress={() => {
        navigation.navigate('InviteUserScreen');
        console.log("Navigating to InviteUserScreen");
      }} 
      color="blue"
    /> */}



          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
              <Text style={styles.boldButtonText}>Go Back</Text>
          </TouchableOpacity>


    </View>
  </View>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // To align items to the center similar to LandingPage
    padding: 16,
    backgroundColor: '#6BCD9B', // Setting the same background color
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',  // This will center the child items horizontally
},

input: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 15,
  paddingHorizontal: 10,
  fontFamily: 'Roboto-Regular',
  width: '100%',
  borderRadius: 8,  // Add this line to round the corners
},

  errorText: {
    color: 'red',
    fontFamily: 'Roboto-Regular', // Using the same font family
  },
  successText: {
    color: 'green',
    fontFamily: 'Roboto-Regular', // Using the same font family
  },
  labelText: { 
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',  // Added this line to make it bold
  },
  
  submitButtonContainer: {
    width: '100%',
    padding: 15, 
    alignItems: 'center',
},

submitButton: {
    width: '85%',  // Reduce the width for a smaller button
    height: 45,    // Reduce the height for a smaller button
    backgroundColor: '#CD6B7D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 150
},
boldButtonText: {
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
  backgroundColor: '#333', // Dark background for contrast
  color: '#fff', // White text
  padding: 10, // Padding for a larger touch target and better look
  borderRadius: 5, // Rounded corners
  marginTop: 50,
  marginBottom: -25, // Give it some space from the list items
  alignSelf: 'center', // Center the button horizontally
  width: 120, // Set a fixed width
},




});



export default LoginScreen;