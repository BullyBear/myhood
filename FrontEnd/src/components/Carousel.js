import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Image, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';



import axios from 'axios';
import { API_URL } from '../../config';

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
  addSwipedToy,
  addToUserSwipedToys,
  toyAdded,
  toyUpdated,
  toyDeleted
} from '../slices/toySlice';

import {
  addProfileToUserBoxAsync, setLastInteractedToyId, fetchUserProfileData, fetchUsersByIds
} from '../slices/userSlice';

function Carousel() {

  const defaultImageUrl = 'https://deplorablesnowflake.com/static/american.jpg';

  const dispatch = useDispatch();

  //const { user } = useSelector((state) => state.user);
  const { user = {} } = useSelector((state) => state.user);


  //const { user } = useSelector((state) => state.user.users);
  console.log('USER', user)


  // const toys = useSelector((state) => state.toy.toys || []);


  // const toys = useSelector((state) => {
  //   console.log("Debugging state.toy:", state.toy);
  //   console.log("Debugging state.toyswipe:", state.toy.swipedToys);
  //   return state.toy.toys.filter((toy) => toy.user_id !== user.id);
  // });

  const toys = useSelector((state) => {
    if (!state.user || !state.user.user) return [];
    return state.toy.toys.filter((toy) => toy.user_id !== state.user.user.id);
  });
  


  // const toys = useSelector((state) => {
  //   const filteredToys = state.toy.toys.filter((toy) => 
  //     toy.user_id !== user.id && 
  //     !state.toy.swipedToys.includes(toy.id)
  //   );
  //   console.log("Filtered toys:", filteredToys);
  //   return filteredToys;
  // });
  


  // const swipedToys = useSelector((state) => state.toy.swipedToys);

  // console.log('SWIPED TOYS bro', swipedToys)

  // const toys = useSelector((state) => {
  //   return state.toy.toys.filter((toy) => 
  //     toy.user_id !== user.id && 
  //     !state.toy.swipedToys.includes(toy.id)
  //   );
  // });
  


  // const toys = useSelector((state) => {
  //   return state.toy.toys.filter((toy) => 
  //     toy.user_id !== user.id && 
  //     !state.toy.swipedToys.includes(toy.id)
  //   );
  // });

  // console.log('TOYS2 WHAT AM I', toys)
  

  
  // const toys = useSelector((state) => {
  //   const userId = user && user.id;
  //   if(state.toy.toys) {
  //     return state.toy.toys.filter((toy) => {
  //       const swipedToysForUser = state.toy.userSwipedToys[userId] || [];
  //       return toy.user_id !== userId && !swipedToysForUser.includes(toy.id);
  //     });
  //   }
  //   return [];
  // });
  
  




  const loading = useSelector((state) => state.toy.loading);
  const error = useSelector((state) => state.toy.error);

  console.log('TOYS', toys)

  const [currentIndex, setCurrentIndex] = useState(0);

  //const currentToy = (toys && toys.length > currentIndex) ? toys[currentIndex] : null;

  const currentToy = (toys && toys.length > currentIndex && currentIndex < toys.length) ? toys[currentIndex] : null;

  //const currentToy = (toys && toys.length > 0 && currentIndex !== -1) ? toys[currentIndex] : null;

  


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

  
    //const imageUrl = currentToy ? currentToy.image_url : defaultImageUrl;
    const imageUrl = currentToy ? currentToy.image_url_one : null;
  
    console.log("Extracted Image URL:", imageUrl);
    console.log("CURRENT TOY", currentToy)
  
    //const bio = useSelector(state => state.user.user.bio);
    //const profilePicture = useSelector(state => state.user.user.profile_picture);
    
    //const [loaded, setLoaded] = useState(false);
    const [imageLoadingError, setImageLoadingError] = useState(false);
    const translateX = new Animated.Value(0);
  
    console.log('useEffect triggered');

    const [showDefaultImage, setShowDefaultImage] = useState(false);
    

  
  
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
  



  useEffect(() => {
    if (user && user.user_latitude && user.user_longitude) {
      console.log('[fetchToysWithinRadiusFromAPI] - Dispatching action...');
      dispatch(fetchToysWithinRadiusFromAPI({
        latitude: user.user_latitude,
        longitude: user.user_longitude,
        user_id: user.id,
        mode: 'uninteracted'
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

  const rotate = translateX.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-30deg", "0deg", "30deg"],
});





  const recordSwipeAction = async (userId, toyId, action, toyToShow) => {
    try {
      console.log(`Sending POST request to /api/toyswipe with userId: ${userId}, toyId: ${toyId}, action: ${action}`);
      
      const response = await axios.post(`${API_URL}/api/toyswipe`, {
        user_id: userId,
        toy_id: toyId,
        action
      }, { 
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log("Response received:", response);

  
      if (response.status === 200 || response.status === 201) {  
        const data = response.data;
        console.log("JSON Data received from server:", data);

      
        if (!user || typeof user.id === 'undefined') {
          console.error('User or user ID is not defined.');
          return;
      }
      

        //dispatch(addSwipedToy(toyId));
        //dispatch(addSwipedToy(toyToShow));

        console.log('Carousel - user id', user.id);
        console.log ('Carousel - toytoshow', toyToShow);
        console.log("User object before dispatching addSwipedToy:", user);


         dispatch(addSwipedToy({ userId: user.id, toy: toyToShow }));
         console.log("NEW am i working:", toyToShow);



         //dispatch(addToUserSwipedToys({ userId: user.id, toy: toyToShow }));

  



      } else {
        console.error(`Failed to record swipe action. Status: ${response.status}, StatusText: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error recording swipe action: ${error.message}`);
      console.error("Additional error details:", error);
    }
  };
  
  


  // const onSwipeRight = () => {
  //   const toyToShow = toys[currentIndex];
  //   console.log('Swiping Right');
  
  //   if (!toyToShow) {
  //     console.error('No toy found at current index:', currentIndex);
  //     return;
  //   }
  
  //   const userIdOfToy = toyToShow.user_id;
  //   if (!userIdOfToy) {
  //     console.error('No user ID found for toy with ID:', toyToShow.id);
  //     return;
  //   }
  

  //   console.log("onswiperight - user", user);
  //   console.log("onswiperight - currenttoy", currentToy);
  //   console.log("onswiperight - useridoftoy", userIdOfToy);
  //   console.log("onswiperight - toytoshow", toyToShow);
  

  //   if (user && user.id && currentToy && currentToy.id) {
  //     //recordSwipeAction(user.id, currentToy.id, 'right');
  //     recordSwipeAction(user.id, currentToy.id, 'right', toyToShow);
  



  //     // const ownerProfileData = {
  //     //   profile_picture: currentToy.image_url_one,
  //     //   user_details: {
  //     //       name: currentToy.owner_name,
  //     //       bio: currentToy.owner_bio,
  //     //       id: currentToy.id,
  //     //   }
  //     // };

  //     const ownerProfileData = {
  //       swiper_id: user.id, // This is the ID of User B (the swiper)
  //       toy_id: currentToy.id, // The toy they swiped on
  //       profile_picture: user.profile_picture,
  //       user_details: {
  //           name: user.name, 
  //           bio: user.bio,
  //           //toy_id: currentToy.id

  //       }
  //   };
    
    

  //     dispatch(addProfileToUserBoxAsync({
  //       userId: userIdOfToy,
  //       profileData: ownerProfileData
  //   }));

  
  //     // dispatch(addProfileToUserBoxAsync({
  //     //   userId: userIdOfToy,
  //     //   profileData: {
  //     //     profilePicture: user.profile_picture,
  //     //     name: user.name,
  //     //     bio: user.bio,
  //     //     id: user.id,
  //     //   }
  //     // }));



  //   }
  
  //   dispatch(removeToyFromCarousel(toyToShow));
  
  //   setCurrentIndex((prevIndex) => {
  //     const newIndex = prevIndex + 1;
  //     if (newIndex >= toys.length) {
  //       setShowDefaultImage(true);
  //     }
  //     return newIndex;
  //   });
  // }
  

  
  
  


  


  // const onSwipeLeft = () => {
  //   const toyToRemove = toys[currentIndex];
  //   console.log('Swiping Left');
  //   //console.log('Current Toy to Remove:', toyToRemove.name, '| Index:', currentIndex);

  //   if (user && user.id && currentToy && currentToy.id) {

  //     //recordSwipeAction(user.id, currentToy.id, 'right', toyToShow);
  //     //recordSwipeAction(user.id, currentToy.id, 'left', toyToRemove);
  //     recordSwipeAction(user.id, currentToy.id, 'left');

  //     dispatch(setLastInteractedToyId(currentToy.id));
  //   }

  //   dispatch(removeToyFromCarousel(toyToRemove));

  //   // setCurrentIndex((prevIndex) => {
  //   //   if (toys.length === 0) return 0;  // If toys array is empty, keep index at 0
  //   //   const newIndex = (prevIndex < toys.length - 1 ? prevIndex + 1 : 0);
  //   //   console.log('New Current Index after Swipe Left:', newIndex);
  //   //   return newIndex;
  //   //   });

  //   setCurrentIndex((prevIndex) => {
  //     const newIndex = prevIndex + 1;
  //     if (newIndex >= toys.length) {
  //       setShowDefaultImage(true);  // <-- Set to show default image
  //     }
  //     //return (newIndex < toys.length ? newIndex : prevIndex);
  //     return newIndex;
  //   });

  //   };




  //   useEffect(() => {
  //     if (user && user.last_interacted_toy_id) {
  //       const index = toys.findIndex(toy => toy.id === user.last_interacted_toy_id);
  //       if (index !== -1) {
  //         setCurrentIndex(index);
  //       }
  //     }
  //   }, [user, toys]);
  



  const onSwipeRight = () => {
    const toyToShow = toys[currentIndex];
    console.log('Swiping Right');
  
    if (!toyToShow) {
      console.error('No toy found at current index:', currentIndex);
      return;
    }
  
    if (user && user.id && currentToy && currentToy.id) {
      recordSwipeAction(user.id, currentToy.id, 'right', toyToShow);
  
      const ownerProfileData = {
        swiper_id: user.id,
        toy_id: currentToy.id,
        profile_picture: user.profile_picture,
        user_details: {
          name: user.name,
          bio: user.bio,
        }
      };
  
      dispatch(addProfileToUserBoxAsync({
        userId: toyToShow.user_id,
        profileData: ownerProfileData
      }));
    }
  
    dispatch(removeToyFromCarousel(toyToShow));
  
    setCurrentIndex(currentIndex + 1);
  
    Animated.timing(translateX, {
      toValue: Dimensions.get('window').width,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      translateX.setValue(0);
    });
  }
  
  const onSwipeLeft = () => {
    const toyToRemove = toys[currentIndex];
    console.log('Swiping Left');
  
    if (user && user.id && currentToy && currentToy.id) {
      recordSwipeAction(user.id, currentToy.id, 'left');
      dispatch(setLastInteractedToyId(currentToy.id));
    }
  
    dispatch(removeToyFromCarousel(toyToRemove));
  
    setCurrentIndex(currentIndex + 1);
  
    Animated.timing(translateX, {
      toValue: -Dimensions.get('window').width,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      translateX.setValue(0);
    });
  }
  
  



  
    return (
      <View style={styles.carouselContainer}>
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.oldState === State.ACTIVE) {
              let isActive = true;
              if (nativeEvent.translationX > 150) {
                  Animated.spring(translateX, {
                      toValue: Dimensions.get('window').width,
                      useNativeDriver: true
                  }).start(() => isActive && onSwipeRight());
              } else if (nativeEvent.translationX < -150) {
                  Animated.spring(translateX, {
                      toValue: -Dimensions.get('window').width,
                      useNativeDriver: true
                  }).start(() => isActive && onSwipeLeft());
              } else {
                  Animated.spring(translateX, {
                      toValue: 0,
                      stiffness: 80,
                      damping: 12,
                      mass: 1,
                      useNativeDriver: true
                  }).start();
              }
          
              return () => {
                  isActive = false;
              };
          }
      
      }}
      enabled={currentToy !== null} // Enable the gesture handler only if there's a current toy
    >

      <Animated.View
          style={[
              styles.carouselItem,
              {
                  transform: [
                      { translateX },
                      { rotate }
                  ],
                  opacity: translateX.interpolate({
                      inputRange: [-Dimensions.get('window').width, 0, Dimensions.get('window').width],
                      outputRange: [0.5, 1, 0.5]
                  })
              }
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