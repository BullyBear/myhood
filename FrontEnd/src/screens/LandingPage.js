import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';


const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <LottieView 
          source={require('../../assets/neighborhoodAnimation.json')} 
          autoPlay 
          loop 
          style={styles.lottie}
        />
        <Text style={styles.title}>MyHood</Text>
        <Text style={styles.subtitle}>Where Tinder & Meetup Collide.</Text>
      </View>

      <View style={styles.middleContent}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AuthNavigator', { screen: 'Login' })}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AuthNavigator', { screen: 'Registration' })}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContent}>
        <Button color="blue" title="Forgot Password ?" onPress={() => navigation.navigate('AuthNavigator', { screen: 'ForgotPasswordScreen' })} />
        <Button color="blue" title="Invite User" onPress={() => navigation.navigate('AuthNavigator', { screen: 'InviteUserScreen' })} />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#6BCD9B',
  },
  topContent: {
    flex: 5,  // You can adjust these values as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  middleContent: {
    flex: 2,  // You can adjust these values as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    flex: 1,  // You can adjust these values as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  lottie: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  title: {
    marginBottom: 20,
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: 48,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 30,
    color: 'white',
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
  },
  spacingView: {
    marginTop: 100, 
  },
  button: {
    backgroundColor: '#CD6B7D',  
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,           
    marginVertical: 15, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },


});

export default LandingPage;
