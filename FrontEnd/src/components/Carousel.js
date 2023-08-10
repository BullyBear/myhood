import React, { useEffect, useState } from 'react';
import { View, Animated, Image, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import {
  fetchToysFromAPI,
  fetchToysWithinRadiusFromAPI,
  addToyToBox,
  removeToyFromCarousel,
} from '../slices/toySlice';

import { addUserInteraction } from '../slices/userSlice';

function Carousel() {

  //const defaultImageUrl = 'https://deplorablesnowflake.com/static/american.jpg';

  const dispatch = useDispatch();

  //const { toys, loading, error } = useSelector((state) => state.toy);
  const { toys, loading, error } = useSelector((state) => state.toy.toys);


  const { user } = useSelector((state) => state.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const translateX = new Animated.Value(0);

  console.log('useEffect triggered');

  console.log('Entire Toys Array:', toys);
  console.log('Current Toy at Index:', toys[currentIndex]);
  console.log('Current Toy Image URL:', toys[currentIndex]?.image_url);


  useEffect(() => {
      if (toys.length === 0) {
        dispatch(fetchToysFromAPI());
      }
      
      if (user && user.latitude && user.longitude) {
        console.log('fetchToysWithinRadiusFromAPI', fetchToysWithinRadiusFromAPI);
        dispatch(fetchToysWithinRadiusFromAPI({ latitude: user.latitude, longitude: user.longitude }));
      }

      console.log('Toys in useEffect:', toys);
      console.log('Current Index in useEffect:', currentIndex);
      
  }, [user.latitude, user.longitude]);
  
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
    if (currentIndex < toys.length - 1) {
      const newCurrentIndex = currentIndex + 1;
      const toyToAdd = toys[newCurrentIndex];
      console.log('Toy to Add:', toyToAdd);
      console.log('Current Index on Swipe Right:', newCurrentIndex);
      setCurrentIndex(newCurrentIndex);
      dispatch(addToyToBox(toyToAdd));
      dispatch(removeToyFromCarousel(toyToAdd));
      if (user && user.id) {
        dispatch(addUserInteraction({ userId: user.id, toyId: toyToAdd.id }));
      }
    }
  };
  
  const onSwipeLeft = () => {
    if (currentIndex > 0) {
      const newCurrentIndex = currentIndex - 1;
      const toyToRemove = toys[newCurrentIndex];
      console.log('Toy to Remove:', toyToRemove);
      console.log('Current Index on Swipe Left:', newCurrentIndex);
      setCurrentIndex(newCurrentIndex);
      dispatch(removeToyFromCarousel(toyToRemove));
    }
  };
  
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
            source={{ uri: toys[currentIndex]?.image_url || 'https://deplorablesnowflake.com/static/american.jpg' }}
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