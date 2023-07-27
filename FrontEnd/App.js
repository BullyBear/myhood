//App.js: Sets up the main navigation stack using React Navigation. 
//It includes screens such as FrontPage, NavigationPage, Toy, ToyBox, 
//ToyDetails, Profile, UserBox, UserDetails, and ChatScreen. It also wraps the app 
//with Redux's Provider and PaperProvider for state management and UI components.


import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';

import store from './src/store/store';

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


const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
        {/*<Stack.Screen name="Auth" component={AuthNavigator} />*/}
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