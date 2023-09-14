import React, { useEffect, useState } from 'react';
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

  // if(currentToy) {
  //   currentToy.images = [
  //     currentToy.image_url_one,
  //     currentToy.image_url_two,
  //     currentToy.image_url_three,
  //     currentToy.image_url_four,
  //     currentToy.image_url_five
  //   ].filter(Boolean); 
  // }
  
  
  
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
    return (
      <Modal isVisible={isVisible} backdropOpacity={0.5} onBackdropPress={onClose} backdropPressToClose={true}>
        <FlatList
          horizontal
          data={images || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.modalImageContainer}>
              <Image source={{ uri: item }} style={styles.modalImage} />
            </View>
          )}
          pagingEnabled
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
            setModalImageIndex(newIndex);
          }}
        />
      </Modal>
    );
  }
  
  
  
  
  
  

  // const entireState = useSelector((state) => state);
  // console.log("Entire Redux State:", JSON.stringify(entireState));




  // const toyState = useSelector((state) => state.toy.toys);
  // const rawToys = toyState?.toys || [];
  // const toys = user ? rawToys.filter(toy => toy.user_id !== user.id) : rawToys;
  //const { loading, error } = toyState;



  //const currentToy = (toys && toys.length > currentIndex) ? toys[currentIndex] : null;
  //const currentToy = (toys && toys.length > 0) ? toys[0] : null;
  // const currentToy = (toys && toys.toys && toys.toys.length > currentIndex) ? toys.toys[currentIndex] : null;


  useEffect(() => {
    console.log("Current Redux state for toys:", toys);
  }, [toys]);
  

  useEffect(() => {
    if (user && user.user_latitude && user.user_longitude) {
      console.log('[fetchToysWithinRadiusFromAPI] - Dispatching action...');
      dispatch(fetchToysWithinRadiusFromAPI({ latitude: user.user_latitude, longitude: user.user_longitude }));
    } else {
      console.log('shit outta luck');
      //dispatch(fetchToysFromAPI());
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
//   if (user && (user.user_latitude && user.user_longitude)) {
//     console.log('BEFORE FETCHTOYSWITHINRADIUSFROMAPI DISPATCH');
//     dispatch(fetchToysWithinRadiusFromAPI({ latitude: user.user_latitude, longitude: user.user_longitude }))
//       .then((response) => {
//         if (response.payload) {
//           console.log('Toys within radius fetched', response.payload);
//         }
//       })
//       .catch((error) => console.error(error));
//     console.log('AFTER FETCHTOYSWITHINRADIUSFROMAPI DISPATCH');
//   } else {
//     console.log('BEFORE FETCHTOYSFROMAPI DISPATCH');
//     dispatch(fetchToysFromAPI())
//       .then((response) => {
//         if (response.payload) {
//           console.log('All toys fetched', response.payload);
//         }
//       })
//       .catch((error) => console.error(error));
//     console.log('AFTER FETCHTOYSFROMAPI DISPATCH');
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
    return newIndex;
  });
};
  
  const onSwipeLeft = () => {
    const toyToRemove = toys[currentIndex];
    console.log('Swiping Left');
    //console.log('Current Toy to Remove:', toyToRemove.name, '| Index:', currentIndex);
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
        {/* ... existing code ... */}
      
        {currentToy ? (
        <TouchableOpacity onPress={() => openModal(currentToy, currentIndex)}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.toyImage}
            onLoadStart={() => setImageLoadingError(false)}
            onError={(error) => {
              console.log("Image Loading Error:", error.nativeEvent.error);
              setImageLoadingError(true);
            }}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={{ uri: defaultImageUrl }}
          style={styles.toyImage}
        />
      )}
      
      <Modal 
        transparent={true}
        isVisible={isModalVisible}
        backdropOpacity={0.5}
        onBackdropPress={closeModal}
        backdropPressToClose={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <ScrollView
              horizontal
              pagingEnabled
              contentOffset={{ x: modalImageIndex * screenWidth, y: 0 }}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
                setModalImageIndex(newIndex);
              }}
            >
              {currentToy && currentToy.images?.map((imageUrl, index) => (
                <View key={index} style={styles.modalImageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.modalImage} />
              </View>
              ))}

            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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