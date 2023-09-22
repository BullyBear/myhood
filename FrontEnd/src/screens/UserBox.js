import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsersByIds, addProfileToUserBoxAsync } from '../slices/userSlice';
import { createSelector } from 'reselect';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

const selectUserBox = state => state.user.userBox;
const selectUsersByIds = state => state.user.usersByIds;
const selectUser = state => state.user.user;

const getUserBox = createSelector([selectUserBox], userBox => userBox || []);
const getUsersByIds = createSelector([selectUsersByIds], usersByIds => usersByIds || {});
const getUser = createSelector([selectUser], user => user || null);

function UserBox() {
  const [page, setPage] = useState(1);
  
  const userBox = useSelector(getUserBox);
  const usersByIds = useSelector(getUsersByIds);
  const user = useSelector(getUser);
  
  const dispatch = useDispatch();


  // useEffect(() => {
  //   console.log("USER", user);
  //   console.log("PROFILE", user.profile_picture);
  //   console.log("usersByIds:", usersByIds);
  //   console.log("userBox:", userBox);
    
  //   if (userBox && userBox.length > 0) {
  //     console.log('Dispatching the fetchUsersByIds thunk');
  //     dispatch(fetchUsersByIds(userBox.slice(0, 10)));
      
  //     // Check if user data is available before dispatching
  //     if (user && user.id && user.profile_picture) {
  //       dispatch(addProfileToUserBoxAsync({
  //         userId: user.id,
  //         profileData: { profile_picture: user.profile_picture }
  //       }));
  //     }
  //   }
  // }, [userBox, user]);




  useEffect(() => {
    if (userBox && userBox.length > 0) {
        console.log('Dispatching the fetchUsersByIds thunk');
        dispatch(fetchUsersByIds(userBox.slice(0, 10)));
    }
  }, [userBox]);
  

// First useEffect to add the profile
useEffect(() => {
  if (user && user.id && user.profile_picture) {
      dispatch(addProfileToUserBoxAsync({
          userId: user.id,
          profileData: { profile_picture: user.profile_picture }
      }));
  }
}, [user]);







  
  useEffect(() => {
    console.log("Updated usersByIds:", usersByIds);
    console.log("Updated userBox:", userBox);
  }, [usersByIds, userBox]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderThumbnail = (item, index) => {
    let imageSize = usersToShow.length <= 1 ? width * 0.6 : width * 0.3;
    const imageUrl = item.profile_picture;
    console.log("imageUrl:", imageUrl);

    return (
      <TouchableOpacity onPress={() => navigation.navigate('UserDetails', { user: item })} style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={{ width: imageSize, height: imageSize }} />
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
        <TouchableOpacity key={i} style={[styles.pageButton, i === page ? styles.currentPageButton : null]} onPress={() => handlePageChange(i)}>
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

  const usersToShow = Array.isArray(userBox) 
  ? userBox.slice(startIdx, endIdx).reduce((result, id) => {
      const user = usersByIds[id];  
      if (user) result.push(user);
      return result;
  }, []) 
  : [];

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {usersToShow.map(renderThumbnail)}
        <Text>placeholder</Text>
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
});

export default UserBox;
