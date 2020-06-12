import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-community/async-storage';
import constants from '../config/constants';
import {Card, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import CheckinButton from '../components/CheckinButton';
const Checkin = ({route, navigation}) => {
  const {user_id} = route.params;
  const {image_data_front} = route.params;
  const {image_data_back} = route.params;
  const [userToken, setUserToken] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [location, setLocation] = React.useState([]);
  const [imageData, setImageData] = React.useState('');

  const hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  useFocusEffect(
    React.useCallback(() => {
      setImageData(image_data_front);
    }, [imageData]),
  );

  React.useEffect(() => {
    const getLocation = async () => {
      if (await hasLocationPermission()) {
        await Geolocation.getCurrentPosition(
          position => {
            setLocation(position);
            if (location != null) {
              setIsLoading(false);
            }
          },
          error => {
            setIsLoading(false);
            // console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 50,
            forceRequestLocation: true,
          },
        );
      }
    };
    let token;
    const bootstrapAsync = async () => {
      try {
        token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
        getLocation();
      } catch (e) {
        console.log(e);
      }
    };
    bootstrapAsync();
  }, []);

  const postCheckin = () => {
    setIsLoading(true);
    fetch(constants.POST_USER_CHECKIN_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        type: 1,
        token: 'siprenta',
        image_front: image_data_front,
        image_back: image_data_back,
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      setIsLoading(false);
        if (json.errors) {
          ToastAndroid.show(json.message, ToastAndroid.LONG);
        } else {
          ToastAndroid.show('Data berhasil disimpan.', ToastAndroid.LONG);
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.error(error);
      });
    //   console.log(location);
  };
  return isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Card>
          <View style={{width: '100%', height: 200}}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034,
              }}>
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
                // description={marker.description}
              />
            </MapView>
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
              <View style={styles.camera}>
                <Image
                  source={{uri: `data:image/png;base64,${image_data_front}`}}
                  style={styles.preview}
                />
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: -20,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Camera', {type: 'front'})
                    }
                    style={styles.capture}>
                    <Icon
                      raised
                      name="camera"
                      size={30}
                      type="font-awesome"
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
            <Card>
              <View style={styles.camera}>
                <Image
                  source={{uri: `data:image/png;base64,${image_data_back}`}}
                  style={styles.preview}
                />
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: -20,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Camera', {type: 'back'})
                    }
                    style={styles.capture}>
                    <Icon
                      raised
                      name="camera"
                      size={30}
                      type="font-awesome"
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
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
          <CheckinButton
            title="Checkin"
            onPress={postCheckin}
            isDisabled={image_data_back && image_data_front ? false:true}
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
  camera: {
    width: 100,
    height: 200,
  },
  preview: {
    width: 100,
    height: 200,
  },
});

export default Checkin;
