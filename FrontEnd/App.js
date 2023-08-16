import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import * as Font from 'expo-font';

import store from './src/store/store';

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


const fetchFonts = () => {
  return Font.loadAsync({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    // Add other font variations if needed
  });
};

const Stack = createStackNavigator();

const App = () => {

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fetchFonts();
      } catch (error) {
        console.warn(error);
      } finally {
        setFontLoaded(true);
      }
    }

    loadResources();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;  // You can return a placeholder view here if needed
  }

  return (
    <Provider store={store}>
      <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Landing" component={LandingPage} /> 
        <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="FrontPage" component={FrontPage} />
          <Stack.Screen name="NavigationPage" component={NavigationPage} />
          <Stack.Screen name="Toy" component={Toy} />
          <Stack.Screen name="ToyBox" component={ToyBox} />
          <Stack.Screen name="ToyDetails" component={ToyDetails} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="UserBox" component={UserBox} />
          <Stack.Screen name="UserDetails" component={UserDetails} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;