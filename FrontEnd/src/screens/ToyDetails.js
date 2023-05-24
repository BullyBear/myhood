import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { getUserById, getToyById } from '../API/userAPI';



function ToyDetails({ toy, navigation }) {
  const [submitter, setSubmitter] = useState(null);

  useEffect(() => {
    const fetchSubmitter = async () => {
      const submitterData = await getUserById(toy.submitter_id);
      setSubmitter(submitterData);
    };
    fetchSubmitter();
  }, [toy.submitter_id]);

  return (
    <View>
      <Image source={{ uri: toy.image_url }} style={{ width: 200, height: 200 }} />
      <Text>{toy.description}</Text>
      {submitter && (
        <TouchableOpacity onPress={() => navigation.navigate('UserDetails', { user: submitter })}>
          <Text>{submitter.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const mapStateToProps = (state, ownProps) => ({
  toy: state.toy.toys.find((toy) => toy.id === ownProps.route.params.toyId),
});

export default connect(mapStateToProps)(ToyDetails);
