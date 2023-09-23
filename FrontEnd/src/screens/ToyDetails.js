import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Animated, Image, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const { width: screenWidth } = Dimensions.get('window');


export default function ToyDetails({ route }) {

  const { toy } = route.params;
  const navigation = useNavigation();
  
  const currentUser = useSelector((state) => state.currentUer);

  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);


  const onChatPressed = () => {
    navigation.navigate('ChatScreen');
  };


  const openModal = (index) => {
    setModalImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  

  const toyImages = [
    toy.image_url_one,
    toy.image_url_two,
    toy.image_url_three,
    toy.image_url_four,
    toy.image_url_five
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
      <Text>Fuck</Text>
      <ToyImageModal isVisible={isModalVisible} onClose={closeModal} images={toyImages} />

      <TouchableOpacity style={styles.chatButton} onPress={onChatPressed}>
          <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>

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
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});


