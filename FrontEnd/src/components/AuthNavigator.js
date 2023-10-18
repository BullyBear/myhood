import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import InviteUserScreen from '../screens/InviteUserScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InviteUser" component={InviteUserScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
