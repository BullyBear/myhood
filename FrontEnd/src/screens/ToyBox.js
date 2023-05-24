import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


const ITEMS_PER_PAGE = 10;

function ToyBox({ toyBox }) {
  const [page, setPage] = useState(1);

  const navigation = useNavigation();

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderThumbnail = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ToyDetails', { toy: item })}>
        <Image source={{ uri: item.image_url }} style={styles.thumbnail} />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (toyBox.length <= ITEMS_PER_PAGE) {
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

    return (
      <View style={styles.paginationContainer}>
        {pageButtons}
      </View>
    );
  };

  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const toysToShow = toyBox.slice(startIdx, endIdx);

  return (
    <View style={styles.container}>
      <FlatList
        data={toysToShow}
        renderItem={renderThumbnail}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        ListFooterComponent={renderFooter}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}


const mapStateToProps = (state) => ({
  toyBox: state.toy.toys,
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 70,
    height: 70,
    margin: 5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  currentPageButton: {
    backgroundColor: '#007aff',
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default connect(mapStateToProps)(ToyBox);
