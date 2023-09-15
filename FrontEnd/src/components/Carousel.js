import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Image, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import {
  fetchToysFromAPI,
  fetchToysWithinRadiusFromAPI,
  fetchToyByIdFromAPI,
  createToyInAPI,
  updateToyInAPI,
  deleteToyInAPI,
  clearToys,
  loadToy,
  loadToys,
  removeToyFromCarousel,
  addswipedtoy,
  toyAdded,
  toyUpdated,
  toyDeleted
} from '../slices/toySlice';

import {
  addProfileToUserBoxAsync
} from '../slices/userSlice';

function Carousel() {

  const defaultImageUrl = 'https://deplorablesnowflake.com/static/american.jpg';

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  //const { user } = useSelector((state) => state.user.users);
  console.log('USER', user)


  const swipedToyIds = useSelector((state) => state.toy.swipedToyIds);

  const toys = useSelector((state) => {
    return state.toy.toys.filter((toy) => toy.user_id !== user.id);
  });



  // const toys = useSelector((state) => state.toy.toys || []);

  const loading = useSelector((state) => state.toy.loading);
  const error = useSelector((state) => state.toy.error);

  console.log('TOYS', toys)

  const [currentIndex, setCurrentIndex] = useState(0);

  //const currentToy = (toys && toys.length > currentIndex) ? toys[currentIndex] : null;

  const currentToy = (toys && toys.length > currentIndex && currentIndex < toys.length) ? toys[currentIndex] : null;

  let selectedToyImages = [];

  if(currentToy) {
    selectedToyImages = [
      currentToy.image_url_one,
      currentToy.image_url_two,
      currentToy.image_url_three,
      currentToy.image_url_four,
      currentToy.image_url_five
    ].filter(Boolean);
  }

  console.log('selectedToyImages:', selectedToyImages);
  
  
  
    //const imageUrl = currentToy ? currentToy.image_url : defaultImageUrl;
    const imageUrl = currentToy ? currentToy.image_url_one : null;
  
    console.log("Extracted Image URL:", imageUrl);
    console.log("CURRENT TOY", currentToy)
  
    const bio = useSelector(state => state.user.user.bio);
    const profilePicture = useSelector(state => state.user.user.profile_picture);
    
    //const [loaded, setLoaded] = useState(false);
    const [imageLoadingError, setImageLoadingError] = useState(false);
    const translateX = new Animated.Value(0);
  
    console.log('useEffect triggered');
  
  
  
    //console.log('Current Toy Image URL:', toys.toys[currentIndex]?.image_url);
  
  
    console.log('Entire Toys Array:', toys);
    console.log('Current Index:', currentIndex);
    // console.log('Current Toy Image URL:', toys[currentIndex]?.image_url_one);
  
    if (currentToy) {
      console.log("CURRENT TOY", currentToy);
      console.log("Current Toy Image URL:", currentToy.image_url_one);
    } else {
      console.log("CURRENT TOY is not available");
      console.log("Current Toy Image URL: not available");
    }

    const screenWidth = Dimensions.get('window').width;

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
  
    const openModal = (toy, index) => {
      setModalImageIndex(index);
      setModalVisible(true);
    };
  
  

  const closeModal = () => {
    setModalVisible(false);
  };

  function ToyImageModal({ isVisible, onClose, images }) {
    const flatListRef = useRef();
    const [currentModalIndex, setCurrentModalIndex] = useState(0);
  
    return (
      <Modal isVisible={isVisible} backdropOpacity={0.5} onBackdropPress={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => { /* Do nothing to avoid propagating to parent */ }}>
              <FlatList
                ref={flatListRef}
                horizontal
                data={images || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => { /* Do nothing to avoid propagating to parent */ }}>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  
  
  
  

  

  // const entireState = useSelector((state) => state);
  // console.log("Entire Redux State:", JSON.stringify(entireState));



  useEffect(() => {
    console.log("Current Redux state for toys:", toys);
  }, [toys]);
  

  // useEffect(() => {
  //   if (user && user.user_latitude && user.user_longitude) {
  //     console.log('[fetchToysWithinRadiusFromAPI] - Dispatching action...');
  //     dispatch(fetchToysWithinRadiusFromAPI({ latitude: user.user_latitude, longitude: user.user_longitude }));
  //   } else {
  //     console.log('shit outta luck');
  //     //dispatch(fetchToysFromAPI());
  //   }
  // }, [user]);


  useEffect(() => {
    if (user && user.user_latitude && user.user_longitude) {
      console.log('[fetchToysWithinRadiusFromAPI] - Dispatching action...');
      dispatch(fetchToysWithinRadiusFromAPI({
        latitude: user.user_latitude,
        longitude: user.user_longitude,
        user_id: user.id // Include the user ID here
      }));
    }
  }, [user]);
  
  

//   useEffect(() => {
//     // Clear old toys before fetching new ones
//     dispatch(clearToys());
//     // ... Existing code for fetching toys
// }, [user]);


// useEffect(() => {
//   if (user && (user.user_latitude && user.user_longitude)) {
//     console.log('BEFORE FETCHTOYSWITHINRADIUSFROMAPI DISPATCH')
//     dispatch(fetchToysWithinRadiusFromAPI({ latitude: user.user_latitude, longitude: user.user_longitude }));
//     console.log('AFTER FETCHTOYSWITHINRADIUSFROMAPI DISPATCH')
//   } else {
//     console.log('BEFORE FETCHTOYSFROMAPI DISPATCH')
//     dispatch(fetchToysFromAPI());
//     console.log('AFTER FETCHTOYSFROMAPI DISPATCH')
//   }
// }, [user]); 


  // useEffect(() => {
  //   if (toys.length > 0) {
  //     setLoaded(true);
  //     setCurrentIndex(0); // Resetting index whenever toys are updated
  //   }
  // }, [toys]);
  


  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const recordSwipeAction = async (userId, toyId, action) => {
    try {
      const response = await fetch('/api/toyswipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, toy_id: toyId, action })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Swipe action recorded:', data);
        dispatch(toySlice.actions.addSwipedToy(toyId));
      } else {
        console.error('Failed to record swipe action:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error recording swipe action:', error);
    }
  };
  

  const onSwipeRight = () => {
    const toyToShow = toys[currentIndex];
    console.log('Swiping Right');
    
    if (!toyToShow) {
      console.error('No toy found at current index:', currentIndex);
      return;
    }
  
    const userIdOfToy = toyToShow.user_id;
    if (!userIdOfToy) {
      console.error('No user ID found for toy with ID:', toyToShow.id);
      return;
    }

    console.log("userIdOfToy:", userIdOfToy);
    console.log("Bio in carousel:", bio);
    console.log("Profile Picture in carousel:", profilePicture);

    if (user && user.id && currentToy && currentToy.id) {
      recordSwipeAction(user.id, currentToy.id, 'right');
    }

  //   dispatch(addProfileToUserBoxAsync({
  //     userId: userIdOfToy, 
  //     profileData: {
  //         bio: bio, 
  //         profile_picture: profilePicture
  //     }
  // }));

    dispatch(removeToyFromCarousel(toyToShow));
  
    if (user && user.id) {
      console.log('Recording User Interaction for User:', user.id);
      // Add logic here if you want to record interactions between users
    }
  
  setCurrentIndex((prevIndex) => {
    if (toys.length === 0) return 0;  // If toys array is empty, keep index at 0
    const newIndex = (prevIndex < toys.length - 1 ? prevIndex + 1 : 0);
    //const newIndex = (prevIndex < toys.length - 1 ? prevIndex + 1 : prevIndex);
    return newIndex;
  });
};
  
  const onSwipeLeft = () => {
    const toyToRemove = toys[currentIndex];
    console.log('Swiping Left');
    //console.log('Current Toy to Remove:', toyToRemove.name, '| Index:', currentIndex);

    if (user && user.id && currentToy && currentToy.id) {
      recordSwipeAction(user.id, currentToy.id, 'left');
    }

    dispatch(removeToyFromCarousel(toyToRemove));
    setCurrentIndex((prevIndex) => {
      if (toys.length === 0) return 0;  // If toys array is empty, keep index at 0
      const newIndex = (prevIndex < toys.length - 1 ? prevIndex + 1 : 0);
      console.log('New Current Index after Swipe Left:', newIndex);
      return newIndex;
      });
    };

  
    return (
      <View style={styles.carouselContainer}>
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.oldState === State.ACTIVE) {
          if (currentToy) { // Only swipe if there's a current toy
            if (nativeEvent.translationX >= 100) {
              onSwipeRight();
              translateX.setValue(0);
            } else if (nativeEvent.translationX <= -100) {
              onSwipeLeft();
              translateX.setValue(0);
            } else {
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          }
        }
      }}
      enabled={currentToy !== null} // Enable the gesture handler only if there's a current toy
    >

      <Animated.View
        style={[
          styles.carouselItem,
          { transform: [{ translateX }] },
        ]}
      >
        

        {currentToy ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.toyImage}
            onLoadStart={() => setImageLoadingError(false)}
            onError={(error) => {
              console.log("Image Loading Error:", error.nativeEvent.error);
              setImageLoadingError(true);
            }}
          />
        ) : (
          <Image
            source={{ uri: defaultImageUrl }}
            style={styles.toyImage}
          />
        )}
      </Animated.View>
    </PanGestureHandler>
    <TouchableOpacity
    style={{ position: 'absolute', bottom: 50 }}
    onPress={() => openModal(currentToy, currentIndex)}>

      <Text style={{fontSize: 18, color: 'blue'}}>See More</Text>
    </TouchableOpacity>

    <ToyImageModal isVisible={isModalVisible} onClose={closeModal} images={selectedToyImages} />
  </View>
  );
    

}

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    flexDirection: 'row',
  },
  toyImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  otherImagesStyle: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  modalImageContainer: {
    width: Dimensions.get('window').width, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  

});

export default Carousel;
