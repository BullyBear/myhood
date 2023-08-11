import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LottieView 
        source={require('../../assets/neighborhoodAnimation.json')} 
        autoPlay 
        loop 
        style={styles.lottie}
      />
      <Text style={styles.title}>MyHood</Text>
      <Text style={styles.subtitle}>Where Tinder & Meetup Collide. </Text>
      <Button title="Login" onPress={() => navigation.navigate('Auth', { screen: 'Login' })} />
      <Button title="Register" onPress={() => navigation.navigate('Auth', { screen: 'Registration' })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6BCD9B',
  },
  lottie: {
    width: 300,
    height: 300,
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    marginBottom: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 30,
    color: 'white',
  },
});

export default LandingPage;
