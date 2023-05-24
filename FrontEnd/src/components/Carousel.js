import React, { useEffect } from 'react';
import { View, Text, Animated, Image } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { fetchToys } from '../actions/toyActions';
import { addToyToBox } from '../actions/userActions'; // import addToyToBox action

function Carousel({ toys, fetchToys, addToyToBox }) {
  useEffect(() => {
    fetchToys();
  }, []);

  const translateX = new Animated.Value(0);
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onSwipeRight = (toy) => {
    addToyToBox(toy);
  };

  return (
    <View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.translationX >= 100) {
            onSwipeRight(toys[0]);
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
          {toys.map((toy, index) => (
            <Image
              key={index}
              source={{ uri: toy.image_url }}
              style={{ width: 100, height: 100, marginRight: 10 }}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const mapStateToProps = (state) => ({
  toys: state.toy.toys,
});

const mapDispatchToProps = {
  fetchToys,
  addToyToBox,
};

export default connect(mapStateToProps, mapDispatchToProps)(Carousel);
