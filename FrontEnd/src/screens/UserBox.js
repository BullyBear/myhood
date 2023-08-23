// UserBox.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { fetchUsersByIds } from '../slices/userSlice';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

function UserBox({ userBox, usersByIds, fetchUsersByIds, userInteractions }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userBox && userBox.length > 0) {
      fetchUsersByIds(userBox.slice(0, 10));
    }
  }, [userBox, fetchUsersByIds]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderThumbnail = (item, index) => {
    let imageSize = usersToShow.length <= 1 ? width * 0.6 : width * 0.3;
    const imageUrl = item.profile_picture || item.image_url;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('UserDetails', { user: item })} style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={{ width: imageSize, height: imageSize }} />
      <Text style={{marginTop: 10}}>{item.bio}</Text>
    </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!userBox || userBox.length <= ITEMS_PER_PAGE) {
      return null;
    }

    const numPages = Math.ceil(userBox.length / ITEMS_PER_PAGE);
    const pageButtons = [];

    for (let i = 1; i <= numPages; i++) {
      pageButtons.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, i === page ? styles.currentPageButton : null]}
          onPress={() => handlePageChange(i)}
        >
          <Text style={styles.pageButtonText}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        {pageButtons}
      </View>
    );
  };
  
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;

  //const usersToShow = Array.isArray(userBox) ? userBox.slice(startIdx, endIdx) : [];
  const usersToShow = Array.isArray(userBox) 
  ? userBox.slice(startIdx, endIdx).map(id => usersByIds[id]).filter(user => user) 
  : [];


  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {usersToShow.map(renderThumbnail)}
      </View>
      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageContainer: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  // ... other styles here
});

const mapStateToProps = (state) => ({
  usersByIds: state.user.usersByIds,
  userInteractions: state.user.userInteractions,
  user: state.user.user,
});

const mapDispatchToProps = {
  fetchUsersByIds,
};

// export default connect(mapStateToProps, mapDispatchToProps)(UserBox);

export default UserBox;