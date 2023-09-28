import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createSelector } from 'reselect';
import { resetUserState } from '../slices/userSlice';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

//const selectUserBox = state => state.user.userBox;

const selectUserBox = state => {
  console.log('Inside selectUserBox:', state.user.user.userBox);
  return state.user.user.userBox;
};


const getUserBox = createSelector([selectUserBox], userBox => userBox || []);

function UserBox() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  //const user = useSelector(state => state.user.user);
  //console.log('userrrrr', user)


  const userBox = useSelector(getUserBox);
  
  const userBoxArray = Array.isArray(userBox) ? userBox : [];


  //const userBoxArray = Array.isArray(userBox) ? userBox.map(userDetail => userDetail.profilePicture) : [];

  // const userBoxArray = Array.isArray(userBox) ? userBox : [];
  // if (userBox && typeof userBox === "string") {
  //   try {
  //     userBoxArray.push(...JSON.parse(userBox));
  //   } catch (e) {
  //     console.error("Error parsing userBox:", e);
  //   }
  // }



  // if (userBox && typeof userBox === "string") {
  //   try {
  //     userBoxArray.push(...JSON.parse(userBox));
  //   } catch (e) {
  //     console.error("Error parsing userBox:", e);
  //   }
  // }



  console.log("Initial userBox:", userBox);
  console.log("Processed userBoxArray:", userBoxArray);

  const navigation = useNavigation();


  const renderThumbnail = (userDetail, index) => {
    let imageUrl;
    let userDetailObject = userDetail.user_details;
  
    // Add debugging logs
    console.log('userDetail:', userDetail);
    console.log('userDetailObject before navigation:', userDetailObject);
  
    if (typeof userDetail === 'string') {
      imageUrl = userDetail;
      userDetailObject = {}; // If you don't have details, pass an empty object or any default
    } else {
      imageUrl = userDetail.profile_picture;
      userDetailObject = userDetail.user_details;
    }
  
    // Add a log to check the image URL
    console.log('Rendering thumbnail with imageUrl:', imageUrl);
  
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate('UserDetails', {
            user: userDetail,
            imageUrl: imageUrl,
          })
        }
        style={styles.imageContainer}
      >
        <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
      </TouchableOpacity>
    );
  };
  
  




  const handlePageChange = (newPage) => {
    setPage(newPage);
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

  const usersToShow = userBoxArray.slice(startIdx, endIdx);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/*{usersToShow.map(renderThumbnail)}*/}
        {/*{usersToShow.map(userDetail => userDetail && renderThumbnail(userDetail))}*/}
        {usersToShow.map((userDetail, index) => userDetail && renderThumbnail(userDetail, index))}

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