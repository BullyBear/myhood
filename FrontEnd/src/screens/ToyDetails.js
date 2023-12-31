import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Animated, Image, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

import { generateRoomId } from '../components/utils'

const { width: screenWidth } = Dimensions.get('window');


export default function ToyDetails({ route }) {

 // const { toy } = route.params;
  const toy = route.params?.toy || {};



  const toyId = toy.id;
  const creatorUserId = toy.user_id;
  const currentUserMan = useSelector(state => state.user.user);
  
  console.log('toybox toy creator Toy ID:', toyId);
  console.log('toybox Toy Creator User ID:', creatorUserId);
  console.log("toybox toy swiper user id", currentUserMan.id)

  
  


  const navigation = useNavigation();
  
 
  const currentUser = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);





  const onChatPressed = () => {
    // Check if we have all the necessary details
    if (toyId && currentUserMan.id && creatorUserId) {
      // Generate the unique room ID
      const roomId = generateRoomId(toyId, currentUserMan.id, creatorUserId);
  
      // Navigate to the ChatScreen with the roomId
      navigation.navigate('ChatScreen', { roomId, creatorUserId });
    } else {
      // Log any missing details for debugging purposes
      console.log("toyId", toyId, "currentUserMan", currentUserMan, "user", user);
    }
  };



//   const onChatPressed = () => {
//     {/*const roomId = generateRoomId(toy.id, currentUser.id, 'ID_OF_THE_OTHER_USER');*/}
//     navigation.navigate('ChatScreen', { roomId });
// };



  const openModal = (index) => {
    setModalImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  

  const toyImages = [
    toy?.image_url_one,
    toy?.image_url_two,
    toy?.image_url_three,
    toy?.image_url_four,
    toy?.image_url_five
  ].filter(Boolean);


  function ToyImageModal({ isVisible, onClose, images }) {
    const flatListRef = useRef();
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

    return (
      <Modal isVisible={isVisible} backdropOpacity={0.5} onBackdropPress={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
              ref={flatListRef}
              horizontal
              data={images || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback>
                  <View style={styles.modalImageContainer}>
                    <Image source={{ uri: item }} style={styles.modalImage} />
                  </View>
                </TouchableWithoutFeedback>
              )}
              pagingEnabled
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
                if (newIndex >= 0 && newIndex < images.length) {
                  setCurrentModalIndex(newIndex);
                }
              }}
              initialScrollIndex={currentModalIndex}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => openModal(0)}>
        <Image source={{ uri: toy.image_url_one }} style={styles.image} />
      </TouchableOpacity>
      <ToyImageModal isVisible={isModalVisible} onClose={closeModal} images={toyImages} />

      <TouchableOpacity style={styles.chatButton} onPress={onChatPressed}>
          <MaterialIcons name="chat-bubble" size={75} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>



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

  modalImageContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth,
    height: 300,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
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
    marginTop: 100, // Give it some space from the list items
    alignSelf: 'center', // Center the button horizontally
    width: 120, // Set a fixed width
  },



});


