import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const LogoTitle = () => {
  return (
    <View style={{flexDirection:'row'}}>
      <Icon raised name="home" type="font-awesome" color="#9e9e9e" size={22} />
      <View style={{flex:1,flexDirection:'row'}}>
            <Text style={{marginLeft:5,textAlign:'center',fontSize:16,fontWeight:'bold'}}>Siprenta Lite</Text>
      </View>
    </View>
  );
};

export default LogoTitle;
