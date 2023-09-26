import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createSelector } from 'reselect';

import { fetchUsersByIds, addProfileToUserBoxAsync, resetUserState } from '../slices/userSlice';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;


const selectUser = state => state.user.user;
const selectUsersByIds = state => state.user.usersByIds;
const selectUserBox = state => state.user.userBox;


const getUser = createSelector([selectUser], user => user || null);
const getUsersByIds = createSelector([selectUsersByIds], usersByIds => usersByIds || {});
const getUserBox = createSelector([selectUserBox], userBox => userBox || []);


function UserBox() {
  const [page, setPage] = useState(1);
  

  const user = useSelector(getUser);
  const usersByIds = useSelector(getUsersByIds);
  const userBox = useSelector(getUserBox);

  // let userBoxArray = [];

  // try {
  //     userBoxArray = JSON.parse(userBox);
  // } catch (e) {
  //     userBoxArray = [];
    
  // } 

  const userBoxArray = Array.isArray(userBox) ? userBox : JSON.parse(userBox);

  console.log("Initial userBox:", userBox);
  console.log("Processed userBoxArray:", userBoxArray);
  

  const navigation = useNavigation();
  
  const dispatch = useDispatch();


  // useEffect(() => {
  //   console.log("USER FROM USERBOX", user);
  //   console.log("usersByIds:", usersByIds);
  //   console.log("userBoxArray:", userBoxArray);
    
  //     //dispatch(resetUserState());

  //     if (userBoxArray !== null && userBoxArray.length > 0) {
  //     console.log('Dispatching the fetchUsersByIds thunk');
  //     dispatch(fetchUsersByIds(userBoxArray.slice(0, 100)));

  //   }
  // }, [userBoxArray, user]);



  useEffect(() => {
    console.log("USER FROM USERBOX", user);
    console.log("usersByIds:", usersByIds);
    console.log("userBoxArray:", userBoxArray);
    
    if (user) {
      // Fetch users who swiped right on your profile based on your user ID
      dispatch(fetchUsersByIds([user.id]));
    }

    if (userBoxArray !== null && userBoxArray.length > 0) {
      console.log('Dispatching the fetchUsersByIds thunk');
      dispatch(fetchUsersByIds(userBoxArray.slice(0, 100)));
    }
}, [userBoxArray, user]);




  

  
     
    
  // useEffect(() => {
  //   console.log("Updated usersByIds:", usersByIds);
  //   console.log("Updated userBoxArray:", userBoxArray);
  // }, [usersByIds, userBoxArray]);


  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderThumbnail = (item, index) => {
    let imageSize = usersToShow.length <= 1 ? width * 0.6 : width * 0.3;
    const imageUrl = item.profile_picture;
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('UserDetails', { user: item })} style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={{ width: imageSize, height: imageSize }} />
      </TouchableOpacity>
    );
  };
  
  
  

  const renderFooter = () => {
    if (!userBoxArray || userBoxArray.length <= ITEMS_PER_PAGE) {
      return null;
    }

    const numPages = Math.ceil(userBoxArray.length / ITEMS_PER_PAGE);
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

  const usersToShow = Array.isArray(userBoxArray) 
  ? userBoxArray.slice(startIdx, endIdx).reduce((result, id) => {
      const user = usersByIds[id];  
      if (user) result.push(user);
      return result;
  }, []) 
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
});

export default UserBox;
