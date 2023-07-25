import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { fetchUsersByIds } from '../slices/userSlice';
import ToyBox from './ToyBox';


function UserBox({ userBox, usersByIds, fetchUsersByIds }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsersByIds(userBox.slice(0, 10));
  }, []);

  const handleLoadMore = () => {
    setPage(page + 1);
    fetchUsersByIds(userBox.slice(page * 10, page * 10 + 10));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserDetails', { userId: item.id })}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: item.image_url }} style={{ width: 50, height: 50, marginRight: 10 }} />
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={usersByIds}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
    />
  );
}

const mapStateToProps = (state) => ({
  usersByIds: state.user.usersByIds,
});

const mapDispatchToProps = {
  fetchUsersByIds,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserBox);
