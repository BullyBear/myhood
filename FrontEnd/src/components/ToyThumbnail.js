import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ToyThumbnail = ({ toy, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: toy.image_url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{toy.title}</Text>
        <Text style={styles.description}>{toy.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default ToyThumbnail;
