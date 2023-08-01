import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { inviteUser } from '../slices/userSlice';
import { Formik } from 'formik';
import * as yup from 'yup';

const InviteUserScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('Email is a required field.'),
  });

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values) => {
        dispatch(inviteUser(values.email));
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
            <Button title="Invite User" onPress={handleSubmit} />
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {message && <Text style={styles.messageText}>{message}</Text>}
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

export default InviteUserScreen;
