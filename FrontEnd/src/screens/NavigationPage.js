import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome as an example.

const ListItems = [
  { title: 'Carousel', icon: 'home', navigateTo: 'FrontPage' }, // 'home' icon as an example
  { title: 'Create Toy', icon: 'plus-circle', navigateTo: 'Toy' }, // 'plus-circle' icon as an example
  { title: 'My ToyBox', icon: 'gift', navigateTo: 'ToyBox' }, // 'gift' icon as an example
  { title: 'My UserBox', icon: 'users', navigateTo: 'UserBox' }, // 'users' icon as an example

  { title: 'Edit Profile', icon: 'user-circle', navigateTo: 'Profile' }, // 'user-circle' icon as an example
];

export default function NavigationPage({ navigation }) {
  return (
    <View style={styles.container}>
      {ListItems.map((item, index) => (
        <ListItem key={index} bottomDivider onPress={() => navigation.navigate(item.navigateTo)}>
          <Icon name={item.icon} size={20} color="#000" />
          <ListItem.Content>
            <ListItem.Title style={styles.centeredText}>{item.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
    width: '100%',
  },
});
