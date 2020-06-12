import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../App';

const Header = () => {
  const {signOut} = React.useContext(AuthContext);
  return (
    <View style={{marginRight: 10}}>
      <Icon
        raised
        name="md-exit"
        type="ionicon"
        color="#9e9e9e"
        size={22}
        onPress={signOut}
      />
    </View>
  );
};

export default Header;
