import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const SOSRequestPage = () => {
  const [peopleCount, setPeopleCount] = useState('');
  const [image, setImage] = useState('');
  const [situationLevel, setSituationLevel] = useState('');
  const [situationDescription, setSituationDescription] = useState('');

  const handleSOSRequest = () => {
    // Implement SOS request logic here
    console.log('SOS requested with:', peopleCount, image, situationLevel, situationDescription);
  };

  return (
    <View>
      <TextInput
        placeholder="Approx Number of People"
        value={peopleCount}
        onChangeText={(text) => setPeopleCount(text)}
        keyboardType="numeric"
      />
      {/* Add image upload component */}
      <TextInput
        placeholder="Situation Level"
        value={situationLevel}
        onChangeText={(text) => setSituationLevel(text)}
      />
      <TextInput
        placeholder="Situation Description"
        value={situationDescription}
        onChangeText={(text) => setSituationDescription(text)}
      />
      <Button title="Submit SOS Request" onPress={handleSOSRequest} />
    </View>
  );
};

export default SOSRequestPage;
