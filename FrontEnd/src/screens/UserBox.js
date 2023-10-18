import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createSelector } from 'reselect';
import { resetUserState } from '../slices/userSlice';
import { addSwipedToy } from '../slices/toySlice';


const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;


const selectUserBox = state => {
  return state.user.user.userBox;
};

const getUserBox = createSelector([selectUserBox], userBox => userBox || []);


function UserBox() {
  
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();


  //const user = useSelector(state => state.user);
  const user = useSelector(state => state.user.user);
  const userId = user.id;

  const swipedToy = useSelector(state => state.toy.swipedToy);

  console.log("USERBOX user", user)
  console.log("USERBOX userid", userId)

  console.log("USERBOX swipedtoy", swipedToy)


  const state = useSelector(state => state);
  console.log("USERBOX STATE!", state)








// const selectSwipedToysForUser = (state, userId) => {
//   return state.userSwipedToys ? state.userSwipedToys[userId] || [] : [];
// };




const selectSwipedToysForUser = (state, userId) => {
  console.log('USERBOX state.toy.userswipedtoy', state.toy.userSwipedToys)
  return state.toy.userSwipedToys ? state.toy.userSwipedToys[userId] || [] : [];
};





console.log('TACO', selectSwipedToysForUser(state, userId));

// Inside your component
const userSwipedToys = useSelector(state => selectSwipedToysForUser(state, userId));



  const userBox = useSelector(getUserBox);
  
  const userBoxArray = Array.isArray(userBox) ? userBox : [];


  const navigation = useNavigation();



  useEffect(() => {
    console.log("USERBOX swipedToy updated in UserBox:", swipedToy);
  }, [swipedToy]);
  


  const renderThumbnail = (userDetail, index) => {
    console.log("Entire userDetail:", userDetail);
    const imageUrl = userDetail.profile_picture;
    const userDetailObject = userDetail.details || {};

    // Fetching the toy for this specific user
    const toyForThisUser = userSwipedToys[userDetail.id];
    const mostRecentToy = toyForThisUser ? toyForThisUser[toyForThisUser.length - 1] : null;

    const currentSwipedToy = selectSwipedToysForUser(state, userDetail.id);
    
    
    console.log("USERBOX SWIPED KID", currentSwipedToy);

    return (
        <TouchableOpacity
            key={index}
            onPress={() =>
                navigation.navigate('UserDetails', {
                    user: userDetail,
                    imageUrl: imageUrl,
                    swipedToy: selectSwipedToysForUser(state, userDetail.id)
                })
            }
            style={styles.imageContainer}
        >
            <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
        </TouchableOpacity>
    );
};





// const renderThumbnail = (userDetail, index) => {
//   const imageUrl = userDetail.profile_picture;
//   const toyId = userDetail.details.toy_id; // extract the toy_id

//   return (
//       <TouchableOpacity
//           key={index}
//           onPress={() => navigation.navigate('UserDetails', {
//               user: userDetail,
//               imageUrl: imageUrl,
//               swipedToyId: toyId
//           })}
//           style={styles.imageContainer}
//       >
//           <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
//       </TouchableOpacity>
//   );
// };

  
  



 

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
        {usersToShow.map((userDetail, index) => userDetail && renderThumbnail(userDetail, index, swipedToy))}

        <TouchableOpacity 
        style={{ marginTop: 50 }} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.boldButtonText}>Go Back</Text>
      </TouchableOpacity>

      </View>
      {/*{renderFooter()}*/}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
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


export default UserBox;