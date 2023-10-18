import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import toySlice from '../slices/toySlice';

const { width, height } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

function ToyBox() {
  const [page, setPage] = useState(1);

  const navigation = useNavigation();


  const toyState = useSelector((state) => state.toy);

  const toys = useSelector((state) => state.toy.toys || []);
  const toyBox = useSelector((state) => state.toy.toyBox || []);
  //const toyImages = useSelector((state) => state.toy.toyImages || []);

  const toyImages = toys.map(toy => toy.image_url_one);  // assuming you only want the first image.




  console.log("Toy State:", toyState);
  console.log ("TOYS IN TOYBOX", toys);
  console.log("ToyBox:", toyBox);
  console.log("ToyImages in ToyBox:", toyImages);


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const renderThumbnail = (toy, index) => {
    if (!toy || !toy.image_url_one) return null;
    return (
      <TouchableOpacity
          key={toy.id}
          onPress={() => navigation.navigate('ToyDetails', { toy: toy })}
          style={styles.imageContainer}
      >
          <Image
              source={{ uri: toy.image_url_one }}
              style={{ width: 100, height: 100 }} // This matches UserBox styling
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
  //const toysToShow = Array.isArray(toyBox) ? toyBox.slice(startIdx, endIdx) : [];
  const toysToShow = Array.isArray(toys) ? toys.slice(startIdx, endIdx) : [];



  console.log("toysToShow length: ", toysToShow.length);
  console.log("toyBox length: ", toyBox.length);
 

  console.log('TOYSTOSHOW', toysToShow)

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {toysToShow.map((toy, index) => toy && renderThumbnail(toy, index))}
      </View>
      <TouchableOpacity 
        style={{ marginTop: 50 }} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.boldButtonText}>Go Back</Text>
      </TouchableOpacity>
      {/*{renderFooter()}*/}
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
  boldButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#333', // Dark background for contrast
    color: '#fff', // White text
    padding: 10, // Padding for a larger touch target and better look
    borderRadius: 5, // Rounded corners
    marginTop: 200, // Give it some space from the list items
    alignSelf: 'center', // Center the button horizontally
    width: 120, // Set a fixed width

  },

});

export default ToyBox;
