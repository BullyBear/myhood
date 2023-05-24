import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { fetchToysFromAPI } from '../reducers/toySlice';

import { Button } from '@rneui/base';


const FrontPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const { toys, loading, error } = useSelector((state) => state.toy);

  useEffect(() => {
    dispatch(fetchToysFromAPI());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Button title="Hello World" />
      {toys && toys.length > 0 ? (
        toys.map((toy) => (
          <Text key={toy.id}>{toy.name}</Text>
        ))
      ) : (
        <Text>No toys found</Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('NavigationPage')}>
        <Text>Go to Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FrontPage;
