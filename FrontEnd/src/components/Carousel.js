// Carousel.js
import React, { useEffect } from 'react';
import { View, Animated, Image, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PanGestureHandler, State } from 'react-native-gesture-handler';


import { fetchToysFromAPI, addToyToBox, removeToyFromCarousel, fetchToysWithinRadiusFromAPI } from '../slices/toySlice';
import { addUserInteraction } from '../slices/userSlice';

function Carousel() {
  const dispatch = useDispatch();
  const { toys, loading, error } = useSelector((state) => state.toy);
  const { user } = useSelector((state) => state.user);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const translateX = new Animated.Value(0);


  // useEffect(() => {
  //   if (!toys.length) {
  //     dispatch(fetchToysFromAPI());
  //   }
  //   fetchToysWithinRadius();
  // }, [dispatch, toys]);


  useEffect(() => {
    if (toys.length === 0) {
      dispatch(fetchToysFromAPI());
      fetchToysWithinRadius();
    }
}, [dispatch, toys]);

  

  const fetchToysWithinRadius = () => {
    if (user && user.latitude && user.longitude) {
      const { latitude, longitude } = user;
      dispatch(fetchToysWithinRadiusFromAPI(latitude, longitude));
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onSwipeRight = () => {
    const toyToAdd = toys[currentIndex];
    dispatch(addToyToBox(toyToAdd));
    dispatch(removeToyFromCarousel(toyToAdd));
    if (user && user.id) { 
      dispatch(addUserInteraction({ userId: user.id, toyId: toyToAdd.id }));
    }
  };

  const onSwipeLeft = () => {
    const toyToRemove = toys[currentIndex];
    dispatch(removeToyFromCarousel(toyToRemove));
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
          {loading && <Text>Loading...</Text>}
          {error && <Text>Error: {error}</Text>}
          {toys[currentIndex] && (
            <Image
              source={{ uri: toys[currentIndex].image_url }}
              style={styles.toyImage}
            />
          )}
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
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});

export default Carousel;
