import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { loginUserRequest, loginUserSuccess, loginUserFailure } from '../slices/userSlice';
import { loginUser } from '../API/userAPI';
//import { loginUserFromAPI } from '../API/userAPI';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      dispatch(loginUserRequest()); // Dispatch loginUserRequest action
      // Dispatch the loginUser action with the login credentials
      const response = await loginUser({ email, password });
      dispatch(loginUserSuccess(response.data)); // Dispatch loginUserSuccess action with the response data
      navigation.navigate('FrontPage');
    } catch (error) {
      console.log('Login Error:', error.message); // Log the error message to the console
      dispatch(loginUserFailure(error.message)); // Dispatch loginUserFailure action with the error message
      setErrorMsg('Login failed. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      {loading ? (
        <Button title="Loading..." disabled />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
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
});

export default LoginScreen;
