import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';
import jwt_decode from 'jwt-decode';

import Carousel from '../components/Carousel';
//import { fetchToysFromAPI } from '../slices/toySlice';
import { logoutUser } from '../slices/userSlice';


const FrontPage = ({ navigation }) => {
  const dispatch = useDispatch();

  //const { toys, loading, error } = useSelector((state) => state.toy);
  const { toys = [], loading, error } = useSelector((state) => state.toy.toys); 

  const { user } = useSelector((state) => state.user);

  //const state = useSelector((state) => state);  

  const [userName, setUserName] = useState(null);



  // useEffect(() => {
  //   dispatch(fetchToysFromAPI());
  // }, [dispatch]);


  // Update this useEffect hook
  useEffect(() => {
    if(user?.name) {
      setUserName(user.name);
      console.log(user.name);
    }
  }, [user]);

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

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
      <Text style={styles.userNameText}>Hello, {userName ? userName : 'No User'}</Text> 
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Navigation"
          onPress={() => navigation.navigate('NavigationPage')}
          style={styles.button}
        />
        <Button title="Logout" onPress={handleLogout} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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
