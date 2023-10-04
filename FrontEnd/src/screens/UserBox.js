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
  //   console.log("Entire userDetail:", userDetail);
  //   let imageUrl;
  //   //let userDetailObject = userDetail.user_details;
  //   let userDetailObject = userDetail.user_details || {}; 

    
  //   // Fetching the toy for this specific user
  //   //const toyForThisUser = userSwipedToys[userDetail.id];
  //   const toyForThisUser = userSwipedToys[userDetail.details.id];
    

  //   const mostRecentToy = toyForThisUser ? toyForThisUser[toyForThisUser.length - 1] : null;


  //   console.log("hmmm", userDetail.details)

  //   console.log("Toys swiped by user with ID:", userId, userSwipedToys);
  //   console.log("USERDETAILOBJECT", userDetailObject)

  
  //   if (typeof userDetail === 'string') {
  //     imageUrl = userDetail;
  //     userDetailObject = {}; 
  //   } else {
  //     imageUrl = userDetail.profile_picture;
  //     userDetailObject = userDetail.user_details;
  //   }


  // //   if (typeof userDetail === 'string') {
  // //     imageUrl = userDetail;
  // //     userDetailObject = {}; 
  // // } else if (userDetail && userDetail.profile_picture && userDetail.user_details) {
  // //     imageUrl = userDetail.profile_picture;
  // //     userDetailObject = userDetail.user_details;
  // // } else {
  // //     // Handle unexpected data structures here
  // //     imageUrl = '';
  // //     userDetailObject = {};
  // // }
  
  
  //   return (
  //     <TouchableOpacity
  //       key={index}
  //       onPress={() =>
  //         navigation.navigate('UserDetails', {
  //           user: userDetail,
  //           imageUrl: imageUrl,
  //           //swipedToy: mostRecentToy
  //           //swipedToy: swipedToy
  //           //swipedToy: userSwipedToys
  //           swipedToy: selectSwipedToysForUser(state, userDetail.details.id)

  //         })
  //       }
  //       style={styles.imageContainer}
  //     >
  //       <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
  //     </TouchableOpacity>
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