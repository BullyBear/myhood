// FrontPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/base';

import Carousel from '../components/Carousel';
import { fetchToysFromAPI } from '../slices/toySlice';
import { logoutUser } from '../slices/userSlice';


const FrontPage = ({ navigation }) => {
  const dispatch = useDispatch();
  //const { toys, loading, error } = useSelector((state) => state.toys);
  //const { toys, toyBox, loading, error } = useSelector((state) => state.toy);
  const { toys, loading, error } = useSelector((state) => state.toy);




  useEffect(() => {
    dispatch(fetchToysFromAPI());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    // Add any additional logic you need for logging out (e.g., clearing local storage, resetting state, etc.)
    navigation.navigate('Login');
  };


  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Button title="Hello World" />
      <Carousel />
      <TouchableOpacity onPress={() => navigation.navigate('NavigationPage')}>
        <Text>Go to Navigation</Text>
      </TouchableOpacity>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default FrontPage;
