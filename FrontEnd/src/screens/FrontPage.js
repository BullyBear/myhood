// FrontPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';
import Carousel from '../components/Carousel';
import { fetchToysFromAPI } from '../slices/toySlice';
import { logoutUser } from '../slices/userSlice';

const FrontPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const { toys, loading, error } = useSelector((state) => state.toy);

  useEffect(() => {
    dispatch(fetchToysFromAPI());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate('Login');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Go to Navigation" onPress={() => navigation.navigate('NavigationPage')} style={styles.button} />
        <Button title="Logout" onPress={handleLogout} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    flex: 8,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 40,
  },
});

export default FrontPage;
