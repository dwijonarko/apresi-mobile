'use strict';
import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      CamType: '',
    };
  }
  render() {
    const {route, navigation} = this.props;
    const {type} = route.params;
    let cameraType = RNCamera.Constants.Type.back;
    this.setState({CamType:type});
    if (type == 'front') {
      cameraType = RNCamera.Constants.Type.front;
    } else {
      cameraType = RNCamera.Constants.Type.back;
    }
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={cameraType}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
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
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      if (this.state.CamType === 'front') {
        this.props.navigation.navigate('Checkin', {
          image_data_front: data.base64,
        });
      } else {
        this.props.navigation.navigate('Checkin', {
          image_data_back: data.base64,
        });
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
