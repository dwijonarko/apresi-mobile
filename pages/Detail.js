import React from 'react';
import {View, Image, ImageBackground,Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import constants from '../config/constants';

const Detail = ({route, navigation}) => {
  const {image_front} = route.params;
  const {image_back} = route.params;
  const {latitude} = route.params;
  const {longitude} = route.params;
  const {date} = route.params;
  let data_image_front =
  constants.BASE_URL + image_front;
  let data_image_back =
  constants.BASE_URL + image_back;
  return (
    <View style={{width: '100%', height: '100%'}}>
      <MapView
        style={{width: '100%', height: '100%'}}
        initialRegion={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        }}>
        <Marker
          coordinate={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
          title="Your Location "
          >
          <ImageBackground
            source={require('../assets/images/bg.png')}
            style={{height: 285, width: 300}}>
            <View style={{marginTop:15,alignContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold'}}>{date}</Text></View>
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                justifyContent: 'space-around',
                marginTop:5,
                height:285
              }}
            >
            <Image
              source={{uri: data_image_front}}
              style={{width:100,height:140}}
            />
            <Image
              source={{uri: data_image_back}}
              style={{width:100,height:140}}
            />
            </View>
          </ImageBackground>
        </Marker>
      </MapView>
    </View>
  );
};

export default Detail;
