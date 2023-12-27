import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import Carousel from '../components/Carousel';
//import { fetchToysFromAPI } from '../slices/toySlice';
import { logoutUser } from '../slices/userSlice';
import { resetState } from '../slices/toySlice'


const FrontPage = ({ navigation }) => {
  const dispatch = useDispatch();

  //const { toys, loading, error } = useSelector((state) => state.toy);
 //const { toys = [], loading, error } = useSelector((state) => state.toy);
  //const { toys = [], loading, error } = useSelector((state) => state.toy.toys); 


  

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
    //dispatch(logoutUser());
    //dispatch(resetState());
    navigation.navigate('Login');
  };

  // if (loading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (error) {
  //   return <Text>Error: {error}</Text>;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel />
      </View>
      <Text style={styles.userNameText}>Hello, {userName ? userName : 'No User'}</Text> 
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('NavigationPage')} style={styles.button}>
          <Icon name="compass" size={20} color="#fff" />
          <Text style={{color: "#fff"}}>Nav</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.outlinedButton]}>
          <Icon name="sign-out" size={20} color="#fff" />
          <Text style={{color: "#fff"}}>Logout</Text> 
        </TouchableOpacity>
      </View>
    </View>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6BCD9B',
    fontFamily: 'Roboto-Regular',
  },
  gradientBackground: {
    flex: 1,
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
    colors: ['#FF416C', '#FF4B2B'],
  },

  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  carouselContainer: {
    flex: 8,
    shadowColor: "black", // Shadow color
    shadowOffset: {
        width: 10,
        height: 10, // Shadow will appear at the bottom
    },
    shadowOpacity: 0.5, // Adjust the opacity for desired shadow intensity
    shadowRadius: 10,


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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    //backgroundColor: '#FF6B6B',
    backgroundColor: '#CD6B7D',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  outlinedButton: {
    backgroundColor: '#666', // Subdued color for the "Logout" button
    borderWidth: 1,
    borderColor: '#333',
  }
});


export default FrontPage;