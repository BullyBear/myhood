import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

function ToyDetails() {
  const route = useRoute();
  const { toyId } = route.params;
  const toy = useSelector((state) => state.toy.toys.find((toy) => toy.id === toyId));

  if (!toy) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: toy.image_url }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 300, 
    height: 300,
  },
});

export default ToyDetails;
