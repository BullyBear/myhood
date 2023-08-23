import React, { useEffect, useState } from 'react';
import { View, Animated, Image, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import {
  fetchToysFromAPI,
  fetchToysWithinRadiusFromAPI,
  removeToyFromCarousel,
} from '../slices/toySlice';

import {
  addProfileToUserBoxAsync
} from '../slices/userSlice';


// import { addUserInteraction } from '../slices/userSlice';




function Carousel() {

  const defaultImageUrl = 'https://deplorablesnowflake.com/static/american.jpg';

  const dispatch = useDispatch();


  const { user } = useSelector((state) => state.user);
  //const { user } = useSelector((state) => state.user.users);
  console.log('USER', user)


  //const { toys, loading, error } = useSelector((state) => state.toy);
  //const { toys = [], loading, error } = useSelector((state) => state.toy);
  //const { toys, loading, error } = useSelector((state) => state.toys.toys);


  const { toys = [], loading, error } = useSelector((state) => state.toy.toys);

  // const toyState = useSelector((state) => state.toy.toys);
  // const rawToys = toyState?.toys || [];
  // const toys = user ? rawToys.filter(toy => toy.user_id !== user.id) : rawToys;
  //const { loading, error } = toyState;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentToy = (toys && toys.length > currentIndex) ? toys[currentIndex] : null;
  const imageUrl = currentToy ? currentToy.image_url : defaultImageUrl;
  console.log("Extracted Image URL:", imageUrl);

  //const bio = useSelector(state => state.user.bio);
  //const profilePicture = useSelector(state => state.user.profile_picture);
  const bio = useSelector(state => state.user.user.bio);
  const profilePicture = useSelector(state => state.user.user.profile_picture);
  


  //const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const translateX = new Animated.Value(0);

  console.log('useEffect triggered');

  console.log('Entire Toys Array:', toys);
  console.log('Current Toy at Index:', [currentIndex]);
  //console.log('Current Toy Image URL:', toys.toys[currentIndex]?.image_url);
  console.log('Current Toy Image URL:', toys[currentIndex]?.image_url);


  // const entireState = useSelector((state) => state);
  // console.log('Entire Redux State:', entireState);



  useEffect(() => {

    if (toys.length === 0) {
      //if (toys.length > 0) {
      console.log("I DONT SEE THIS")
      dispatch(fetchToysFromAPI());
    }
        
    if (user && user.latitude && user.longitude) {
      console.log('fetchToysWithinRadiusFromAPI', fetchToysWithinRadiusFromAPI);
      dispatch(fetchToysWithinRadiusFromAPI({ latitude: user.latitude, longitude: user.longitude }));
    }
  }, [user]);
  
  
  useEffect(() => {
      if (toys.length > 0) {
          setLoaded(true);
          if (currentIndex === -1 || typeof currentIndex === 'undefined') {
              setCurrentIndex(0); // explicitly set to 0
          }
      }
  }, [toys]);
  

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


  
    // Dispatch with the user ID using the Async action
    //dispatch(addProfileToUserBoxAsync(userIdOfToy));  
    //dispatch(addProfileToUserBoxAsync({ userId: userIdOfToy, profileData: profileData }));

    dispatch(addProfileToUserBoxAsync({
      userId: userIdOfToy, 
      profileData: {
          bio: bio, 
          profile_picture: profilePicture
      }
  }));

    dispatch(removeToyFromCarousel(toyToShow));
  
    if (user && user.id) {
      console.log('Recording User Interaction for User:', user.id);
      // Add logic here if you want to record interactions between users
    }
  
  // setCurrentIndex((prevIndex) => {
  //     if (toys.length === 0) return 0;  // If toys array is empty, keep index at 0
  //     const newIndex = (prevIndex < toys.length - 1 ? prevIndex + 1 : 0);
  //     console.log('New Current Index after Swipe Right:', newIndex);
  //     return newIndex;
  //   });
  // };

  setCurrentIndex((prevIndex) => {
    if (toys.length === 0) return 0;  // If toys array is empty, keep index at 0
    const newIndex = (prevIndex < toys.length - 1 ? prevIndex + 1 : 0);
    return newIndex;
  });
};
  
  
  


  // const onSwipeRight = () => {
  //   if (currentIndex < toys.length - 1) {
  //     const newCurrentIndex = currentIndex + 1;
  //     const toyToAdd = toys[newCurrentIndex];
  //     console.log('Toy to Add:', toyToAdd);
  //     console.log('Current Index on Swipe Right:', newCurrentIndex);
  //     setCurrentIndex(newCurrentIndex);
  //     dispatch(addProfileToUserBox(toyToAdd));
  //     dispatch(removeToyFromCarousel(toyToAdd));
  //     if (user && user.id) {
  //       dispatch(addUserInteraction({ userId: user.id, toyId: toyToAdd.id }));
  //     }
  //   }
  // };
  

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


//   const onSwipeLeft = () => {
//     if (currentIndex < toys.length - 1) {
//         const newCurrentIndex = currentIndex + 1;
//         const toyToRemove = toys[newCurrentIndex];
//         console.log('Toy to Remove:', toyToRemove);
//         console.log('Current Index on Swipe Left:', newCurrentIndex);
//         setCurrentIndex(newCurrentIndex);
//         dispatch(removeToyFromCarousel(toyToRemove));
//     }
// };

  
  return (
    <View style={styles.carouselContainer}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.oldState === State.ACTIVE) {
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
        }}
      >
        <Animated.View
          style={[
            styles.carouselItem,
            { transform: [{ translateX }] },
          ]}
        >
          <Text>Current Index: {currentIndex}</Text>
          {loading && <Text>Loading...</Text>}
          {error && <Text>Error: {error}</Text>}

          
      
          <Image
            source={{ uri: imageUrl }}
            style={styles.toyImage}
            onLoadStart={() => setImageLoadingError(false)}
            onError={(error) => {
            console.log("Image Loading Error:", error.nativeEvent.error);
            }}
          />
         

        </Animated.View>
      </PanGestureHandler>
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
});

export default Carousel;