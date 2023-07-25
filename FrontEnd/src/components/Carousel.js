import React, { useEffect, useState } from 'react';
import { View, Animated, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { fetchToysFromAPI, addToyToBox, removeToyFromCarousel } from '../slices/toySlice';

function Carousel() {
  const dispatch = useDispatch();
  //const { toys, toyBox, loading, error } = useSelector((state) => state.toys);
  //const { toys, toyBox, loading, error } = useSelector((state) => state.toy);
  const { toys, loading, error } = useSelector((state) => state.toy);



  useEffect(() => {
    if (!toys.length) {
      dispatch(fetchToysFromAPI());
    }
  }, [dispatch, toys]);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const translateX = new Animated.Value(0);
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onSwipeRight = () => {
    const toyToAdd = toys[currentIndex];
    dispatch(addToyToBox(toyToAdd));
    dispatch(removeToyFromCarousel(toyToAdd));
    setCurrentIndex(prevIndex => (prevIndex < toys.length - 1 ? prevIndex + 1 : 0));
  };
  
  const onSwipeLeft = () => {
    setCurrentIndex(prevIndex => (prevIndex < toys.length - 1 ? prevIndex + 1 : 0));
  };
  


  return (
    <View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={({ nativeEvent }) => {
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
        }}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            transform: [{ translateX }],
          }}
        >
          {loading && <Text>Loading...</Text>}
          {error && <Text>Error: {error}</Text>}
          {toys[currentIndex] && (
            <Image
              source={{ uri: toys[currentIndex].image_url }}
              style={{ width: 100, height: 100, marginRight: 10 }}
            />
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

export default Carousel;
