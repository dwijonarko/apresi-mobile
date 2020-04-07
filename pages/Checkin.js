import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MapView from 'react-native-maps';
import gmaps from '../assets/images/gmaps.jpg';
import snap from '../assets/images/snap.png';

import {Card, Button, ListItem, Header} from 'react-native-elements';
const Checkin = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Card>
          <View style={{width: '100%', height: 200}}>
            <MapView
            style={styles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
        </Card>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
              Please attach your image
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Card>
              <Image
                source={snap}
                resizeMode={'cover'}
                style={{width: 100, height: 200}}
              />
            </Card>
            <Card>
              <Image
                source={snap}
                resizeMode={'cover'}
                style={{width: 100, height: 200}}
              />
            </Card>
          </View>
        </Card>
        <View
          style={{
            paddingHorizontal: 10,
            marginVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Button
            icon={{
              name: 'save',
              size: 15,
              color: 'white',
            }}
            title="Checkin"
            buttonStyle={{backgroundColor: '#00bcd4', width: 150}}
          />
          <Button
            icon={{
              name: 'arrow-back',
              size: 15,
              color: 'white',
            }}
            title="Cancel"
            buttonStyle={{backgroundColor: '#ff9800', width: 150}}
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 200,
  },
  box: {
    backgroundColor: '#b3e5fc',
  },
  gmaps: {
    width: Dimensions.get('window').width,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  userAvatar: {},
});

export default Checkin;
