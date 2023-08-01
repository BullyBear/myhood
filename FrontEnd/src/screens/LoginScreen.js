import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/userSlice';

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
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await dispatch(loginUser(values));
      setIsLoading(false);

      // Check if user exists in the Redux store
      if (userFromStore) {
        navigation.navigate('FrontPage', { name: userFromStore.name });
      } else {
        setError('Login failed.');
      }
    } catch (err) {
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
          <View>
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
            <Button title={isLoading ? 'Loading...' : 'Submit'} onPress={handleSubmit} disabled={isLoading} />
          </View>
        )}
      </Formik>
      <Button title="Forgot Password?" onPress={() => navigation.navigate('ForgotPassword')} />
      <Button title="Invite User" onPress={() => navigation.navigate('InviteUser')} />
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

export default LoginScreen;
