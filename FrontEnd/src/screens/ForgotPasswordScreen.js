import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
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

  useEffect(() => {
    if (user && !loading) {
      navigation.navigate('Login');
    }
  }, [user, loading]);

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
              <Button title="Go Back" onPress={() => navigation.navigate('Login')} />
            </>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {emailSent && <Text style={styles.messageText}>Email sent!</Text>}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
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
});

export default ForgotPasswordScreen;
