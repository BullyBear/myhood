import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { inviteUser } from '../slices/userSlice';

const InviteUserScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);
  const [invitationSent, setInvitationSent] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('Email is a required field.'),
  });

  const handleInviteUser = async (email) => {
    await dispatch(inviteUser(email));
    setInvitationSent(true);
  };

  // useEffect(() => {
  //   if (user && !loading) {
  //     navigation.navigate('Login');
  //   }
  // }, [user, loading]);

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values) => {
        handleInviteUser(values.email);
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
            placeholderTextColor="grey" 
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          {loading ? (
            <Button title="Loading..." disabled />
          ) : (
            <>
              <Button title="Invite User" onPress={handleSubmit} />
              <Button title="Go Back" onPress={() => navigation.navigate('Landing')} />
            </>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {invitationSent && <Text style={styles.messageText}>Invitation sent successfully!</Text>}
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

export default InviteUserScreen;
