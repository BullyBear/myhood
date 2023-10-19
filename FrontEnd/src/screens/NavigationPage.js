import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome as an example.
import LottieView from 'lottie-react-native';

const ListItems = [
  { title: 'My ToyBox', icon: 'gift', navigateTo: 'ToyBox' }, // 'gift' icon as an example
  { title: 'My UserBox', icon: 'users', navigateTo: 'UserBox' }, // 'users' icon as an example
  { title: 'Create Toy', icon: 'plus-circle', navigateTo: 'Toy' }, // 'plus-circle' icon as an example
  { title: 'Edit Profile', icon: 'user-circle', navigateTo: 'Profile' }, // 'user-circle' icon as an example
];

export default function NavigationPage({ navigation }) {
  return (
    <View style={styles.container}>
      {ListItems.map((item, index) => (
        <ListItem key={index} bottomDivider onPress={() => navigation.navigate(item.navigateTo)} containerStyle={styles.listItemContainer}>
          <Icon name={item.icon} size={20} color="#000" />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}

      <LottieView 
        source={require('../../assets/pyramid.json')} 
        autoPlay 
        loop 
        style={styles.lottie}
      />

      <TouchableOpacity 
        style={{ marginTop: 50 }} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.boldButtonText}>Go Back</Text>
      </TouchableOpacity>

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6BCD9B',
    padding: 75,
  },
  title: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18, // Decreased font size for a neater look
    color: '#333', // Slightly lighter than black for a softer look
    marginLeft: 10, // Provide some spacing between the icon and title
  },
  listItemContainer: {
    backgroundColor: '#fff', // Make the list items pop with a white background
    marginVertical: 10, // Increased space between list items
    borderRadius: 10, // Rounded corners for a softer look
    overflow: 'hidden', // Ensures the rounded corners effect
    marginTop: 20,
    backgroundColor: 'white'
  },
  boldButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333', // Dark background for contrast
    color: '#fff', // White text
    padding: 10, // Padding for a larger touch target and better look
    borderRadius: 5, // Rounded corners
    marginTop: 50, // Give it some space from the list items
    alignSelf: 'center', // Center the button horizontally
    width: 120, // Set a fixed width
  },
  lottie: {
    width: 300,
    height: 300,
    marginBottom: 30,
    alignSelf: 'center',
  },


});

