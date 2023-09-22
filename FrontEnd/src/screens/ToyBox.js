import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

function ToyBox() {
  const [page, setPage] = useState(1);

  const navigation = useNavigation();
  const toyBox = useSelector((state) => state.toy.toyBox);
  const toyImages = useSelector((state) => state.toy.toyImages);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderThumbnail = (item, index) => {
    if (!item || !toyImages[index]) return null;

    // Assuming each toy object has an 'image_url' property
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate('ToyDetails', { toyId: item.id })}
        style={styles.imageContainer}
      >
      <Image
        source={{ uri: toyImages[index] }}
        style={{ width: width * 0.6, height: width * 0.6 }}
      />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!toyBox || toyBox.length <= ITEMS_PER_PAGE) {
      return null;
    }

    const numPages = Math.ceil(toyBox.length / ITEMS_PER_PAGE);
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

    return <View style={styles.paginationContainer}>{pageButtons}</View>;
  };

  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const toysToShow = Array.isArray(toyBox) ? toyBox.slice(startIdx, endIdx) : [];

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>{toysToShow.map(renderThumbnail)}</View>
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
    justifyContent: 'center',
  },
  // ... other styles here
});

export default ToyBox;
