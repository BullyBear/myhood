//NavigationPage.js: Displays a navigation view with buttons to navigate to different screens, 
//including the FrontPage, Toy, Profile, ToyBox, UserBox, and other screens.


import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { List, MD3Colors } from 'react-native-paper';


export default function NavigationPage({ navigation }) {
  return (
    // <View>
    //   <TouchableOpacity onPress={() => navigation.navigate('FrontPage')}>
    //     <Text>Carousel</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={() => navigation.navigate('Toy')}>
    //     <Text>Create Toy</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
    //     <Text>Create Profile</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={() => navigation.navigate('ToyBox')}>
    //     <Text>My ToyBox</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={() => navigation.navigate('UserBox')}>
    //     <Text>My UserBox</Text>
    //   </TouchableOpacity>
    //   {/* ... other buttons */}
    // </View>
    <List.Section>
    <List.Subheader>Welcome to Myhood</List.Subheader>
    <List.Item title="Carousel" onPress={() => navigation.navigate('FrontPage')} left={() => <List.Icon icon="view-carousel" />} />
    <List.Item title="My ToyBox" onPress={() => navigation.navigate('ToyBox')} left={() => <List.Icon color={MD3Colors.tertiary70} icon="airballoon" />} />
    <List.Item title="Create Toy" onPress={() => navigation.navigate('Toy')} left={() => <List.Icon color={MD3Colors.tertiary30} icon="toy-brick" />} />
    <List.Item title="My UserBox" onPress={() => navigation.navigate('UserBox')} left={() => <List.Icon color={MD3Colors.tertiary50} icon="human-handsup" />} />
    <List.Item title="Create Profile" onPress={() => navigation.navigate('Profile')} left={() => <List.Icon color={MD3Colors.tertiary10} icon="face-man-profile" />} />
    </List.Section>
  );
}
