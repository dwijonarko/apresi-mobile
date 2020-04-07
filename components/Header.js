import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Header = () => {
  return (
    <View style={{marginRight: 10}}>
      <Icon
        raised
        name="cog"
        type="font-awesome"
        color="#9e9e9e"
        size={22}
        onPress={() => console.log('hello')}
      />
    </View>
  );
};

export default Header;
