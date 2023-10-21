import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { resetPassword } from '../slices/userSlice';


const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);
  const [emailSent, setEmailSent] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('Email is a required field.'),
  });

  const handleResetPassword = async (email) => {
    dispatch(resetPassword(email));
  };

  // useEffect(() => {
  //   if (user && !loading) {
  //     navigation.navigate('Login');
  //   }
  // }, [user, loading]);

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        await handleResetPassword(values.email);
        setEmailSent(true);
      }}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>

          <TextInput
            name="email"
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            style={styles.input}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          {loading ? (
            <Button title="Loading..." disabled />
          ) : (
            <>
              <Button title="Reset Password" onPress={handleSubmit} />
              <Button title="Go Back" onPress={() => navigation.navigate('Landing')} />
            </>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {emailSent && <Text style={styles.messageText}>Email sent!</Text>}


{/* 
          <TouchableOpacity style={styles.goBackButtonForgot} onPress={() => navigation.goBack()}>
              <Text style={styles.boldButtonTextForgot}>Go Back</Text>
          </TouchableOpacity> */}

        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6BCD9B',
  },
  input: {
    width: '75%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  messageText: {
    color: 'green',
    marginTop: 10,
  },
  boldButtonTextForgot: {
    fontWeight: 'bold',
    color: 'blue',
    fontSize: 18,  // or any other size you prefer
    textAlign: 'center',
    padding: 10,  // or adjust as needed
    margintop: 100
  },
  
  boldButtonTextForgot: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333', // Dark background for contrast
    color: '#fff', // White text
    padding: 10, // Padding for a larger touch target and better look
    borderRadius: 5, // Rounded corners
    marginTop: -50, // Give it some space from the list items
    alignSelf: 'center', // Center the button horizontally
    width: 120, // Set a fixed width
  },
});

export default ForgotPasswordScreen;
