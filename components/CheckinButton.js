import React from 'react';
import {Button} from 'react-native-elements';

export default function CheckinButton(props) {
  const {title, isDisabled, onPress} = props;
  return isDisabled ? (
    <Button
      icon={{
        name: 'save',
        size: 15,
        color: 'white',
      }}
      title={title}
      buttonStyle={{backgroundColor: '#00bcd4', width: 150}}
      onPress={onPress}
      disabled={true}
    />
  ) : (
    <Button
      icon={{
        name: 'save',
        size: 15,
        color: 'white',
      }}
      title={title}
      buttonStyle={{backgroundColor: '#00bcd4', width: 150}}
      onPress={onPress}
    />
  );
}
