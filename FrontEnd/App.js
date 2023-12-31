import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import * as Font from 'expo-font';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/store/store';

import LandingPage from './src/screens/LandingPage';
import AuthNavigator from './src/components/AuthNavigator';
import FrontPage from './src/screens/FrontPage';
import NavigationPage from './src/screens/NavigationPage';
import Toy from './src/screens/Toy';
import ToyBox from './src/screens/ToyBox';
import ToyDetails from './src/screens/ToyDetails';
import Profile from './src/screens/Profile';
import UserBox from './src/screens/UserBox';
import UserDetails from './src/screens/UserDetails';
import ChatScreen from './src/screens/ChatScreen';
// import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
// import InviteUserScreen from './src/screens/InviteUserScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
          // ... add other font variations if needed
        });
        setFontLoaded(true);
      } catch (error) {
        console.error("Error loading fonts", error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="FrontPage" component={FrontPage} options={{ headerShown: false }} />
          <Stack.Screen name="NavigationPage" component={NavigationPage} options={{ headerShown: false }} />
          <Stack.Screen name="Toy" component={Toy} options={{ headerShown: false }} />
          <Stack.Screen name="ToyBox" component={ToyBox} options={{ headerShown: false }} />
          <Stack.Screen name="ToyDetails" component={ToyDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="UserBox" component={UserBox} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>

        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
