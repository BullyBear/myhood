import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createSelector } from 'reselect';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

const selectUserBox = state => state.user.userBox;

const getUserBox = createSelector([selectUserBox], userBox => userBox || []);

function UserBox() {
  const [page, setPage] = useState(1);

  const userBox = useSelector(getUserBox);

  const userBoxArray = Array.isArray(userBox) ? userBox : [];
  if (userBox && typeof userBox === "string") {
    try {
      userBoxArray.push(...JSON.parse(userBox));
    } catch (e) {
      console.error("Error parsing userBox:", e);
    }
  }

  console.log("Initial userBox:", userBox);
  console.log("Processed userBoxArray:", userBoxArray);

  const navigation = useNavigation();

  const renderThumbnail = (imageUrl, index) => {
    let imageSize = userBoxArray.length <= 1 ? width * 0.6 : width * 0.3;
    console.log("IMAGE URL", imageUrl);

    return (
      <TouchableOpacity onPress={() => {/* Do whatever when image is clicked */}} style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={{ width: imageSize, height: imageSize }} />
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
