import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { removeUserFromBox } from '../slices/userSlice';
import { addToyToToybox, updateToyImages } from '../slices/toySlice'; 

const { width, height } = Dimensions.get('window');


export default function UserDetails({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  
  const [showAcceptButton, setShowAcceptButton] = useState(true);
  const currentToy = useSelector((state) => state.currentToy);


  const dispatch = useDispatch();
  


  const onChatPressed = () => {
    navigation.navigate('ChatScreen');
  };


  const onAcceptPressed = () => {

    console.log("PRESSING ACCEPT")

    if (user && user.id && currentToy && currentToy.id) {
      recordSwipeAction(user.id, currentToy.id, 'right');
      

      dispatch(addToyToToybox({ userId: user.id, toyId: currentToy.id }));
      dispatch(updateToyImages({ toyId: currentToy.id, toyImages: currentToy.images }));
      //dispatch toast notification

    }

    setShowAcceptButton(false);
  };


  const onDeclinePressed = () => {

    dispatch(removeUserFromBox(user.id));
    navigation.goBack();
  };



  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profile_picture }} style={styles.image} />
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>{user.bio}</Text>
      
      {showAcceptButton && (
        <>
          <TouchableOpacity style={styles.acceptButton} onPress={onAcceptPressed}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton} onPress={onDeclinePressed}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </>
      )}
      
      {!showAcceptButton && (
        <TouchableOpacity style={styles.chatButton} onPress={onChatPressed}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  declineButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  declineButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  chatButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
