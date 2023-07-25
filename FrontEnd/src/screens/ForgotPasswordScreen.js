import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../slices/userSlice';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.user);
  
    const handleResetPassword = () => {
      dispatch(resetPassword(email));
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {loading ? (
          <Button title="Loading..." disabled />
        ) : (
          <Button title="Reset Password" onPress={handleResetPassword} />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {message && <Text style={styles.messageText}>{message}</Text>}
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
    messageText: {
      color: 'green',
      marginTop: 10,
    },
  });
  
  
  export default ForgotPasswordScreen;
