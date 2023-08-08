import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';


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
});


const RegistrationScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRegister = async (values) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Make a POST request to the server's register route  
    try {
      //const response = await fetch('http://127.0.0.1:8000/register', {  
      const response = await fetch('http://192.168.1.146:8000/register', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Registration successful
        setSuccessMessage('Registration successful! You can now login.');
        setIsLoading(false);
      } else {
        setError('Registration failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
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
            {error && <Text style={styles.errorText}>{error}</Text>}
            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
            <Button title={isLoading ? 'Loading...' : 'Register'} onPress={handleSubmit} disabled={isLoading} />
            <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
