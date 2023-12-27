import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { removeUserFromBox, addProfileToUserBoxAsync, acceptUser  } from '../slices/userSlice';
import { addToyToToybox, updateToyImages, addSwipedToy } from '../slices/toySlice';
import { addToyToToyboxAPI } from '../API/toyAPI';
import { generateRoomId } from '../components/utils'

const { width, height } = Dimensions.get('window');


export default function UserDetails({ route }) {

 const { user, imageUrl, swipedToy } = route.params;

//  console.log("user bro", user)
 console.log("swipedToy son", swipedToy)

//  const state = useSelector(state => state);
//  console.log("USERDETAILS STATE!", state)


  const { details } = user; 
  const { name, bio } = details; 


  const currentUser = useSelector(state => state.user.user);
  console.log("toy creator user id", currentUser.id)


  const currentToyId = currentUser.toys && currentUser.toys.length > 0 ? currentUser.toys[0].id : null;
  console.log("toy creator toy id", currentToyId);

 
  const userId = user.id;
  console.log("swiper user id", userId);
  

  const acceptedUsers = useSelector(state => state.user.acceptedUsers);
  const isUserAccepted = acceptedUsers ? acceptedUsers.includes(user.id) : false;
  
  


  const navigation = useNavigation();
  
  const [showAcceptButton, setShowAcceptButton] = useState(true);

  //const currentToy = useSelector((state) => state.currentToy);
  //const currentToy = useSelector((state) => state.toy.toyBox?.[state.toy.toyBox.length - 1]);
  //const currentToy = useSelector((state) => state.toy.toys?.[state.toy.toys.length - 1]);

  const toyStateForDebug = useSelector(state => state.toy);
  const stateForDebug = useSelector(state => state);

  console.log("SWIPED!", swipedToy)
  //console.log("CURRENT TOY!", currentToy)
  console.log('Debug toy state:', toyStateForDebug);
  console.log('Debug state:', stateForDebug);

  //console.log("creator id", creatorId)

  console.log("CURRENT USER USERBOX", currentUser.userBox)

  console.log("USERDETAILS swipedToy", swipedToy, "USERDETAILS currentUser", currentUser, "USERDETAILS user", user);

  //console.log("BRO", swipedToy[0].image_url_one)

  const dispatch = useDispatch();
  



// const onChatPressed = () => {
//   if (swipedToy && currentUser && user) {
//     const roomId = generateRoomId(swipedToy.id, currentUser.id, user.id);
//     navigation.navigate('ChatScreen', { roomId });
//  } else {
//   console.log("swipedToy", swipedToy, "currentUser", currentUser, "user", user);

//  }
// };


const onChatPressed = () => {
  // Check if we have all the necessary details
  if (currentToyId && currentUser.id && userId) {
    // Generate the unique room ID
    const roomId = generateRoomId(currentToyId, currentUser.id, userId);

    // Navigate to the ChatScreen with the roomId
    navigation.navigate('ChatScreen', { roomId, userId });
  } else {
    // Log any missing details for debugging purposes
    console.log("currentToyId", currentToyId, "currentUser", currentUser, "user", user);
  }
};






const onAcceptPressed = async () => {
  console.log("PRESSING ACCEPT")
  console.log("User object: ", user);
  console.log("User ID: ", user.id);
  console.log("SwipedToy object: ", swipedToy);
  console.log("SwipedToy ID: ", swipedToy[0] ? swipedToy[0].id : "No ID found");


  //if (user && user.id && swipedToy && swipedToy[0].id) {
  //if (user && user.id) {
  if (user?.id && swipedToy?.[0]?.id) {
    console.log("tacoooo")

      dispatch(addToyToToybox({ userId: user.id, toyId: swipedToy[0].id }));
      console.log("cheese man")
      dispatch(updateToyImages({ toyId: swipedToy[0].id, toyImages: swipedToy[0].image_url_one }));
      console.log("brocolli man")
      dispatch(acceptUser(user.id));
      console.log("icecream man")

      console.log("Accepted users after dispatch: ", useSelector(state => state.user.acceptedUsers));


      // Assuming the addToyToToyboxAPI returns the push token for person B
      let response = await addToyToToyboxAPI(user.id, swipedToy[0].id);
      if (response && response.pushToken) {
        sendPushNotification(response.pushToken, "A new toy was added to your toybox!");
      }
  }

  setShowAcceptButton(false);
  onChatPressed();
};


const sendPushNotification = async (pushToken, message) => {
  const payload = {
    to: pushToken,
    sound: 'default',
    title: 'New Toy!',
    body: message,
    data: { extraData: 'Some data' }
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};



  // const onDeclinePressed = () => {
  //   dispatch(removeUserFromBox(user.id));
  //   navigation.goBack();
  // };


  const onDeclinePressed = () => {
    dispatch(removeUserFromBox(user.id));
    navigation.navigate('UserBox');
  };
  



  return (
    <View style={styles.container}>
      {/*<Image source={{ uri: user.profile_picture }} style={styles.image} />*/}
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.text}>{bio}</Text>
      
      {!isUserAccepted && (
        <>
          <TouchableOpacity style={styles.acceptButton} onPress={onAcceptPressed}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton} onPress={onDeclinePressed}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </>
      )}
      
      {isUserAccepted && (
      <TouchableOpacity style={styles.chatButton} onPress={onChatPressed}>
          <MaterialIcons name="chat-bubble" size={75} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
      )}
        <TouchableOpacity 
            style={{ marginTop: 50 }} 
            onPress={() => navigation.goBack()}
            >
          <Text style={styles.boldButtonText}>Go Back</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Changed this from 'center'
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,  // Added this line
    backgroundColor: '#6BCD9B',
},

  image: {
    width: 350,
    height: 350,
    marginBottom: 20,
    marginTop: 100, // Added this line
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
    marginTop: 50,

  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  boldButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333', // Dark background for contrast
    color: '#fff', // White text
    padding: 10, // Padding for a larger touch target and better look
    borderRadius: 5, // Rounded corners
    marginTop: 25, // Give it some space from the list items
    alignSelf: 'center', // Center the button horizontally
    width: 120, // Set a fixed width
  },

});