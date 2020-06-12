import React from 'react';
import {Button} from 'react-native-elements';

export default function MyButton(props) { 
  const {title, isLoading, onPress} = props;
  return isLoading ? (
    <Button title={title} loading />
  ) : (
    <Button title={title} onPress={onPress} />
  );
}
