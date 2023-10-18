import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
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
        <View style={{ width: '80%' }}> 
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
          <View style={styles.submitButtonContainer}>
          <Button 
            title={isLoading ? 'Loading...' : 'Submit'} 
            onPress={handleSubmit} 
            disabled={isLoading} 
            color="white"
          />
        </View>   
        </View>

      )}
    </Formik>
    <View style={{ marginTop: 200 }}> 
    <Button 
      title="Forgot Password?" 
      onPress={() => navigation.navigate('ForgotPassword')} 
      color="blue"
    />
    <Button 
      title="Invite User" 
      onPress={() => navigation.navigate('InviteUser')} 
      color="blue"
    />
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

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontFamily: 'Roboto-Regular', // Using the same font family
    width: '100%', // Optionally, you can set this to make sure the inputs stretch to full width
  },
  errorText: {
    color: 'red',
    fontFamily: 'Roboto-Regular', // Using the same font family
  },
  successText: {
    color: 'green',
    fontFamily: 'Roboto-Regular', // Using the same font family
  },
  labelText: { // For labels such as "Email" and "Password"
    fontFamily: 'Roboto-Regular', // Using the same font family
    fontSize: 24, // Size taken from subtitle of LandingPage
    color: 'black', // Color taken from title of LandingPage
    marginBottom: 10, // Some spacing before the input
  },
  submitButtonContainer: {
    marginTop: 125, // Adjust this value as needed
  },


});



export default LoginScreen;